'use client';

import { CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { Land } from '@/lib/types';
import { useFilteredLands } from '@/hooks/useFilteredLands';
interface LandMarkersProps {
  onSelect: (land: Land) => void;
  selectedLandId?: string;
}

export default function LandMarkers({ onSelect, selectedLandId }: LandMarkersProps) {
  const { filteredLands, isLoading } = useFilteredLands();

  if (isLoading || filteredLands.length === 0) return null;

  return (
    <>
      {filteredLands.map((land) => {
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
