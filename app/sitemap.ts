import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://xacres.vercel.app';

  // 1. Static URLs
  const staticUrls = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/lands`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  try {
    // 2. Fetch all public land listing slugs
    const { data: lands } = await supabase
      .from('lands')
      .select('slug, updated_at')
      .eq('is_public', true);

    const landUrls = (lands || []).map((land) => ({
      url: `${baseUrl}/lands/${land.slug}`,
      lastModified: land.updated_at ? new Date(land.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // 3. Fetch unique districts of public lands
    const { data: districtsData } = await supabase
      .from('lands')
      .select('district')
      .eq('is_public', true);

    const uniqueDistricts = Array.from(
      new Set(
        (districtsData || [])
          .map((item) => item.district)
          .filter((d): d is string => typeof d === 'string' && d.length > 0)
      )
    );

    const districtUrls = uniqueDistricts.map((district) => ({
      url: `${baseUrl}/lands/district/${district.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    return [...staticUrls, ...landUrls, ...districtUrls];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return staticUrls;
  }
}
