import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Grid } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import LandCard from '@/components/common/LandCard';
import { Land } from '@/lib/types';

interface PageProps {
  params: Promise<{ district: string }>;
}

interface DbLand {
  id: string;
  title: string;
  slug: string;
  price: number;
  area: number;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  type: string;
  road_access: boolean;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface DbImage {
  url: string;
  is_primary: boolean;
}

// Map helper localized for SSR
function mapDbLandToFrontend(dbLand: DbLand, images: DbImage[] = []): Land {
  return {
    id: dbLand.id,
    $id: dbLand.id,
    title: dbLand.title,
    slug: dbLand.slug,
    price: Number(dbLand.price),
    area: Number(dbLand.area),
    district: dbLand.district,
    village: dbLand.village,
    latitude: dbLand.latitude,
    longitude: dbLand.longitude,
    type: dbLand.type,
    roadAccess: dbLand.road_access,
    description: dbLand.description || '',
    isPublic: dbLand.is_public,
    createdAt: dbLand.created_at,
    updatedAt: dbLand.updated_at,
    images: images.map(img => ({
      url: img.url,
      isPrimary: img.is_primary
    }))
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { district } = await params;
  const rawDistrict = decodeURIComponent(district);
  const formattedDistrict = rawDistrict.charAt(0).toUpperCase() + rawDistrict.slice(1).toLowerCase();

  const title = `Farmland & Agricultural Land for Sale in ${formattedDistrict}, Haryana | Xacres`;
  const description = `Explore available farm plots, agricultural land, and highway properties for sale in ${formattedDistrict}, Haryana. View map locations, sizes, and price details on Xacres.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/lands/district/${district.toLowerCase()}`,
    },
    openGraph: {
      title,
      description,
      url: `/lands/district/${district.toLowerCase()}`,
      type: 'website',
      siteName: 'Xacres',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function DistrictLandsPage({ params }: PageProps) {
  const { district } = await params;
  const rawDistrict = decodeURIComponent(district);
  const formattedDistrict = rawDistrict.charAt(0).toUpperCase() + rawDistrict.slice(1).toLowerCase();

  // 1. Fetch matching lands from Supabase
  const { data: dbLands, error: landsError } = await supabase
    .from('lands')
    .select('*')
    .eq('district', formattedDistrict)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (landsError) {
    console.error(`Error loading lands for district ${formattedDistrict}:`, landsError);
  }

  let lands: Land[] = [];
  if (dbLands && dbLands.length > 0) {
    const landIds = dbLands.map(l => l.id);
    const { data: dbImages, error: imagesError } = await supabase
      .from('land_images')
      .select('*')
      .in('land_id', landIds)
      .order('sort_order', { ascending: true });

    if (!imagesError && dbImages) {
      lands = dbLands.map(dbLand => {
        const images = dbImages.filter(img => img.land_id === dbLand.id);
        return mapDbLandToFrontend(dbLand, images);
      });
    } else {
      lands = dbLands.map(dbLand => mapDbLandToFrontend(dbLand, []));
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Directory Title / Header */}
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
          <MapPin className="text-blue-600 w-8 h-8" />
          Land in {formattedDistrict}
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
          Browse verified farmland listings, agricultural plots, and development sites for sale in the {formattedDistrict} district of Haryana, India.
        </p>
      </div>

      {/* Content grid */}
      {lands.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 border border-dashed border-gray-200 rounded-[28px] text-center">
          <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 mb-4">
            <Grid size={20} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">No Listings Found</h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xs font-medium">
            There are currently no active land listings listed in {formattedDistrict}. Keep checking back or explore other districts.
          </p>
          <Link href="/lands" className="mt-6 inline-flex bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all active:scale-95">
            View All Lands
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {lands.map((land) => (
            <LandCard key={land.id} land={land} />
          ))}
        </div>
      )}
    </div>
  );
}
