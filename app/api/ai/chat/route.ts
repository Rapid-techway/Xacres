import { ToolLoopAgent, tool, createAgentUIStreamResponse, type InferAgentUIMessage, wrapLanguageModel } from 'ai';
import { google } from '@ai-sdk/google';
import { devToolsMiddleware } from '@ai-sdk/devtools';
import { z } from 'zod';
import { databases, Query } from '@/lib/appwrite';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_LAND_COLLECTION_ID!;
const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;

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
          const queries = [];
          if (district) {
            queries.push(Query.equal('district', district));
          }
          if (maxPrice) {
            queries.push(Query.lessThanEqual('price', maxPrice));
          }
          if (minArea) {
            queries.push(Query.greaterThanEqual('area', minArea));
          }
          if (maxArea) {
            queries.push(Query.lessThanEqual('area', maxArea));
          }
          
          queries.push(Query.limit(12));

          const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            queries
          );

          return {
            success: true,
            total: response.total,
            lands: response.documents.map(doc => {
              // Parse images field which might be a JSON string array
              let imageList = [];
              try {
                imageList = typeof doc.images === 'string' ? JSON.parse(doc.images) : (doc.images || []);
              } catch {
                imageList = [];
              }

              let imageUrl = null;
              if (Array.isArray(imageList) && imageList.length > 0) {
                const firstImage = imageList[0];
                if (typeof firstImage === 'string') {
                  if (firstImage.startsWith('http') || firstImage.startsWith('/')) {
                    imageUrl = firstImage;
                  } else {
                    imageUrl = `${ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${firstImage}/view?project=${PROJECT_ID}`;
                  }
                } else if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
                  imageUrl = firstImage.url;
                }
              }

              return {
                id: doc.$id,
                slug: doc.slug,
                title: doc.title,
                price: doc.price,
                area: doc.area,
                village: doc.village,
                district: doc.district,
                roadAccess: doc.roadAccess,
                type: doc.type,
                images: imageUrl ? [{ url: imageUrl, isPrimary: true }] : []
              };
            })
          };
        } catch (error) {
          console.error('Error fetching lands:', error);
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