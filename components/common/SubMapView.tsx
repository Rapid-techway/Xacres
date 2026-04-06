'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import { Plus, Minus, Maximize2, X } from 'lucide-react';
import {
  GeoJsonFeatureCollection,
  SubMapViewProps,
  Centroid,
} from '@/lib/types';
import { MapController } from '@/components/map/MapController';

// Fix Leaflet icon issue
const fixLeafletIcon = () => {
  const DefaultIcon = L.Icon.Default.prototype as unknown as { _getIconUrl?: string };
  delete DefaultIcon._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Helper: Calculate centroid from feature collection
const calculateCentroid = (collection: GeoJsonFeatureCollection): Centroid => {
  try {
    if (!collection || !collection.features || collection.features.length === 0) {
      return { lat: 0, lng: 0 };
    }

    const centroid = turf.centroid(collection);

    if (!centroid || !centroid.geometry || !centroid.geometry.coordinates) {
      return { lat: 0, lng: 0 };
    }

    const [lng, lat] = centroid.geometry.coordinates;
    return { lat, lng };
  } catch (err) {
    console.error('Centroid calculation failed:', err);
    return { lat: 0, lng: 0 };
  }
};

// Map controller to handle auto-zoom/fitting


export default function SubMapView({ 
  initialPolygon, 
  initialCenter,
  village,
  district,
  latitude,
  longitude
}: SubMapViewProps) {
  const defaultPosition: [number, number] = [28.7041, 76.0856]; // Haryana default
  const [isClient, setIsClient] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
      fixLeafletIcon();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Handle mobile back button to close full screen
  useEffect(() => {
    if (!isFullScreen) return;

    // Push a dummy state to history
    window.history.pushState({ fullScreen: 'map' }, '');

    const handlePopState = () => {
      setIsFullScreen(false);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      // If the component unmounts or fullScreen becomes false, 
      // check if we still have our dummy state and remove it if so
      if (window.history.state?.fullScreen === 'map') {
        window.history.back();
      }
    };
  }, [isFullScreen]);

  // Parse polygon if it's a string
  let parsedPolygon: GeoJsonFeatureCollection | null = null;
  if (initialPolygon) {
    if (typeof initialPolygon === 'string') {
      try {
        parsedPolygon = JSON.parse(initialPolygon);
      } catch {
        parsedPolygon = null;
      }
    } else {
      parsedPolygon = initialPolygon;
    }
  }

  // Determine initial focus position
  const getInitialPosition = (): [number, number] => {
    if (initialCenter && initialCenter.lat !== 0 && initialCenter.lng !== 0) {
      return [initialCenter.lat, initialCenter.lng];
    }

    if (parsedPolygon && parsedPolygon.features && parsedPolygon.features.length > 0) {
      const centroid = calculateCentroid(parsedPolygon);
      if (centroid.lat !== 0 || centroid.lng !== 0) {
        return [centroid.lat, centroid.lng];
      }
    }

    return defaultPosition;
  };

  const initialPosition = getInitialPosition();

  if (!isClient) {
    return (
      <div className="h-full w-full bg-gray-50 animate-pulse rounded-[28px] flex items-center justify-center text-gray-400">
        Loading Map...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {village && district && (
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900">
              Where the land is
            </h3>
            <p className="text-sm text-gray-600">
              {village}, {district}
            </p>
          </div>

          <button
            onClick={() => {
              const url = `https://www.google.com/maps?q=&layer=c&cbll=${latitude},${longitude}`
              window.open(url, "_blank")
            }}
            className="text-sm font-medium text-gray-900 border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100 transition"
          >
            Real View
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 overflow-hidden h-[380px]">
        <MapLayout
          initialPosition={initialPosition}
          parsedPolygon={parsedPolygon}
          setIsFullScreen={setIsFullScreen}
        />
      </div>

      {/* Full Screen Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 z-[9999] bg-white animate-in fade-in duration-300">
          <MapLayout
            isModal={true}
            initialPosition={initialPosition}
            parsedPolygon={parsedPolygon}
            setIsFullScreen={setIsFullScreen}
          />
        </div>
      )}
    </div>
  );
}

interface MapLayoutProps {
  isModal?: boolean;
  initialPosition: [number, number];
  parsedPolygon: GeoJsonFeatureCollection | null;
  setIsFullScreen: (val: boolean) => void;
}

function MapLayout({ isModal = false, initialPosition, parsedPolygon, setIsFullScreen }: MapLayoutProps) {
  return (
    <div className={`h-full w-full relative group ${!isModal ? 'rounded-2xl overflow-hidden border border-gray-200 shadow-sm' : ''}`}>
      <MapContainer
        key={`${isModal ? 'modal' : 'submap'}-${initialPosition[0]}-${initialPosition[1]}`}
        center={initialPosition}
        zoom={13}
        scrollWheelZoom={isModal}
        dragging={isModal}
        touchZoom={isModal}
        doubleClickZoom={isModal}
        keyboard={isModal}
        boxZoom={isModal}
        style={{ 
          touchAction: isModal ? 'none' : 'auto'
        }}
        className={`h-full w-full z-10 ${!isModal ? '[&_.leaflet-grab]:!cursor-default [&_.leaflet-interactive]:!cursor-default' : ''}`}
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

        <MapController
          parsedPolygon={parsedPolygon}
          initialPosition={initialPosition}
        />

        {parsedPolygon && (
          <GeoJSON
            data={parsedPolygon}
            style={{
              color: '#3b82f6', // blue-500
              weight: 3,
              opacity: 0.8,
              fillColor: '#3b82f6',
              fillOpacity: 0.2,
            }}
          />
        )}

        {/* Floating Custom Controls */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          {!isModal && (
            <button
              onClick={() => setIsFullScreen(true)}
              className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-gray-200 shadow-md hover:bg-white transition-all active:scale-95 group/btn"
              title="Full screen"
            >
              <Maximize2 size={18} className="text-gray-700 group-hover/btn:text-gray-900" />
            </button>
          )}

          <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 shadow-md overflow-hidden">
            <ZoomButton type="in" />
            <div className="h-[1px] bg-gray-100 mx-2" />
            <ZoomButton type="out" />
          </div>
        </div>

        {isModal && (
          <button
            onClick={() => setIsFullScreen(false)}
            className="absolute top-6 left-6 z-[1000] bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-gray-200 shadow-xl hover:bg-white transition-all active:scale-95 group/close"
          >
            <X size={24} className="text-gray-700 group-hover/close:text-gray-900" />
          </button>
        )}
      </MapContainer>
    </div>
  );
}

function ZoomButton({ type }: { type: 'in' | 'out' }) {
  const map = useMap();
  return (
    <button
      onClick={() => type === 'in' ? map.zoomIn() : map.zoomOut()}
      className="p-2.5 hover:bg-gray-50 transition-colors flex items-center justify-center group/zoom"
    >
      {type === 'in' ? (
        <Plus size={18} className="text-gray-600 group-hover/zoom:text-gray-900" />
      ) : (
        <Minus size={18} className="text-gray-600 group-hover/zoom:text-gray-900" />
      )}
    </button>
  );
}
