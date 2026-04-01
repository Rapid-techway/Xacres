'use client';

import dynamic from 'next/dynamic';

// Dynamically import map components with ssr: false to avoid "window is not defined" error
const MapContent = dynamic(() => import('@/components/map/MapContent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-foreground/40 font-medium">Loading Map...</div>
});

export default function MapView() {
  return (
    <div className="w-full h-full relative">
      <MapContent />
    </div>
  );
}
