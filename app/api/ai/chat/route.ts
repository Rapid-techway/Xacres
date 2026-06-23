import { ToolLoopAgent, tool, createAgentUIStreamResponse, type InferAgentUIMessage, wrapLanguageModel } from 'ai';
import { google } from '@ai-sdk/google';
import { devToolsMiddleware } from '@ai-sdk/devtools';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { Land } from '@/lib/types';

const model = wrapLanguageModel({
  model: google('gemini-2.5-flash'),
  middleware: process.env.NODE_ENV === 'development' ? devToolsMiddleware() : [],
});

const searchAgent = new ToolLoopAgent({
  model,
  instructions: `You are the expert AI land search assistant for Xacres, a premium map-first land discovery platform in Haryana.
Your job is to convert natural language into precise land search filters using the getLands tool.

Language Guidelines:
1. STRICTLY respond in the SAME LANGUAGE as the user's input. 
   - User English -> You English.
   - User Hindi -> You Hindi.
   - User Hinglish -> You Hinglish.
2. If the input is mixed, favor Hinglish (e.g., "Ye rahi aapki search ke mutabik results...").
3. Avoid Urdu script; use Hindi (Devanagari) or Romanized Hindi/Hinglish.

Style Guidelines:
1. Be extremely brief (max 1 sentence).
2. Professional yet natural tone.
3. Example: "Ji, Rohtak mein agricultural land dhundhte hain..." or "Searching for lands in Hisar under 1 crore."
4. DO NOT write long paragraphs. Do not hallucinate land data.`,
  tools: {
    getLands: tool({
      description: 'Fetch lands based on district, price, and area constraints. Use this whenever the user searches for land.',
      inputSchema: z.object({
        district: z.string().optional().describe('The district to search in (e.g., Hisar, Rohtak)'),
        maxPrice: z.number().optional().describe('Maximum price in INR. Convert words like "1 crore" to 10000000'),
        minArea: z.number().optional().describe('Minimum area in acres'),
        maxArea: z.number().optional().describe('Maximum area in acres'),
      }),
      execute: async ({ district, maxPrice, minArea, maxArea }) => {
        try {
          let query = supabase.from('lands').select('*').eq('is_public', true);

          if (district) {
            // Case-insensitive matches for district
            query = query.ilike('district', `%${district}%`);
          }
          if (maxPrice) {
            query = query.lte('listed_price', maxPrice);
          }
          if (minArea) {
            query = query.gte('area_acres', minArea);
          }
          if (maxArea) {
            query = query.lte('area_acres', maxArea);
          }

          const { data: dbLands, error } = await query
            .order('created_at', { ascending: false })
            .limit(12);

          if (error) throw error;

          let lands: Partial<Land>[] = [];
          if (dbLands && dbLands.length > 0) {
            const landIds = dbLands.map(l => l.id);
            const { data: dbImages, error: imgError } = await supabase
              .from('land_images')
              .select('*')
              .in('land_id', landIds)
              .order('sort_order', { ascending: true });

            if (imgError) throw imgError;

            lands = dbLands.map(dbLand => {
              const imagesForLand = dbImages?.filter(img => img.land_id === dbLand.id) || [];
              const primaryUrl = imagesForLand.find(img => img.is_primary)?.url || imagesForLand[0]?.url || null;

              return {
                id: dbLand.id,
                slug: dbLand.slug,
                title: dbLand.title,
                listedPrice: Number(dbLand.listed_price),
                area: Number(dbLand.area_acres),
                village: dbLand.village,
                district: dbLand.district,
                roadAccess: dbLand.road_access,
                landType: dbLand.land_type,
                images: primaryUrl ? [{ url: primaryUrl, isPrimary: true }] : []
              };
            });
          }

          return {
            success: true,
            total: lands.length,
            lands
          };
        } catch (error) {
          console.error('Error fetching lands for AI Search:', error);
          return { success: false, lands: [], error: 'Failed to fetch lands' };
        }
      },
    }),
  },
});

export type SearchAgentUIMessage = InferAgentUIMessage<typeof searchAgent>;

export async function POST(req: Request) {
  const { messages } = await req.json();

  return createAgentUIStreamResponse({
    agent: searchAgent,
    uiMessages: messages,
  });
}