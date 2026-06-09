'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Sprout, Heart, Ruler, Route } from 'lucide-react';
import { Land } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

interface LandCardProps {
  land: Land;
}

export default function LandCard({ land }: LandCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const primaryImage = land.images.find(img => img.isPrimary)?.url ||
    land.images[0]?.url ||
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="group relative bg-white border border-[#e7e5e4] rounded-[24px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Full Card Link overlay (elevated to z-30 to cover the whole card text & image) */}
      <Link href={`/lands/${land.slug}`} className="absolute inset-0 z-30" />

      {/* Image Container (flush with top, left, right edges) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-50">
        <Image
          src={primaryImage}
          alt={land.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-102"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Top Left Badge: Area size */}
        <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <Ruler size={11} className="text-white/80" />
          <span>{land.area} Acres</span>
        </div>

        {/* Top Right Wishlist button (elevated to z-40 to sit above full-card overlay) */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 z-40 w-8.5 h-8.5 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-stone-100"
          title={isFavorite ? "Remove from Saved" : "Save Property"}
        >
          <Heart
            size={14}
            className={`transition-colors duration-200 ${isFavorite ? "fill-red-500 text-red-500" : "text-stone-600"}`}
          />
        </button>
      </div>

      {/* Info Section: Overlaps the bottom of the image with curved top corners */}
      <div className="relative bg-white rounded-t-[24px] -mt-5 p-5 flex flex-col gap-3.5 z-20 flex-1">
        {/* Decision Metrics Group (Price, Area, and Rate per Acre together) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline">
            <h3 className="text-2xl font-sans font-semibold text-stone-900 tracking-tight leading-none">
              ₹ {formatPrice(land.price)}
            </h3>
            <span className="text-[13px] font-bold text-blue-600 tracking-wide shrink-0">
              ₹ {formatPrice(Math.round(land.price / land.area))}/ac
            </span>
          </div>
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            {land.area} Acres Total
          </p>
        </div>

        {/* Village & District Location */}
        <div className="flex items-center gap-1.5 text-stone-550 text-xs font-semibold pt-2.5 border-t border-stone-100">
          <MapPin size={13.5} className="text-stone-400 shrink-0" />
          <span className="truncate">{land.village}, {land.district}</span>
        </div>

        {/* Attribute Badges & Action Arrow */}
        <div className="flex items-center justify-between gap-4 mt-auto pt-2 z-20">
          {/* Attribute Badges */}
          <div className="flex flex-wrap gap-1.5 min-w-0">
            <div className="bg-[#f4f4f5] border border-stone-200/20 text-stone-700 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Sprout size={10.5} className="text-stone-400" />
              <span>{land.type || 'Agricultural'}</span>
            </div>

            <div className="bg-[#f4f4f5] border border-stone-200/20 text-stone-700 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Route size={10.5} className="text-stone-450" />
              <span>{land.roadAccess ? 'Road Access' : 'No Direct Road'}</span>
            </div>
          </div>

          {/* Arrow indicator */}
          {/* <div 
            className="w-8.5 h-8.5 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-600 active:scale-95 transition-all duration-200 shrink-0"
          >
            <ArrowRight size={15} />
          </div> */}
        </div>
      </div>
    </div>
  );
}
