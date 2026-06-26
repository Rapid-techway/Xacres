import { Metadata } from 'next';
import { landService } from '@/services/land.service';
import LandsClientPage from './LandsClientPage';
import { Land } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Agricultural & Farm Land for Sale in Haryana | Xacres',
  description: 'Browse verified agricultural land, farm plots, and highway commercial land for sale in Haryana. Filter by size, price, and district on Xacres.',
  alternates: {
    canonical: '/lands',
  },
  openGraph: {
    title: 'Agricultural & Farm Land for Sale in Haryana | Xacres',
    description: 'Browse verified agricultural land, farm plots, and highway commercial land for sale in Haryana. Filter by size, price, and district on Xacres.',
    url: '/lands',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Xacres',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agricultural & Farm Land for Sale in Haryana | Xacres',
    description: 'Browse verified agricultural land, farm plots, and highway commercial land for sale in Haryana.',
  },
};

export default async function PublicLandsPage() {
  // Fetch lands directly on the server for full SSR crawlability
  let initialLands: Land[] = [];
  try {
    const { documents } = await landService.getLands({
      isPublic: true,
      limit: 100
    });
    initialLands = (documents || []) as Land[];
  } catch (error) {
    console.error('Error loading lands on server:', error);
  }

  return <LandsClientPage initialLands={initialLands} />;
}
