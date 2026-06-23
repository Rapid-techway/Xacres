import { Metadata } from 'next';
import HeroLayout from '@/components/home/HeroLayout';
import HighlightsSection from '@/components/home/HighlightsSection';
import MapSection from '@/components/home/MapSection';
import AboutSection from '@/components/home/AboutSection';
import ValuesSection from '@/components/home/ValuesSection';
import FaqSection from '@/components/home/FaqSection';
import { Footer1 } from '@/components/home/footer';

export const metadata: Metadata = {
  title: 'Xacres - Direct, Verified & Hassle-free Land in Haryana',
  description: 'Discover premium land opportunities in Haryana with absolute clarity. Explore agricultural, farming, and commercial land listings directly from verified owners.',
};

export default function Home2Page() {
  return (
    <main className="w-full min-h-screen bg-black">
      <HeroLayout />
      <HighlightsSection />
      <MapSection />
      <AboutSection />
      <ValuesSection />
      <FaqSection />
      <Footer1 />
    </main>
  );
}




