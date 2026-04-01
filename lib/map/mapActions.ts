import { Map, LatLngBoundsExpression, Polygon } from 'leaflet';

/**
 * Smoothly flies the map to a specific district's bounds.
 */
export const flyToDistrict = (map: Map, bounds: LatLngBoundsExpression) => {
  map.flyToBounds(bounds, {
    padding: [50, 50],
    duration: 1.5,
    easeLinearity: 0.25
  });
};

/**
 * Zooms the map to a specific polygon.
 */
export const zoomToPolygon = (map: Map, polygon: Polygon) => {
  map.flyToBounds(polygon.getBounds(), {
    padding: [40, 40],
    duration: 1.2
  });
};

/**
 * Fits the map to the given bounds using smooth animation.
 */
export const zoomToBounds = (map: Map, bounds: LatLngBoundsExpression) => {
  map.flyToBounds(bounds, {
    padding: [20, 20],
    duration: 1.0
  });
};
