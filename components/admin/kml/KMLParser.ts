import * as toGeoJSON from '@tmcw/togeojson';
import * as turf from '@turf/turf';
import { GeoJsonFeatureCollection, GeoJsonFeature } from '@/lib/types';

export interface KMLParserResult {
  polygon: GeoJsonFeatureCollection;
  centroid: { lat: number; lng: number };
  acreage: number;
}

/**
 * Parses a raw KML text string, converts it to a standard GeoJSON FeatureCollection,
 * calculates the boundary's centroid, and computes the land area in acres.
 */
interface KMLGeometry {
  type: string;
  coordinates?: number[][][] | number[][][][] | unknown;
  geometries?: KMLGeometry[];
}

interface KMLFeature {
  type: string;
  geometry?: KMLGeometry;
  properties?: Record<string, unknown> | null;
  features?: KMLFeature[];
}

export function parseKMLToGeoJSON(kmlText: string): KMLParserResult {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(kmlText, 'text/xml');
  
  // Validate XML document
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Invalid XML structure in KML file.');
  }

  // Convert XML to GeoJSON using @tmcw/togeojson
  const converted = toGeoJSON.kml(xmlDoc);

  if (!converted || converted.type !== 'FeatureCollection') {
    throw new Error('Could not parse KML into a valid GeoJSON structure.');
  }

  const singlePolygonFeatures: GeoJsonFeature[] = [];

  const addPolygonFeature = (coords: number[][][], properties: Record<string, unknown> | null | undefined) => {
    singlePolygonFeatures.push({
      type: 'Feature',
      properties: properties || {},
      geometry: {
        type: 'Polygon',
        coordinates: coords,
      },
    } as GeoJsonFeature);
  };

  // Helper to traverse and extract single polygon geometries
  const extractPolygons = (feature: KMLFeature) => {
    if (!feature) return;

    if (feature.type === 'FeatureCollection' && Array.isArray(feature.features)) {
      feature.features.forEach(extractPolygons);
    } else if (feature.type === 'Feature') {
      const geometry = feature.geometry;
      if (!geometry) return;

      const type = geometry.type;
      if (type === 'Polygon' && Array.isArray(geometry.coordinates)) {
        addPolygonFeature(geometry.coordinates as number[][][], feature.properties);
      } else if (type === 'MultiPolygon' && Array.isArray(geometry.coordinates)) {
        (geometry.coordinates as number[][][][]).forEach((coords) => {
          if (Array.isArray(coords)) {
            addPolygonFeature(coords, feature.properties);
          }
        });
      } else if (type === 'GeometryCollection' && Array.isArray(geometry.geometries)) {
        geometry.geometries.forEach((geom) => {
          if (geom.type === 'Polygon' && Array.isArray(geom.coordinates)) {
            addPolygonFeature(geom.coordinates as number[][][], feature.properties);
          } else if (geom.type === 'MultiPolygon' && Array.isArray(geom.coordinates)) {
            (geom.coordinates as number[][][][]).forEach((coords) => {
              if (Array.isArray(coords)) {
                addPolygonFeature(coords, feature.properties);
              }
            });
          }
        });
      }
    }
  };

  extractPolygons(converted as unknown as KMLFeature);

  if (singlePolygonFeatures.length === 0) {
    throw new Error('No Polygon boundaries found in the KML file. Make sure the file contains a polygon path.');
  }

  // Find the single largest polygon by area
  let largestFeature = singlePolygonFeatures[0];
  let maxArea = turf.area(largestFeature);

  for (let i = 1; i < singlePolygonFeatures.length; i++) {
    const area = turf.area(singlePolygonFeatures[i]);
    if (area > maxArea) {
      maxArea = area;
      largestFeature = singlePolygonFeatures[i];
    }
  }

  const finalGeoJson: GeoJsonFeatureCollection = {
    type: 'FeatureCollection',
    features: [largestFeature],
  };

  // 1. Calculate Centroid (using Turf.js)
  const centroidFeature = turf.centroid(finalGeoJson);
  if (!centroidFeature || !centroidFeature.geometry || !centroidFeature.geometry.coordinates) {
    throw new Error('Failed to calculate centroid coordinates for the boundary.');
  }
  const [lng, lat] = centroidFeature.geometry.coordinates;

  // 2. Calculate Area/Acreage (using Turf.js)
  // turf.area returns area in square meters.
  // 1 acre = 4046.8564224 square meters.
  const areaInSquareMeters = turf.area(finalGeoJson);
  const acreage = Number((areaInSquareMeters / 4046.8564224).toFixed(3));

  return {
    polygon: finalGeoJson,
    centroid: { lat, lng },
    acreage,
  };
}
