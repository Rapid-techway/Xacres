"use client"

import { Label } from "@/components/ui/label"
import { MapPin, Map as MapIcon, ChevronUp, ChevronDown } from "lucide-react"
import DistrictDropdown from "../DistrictDropdown"
import { FullFormData } from "./LandFormRoot"

interface LocationCardProps {
  formData: {
    district: string;
    village: string;
  };
  handleChange: (field: keyof FullFormData, value: string | Record<string, unknown> | null) => void;
  sectionsExpanded: { location: boolean };
  toggleSection: (section: "location") => void;
  selectedTehsil: string;
  setSelectedTehsil: (val: string) => void;
  availableTehsils: string[];
  availableVillages: string[];
}

export default function LocationCard({
  formData,
  handleChange,
  sectionsExpanded,
  toggleSection,
  selectedTehsil,
  setSelectedTehsil,
  availableTehsils,
  availableVillages,
}: LocationCardProps) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-200/60 p-6 md:p-8 shadow-sm hover:shadow-md/20 transition-all duration-300 flex flex-col justify-between">
      <div className="flex-1">
        {/* Header with Accordion Toggle for Mobile */}
        <div
          className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 cursor-pointer lg:cursor-default select-none"
          onClick={() => toggleSection("location")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50/50 text-emerald-600 flex items-center justify-center border border-emerald-100/30 shadow-sm shrink-0">
              <MapPin size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">LOCATION DETAILS</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Location information visible publicly</p>
            </div>
          </div>
          <button type="button" className="lg:hidden text-slate-400 hover:text-slate-600 transition">
            {sectionsExpanded.location ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Collapsible Content */}
        <div className={`space-y-5 ${sectionsExpanded.location ? 'block' : 'hidden lg:block'}`}>
          {/* District */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Haryana District <span className="text-red-500 font-extrabold">*</span></Label>
            <DistrictDropdown
              value={formData.district}
              onChange={(val) => {
                handleChange("district", val)
                setSelectedTehsil("")
                handleChange("tehsil", "")
                handleChange("village", "")
                handleChange("polygon", null)
              }}
            />
          </div>

          {/* Tehsil Dropdown */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Tehsil <span className="text-red-500 font-extrabold">*</span></Label>
            <div className="relative">
              <select
                value={selectedTehsil}
                onChange={(e) => {
                  const val = e.target.value
                  setSelectedTehsil(val)
                  handleChange("tehsil", val)
                  handleChange("village", "")
                  handleChange("polygon", null)
                }}
                disabled={!formData.district}
                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/40 hover:border-slate-350 px-4 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-emerald-500/10 focus:outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {formData.district ? "Select Tehsil" : "Select District First"}
                </option>
                {availableTehsils.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={14} className="opacity-75" />
              </div>
            </div>
          </div>

          {/* Village Dropdown */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Village / Locality <span className="text-red-500 font-extrabold">*</span></Label>
            <div className="relative">
              <select
                value={formData.village}
                onChange={(e) => {
                  const val = e.target.value
                  handleChange("village", val)
                  handleChange("polygon", null)
                }}
                disabled={!selectedTehsil}
                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/40 hover:border-slate-350 px-4 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-emerald-500/10 focus:outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedTehsil ? "Select Village" : "Select Tehsil First"}
                </option>
                {availableVillages.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
                {formData.village && !availableVillages.includes(formData.village) && (
                  <option value={formData.village}>{formData.village}</option>
                )}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={14} className="opacity-75" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Landscape graphic callout box */}
      <div className={`mt-6 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/20 flex gap-4.5 relative overflow-hidden ${sectionsExpanded.location ? 'flex' : 'hidden lg:flex'} h-[88px] items-center`}>
        <div className="w-9 h-9 rounded-xl bg-white text-emerald-600 border border-emerald-100/60 shadow-sm flex items-center justify-center shrink-0 z-10">
          <MapIcon size={16} />
        </div>
        <div className="space-y-0.5 z-10">
          <p className="text-xs font-extrabold text-emerald-800 leading-tight">Accurate location details</p>
          <p className="text-[10px] text-emerald-600 font-semibold leading-relaxed max-w-[240px]">Help buyers discover your property easily and improve search relevance.</p>
        </div>
        {/* Premium Inline SVG Illustrating Grass, Hills, and a Small House */}
        <div className="absolute right-0 bottom-0 top-0 w-[140px] hidden sm:block pointer-events-none opacity-90 select-none">
          <svg viewBox="0 0 140 88" fill="none" className="w-full h-full object-cover">
            <path d="M-10 88 C 30 50, 60 70, 150 45 L 150 88 Z" fill="#ecfdf5" />
            <path d="M20 88 C 70 40, 95 62, 150 35 L 150 88 Z" fill="#d1fae5" />
            <path d="M60 88 C 90 30, 110 52, 150 25 L 150 88 Z" fill="#a7f3d0" />
            {/* tiny house */}
            <rect x="112" y="18" width="12" height="10" fill="#f4f4f5" rx="0.5" />
            <polygon points="109,18 127,18 118,10" fill="#f43f5e" />
            <rect x="116.5" y="22" width="3" height="6" fill="#71717a" />
            {/* tiny sun */}
            <circle cx="20" cy="20" r="6" fill="#fef08a" />
            <circle cx="20" cy="20" r="4.2" fill="#fde047" />
          </svg>
        </div>
      </div>
    </div>
  )
}
