'use client';

import { useFilterStore } from '@/store/useFilterStore';
import { Check, Search, MapPin } from 'lucide-react';
import { useState } from 'react';

import { HARYANA_DISTRICTS } from '@/lib/static';

export default function LocationFilter() {
  const { location, setLocation, setActiveFilterPanel } = useFilterStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDistricts = HARYANA_DISTRICTS.filter(d => 
    d.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (district: string) => {
    if (location === district) {
      setLocation(null); // toggle off
    } else {
      setLocation(district);
      setActiveFilterPanel(null); // close panel on select
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[420px] w-full">
      <div className="relative mb-4 px-1">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
        <input 
          type="text"
          placeholder="Search districts in Haryana"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-[15px] focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      <div className="overflow-y-auto overflow-x-hidden flex-1 custom-scrollbar max-h-[300px] -mx-4 px-4 pr-2">
        <ul className="space-y-1">
          {filteredDistricts.length > 0 ? (
            filteredDistricts.map((district) => {
              const isSelected = location === district;
              return (
                <li key={district}>
                  <button
                    onClick={() => handleSelect(district)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                      isSelected ? 'bg-primary/5 text-primary font-bold' : 'hover:bg-gray-50 text-foreground/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-foreground/40 group-hover:bg-white group-hover:shadow-sm'}`}>
                        <MapPin size={16} />
                      </div>
                      <span className="text-[15px]">{district}</span>
                    </div>
                    {isSelected && <Check size={18} className="text-primary" />}
                  </button>
                </li>
              );
            })
          ) : (
            <div className="py-10 text-center text-foreground/40 text-[14px]">
              No districts found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
