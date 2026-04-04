'use client';

import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerFooter
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/store/useFilterStore';
import { useFilteredLands } from '@/hooks/useFilteredLands';
import { Search, X, ChevronRight, MapPin, IndianRupee, Scaling } from 'lucide-react';
import LocationFilter from './filters/LocationFilter';
import PriceFilter from './filters/PriceFilter';
import SizeFilter from './filters/SizeFilter';
import { useState } from 'react';

interface MobileSearchDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'location' | 'price' | 'size' | null;

export default function MobileSearchDrawer({ open, onOpenChange }: MobileSearchDrawerProps) {
  const { 
    location, 
    minPrice, maxPrice, 
    minSize, maxSize,
    resetFilters
  } = useFilterStore();

  const { filteredLands } = useFilteredLands();
  const [activeStep, setActiveStep] = useState<Step>(null);

  // Summary helper
  const formatPriceCr = (price: number | null) => {
    if (!price) return '0';
    const cr = price / 10000000;
    return cr % 1 === 0 ? cr.toString() : cr.toFixed(1);
  };

  const priceText = (minPrice || maxPrice) 
    ? `₹${formatPriceCr(minPrice)} - ${maxPrice ? '₹' + formatPriceCr(maxPrice) : 'Any'} Cr`
    : 'Any budget';

  const sizeText = (minSize || maxSize)
    ? `${minSize || 0} - ${maxSize || 'Any'} ac`
    : 'Any area';

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[92vh] flex flex-col bg-white border-none rounded-t-[32px]">
        <DrawerHeader className="border-b border-gray-100 px-4 py-4 flex flex-row items-center justify-between shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)} 
            className="rounded-full bg-gray-50 hover:bg-gray-100"
          >
            <X size={20} />
          </Button>
          <DrawerTitle className="text-[17px] font-bold tracking-tight">Filters</DrawerTitle>
          <Button 
            variant="ghost" 
            onClick={resetFilters} 
            className="text-[14px] font-bold text-primary hover:bg-primary/5 px-3"
          >
            Clear all
          </Button>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
          
          {/* Step 1: Location */}
          <FilterSection 
            title="Where"
            summary={location || 'Search districts in Haryana'}
            icon={<MapPin size={18} />}
            isActive={activeStep === 'location'}
            isSelected={!!location}
            onClick={() => setActiveStep(activeStep === 'location' ? null : 'location')}
          >
            <h3 className="text-[20px] font-bold text-foreground mb-4">Where to?</h3>
            <LocationFilter />
          </FilterSection>

          {/* Step 2: Budget */}
          <FilterSection 
            title="Budget"
            summary={priceText}
            icon={<IndianRupee size={18} />}
            isActive={activeStep === 'price'}
            isSelected={!!(minPrice || maxPrice)}
            onClick={() => setActiveStep(activeStep === 'price' ? null : 'price')}
          >
            <h3 className="text-[20px] font-bold text-foreground mb-4">What&apos;s your budget?</h3>
            <PriceFilter />
          </FilterSection>

          {/* Step 3: Area */}
          <FilterSection 
            title="Area"
            summary={sizeText}
            icon={<Scaling size={18} />}
            isActive={activeStep === 'size'}
            isSelected={!!(minSize || maxSize)}
            onClick={() => setActiveStep(activeStep === 'size' ? null : 'size')}
          >
            <h3 className="text-[20px] font-bold text-foreground mb-4">How much land?</h3>
            <SizeFilter />
          </FilterSection>

        </div>

        <DrawerFooter className="border-t border-gray-100 bg-white p-4 shrink-0">
          <Button 
            onClick={() => onOpenChange(false)} 
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
          >
            <Search size={18} strokeWidth={3} />
            Show {filteredLands.length} {filteredLands.length === 1 ? 'land' : 'lands'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function FilterSection({ 
  title, 
  summary, 
  icon, 
  isActive, 
  isSelected, 
  onClick, 
  children 
}: { 
  title: string;
  summary: string;
  icon: React.ReactNode;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`overflow-hidden rounded-[24px] border transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
      isActive 
        ? 'bg-white border-gray-300 shadow-xl ring-1 ring-black/5' 
        : 'bg-white border-gray-200 hover:bg-gray-50/80'
    }`}>
      <button 
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 px-5 text-left transition-all ${isActive ? 'pb-2 opacity-100' : 'opacity-100'}`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isSelected || isActive ? 'bg-primary text-white shadow-md shadow-primary/10' : 'bg-gray-100 text-foreground/60'
          }`}>
            {icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`text-[12px] font-bold uppercase tracking-wider transition-colors ${
              isActive ? 'text-primary' : 'text-foreground/60'
            }`}>{title}</span>
            {!isActive && (
              <span className={`text-[15px] font-semibold truncate transition-colors ${
                isSelected ? 'text-foreground' : 'text-foreground/50'
              }`}>
                {summary}
              </span>
            )}
          </div>
        </div>
        {!isActive && <ChevronRight size={18} className="text-foreground/40 shrink-0" />}
      </button>
      
      <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top ${
        isActive ? 'max-h-[600px] opacity-100 p-5 pt-2' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        {children}
      </div>
    </div>
  );
}
