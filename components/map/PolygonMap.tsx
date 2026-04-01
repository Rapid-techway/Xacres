'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import * as turf from '@turf/turf';
import { X } from 'lucide-react';
import BoundarySheet from './BoundarySheet';
import {
  GeoJsonFeature,
  GeoJsonFeatureCollection,
  GeoJsonCoordinate,
  PolygonMapProps,
  Centroid,
  closeRing,
  getEditableVertices,
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
      console.warn('Turf failed to calculate a valid centroid for:', collection);
      return { lat: 0, lng: 0 };
    }

    const [lng, lat] = centroid.geometry.coordinates;
    return { lat, lng };
  } catch (err) {
    console.error('Centroid calculation failed:', err);
    return { lat: 0, lng: 0 };
  }
};

// Helper: Create GeoJSON from Leaflet layers
const createGeoJsonFromLayers = (featureGroup: L.FeatureGroup): GeoJsonFeatureCollection => {
  const layers = featureGroup.getLayers();
  const features = layers
    .filter((layer): layer is L.Polygon => layer instanceof L.Polygon)
    .map((layer) => layer.toGeoJSON() as GeoJsonFeature);
  
  return {
    type: 'FeatureCollection',
    features,
  };
};

interface GeomanControlsProps {
  onPolygonComplete?: (polygon: GeoJsonFeatureCollection | null, centroid: Centroid) => void;
  initialPolygon?: GeoJsonFeatureCollection | null;
  readOnly?: boolean;
}

