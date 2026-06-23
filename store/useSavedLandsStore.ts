'use client';

import { create } from 'zustand';
import { Land } from '@/lib/types';

interface SavedLandsState {
  savedLands: Land[];
  isLoaded: boolean;
  toggleSave: (land: Land) => void;
  loadSaved: () => void;
  clearAll: () => void;
}

export const useSavedLandsStore = create<SavedLandsState>((set, get) => ({
  savedLands: [],
  isLoaded: false,
  toggleSave: (land: Land) => {
    const { savedLands } = get();
    const landId = land.$id || land.id || '';
    const exists = savedLands.some(item => (item.$id === landId || item.id === landId));

    let updatedLands;
    if (exists) {
      updatedLands = savedLands.filter(item => (item.$id !== landId && item.id !== landId));
    } else {
      updatedLands = [...savedLands, land];
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('savedLands', JSON.stringify(updatedLands));
    }
    set({ savedLands: updatedLands });
  },
  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('savedLands');
    }
    set({ savedLands: [] });
  },
  loadSaved: () => {
    if (typeof window === 'undefined') return;
    const { isLoaded } = get();
    if (isLoaded) return; // Prevent double loads

    const saved = localStorage.getItem('savedLands');
    if (saved) {
      try {
        set({ savedLands: JSON.parse(saved), isLoaded: true });
      } catch (e) {
        console.error('Error parsing saved lands from localStorage:', e);
        set({ isLoaded: true });
      }
    } else {
      set({ isLoaded: true });
    }
  }
}));
