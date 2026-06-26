'use client';

import { useState } from 'react';
import { Land } from '@/lib/types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ArrowRight,
  Share,
  Navigation
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer';
import { formatPrice, shareProperty } from '@/lib/utils';

interface LandDetailViewProps {
  land: Land;
  onClose: () => void;
}

export default function LandDetailView({ land, onClose }: LandDetailViewProps) {
  const isMobile = useIsMobile();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Reset state when land changes (during render is preferred over useEffect for prop sync)
  const [lastSlug, setLastSlug] = useState(land.slug);
  if (land.slug !== lastSlug) {
    setLastSlug(land.slug);
    setCurrentImageIndex(0);
    setIsImageLoaded(false);
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImageLoaded(false);
    setCurrentImageIndex((prev) => (prev === 0 ? land.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImageLoaded(false);
    setCurrentImageIndex((prev) => (prev === land.images.length - 1 ? 0 : prev + 1));
  };

  if (isMobile === undefined) return null;

  const mainContent = (
    <div className="flex flex-col bg-white font-sans min-h-0 overflow-hidden">
      {/* Refined Header - Unified for Mobile/Desktop */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between bg-white relative z-10 shrink-0">
        <div className="space-y-1.5 text-left flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
              {land.area} acres
            </h3>
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 text-white" stroke="currentColor" strokeWidth="4">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
            <MapPin size={14} className="text-gray-400" />
            <span className="truncate">{land.village}, {land.district} (Dist)</span>
          </div>

          <div className="flex items-center flex-wrap gap-1 text-[15px] font-semibold text-gray-900">
            <span>₹ {formatPrice(land.listedPrice / land.area)} /acre</span>
            <span className="text-gray-400 font-medium"> (Total - {formatPrice(land.listedPrice)})</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900 active:scale-90"
        >
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth pb-2 min-h-0">
        {/* Boxed Image Gallery - Inset with Margins */}
        <div className="px-6 mb-6">
          <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-gray-100 group/gallery shadow-sm">
            <Image
              src={land.images[currentImageIndex]?.url}
              alt={`${land.area} acres - ${currentImageIndex + 1}`}
              fill
              onLoad={() => setIsImageLoaded(true)}
              className={`object-cover transition-all duration-700 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />

            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}

            {/* Centered Navigation Overlay */}
            {land.images.length > 1 && (
              <>
                <div className="absolute inset-0 flex items-center justify-between px-3">
                  <button
                    onClick={handlePrevImage}
                    className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 flex items-center justify-center transition-all shadow-lg active:scale-95 border border-white/20"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 flex items-center justify-center transition-all shadow-lg active:scale-95 border border-white/20"
                  >
                    <ChevronRight size={28} />
                  </button>
                </div>

                {/* Paging Dots - Refined */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 transition-all">
                  {land.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/50'
                        }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Subtle Type Tag */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest rounded-full border border-white/10 shadow-sm">
                {land.landType}
              </span>
            </div>
          </div>
        </div>

        {/* Improved Action Buttons Row */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <button
            onClick={() => {
              shareProperty({
                title: land.title,
                slug: land.slug,
                district: land.district,
                village: land.village,
                type: land.landType
              });
            }}
            className="flex items-center justify-center w-11 h-11 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm transition-all active:scale-95 group"
            title="Share property"
          >
            <Share size={20} strokeWidth={2.2} className="transition-transform group-hover:rotate-12" />
          </button>

          <button
            onClick={() => {
              const url = `https://www.google.com/maps?q=&layer=c&cbll=${land.latitude},${land.longitude}`;
              window.open(url, "_blank");
            }}
            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-bold text-gray-900 shadow-sm transition-all active:scale-[0.98]"
          >
            <Navigation size={16} strokeWidth={2.5} className="text-blue-500" />
            Real View
          </button>
        </div>

        {/* Property Overview Restoration */}
        <div className="px-6 mb-4 space-y-3">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-3 bg-blue-500 rounded-full" />
            Property Overview
          </h4>
          <p className="text-[13.5px] text-gray-600 font-medium leading-relaxed italic border-l-2 border-gray-100 pl-4 py-1">
            &quot;{land.description}&quot;
          </p>
        </div>
      </div>

      {/* Premium Blue Footer Action */}
      <div className="p-4 border-t border-gray-100 bg-white mt-auto shrink-0">
        <Link
          href={`/lands/${land.slug}`}
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-blue-100 transition-all group active:scale-[0.98]"
        >
          View Full Details
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );

  // Desktop Floating Card implementation
  if (!isMobile) {
    return (
      <div className="absolute top-4 right-4 w-[350px] max-h-[calc(100vh-32px)] z-[1000] animate-in fade-in slide-in-from-right-4 duration-500 pointer-events-none flex flex-col pb-18">
        <div className="flex flex-col overflow-hidden rounded-[32px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100/50 pointer-events-auto max-h-full ">
          {mainContent}
        </div>
      </div>
    );
  }

  // Mobile Bottom Drawer implementation
  return (
    <Drawer open={true} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent
        className="h-[68vh] p-0 rounded-t-3xl border-none overflow-hidden"
      >
        <DrawerTitle className="sr-only">{land.area} acres Details</DrawerTitle>
        {mainContent}
      </DrawerContent>
    </Drawer>
  );
}
