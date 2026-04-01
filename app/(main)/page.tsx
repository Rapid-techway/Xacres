import MapView from '@/components/map/MapView';
import Link from 'next/link';
import { List } from 'lucide-react';

export default function Home() {
  return (
    <main className="w-full h-[calc(100vh-80px)] overflow-hidden relative">
      <MapView />
      
      {/* View Switcher Toggle */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <Link 
          href="/lands"
          className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 font-bold text-[14px]"
        >
          <span>Show list</span>
          <List size={18} />
        </Link>
      </div>
    </main>
  );
}
