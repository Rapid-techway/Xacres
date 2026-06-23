"use client"

import dynamic from "next/dynamic"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Map as MapIcon, ChevronUp, ChevronDown, Info } from "lucide-react"
import { KMLUpload } from "../kml/KMLUpload"
import { GeoJsonFeatureCollection, Centroid } from "@/lib/types"
import { FullFormData } from "./LandFormRoot"

// Dynamically import PolygonMap to avoid SSR issues with Leaflet
const PolygonMap = dynamic(() => import("@/components/map/PolygonMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-50 animate-pulse rounded-[24px] flex items-center justify-center text-slate-400 font-semibold text-sm">Loading Interactive Map...</div>
})

interface MapCardProps {
  formData: {
    latitude: number;
    longitude: number;
    polygon: Record<string, unknown> | null;
  };
  handleChange: (field: keyof FullFormData, value: number) => void;
  sectionsExpanded: { map: boolean };
  toggleSection: (section: "map") => void;
  mapVersion: number;
  setMapVersion: React.Dispatch<React.SetStateAction<number>>;
  setFormData: React.Dispatch<React.SetStateAction<FullFormData>>;
}

export default function MapCard({
  formData,
  handleChange,
  sectionsExpanded,
  toggleSection,
  mapVersion,
  setMapVersion,
  setFormData,
}: MapCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e7e5e4] p-6 md:p-8 shadow-sm space-y-6 w-full">
      {/* Header with Accordion Toggle for Mobile */}
      <div
        className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 cursor-pointer lg:cursor-default select-none"
        onClick={() => toggleSection("map")}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100/50 shrink-0">
            <MapIcon size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">MAP BOUNDARIES & CENTROID</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Draw the property boundary on the map</p>
          </div>
        </div>
        <button type="button" className="lg:hidden text-slate-400 hover:text-slate-600 transition">
          {sectionsExpanded.map ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Collapsible Content */}
      <div className={`grid grid-cols-1 lg:grid-cols-10 gap-6 ${sectionsExpanded.map ? 'grid' : 'hidden lg:grid'}`}>

        {/* Map Canvas */}
        <div className="lg:col-span-7 h-[360px] md:h-[400px] w-full overflow-hidden rounded-xl border border-[#e7e5e4] shadow-inner relative">
          <PolygonMap
            key={`map-${mapVersion}`}
            initialPolygon={formData.polygon as GeoJsonFeatureCollection | null}
            initialCenter={{ lat: formData.latitude, lng: formData.longitude }}
            onPolygonComplete={(poly: GeoJsonFeatureCollection | null, centroid: Centroid) => {
              setFormData((prev: FullFormData) => ({
                ...prev,
                polygon: poly as Record<string, unknown> | null,
                latitude: centroid.lat,
                longitude: centroid.lng
              }))
            }}
          />
        </div>

        {/* Map inputs / Centroid details on the right */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Latitude (Centroid) <span className="text-red-500 font-extrabold">*</span></Label>
              <Input
                type="number"
                step="any"
                placeholder="28.70515975"
                value={formData.latitude || ""}
                onChange={(e) => handleChange("latitude", parseFloat(e.target.value) || 0)}
                className="h-11 px-4 bg-slate-50/40 border border-slate-200 hover:border-slate-350 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all font-mono text-xs text-slate-700 font-semibold placeholder:text-slate-400/60 placeholder:font-normal"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Longitude (Centroid) <span className="text-red-500 font-extrabold">*</span></Label>
              <Input
                type="number"
                step="any"
                placeholder="76.08435125"
                value={formData.longitude || ""}
                onChange={(e) => handleChange("longitude", parseFloat(e.target.value) || 0)}
                className="h-11 px-4 bg-slate-50/40 border border-slate-200 hover:border-slate-350 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all font-mono text-xs text-slate-700 font-semibold placeholder:text-slate-400/60 placeholder:font-normal"
              />
            </div>

            {/* KML Boundary Import Section */}
            <div className="pt-2 border-t border-slate-100 mt-2">
              <KMLUpload
                onImportSuccess={(result) => {
                  setFormData((prev: FullFormData) => ({
                    ...prev,
                    polygon: result.polygon as unknown as Record<string, unknown> | null,
                    latitude: result.centroid.lat,
                    longitude: result.centroid.lng,
                    area: result.acreage
                  }));
                  // Force map remount to draw new coordinates
                  setMapVersion(v => v + 1);
                }}
              />
            </div>
          </div>

          {/* Tip box */}
          <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100/20 flex gap-3.5">
            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider block">Centroid Placement</span>
              <p className="text-[10px] text-blue-600 font-semibold leading-relaxed">
                Use centroid coordinates for precise search query matches and map camera positioning.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
