"use client"

import dynamic from "next/dynamic"
import { FlattenedLand, GeoJsonFeatureCollection } from "@/lib/types"
import SubHeaderInfo from "@/components/common/SubHeaderInfo"
import ImageGrid from "@/components/common/ImageGrid"
import SubLandDetails from "@/components/common/SubLandDetails"
import PriceStickyCard from "@/components/common/PriceStickyCard"

// Dynamically import map components (reuse same as admin)
const SubMapView = dynamic(() => import("@/components/common/SubMapView"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-50 animate-pulse rounded-3xl flex items-center justify-center text-gray-400 font-medium">Loading Map...</div>
})

interface LandViewProps {
  data: FlattenedLand;
}

export default function LandView({ data }: LandViewProps) {
  return (
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
              price={data.price}
              area={data.area}
              type={data.type}
              title={data.title}
              slug={data.slug}
            />
          </div>
        </div>
      </div>

      {/* Trust & Verification Section (Public) */}
      <div className="mt-20 pt-16 border-t border-gray-100 pb-16">
        <div className="bg-white border border-gray-200 shadow-sm rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4 text-left">
            <h2 className="text-2xl font-bold text-gray-900">Interested in this property?</h2>
            <p className="text-gray-600 font-medium">
              Every listing on Xacres is verified by our team. Connect with us to get more details,
              schedule a site visit, or discuss ownership transfers.
            </p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-green-100 transition-all hover:scale-105 whitespace-nowrap">
            Contact for Details
          </button>
        </div>
      </div>
    </div>
  )
}
