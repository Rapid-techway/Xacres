"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { FlattenedLand, GeoJsonFeatureCollection } from "@/lib/types"
import SubHeaderInfo from "@/components/common/SubHeaderInfo"
import ImageGrid from "@/components/common/ImageGrid"
import SubLandDetails from "@/components/common/SubLandDetails"
import PriceStickyCard from "@/components/common/PriceStickyCard"
import MobileBottomBar from "@/components/common/MobileBottomBar"

// Dynamically import map components (reuse same as admin)
const SubMapView = dynamic(() => import("@/components/common/SubMapView"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-50 animate-pulse rounded-3xl flex items-center justify-center text-gray-400 font-medium">Loading Map...</div>
})

interface LandViewProps {
  data: FlattenedLand;
}

export default function LandView({ data }: LandViewProps) {
  const [isMainCardVisible, setIsMainCardVisible] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMainCardVisible(entry.isIntersecting);
      },
      { 
        threshold: 0,
        rootMargin: "-20px 0px 0px 0px"
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-700">
        {/* Header Info (Breadcrumbs, Title, Share) */}
        <SubHeaderInfo data={data} />

        {/* Image Grid (Airbnb Style) */}
        <ImageGrid
          images={data.images || []}
          title={data.title}
        />

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left Column: Details & Map */}
          <div className="lg:col-span-2 space-y-12">
            {/* Summary & Description */}
            <SubLandDetails data={data} />

            {/* Map Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Location & Boundaries</h3>
              <div className="h-[450px] rounded overflow-hidden ">
                <SubMapView
                  initialPolygon={data.polygon as GeoJsonFeatureCollection | null}
                  initialCenter={{ lat: data.latitude, lng: data.longitude }}
                  village={data.village}
                  district={data.district}
                  latitude={data.latitude}
                  longitude={data.longitude}
                />
              </div>
              <p className="text-sm text-gray-500 italic">
                * Boundary markers are indicative of the property area.
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Price Card */}
          <div className="relative">
            <div className="sticky top-24">
              <PriceStickyCard
                ref={cardRef}
                price={data.price}
                area={data.area}
                type={data.type}
                title={data.title}
                slug={data.slug}
              />
            </div>
          </div>
        </div>
      </div>

      <MobileBottomBar
        price={data.price}
        area={data.area}
        title={data.title}
        slug={data.slug}
        isVisible={!isMainCardVisible}
      />
    </>
  )
}

