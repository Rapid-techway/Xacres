"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { GeoJsonFeatureCollection } from "@/lib/types";

// Map controller to handle auto-zoom/fitting
export function MapController({
  parsedPolygon,
  initialPosition
}: {
  parsedPolygon: GeoJsonFeatureCollection | null,
  initialPosition: [number, number]
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (parsedPolygon && parsedPolygon.features && parsedPolygon.features.length > 0) {
      try {
        const bounds = L.geoJSON(parsedPolygon).getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, {
            padding: [40, 40],
            maxZoom: 16,
            animate: true,
            duration: 1
          });
          return;
        }
      } catch (err) {
        console.error('Error fitting bounds:', err);
      }
    }

    // Default: just center on the point with a closer zoom for land view
    map.setView(initialPosition, 16, { animate: true });
  }, [map, parsedPolygon, initialPosition]);

  return null;
}
