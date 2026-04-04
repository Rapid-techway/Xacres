'use client';

import { useFilterStore } from '@/store/useFilterStore';
import { Check, Sprout } from 'lucide-react';

const SIZE_PRESETS = [
  { label: 'Any size', min: null, max: null },
  { label: 'Under 1 acre', min: null, max: 1 },
  { label: '1 - 2 acres', min: 1, max: 2 },
  { label: '2 - 5 acres', min: 2, max: 5 },
  { label: '5 - 10 acres', min: 5, max: 10 },
  { label: '10+ acres', min: 10, max: null }
];

export default function SizeFilter({ isStaged = false }: { isStaged?: boolean }) {
  const { 
    minSize: activeMin, 
    maxSize: activeMax, 
    setSize,
    stagedMinSize,
    stagedMaxSize,
    setStagedSize
  } = useFilterStore();

  const minSize = isStaged ? stagedMinSize : activeMin;
  const maxSize = isStaged ? stagedMaxSize : activeMax;
  const updateSize = isStaged ? setStagedSize : setSize;

  const handleSelect = (min: number | null, max: number | null) => {
    updateSize(min, max);
  };

  return (
    <div className="flex flex-col w-full min-w-[280px]">
      <div className="flex items-center gap-2 mb-6 px-1">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <Sprout size={18} />
        </div>
        <h3 className="text-[17px] font-bold text-foreground">Property Area</h3>
      </div>

      <div className="overflow-y-auto max-h-[300px] -mx-2 px-2 custom-scrollbar">
        <ul className="space-y-1.5">
          {SIZE_PRESETS.map((preset, index) => {
            const isSelected = minSize === preset.min && maxSize === preset.max;
            return (
              <li key={index}>
                <button
                  onClick={() => handleSelect(preset.min, preset.max)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                    isSelected ? 'bg-primary/5 text-primary font-bold' : 'hover:bg-gray-50 text-foreground/80'
                  }`}
                >
                  <span className="text-[15px]">{preset.label}</span>
                  {isSelected && (
                    <div className="bg-primary p-1 rounded-full shadow-sm">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
