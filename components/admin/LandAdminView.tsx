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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 py-1 space-y-8">
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
          price={data.listedPrice}
          area={data.area}
          type={data.landType} 
          title={data.title} 
          slug={data.slug}
          landId={data.id || data.$id || ""}
        />
      </div>

      {/* Admin Only Section (Bottom) */}
      <div className="pt-10 mt-10 border-t border-[#e7e5e4] space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
              <ShieldCheck size={18} />
            </div>

            <div>
              <h2 className="text-lg font-sans font-semibold text-stone-900 leading-tight">
                Internal Admin Details
              </h2>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">
                Confidential property assessment and pricing
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Badge */}
            <span className="px-2.5 py-0.5 bg-stone-100 text-stone-700 border border-stone-200 text-[10px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap">
              Admin Only
            </span>

            {/* Button */}
            <Link
              href={`/admin/lands/${data.$id}/edit`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-50 bg-white rounded-full border border-[#e7e5e4] hover:border-blue-650/40 transition-all shadow-sm"
            >
              <Edit3 size={12} />
              Edit Property
            </Link>

          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">

          {/* Owner Name */}
          <div className="bg-white p-4 rounded-xl border border-[#e7e5e4] shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <User size={13} className="text-stone-400" />
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Owner</p>
            </div>
            <p className="text-sm font-semibold text-stone-900 truncate">
              {data.contactType === 'BROKER' ? 'Broker Managed' : (data.ownerName || "N/A")}
            </p>
          </div>

          {/* Expected Price */}
          <div className="bg-white p-4 rounded-xl border border-[#e7e5e4] shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <Tag size={13} className="text-stone-400" />
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Expected</p>
            </div>
            <p className="text-base font-sans font-semibold text-stone-900">₹{data.expectedPrice?.toLocaleString() || "N/A"}</p>
          </div>

          {/* Floor Price */}
          <div className="bg-white p-4 rounded-xl border border-[#e7e5e4] shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingDown size={13} className="text-red-400" />
              <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Min. Floor</p>
            </div>
            <p className="text-base font-sans font-semibold text-red-700">₹{data.minimumPrice?.toLocaleString() || "N/A"}</p>
          </div>

          {/* Negotiable Status */}
          <div className="bg-white p-4 rounded-xl border border-[#e7e5e4] shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <Handshake size={13} className="text-emerald-500" />
              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Negotiable</p>
            </div>
            <p className="text-base font-sans font-semibold text-emerald-700">{data.negotiable ? "Yes" : "No"}</p>
          </div>

          {/* Contact */}
          <div className="bg-white p-4 rounded-xl border border-[#e7e5e4] shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-1.5">
              <Phone size={13} className="text-blue-500" />
              <p className="text-[9px] font-bold text-blue-650 uppercase tracking-widest">Contact</p>
            </div>
            <p className="text-sm font-semibold text-stone-900 truncate">
              {data.contactType === 'BROKER' ? (data.broker?.phoneNumber || "N/A") : (data.ownerPhoneNumber || "N/A")}
            </p>
          </div>
        </div>

        {/* Linked Broker Profile */}
        {data.broker && (
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-750 font-black text-sm shrink-0">
                {data.broker.name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-[9px] font-bold text-blue-650 uppercase tracking-widest mb-0.5">Assigned Partner Broker</p>
                <h4 className="text-sm font-semibold text-stone-900 leading-tight hover:text-blue-650 transition-colors">
                  <Link href={`/admin/brokers/${data.broker.id}`}>
                    {data.broker.name}
                  </Link>
                </h4>
                <p className="text-[10px] text-stone-500 mt-1 font-mono">
                  Code: {data.broker.brokerCode} &bull; {data.broker.district}, {data.broker.tehsil}
                </p>
              </div>
            </div>

            <div className="sm:text-right text-xs">
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Contact Number</p>
              <p className="font-semibold text-stone-850 flex items-center sm:justify-end gap-1.5">
                <Phone size={12} className="text-stone-450" />
                {data.broker.phoneNumber}
              </p>
            </div>
          </div>
        )}

        {/* Admin Notes Section */}
        <div className="relative overflow-hidden bg-white rounded-xl border border-[#e7e5e4] p-5 shadow-sm">
          <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
            <Quote size={40} className="text-stone-900" />
          </div>
          <div className="flex items-center gap-2 mb-2.5">
            <FileText size={14} className="text-stone-400" />
            <h3 className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Internal Observations</h3>
          </div>
          <div className="relative">
            <p className="text-stone-700 leading-relaxed font-sans italic text-sm">
              {data.adminNotes ? (
                <span>&ldquo;{data.adminNotes}&rdquo;</span>
              ) : (
                <span className="text-stone-400 font-sans font-normal not-italic text-sm">No internal notes have been recorded for this property yet.</span>
              )}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
