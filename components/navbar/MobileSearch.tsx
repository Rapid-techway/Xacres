'use client';

import { Search } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useFilterStore } from '@/store/useFilterStore';
import MobileSearchDrawer from './MobileSearchDrawer';
import { useState } from 'react';

export default function MobileSearch() {
  const { location, minPrice, maxPrice, minSize, maxSize } = useFilterStore();
  const [isOpen, setIsOpen] = useState(false);

  let priceSummary = 'Any budget';
  if (minPrice || maxPrice) {
    if (minPrice && maxPrice) priceSummary = `₹${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
    else if (minPrice) priceSummary = `₹${formatPrice(minPrice)}+`;
    else if (maxPrice) priceSummary = `Up to ₹${formatPrice(maxPrice)}`;
  }

  let sizeSummary = 'Any area';
  if (minSize || maxSize) {
    if (minSize && maxSize) sizeSummary = `${minSize}-${maxSize} ac`;
    else if (minSize) sizeSummary = `${minSize}+ ac`;
    else if (maxSize) sizeSummary = `Up to ${maxSize} ac`;
  }

  return (
    <div className="w-full px-2 ">
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:shadow-md transition-all active:scale-[0.98]"
      >
        <div className="p-2 text-primary">
          <Search size={20} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-start overflow-hidden min-w-0 text-left">
          <span className="text-[14px] font-bold text-foreground truncate w-full">
            {location ? location : 'Where to?'}
          </span>
          <span className="text-[12px] text-foreground/50 truncate w-full leading-tight">
            {location ? `${priceSummary} • ${sizeSummary}` : 'Search districts in Haryana'}
          </span>
        </div>
      </button>

      <MobileSearchDrawer open={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
}
