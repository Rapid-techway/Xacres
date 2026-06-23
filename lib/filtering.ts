import { Land } from './types';

export interface FilterParams {
  location?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  minSize?: number | null;
  maxSize?: number | null;
}

export function filterLands(lands: Land[], filters: FilterParams): Land[] {
  return lands.filter(land => {
    // 1. Location filter (District or Village)
    if (filters.location && 
        !land.district.toLowerCase().includes(filters.location.toLowerCase()) && 
        !land.village.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    // 2. Price filter
    if (filters.minPrice && land.listedPrice < filters.minPrice) return false;
    if (filters.maxPrice && land.listedPrice > filters.maxPrice) return false;

    // 3. Size filter (Area/Size)
    if (filters.minSize && land.area < filters.minSize) return false;
    if (filters.maxSize && land.area > filters.maxSize) return false;

    return true;
  });
}
