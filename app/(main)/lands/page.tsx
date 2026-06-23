'use client';

import { useFilteredLands } from '@/hooks/useFilteredLands';
import { useFilterStore } from '@/store/useFilterStore';
import LandCard from '@/components/common/LandCard';
import { LayoutGrid, MapPin, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import FloatingToggler from '@/components/common/FloatingToggler';

export default function PublicLandsPage() {
  const { resetFilters } = useFilterStore();
  const { filteredLands, isLoading, totalCount } = useFilteredLands();
  const [showButton, setShowButton] = useState(true);
  const footerSentinelRef = useRef<HTMLDivElement>(null);
  
  const hasActiveFilters = totalCount > filteredLands.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide button when the sentinel (bottom info) enters 20% of the viewport
        setShowButton(!entry.isIntersecting);
      },
      { 
        threshold: 0,
        rootMargin: '0px 0px -100px 0px' // Trigger slightly before it hits the bottom
      }
    );

    if (footerSentinelRef.current) {
      observer.observe(footerSentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-8">
      {/* Page Header / Results Count */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Agricultural Lands
          </h1>
          <p className="text-gray-500 font-medium">
            {filteredLands.length} {filteredLands.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>

        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="rounded-full border-gray-300 font-bold text-gray-700 hover:bg-gray-50 gap-2"
          >
            <Trash2 size={16} />
            Clear all filters
          </Button>
        )}
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="aspect-square w-full bg-gray-200 rounded-2xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/4 mt-2" />
            </div>
          ))}
        </div>
      ) : filteredLands.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-300 mb-6">
            <LayoutGrid size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No matching lands</h2>
          <p className="text-gray-500 mb-8 max-w-sm text-center font-medium">
            Try adjusting your filters or search criteria to find what you&apos;re looking for.
          </p>
          <Button 
            onClick={resetFilters}
            className="bg-gray-900 hover:bg-black text-white font-bold rounded-xl px-8 h-12 shadow-lg"
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {filteredLands.map((land) => (
            <LandCard key={land.$id} land={land} />
          ))}
        </div>
      )}

      {/* Floating View Switcher */}
      <FloatingToggler show={showButton} />

      {/* Bottom Info */}
      {!isLoading && filteredLands.length > 0 && (
        <div 
          ref={footerSentinelRef}
          className="mt-20 pt-12 border-t border-gray-100 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-gray-500 font-medium">
            Continue exploring more amazing agricultural lands in Haryana.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full">
            <MapPin size={12} />
            Showing results for 15+ Districts
          </div>
        </div>
      )}
    </div>
  );
}
