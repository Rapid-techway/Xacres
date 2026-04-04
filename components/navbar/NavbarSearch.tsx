'use client';

import { useFilterStore, FilterPanel } from '@/store/useFilterStore';
import { Search, MapPin, IndianRupee, Sprout, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import SearchPanelContainer from './filters/SearchPanelContainer';
import LocationFilter from './filters/LocationFilter';
import PriceFilter from './filters/PriceFilter';
import SizeFilter from './filters/SizeFilter';
import { formatPrice } from '@/lib/utils';
import { useLandStore } from '@/store/useLandStore';
import { filterLands } from '@/lib/filtering';

export default function NavbarSearch() {
  const { 
    location,
    minPrice, maxPrice,
    minSize, maxSize,
    activeFilterPanel,
    setActiveFilterPanel,
    setLocation,
    setPrice,
    setSize,
    stagedMinPrice, stagedMaxPrice,
    stagedMinSize, stagedMaxSize,
    applyStagedPrice, applyStagedSize,
    syncStagedWithActive
  } = useFilterStore();

  const { lands } = useLandStore();
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveFilterPanel(null);
      }
    };

    if (activeFilterPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeFilterPanel, setActiveFilterPanel]);

  const handlePanelToggle = (panel: FilterPanel) => {
    if (panel === 'price' || panel === 'size') {
      syncStagedWithActive();
    }
    setActiveFilterPanel(activeFilterPanel === panel ? null : panel);
  };

  const clearFilter = (e: React.MouseEvent, type: 'location' | 'price' | 'size') => {
    e.stopPropagation();
    if (type === 'location') setLocation(null);
    if (type === 'price') setPrice(null, null);
    if (type === 'size') setSize(null, null);
  };

  // Format labels and sub-labels
  const locationText = location || 'Search districts';
  
  let priceText = 'Add budget';
  if (minPrice || maxPrice) {
    if (minPrice && maxPrice) priceText = `₹${formatPrice(minPrice)} - ₹${formatPrice(maxPrice)}`;
    else if (minPrice) priceText = `Min ₹${formatPrice(minPrice)}`;
    else if (maxPrice) priceText = `Max ₹${formatPrice(maxPrice)}`;
  }

  let sizeText = 'Add area';
  if (minSize || maxSize) {
    if (minSize && maxSize) sizeText = `${minSize}-${maxSize} ac`;
    else if (minSize) sizeText = `${minSize}+ ac`;
    else if (maxSize) sizeText = `Up to ${maxSize} ac`;
  }

  return (
    <div className="relative w-full max-w-2xl px-4" ref={containerRef}>
      <div className={`
        flex items-center border shadow-[0_3px_12px_rgba(0,0,0,0.08)] rounded-full transition-all duration-300
        ${activeFilterPanel ? 'bg-gray-100 border-gray-200' : 'bg-background border-border hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]'}
      `}>
        
        {/* Location Section */}
        <div 
          onClick={() => handlePanelToggle('location')}
          className={`
            relative flex-1 flex flex-col items-start px-6 py-2.5 rounded-full cursor-pointer transition-all duration-200 group
            ${activeFilterPanel === 'location' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)]' : 'hover:bg-gray-200/50'}
          `}
        >
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className={location ? 'text-primary' : 'text-foreground/40'} />
            <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">Where</span>
          </div>
          <span className={`text-[14px] truncate w-full ${location ? 'text-foreground font-medium' : 'text-foreground/50'}`}>
            {locationText}
          </span>
          {location && (
            <button 
              onClick={(e) => clearFilter(e, 'location')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-200 text-foreground/40 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className={`w-[1px] h-8 bg-gray-200 transition-opacity ${activeFilterPanel === 'location' || activeFilterPanel === 'price' ? 'opacity-0' : 'opacity-100'}`}></div>

        {/* Price Section */}
        <div 
          onClick={() => handlePanelToggle('price')}
          className={`
            relative flex-1 flex flex-col items-start px-6 py-2.5 rounded-full cursor-pointer transition-all duration-200 group
            ${activeFilterPanel === 'price' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)]' : 'hover:bg-gray-200/50'}
          `}
        >
          <div className="flex items-center gap-1.5">
            <IndianRupee size={12} className={(minPrice || maxPrice) ? 'text-primary' : 'text-foreground/40'} />
            <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">Budget</span>
          </div>
          <span className={`text-[14px] truncate w-full ${(minPrice || maxPrice) ? 'text-foreground font-medium' : 'text-foreground/50'}`}>
            {priceText}
          </span>
          {(minPrice || maxPrice) && (
            <button 
              onClick={(e) => clearFilter(e, 'price')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-200 text-foreground/40 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className={`w-[1px] h-8 bg-gray-200 transition-opacity ${activeFilterPanel === 'price' || activeFilterPanel === 'size' ? 'opacity-0' : 'opacity-100'}`}></div>

        {/* Size Section */}
        <div 
          onClick={() => handlePanelToggle('size')}
          className={`
            relative flex-1 flex flex-col items-start px-6 py-2.5 rounded-full cursor-pointer transition-all duration-200 group
            ${activeFilterPanel === 'size' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)]' : 'hover:bg-gray-200/50'}
          `}
        >
          <div className="flex items-center gap-1.5">
            <Sprout size={12} className={(minSize || maxSize) ? 'text-primary' : 'text-foreground/40'} />
            <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">Area</span>
          </div>
          <span className={`text-[14px] truncate w-full ${(minSize || maxSize) ? 'text-foreground font-medium' : 'text-foreground/50'}`}>
            {sizeText}
          </span>
          {(minSize || maxSize) && (
            <button 
              onClick={(e) => clearFilter(e, 'size')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-200 text-foreground/40 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Button */}
        <div className="pr-1.5 pl-1 shrink-0">
          <button className="p-3.5 rounded-full bg-primary text-white hover:bg-primary/90 shadow-sm transition-colors flex items-center justify-center">
            <Search size={18} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Filter Panels */}
      {activeFilterPanel && (
        <div className={`
          absolute top-full mt-3 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl
          ${activeFilterPanel === 'location' ? 'sm:max-w-md' : 'sm:max-w-lg'}
        `}>
          <SearchPanelContainer>
            {activeFilterPanel === 'location' && <LocationFilter />}
            
            {activeFilterPanel === 'price' && (
              <div className="flex flex-col gap-6">
                <PriceFilter isStaged={true} />
                <div className="border-t border-gray-100 pt-5 px-1 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-1.5 opacity-60 max-w-[240px]">
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-xl">
                      <MapPin size={12} className="text-foreground/40" />
                      <span className="text-[12px] font-medium text-foreground/70 truncate max-w-[80px]">{location || 'Anywhere'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-xl">
                      <Sprout size={12} className="text-foreground/40" />
                      <span className="text-[12px] font-medium text-foreground/70">{sizeText}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      applyStagedPrice();
                      setActiveFilterPanel(null);
                    }}
                    className="bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 group active:scale-95 shrink-0"
                  >
                    <span>Search</span>
                    <span className="opacity-60 font-medium">
                      ({filterLands(lands, { 
                        location, 
                        minPrice: stagedMinPrice, 
                        maxPrice: stagedMaxPrice,
                        minSize, maxSize 
                      }).length})
                    </span>
                  </button>
                </div>
              </div>
            )}

            {activeFilterPanel === 'size' && (
              <div className="flex flex-col gap-6">
                <SizeFilter isStaged={true} />
                <div className="border-t border-gray-100 pt-5 px-1 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-1.5 opacity-60 max-w-[240px]">
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-xl">
                      <MapPin size={12} className="text-foreground/40" />
                      <span className="text-[12px] font-medium text-foreground/70 truncate max-w-[80px]">{location || 'Anywhere'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-xl">
                      <IndianRupee size={12} className="text-foreground/40" />
                      <span className="text-[12px] font-medium text-foreground/70 truncate max-w-[90px]">{priceText}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      applyStagedSize();
                      setActiveFilterPanel(null);
                    }}
                    className="bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 group active:scale-95 shrink-0"
                  >
                    <span>Search</span>
                    <span className="opacity-60 font-medium">
                      ({filterLands(lands, { 
                        location, 
                        minPrice, maxPrice,
                        minSize: stagedMinSize, 
                        maxSize: stagedMaxSize 
                      }).length})
                    </span>
                  </button>
                </div>
              </div>
            )}
          </SearchPanelContainer>
        </div>
      )}
    </div>
  );
}
