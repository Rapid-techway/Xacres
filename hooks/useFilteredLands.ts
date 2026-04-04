import { useMemo, useEffect } from 'react';
import { useLandStore } from '@/store/useLandStore';
import { useFilterStore } from '@/store/useFilterStore';
import { filterLands } from '@/lib/filtering';

export function useFilteredLands() {
  const { lands, fetchLands, isLoading } = useLandStore();
  const { location, minPrice, maxPrice, minSize, maxSize } = useFilterStore();

  useEffect(() => {
    fetchLands();
  }, [fetchLands]);

  const filteredLands = useMemo(() => {
    return filterLands(lands, { location, minPrice, maxPrice, minSize, maxSize });
  }, [lands, location, minPrice, maxPrice, minSize, maxSize]);

  return { filteredLands, isLoading, totalCount: lands.length };
}
