import { Metadata } from 'next';
import HeroLayout from '@/components/home2/HeroLayout';

export const metadata: Metadata = {
  title: 'Xacres - Direct, Verified & Hassle-free Land in Haryana',
  description: 'Discover premium land opportunities in Haryana with absolute clarity. Explore agricultural, farming, and commercial land listings directly from verified owners.',
};

export default function Home2Page() {
  return (
    <main className="w-full min-h-screen">
      <HeroLayout />
    </main>
  );
}
