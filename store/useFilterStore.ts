import { create } from 'zustand';

export type FilterPanel = 'location' | 'price' | 'size' | null;

interface FilterState {
  location: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minSize: number | null;
  maxSize: number | null;
  activeFilterPanel: FilterPanel;
  
  setLocation: (location: string | null) => void;
  setPrice: (min: number | null, max: number | null) => void;
  setSize: (min: number | null, max: number | null) => void;
  setActiveFilterPanel: (panel: FilterPanel) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  location: null,
  minPrice: null,
  maxPrice: null,
  minSize: null,
  maxSize: null,
  activeFilterPanel: null,
  
  setLocation: (location) => set({ location }),
  setPrice: (min, max) => set({ minPrice: min, maxPrice: max }),
  setSize: (min, max) => set({ minSize: min, maxSize: max }),
  setActiveFilterPanel: (panel) => set({ activeFilterPanel: panel }),
  resetFilters: () => set({ 
    location: null, 
    minPrice: null, 
    maxPrice: null, 
    minSize: null, 
    maxSize: null 
  }),
}));
