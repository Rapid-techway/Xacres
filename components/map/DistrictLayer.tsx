'use client';

import { useEffect, useState } from 'react';
import { Marker, Tooltip, useMap } from 'react-leaflet';
import { useFilterStore } from '@/store/useFilterStore';

interface DistrictPosition {
  lat: number;
  lng: number;
  name: string;
}

export default function DistrictLayer() {
  const map = useMap();
  const { location } = useFilterStore();
  const [position, setPosition] = useState<DistrictPosition | null>(null);

  useEffect(() => {
    if (!location || !map) {
      return;
    }

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
          map.flyTo([lat, lng], 11, {
            duration: 1.5,
            easeLinearity: 0.25
          });
        }
      } catch (error) {
        console.error('Error fetching district coordinates from Nominatim:', error);
      }
    };

    fetchDistrictCoords();

    // Reset position when location changes or component unmounts
    return () => setPosition(null);
  }, [location, map]);

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
