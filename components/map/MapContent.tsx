'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import DistrictLayer from './DistrictLayer';
import L from 'leaflet';
import LandMarkers from './LandMarkers';
import { Land } from '@/lib/types';
import LandDetailView from './LandDetailView';

export default function MapContent() {
  const mapRef = useRef<L.Map | null>(null);
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);

  useEffect(() => {
    // Fix Leaflet icon issue in Next.js
    const DefaultIcon = L.Icon.Default.prototype as unknown as L.IconOptions & { _getIconUrl?: string };
    delete DefaultIcon._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    <>
      <MapContainer
        center={[28.7041, 76.0856]}
        zoom={7}
        className="w-full h-full z-10"
        ref={(instance) => {
          if (instance) mapRef.current = instance;
        }}
        zoomControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri World Imagery'
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri Labels'
        />
        <DistrictLayer />
        <MapEvents onMapClick={() => setSelectedLand(null)} />
        <LandMarkers 
          onSelect={setSelectedLand} 
          selectedLandId={selectedLand?.$id} 
        />
      </MapContainer>

      {selectedLand && (
        <LandDetailView 
          key={selectedLand.$id}
          land={selectedLand} 
          onClose={() => setSelectedLand(null)} 
        />
      )}
    </>
  );
}

function MapEvents({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({
    click: () => onMapClick(),
  });
  return null;
}
