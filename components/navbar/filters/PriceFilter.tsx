'use client';

import { useFilterStore } from '@/store/useFilterStore';
import { IndianRupee } from 'lucide-react';

export default function PriceFilter() {
  const { minPrice, maxPrice, setPrice } = useFilterStore();

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? parseInt(e.target.value, 10) : null;
    setPrice(val, maxPrice);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? parseInt(e.target.value, 10) : null;
    setPrice(minPrice, val);
  };

  const quickSelect = (presetMin: number | null, presetMax: number | null) => {
    setPrice(presetMin, presetMax);
  };

  const presets = [
    { label: 'Under ₹50L', min: null, max: 5000000 },
    { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
    { label: '₹1Cr - ₹5Cr', min: 10000000, max: 50000000 },
    { label: '₹5Cr+', min: 50000000, max: null }
  ];

  return (
    <div className="flex flex-col w-full min-w-[320px]">
      <div className="flex items-center gap-2 mb-6 px-1">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <IndianRupee size={18} />
        </div>
        <h3 className="text-[17px] font-bold text-foreground">Budget Range</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8 px-1">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-wider ml-1">Minimum</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 font-medium transition-colors group-focus-within:text-primary">₹</span>
            <input 
              type="number" 
              value={minPrice || ''}
              onChange={handleMinChange}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-[15px] font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-300"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-foreground/40 uppercase tracking-wider ml-1">Maximum</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 font-medium transition-colors group-focus-within:text-primary">₹</span>
            <input 
              type="number" 
              value={maxPrice || ''}
              onChange={handleMaxChange}
              placeholder="Any"
              className="w-full pl-8 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-[15px] font-medium text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-300"
            />
          </div>
        </div>
      </div>

      <div className="px-1">
        <p className="text-[11px] font-bold text-foreground/40 uppercase tracking-wider mb-3 ml-1">Popular Brackets</p>
        <div className="flex flex-wrap gap-2.5">
          {presets.map((preset, idx) => {
            const isActive = minPrice === preset.min && maxPrice === preset.max;
            return (
              <button 
                key={idx}
                onClick={() => quickSelect(preset.min, preset.max)} 
                className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-all duration-200 ${
                  isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                  : 'bg-gray-100 text-foreground/70 hover:bg-gray-200 border border-transparent'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
