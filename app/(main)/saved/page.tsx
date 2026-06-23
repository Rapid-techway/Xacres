'use client';

import { useSavedLandsStore } from '@/store/useSavedLandsStore';
import LandCard from '@/components/common/LandCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import FloatingToggler from '@/components/common/FloatingToggler';
import { useMounted } from '@/hooks/useMounted';

export default function SavedLandsPage() {
  const { savedLands, isLoaded, loadSaved } = useSavedLandsStore();
  const mounted = useMounted();

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  const showSkeleton = !mounted || !isLoaded;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-36 min-h-[75vh] flex flex-col justify-between">
      <div>
        {/* Page Header */}
        <div className="mb-8 border-b border-stone-100 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Saved Lands
          </h1>
          <p className="text-gray-500 font-medium">
            {showSkeleton 
              ? 'Loading your favorites...' 
              : `${savedLands.length} ${savedLands.length === 1 ? 'property' : 'properties'} saved`
            }
          </p>
        </div>

        {/* Main Content */}
        {showSkeleton ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3 animate-pulse">
                <div className="aspect-[4/3] w-full bg-stone-100 rounded-[24px]" />
                <div className="h-5 bg-stone-100 rounded w-3/4" />
                <div className="h-4 bg-stone-100 rounded w-1/2" />
                <div className="h-5 bg-stone-100 rounded w-1/4 mt-2" />
              </div>
            ))}
          </div>
        ) : savedLands.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-stone-50/50 rounded-[32px] border border-dashed border-stone-200 text-center px-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 bg-white rounded-2xl border border-stone-100 shadow-sm flex items-center justify-center text-red-500 mb-6 animate-pulse-subtle">
              <Heart size={32} className="fill-red-500/10" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">Your saved lands list is empty</h2>
            <p className="text-stone-500 mb-8 max-w-sm text-center font-medium text-sm leading-relaxed">
              Explore available agricultural plots and bookmark your favorites to compare them easily in one place.
            </p>
            <Link 
              href="/lands"
              className="bg-stone-900 hover:bg-black text-white font-bold rounded-2xl px-8 py-3.5 shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 transition-all duration-200 text-[14px]"
            >
              Explore Lands
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {savedLands.map((land) => (
              <LandCard key={land.$id || land.id} land={land} />
            ))}
          </div>
        )}
      </div>

      {/* Floating switcher at the bottom */}
      <FloatingToggler />
    </div>
  );
}