function GeomanControls({ onPolygonComplete, initialPolygon, readOnly = false }: GeomanControlsProps) {
  const map = useMap();
  const featureGroupRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const onPolygonCompleteRef = useRef(onPolygonComplete);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [polygonsData, setPolygonsData] = useState<GeoJsonFeature[]>([]);

  // Keep ref in sync with latest callback
  useEffect(() => {
    onPolygonCompleteRef.current = onPolygonComplete;
  }, [onPolygonComplete]);

  // Notify parent of changes
  const notifyParent = useCallback((features: GeoJsonFeature[]) => {
    const collection: GeoJsonFeatureCollection = {
      type: 'FeatureCollection',
      features,
    };
    const centroid = calculateCentroid(collection);
    onPolygonCompleteRef.current?.(
      features.length > 0 ? collection : null,
      centroid
    );
  }, []);

  // Sync map layers to state and notify parent
  const syncFromMap = useCallback(() => {
    const collection = createGeoJsonFromLayers(featureGroupRef.current);
    setPolygonsData(collection.features);
    notifyParent(collection.features);
  }, [notifyParent]);

  // Apply state to map (reverse sync)
  const syncToMap = useCallback((features: GeoJsonFeature[]) => {
    const featureGroup = featureGroupRef.current;
    
    // Clear existing layers
    featureGroup.clearLayers();
    
    if (features.length === 0) {
      notifyParent([]);
      return;
    }
    
    const collection: GeoJsonFeatureCollection = {
      type: 'FeatureCollection',
      features,
    };
    
    // Add layers to map
    L.geoJSON(collection, {
      onEachFeature: (feature, layer) => {
        if (layer instanceof L.Polygon) {
          featureGroup.addLayer(layer);
          
          // Attach event listeners for future edits
          layer.on('pm:edit', syncFromMap);
          layer.on('pm:remove', syncFromMap);
        }
      },
    });
    
    // Notify parent
    notifyParent(features);
  }, [notifyParent, syncFromMap]);

  // Initialize map and geoman (only once)
  useEffect(() => {
    if (!map) return;
    
    const featureGroup = featureGroupRef.current;
    featureGroup.addTo(map);

    if (readOnly) return;

    // Initialize Geoman controls
    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawCircle: false,
      drawText: false,
      editMode: false,      // Disabled: removes edit tool
      dragMode: false,      // Disabled: removes drag tool
      cutPolygon: false,
      removalMode: false,   // Disabled: removes delete tool
      rotateMode: false,    // Disabled: removes rotate tool
      drawPolygon: true,
    });

    map.pm.setGlobalOptions({
      allowSelfIntersection: false,
      snappable: true,
      // Hide action toolbar buttons during drawing
      continueDrawing: false,
      finishOn: 'dblclick',
    });

    // Use a unique ID for the style tag to avoid duplicates and ensure cleanup
    const styleId = 'geoman-hide-actions';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .leaflet-pm-actions-container {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Handle new polygons drawn on map
    const handleCreate = (e: L.LeafletEvent & { layer: L.Layer }) => {
      const { layer } = e;
      featureGroup.addLayer(layer);
      syncFromMap();
      
      // Attach listeners for this new layer
      layer.on('pm:edit', syncFromMap);
      layer.on('pm:remove', syncFromMap);
    };

    if (!readOnly) {
      map.on('pm:create', handleCreate);
    }

    // Cleanup
    return () => {
      map.pm.removeControls();
      map.off('pm:create', handleCreate);
      featureGroup.clearLayers();
      featureGroup.remove();
      // Style tag is shared, so we don't necessarily want to remove it 
      // if other instances exist, but for safety in this specific component:
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [map, syncFromMap, readOnly]);

  // Load initial polygon (separate effect)
  useEffect(() => {
    let polygon = initialPolygon;

    // Handle string case (e.g., if JSON.parse failed or wasn't called)
    if (typeof polygon === 'string') {
      try {
        if (polygon === 'null') {
          polygon = null;
        } else {
          polygon = JSON.parse(polygon);
        }
      } catch (err) {
        console.error('PolygonMap: Failed to parse initialPolygon string:', err);
        polygon = null;
      }
    }

    if (polygon && polygon.features && Array.isArray(polygon.features) && polygon.features.length > 0) {
      setPolygonsData(polygon.features);
      syncToMap(polygon.features);
    } else if (polygon && (!polygon.features || !Array.isArray(polygon.features))) {
      console.error('PolygonMap: polygon.features is not an array:', polygon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Update a specific coordinate in a polygon
  const updateCoordinate = useCallback((
    polygonIndex: number,
    vertexIndex: number,
    field: 'lat' | 'lng',
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const newData = [...polygonsData];
    const polygon = { ...newData[polygonIndex] };
    const geometry = { ...polygon.geometry };
    const coordinates = [...geometry.coordinates];
    const ring = [...coordinates[0]];
    
    // Get editable vertices (without closing duplicate)
    const editableVertices = getEditableVertices(ring);
    
    // Update the specific vertex
    const updatedVertices = [...editableVertices];
    const coord = [...updatedVertices[vertexIndex]];
    
    // GeoJSON uses [lng, lat]
    if (field === 'lat') {
      coord[1] = numValue;
    } else {
      coord[0] = numValue;
    }
    
    updatedVertices[vertexIndex] = coord as GeoJsonCoordinate;
    
    // Close the ring before saving
    const closedRing = closeRing(updatedVertices);
    
    coordinates[0] = closedRing;
    geometry.coordinates = coordinates;
    polygon.geometry = geometry;
    newData[polygonIndex] = polygon;
    
    // Update state and sync to map
    setPolygonsData(newData);
    syncToMap(newData);
  }, [polygonsData, syncToMap]);

  // Remove a polygon
  const removePolygon = useCallback((index: number) => {
    const newData = polygonsData.filter((_, i) => i !== index);
    setPolygonsData(newData);
    syncToMap(newData);
  }, [polygonsData, syncToMap]);

  // Import GeoJSON from sheet
  const handleImportGeoJson = useCallback((geoJson: GeoJsonFeatureCollection) => {
    setPolygonsData(geoJson.features);
    syncToMap(geoJson.features);
  }, [syncToMap]);

  // Reset all polygons
  const resetAll = useCallback(() => {
    setPolygonsData([]);
    syncToMap([]);
  }, [syncToMap]);

  return (
    <>
      <div className="absolute top-4 right-4 z-[1000] flex flex-col sm:flex-row gap-2">
        <BoundarySheet
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          polygonsData={polygonsData}
          onUpdateCoordinate={updateCoordinate}
          onRemovePolygon={removePolygon}
          onImportGeoJson={handleImportGeoJson}
        />

        <button
          type="button"
          onClick={resetAll}
          className="bg-white/95 ml-10 sm:ml-0 w-30 backdrop-blur-sm hover:bg-white text-red-600 font-semibold text-xs px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <X size={14} strokeWidth={2.5} />
          Reset Map
        </button>
      </div>
    </>
  );
}

export default function PolygonMap({ 
  onPolygonComplete, 
  initialPolygon, 
  initialCenter,
  readOnly = false 
}: PolygonMapProps) {
  const defaultPosition: [number, number] = [28.7041, 76.0856]; // Haryana default
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
      fixLeafletIcon();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Determine initial focus position
  const getInitialPosition = (): [number, number] => {
    if (initialCenter && initialCenter.lat !== 0 && initialCenter.lng !== 0) {
      return [initialCenter.lat, initialCenter.lng];
    }

    if (initialPolygon) {
      let poly: GeoJsonFeatureCollection | null = null;
      if (typeof initialPolygon === 'string') {
        try {
          poly = JSON.parse(initialPolygon);
        } catch {
          poly = null;
        }
      } else {
        poly = initialPolygon;
      }
      
      if (poly && poly.features && poly.features.length > 0) {
        const centroid = calculateCentroid(poly);
        if (centroid.lat !== 0 || centroid.lng !== 0) {
          return [centroid.lat, centroid.lng];
        }
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

  let parsedPolygonForView: GeoJsonFeatureCollection | null = null;
  if (initialPolygon) {
    if (typeof initialPolygon === 'string') {
      try {
        parsedPolygonForView = initialPolygon === 'null' ? null : JSON.parse(initialPolygon);
      } catch {
        parsedPolygonForView = null;
      }
    } else {
      parsedPolygonForView = initialPolygon;
    }
  }

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-gray-200 shadow-lg group relative">
      <MapContainer
        key={isClient ? `map-${initialPosition[0]}-${initialPosition[1]}` : "map-loading"}
        center={initialPosition}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-10"
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
          parsedPolygon={parsedPolygonForView}
          initialPosition={initialPosition}
        />
        <GeomanControls 
          onPolygonComplete={onPolygonComplete} 
          initialPolygon={initialPolygon} 
          readOnly={readOnly}
        />
      </MapContainer>

      {!readOnly && (
        <div className="hidden md:block absolute bottom-4 left-4 z-[1000] pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-gray-200 shadow-md">
            <p className="text-xs font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Double-click to finish drawing polygons
            </p>
            <p className="text-[10px] font-medium text-gray-500 mt-0.5 ml-3.5">
              Use Boundary Manager to import GeoJSON or view coordinates
            </p>
          </div>
        </div>
      )}
    </div>
  );
}