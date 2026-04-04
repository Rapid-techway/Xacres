'use client';

import { useEffect, useState } from 'react';
import { Marker, Tooltip, useMap } from 'react-leaflet';
import { useFilterStore } from '@/store/useFilterStore';
import { useIsMobile } from '@/hooks/use-mobile';

interface DistrictPosition {
  lat: number;
  lng: number;
  name: string;
}

export default function DistrictLayer() {
  const map = useMap();
  const { location } = useFilterStore();
  const [position, setPosition] = useState<DistrictPosition | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!location || !map) {
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const fetchDistrictCoords = async () => {
      try {
        const query = `${location}, Haryana, India`;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);
          
          setPosition({ lat, lng, name: location });

          // Smoothly fly to the point
          map.flyTo([lat, lng], isMobile ? 9 : 10, {
            duration: 1.5,
            easeLinearity: 0.25
          });

          // Disappear after 5 seconds
          timeoutId = setTimeout(() => {
            setPosition(null);
          }, 5000);
        }
      } catch (error) {
        console.error('Error fetching district coordinates from Nominatim:', error);
      }
    };

    fetchDistrictCoords();

    // Reset position when location changes or component unmounts
    return () => {
      setPosition(null);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [location, map, isMobile]);

  if (!position) return null;

  return (
    <Marker position={[position.lat, position.lng]}>
      <Tooltip 
        permanent 
        direction="top" 
        offset={[0, -32]}
        className="custom-map-tooltip"
      >
        <div className="flex flex-col items-center gap-0.5 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 shadow-xl">
          <span className="text-white font-bold text-[14px] leading-tight">{position.name}</span>
        </div>
      </Tooltip>
    </Marker>
  );
}
