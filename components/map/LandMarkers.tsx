'use client';

import { useEffect, useState } from 'react';
import { CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { landService } from '@/services/land.service';
import { Land } from '@/lib/types';
import { Query } from '@/lib/appwrite';
interface LandMarkersProps {
  onSelect: (land: Land) => void;
  selectedLandId?: string;
}

export default function LandMarkers({ onSelect, selectedLandId }: LandMarkersProps) {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);
  const map = useMap();

  useEffect(() => {
    async function fetchPublicLands() {
      try {
        setLoading(true);
        const { documents } = await landService.getLands([
          Query.equal('isPublic', true)
        ]);
        setLands(documents);

        // Fetching completed, we no longer auto-zoom to markers to keep focus on Haryana
      } catch (error) {
        console.error('Error fetching landing markers:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPublicLands();
  }, [map]);

  if (loading || lands.length === 0) return null;

  return (
    <>
      {lands.map((land) => {
        const isSelected = selectedLandId === land.$id;

        return (
          <CircleMarker
            key={land.$id}
            center={[land.latitude, land.longitude]}
            radius={isSelected ? 10 : 7}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                onSelect(land);
              },
            }}
            pathOptions={{
              color: isSelected ? '#3b82f6' : '#ffffff',
              weight: isSelected ? 3 : 2,
              fillColor: isSelected ? '#2563eb' : '#fbbf24', // blue if selected, yellow if not
              fillOpacity: 1,
              className: 'drop-shadow-lg cursor-pointer transition-colors duration-200'
            }}
          />
        );
      })}
    </>
  );
}
