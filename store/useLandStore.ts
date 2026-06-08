import { create } from 'zustand';
import { Land } from '@/lib/types';
import { landService } from '@/services/land.service';

interface LandState {
  lands: Land[];
  isLoading: boolean;
  error: string | null;
  fetchLands: () => Promise<void>;
}

export const useLandStore = create<LandState>((set, get) => ({
  lands: [],
  isLoading: false,
  error: null,
  fetchLands: async () => {
    // If we already have lands, don't fetch again (unless we want to force refresh)
    if (get().lands.length > 0) return;

    set({ isLoading: true, error: null });
    try {
      const { documents } = await landService.getLands({
        isPublic: true,
        limit: 100
      });
      set({ lands: documents, isLoading: false });
    } catch (error) {
      console.error('Error fetching lands for store:', error);
      set({ error: 'Failed to fetch lands', isLoading: false });
    }
  },
}));
