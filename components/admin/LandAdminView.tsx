"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { Phone,
  ShieldCheck,
  Edit3,
  FileText,
  Handshake,
  Quote,
  Tag,
  TrendingDown,
  User
} from "lucide-react"
import { FlattenedLand, GeoJsonFeatureCollection } from "@/lib/types"
import ImageGrid from "@/components/common/ImageGrid"
import PriceStickyCard from "@/components/common/PriceStickyCard"
import SubLandDetails from "@/components/common/SubLandDetails"
import SubHeaderInfo from "@/components/common/SubHeaderInfo"


// Dynamically import map components
const SubMapView = dynamic(() => import("@/components/common/SubMapView"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-50 animate-pulse rounded-3xl flex items-center justify-center text-gray-400">Loading Map...</div>
})

interface LandAdminViewProps {
  data: FlattenedLand
}

export default function LandAdminView({ data }: LandAdminViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 py-1 space-y-8 animate-in fade-in duration-700">
      {/* Header Info */}
      <SubHeaderInfo 
        data={data}
      />

      {/* Image Grid (Airbnb Style) */}
      <ImageGrid images={data.images || []} title={data.title} />

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-10">
          <SubLandDetails data={data} />

          {/* Map Section */}
          <SubMapView
            initialPolygon={data.polygon as GeoJsonFeatureCollection | null}
            initialCenter={{ lat: data.latitude, lng: data.longitude }}
            village={data.village}
            district={data.district}
            latitude={data.latitude}
            longitude={data.longitude}
          />
        </div>

        <PriceStickyCard
          price={data.price}
          area={data.area}
          type={data.type}
        />
      </div>

      {/* Admin Only Section (Bottom) */}
      <div className="pt-10 mt-10 border-t border-gray-100 space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                Internal Admin Details
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Confidential property assessment and pricing
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Badge */}
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold uppercase tracking-wider rounded-full whitespace-nowrap">
              Admin Only
            </span>

            {/* Button */}
            <Link
              href={`/admin/lands/${data.$id}/edit`}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 border-b border-dashed border-gray-400 hover:border-gray-900 transition"
            >
              <Edit3 size={14} />
              Edit Property
            </Link>

          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* Owner Name */}
          <div className="group bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-200 transition-all hover:shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <User size={14} className="text-gray-400" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-tight">Owner</p>
            </div>
            <p className="text-sm font-bold text-gray-900 truncate">{data.ownerName || "N/A"}</p>
          </div>

          {/* Expected Price */}
          <div className="group bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-200 transition-all hover:shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={14} className="text-gray-400" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-tight">Expected</p>
            </div>
            <p className="text-base font-bold text-gray-900">₹{data.expectedPrice?.toLocaleString() || "N/A"}</p>
          </div>

          {/* Floor Price */}
          <div className="group bg-red-50/50 p-4 rounded-xl border border-red-100 hover:border-red-200 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={14} className="text-red-400" />
              <p className="text-xs font-semibold text-red-500 uppercase tracking-tight">Min. Floor</p>
            </div>
            <p className="text-base font-bold text-red-700">₹{data.minimumPrice?.toLocaleString() || "N/A"}</p>
          </div>

          {/* Negotiable Status */}
          <div className="group bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Handshake size={14} className="text-emerald-500" />
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-tight">Negotiable</p>
            </div>
            <p className="text-base font-bold text-emerald-700">{data.negotiable ? "Yes" : "No"}</p>
          </div>

          {/* Contact */}
          <div className="group bg-blue-50/50 p-4 rounded-xl border border-blue-100 hover:border-blue-200 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Phone size={14} className="text-blue-500" />
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-tight">Contact</p>
            </div>
            <p className="text-sm font-bold text-gray-900">{data.ownerPhone || "N/A"}</p>
          </div>
        </div>

        {/* Admin Notes Section */}
        <div className="relative overflow-hidden bg-gray-50 rounded-xl border border-gray-200 p-5 group">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Quote size={40} className="text-gray-900" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-indigo-500" />
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Internal Observations</h3>
          </div>
          <div className="relative">
            <p className="text-gray-700 leading-relaxed font-medium text-sm">
              {data.adminNotes ? (
                <span className="italic">&ldquo;{data.adminNotes}&rdquo;</span>
              ) : (
                <span className="text-gray-400 italic font-normal">No internal notes have been recorded for this property yet.</span>
              )}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
