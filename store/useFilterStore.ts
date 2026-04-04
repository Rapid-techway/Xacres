import { create } from 'zustand';

export type FilterPanel = 'location' | 'price' | 'size' | null;

interface FilterState {
  location: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minSize: number | null;
  maxSize: number | null;
  activeFilterPanel: FilterPanel;
  
  // Staged values for desktop "drafting"
  stagedMinPrice: number | null;
  stagedMaxPrice: number | null;
  stagedMinSize: number | null;
  stagedMaxSize: number | null;
  
  setLocation: (location: string | null) => void;
  setPrice: (min: number | null, max: number | null) => void;
  setSize: (min: number | null, max: number | null) => void;
  
  // Staged actions
  setStagedPrice: (min: number | null, max: number | null) => void;
  setStagedSize: (min: number | null, max: number | null) => void;
  applyStagedPrice: () => void;
  applyStagedSize: () => void;
  syncStagedWithActive: () => void;
  
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
  
  // Staged defaults
  stagedMinPrice: null,
  stagedMaxPrice: null,
  stagedMinSize: null,
  stagedMaxSize: null,
  
  setLocation: (location) => set({ location }),
  setPrice: (min, max) => set({ minPrice: min, maxPrice: max }),
  setSize: (min, max) => set({ minSize: min, maxSize: max }),
  
  // Staged logic
  setStagedPrice: (min, max) => set({ stagedMinPrice: min, stagedMaxPrice: max }),
  setStagedSize: (min, max) => set({ stagedMinSize: min, stagedMaxSize: max }),
  
  applyStagedPrice: () => set((state) => ({ 
    minPrice: state.stagedMinPrice, 
    maxPrice: state.stagedMaxPrice 
  })),
  
  applyStagedSize: () => set((state) => ({ 
    minSize: state.stagedMinSize, 
    maxSize: state.stagedMaxSize 
  })),
  
  syncStagedWithActive: () => set((state) => ({
    stagedMinPrice: state.minPrice,
    stagedMaxPrice: state.maxPrice,
    stagedMinSize: state.minSize,
    stagedMaxSize: state.maxSize
  })),
  
  setActiveFilterPanel: (panel) => set({ activeFilterPanel: panel }),
  resetFilters: () => set({ 
    location: null, 
    minPrice: null, 
    maxPrice: null, 
    minSize: null, 
    maxSize: null,
    stagedMinPrice: null,
    stagedMaxPrice: null,
    stagedMinSize: null,
    stagedMaxSize: null
  }),
}));
