"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Maximize2, MoreHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react"
import { LandImage } from "@/lib/types"

interface ImageGridProps {
  images: LandImage[]
  title: string
}

export default function ImageGrid({ images, title }: ImageGridProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Minimum distance in px to register a swipe

    if (diffX > minSwipeDistance) {
      // Swiped left -> Next image
      handleNext();
    } else if (diffX < -minSwipeDistance) {
      // Swiped right -> Previous image
      handlePrev();
    }

    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const sortedImages = [...(images || [])].sort(
    (a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0)
  )

  const displayImages = sortedImages.slice(0, 5)
  const remainingCount = sortedImages.length - 5

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (selectedImageIndex !== null) {
      setIsImageLoaded(false)
      setSelectedImageIndex((prev) => (prev! + 1) % sortedImages.length)
    }
  }, [selectedImageIndex, sortedImages.length])

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (selectedImageIndex !== null) {
      setIsImageLoaded(false)
      setSelectedImageIndex((prev) => (prev! - 1 + sortedImages.length) % sortedImages.length)
    }
  }, [selectedImageIndex, sortedImages.length])


  // Handle keyboard navigation and body scroll
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "Escape") setSelectedImageIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = ""
    }
  }, [selectedImageIndex, handleNext, handlePrev]);

  const isOpen = selectedImageIndex !== null;
  // Handle mobile back button to close full screen
  useEffect(() => {
    if (!isOpen) return;

    // Push a dummy state to history
    window.history.pushState({ fullScreen: 'gallery' }, '');

    const handlePopState = () => {
      setSelectedImageIndex(null);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Remove the dummy state if we close manually
      if (window.history.state?.fullScreen === 'gallery') {
        window.history.back();
      }
    };
  }, [isOpen]); // Only run when opening/closing, not on index change

  if (displayImages.length === 0) {
    return (
      <div className="relative group overflow-hidden rounded-2xl aspect-[16/9] md:aspect-[21/9] bg-gray-100 flex items-center justify-center text-gray-400 font-medium border-2 border-dashed border-gray-200">
        <div className="flex flex-col items-center gap-2">
          <Maximize2 size={40} className="opacity-20" />
          <span>No images available for this property</span>
        </div>
      </div>
    )
  }


  return (
    <>
      <div className="relative group rounded-xl overflow-hidden">
        <div className="aspect-[16/9] md:aspect-[21/9] w-full md:h-[350px]">
          <div
            className={`grid h-full w-full gap-2 
            ${displayImages.length === 1 ? "grid-cols-1" : ""}
            ${displayImages.length === 2 ? "grid-cols-2" : ""}
            ${displayImages.length >= 3 ? "grid-cols-4 grid-rows-2" : ""}
          `}
          >
            {/* Main Large Image */}
            <div
              onClick={() => setSelectedImageIndex(0)}
              className={`relative h-full w-full overflow-hidden 
              ${displayImages.length >= 3 ? "col-span-2 row-span-2" : ""}
              ${displayImages.length === 1 ? "col-span-full row-span-full" : ""}
              ${displayImages.length === 2 ? "col-span-1 row-span-full" : ""}
            `}
            >
              <Image
                src={displayImages[0].url}
                alt={`${title} - Main Image`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover hover:scale-[1.02] transition-transform duration-500 cursor-pointer brightness-[0.98] hover:brightness-100"
              />
            </div>

            {/* Smaller Images */}
            {displayImages.length >= 2 && (
              <>
                {/* Image 2 */}
                <div
                  onClick={() => setSelectedImageIndex(1)}
                  className={`relative h-full w-full overflow-hidden
                  ${displayImages.length === 3 ? "col-span-2 row-span-1" : ""}
                  ${displayImages.length === 4 ? "col-span-1 row-span-1" : ""}
                  ${displayImages.length >= 5 ? "col-span-1 row-span-1" : ""}
                  ${displayImages.length === 2 ? "col-span-1 row-span-full" : ""}
                `}
                >
                  <Image
                    src={displayImages[1].url}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover hover:scale-[1.02] transition-transform duration-500 cursor-pointer brightness-[0.98] hover:brightness-100"
                  />
                </div>

                {/* Image 3 */}
                {displayImages.length >= 3 && (
                  <div
                    onClick={() => setSelectedImageIndex(2)}
                    className={`relative h-full w-full overflow-hidden
                    ${displayImages.length === 3 ? "col-span-2 row-span-1" : ""}
                    ${displayImages.length === 4 ? "col-span-1 row-span-1" : ""}
                    ${displayImages.length >= 5 ? "col-span-1 row-span-1" : ""}
                  `}
                  >
                    <Image
                      src={displayImages[2].url}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover hover:scale-[1.02] transition-transform duration-500 cursor-pointer brightness-[0.98] hover:brightness-100"
                    />
                  </div>
                )}

                {/* Image 4 */}
                {displayImages.length >= 4 && (
                  <div
                    onClick={() => setSelectedImageIndex(3)}
                    className={`relative h-full w-full overflow-hidden
                    ${displayImages.length === 4 ? "col-span-2 row-span-1" : ""}
                    ${displayImages.length >= 5 ? "col-span-1 row-span-1" : ""}
                  `}
                  >
                    <Image
                      src={displayImages[3].url}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover hover:scale-[1.02] transition-transform duration-500 cursor-pointer brightness-[0.98] hover:brightness-100"
                    />
                  </div>
                )}

                {/* Image 5 */}
                {displayImages.length >= 5 && (
                  <div
                    onClick={() => setSelectedImageIndex(4)}
                    className="relative h-full w-full overflow-hidden"
                  >
                    <Image
                      src={displayImages[4].url}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover hover:scale-[1.02] transition-transform duration-500 cursor-pointer brightness-[0.98] hover:brightness-100"
                    />
                    {remainingCount > 0 && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white cursor-pointer hover:bg-black/60 transition-colors backdrop-blur-[2px]">
                        <span className="text-2xl font-bold">
                          +{remainingCount}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">
                          Photos
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => setSelectedImageIndex(0)}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-gray-200 text-gray-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-all hover:bg-white flex items-center gap-2 z-10"
        >
          <MoreHorizontal size={14} />
          Show all photos
        </button>
      </div>

      {/* Full Screen Modal */}
      {selectedImageIndex !== null && typeof document !== "undefined" && createPortal(
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-sm animate-in fade-in duration-300 flex items-center justify-center"
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImageIndex(null)
            }}
            className="absolute top-6 left-6 z-[1000] bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-xl hover:bg-white/20 transition-all active:scale-95 group/close"
            title="Close (Esc)"
          >
            <X size={24} className="text-white/80 group-hover/close:text-white transition-colors" />
          </button>

          {/* Navigation Buttons */}
          {sortedImages.length > 1 && (
            <>
              {/* PREV */}
              <button
                onClick={handlePrev}
                className="
        absolute z-[1000]
        
        /* Mobile (bottom left) */
        bottom-6 left-6
        
        /* Desktop (center left) */
        sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto
        
        bg-white/10 backdrop-blur-md
        p-4 sm:p-3
        rounded-2xl border border-white/20 shadow-xl
        hover:bg-white/20 transition-all active:scale-95
        group/nav
      "
                title="Previous"
              >
                <ChevronLeft size={24} className="text-white/80 group-hover/nav:text-white" />
              </button>

              {/* NEXT */}
              <button
                onClick={handleNext}
                className="
        absolute z-[1000]
        
        /* Mobile (bottom right) */
        bottom-6 right-6
        
        /* Desktop (center right) */
        sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto
        
        bg-white/10 backdrop-blur-md
        p-4 sm:p-3
        rounded-2xl border border-white/20 shadow-xl
        hover:bg-white/20 transition-all active:scale-95
        group/nav
      "
                title="Next"
              >
                <ChevronRight size={24} className="text-white/80 group-hover/nav:text-white" />
              </button>
            </>
          )}

          {/* Main Image View */}
          <div
            className="relative w-full h-full p-4 md:p-16 flex items-center justify-center"
            onClick={() => setSelectedImageIndex(null)}
          >
            <div
              className="relative w-full h-full max-w-7xl max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={sortedImages[selectedImageIndex].url}
                alt={`${title} - Photo ${selectedImageIndex + 1}`}
                fill
                className={`transition-all duration-700 object-scale-down select-none ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                sizes="100vw"
                quality={100}
                priority
                onLoad={() => setIsImageLoaded(true)}
              />
              {!isImageLoaded && (
                <div className="absolute sm:mx-40 my-50 sm:my-0 inset-0 bg-white/5 animate-pulse rounded-2xl border border-white/10" />
              )}
            </div>
          </div>

          {/* Bottom Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-xl text-white font-medium text-sm tracking-wide flex items-center gap-2 select-none">
            <span className="font-semibold">{selectedImageIndex + 1}</span>
            <span className="text-white/50">/</span>
            <span>{sortedImages.length} images</span>
          </div>

          {/* Touch swipe handles all transitions on mobile/tablets */}
        </div>,
        document.body
      )}
    </>
  )
}


