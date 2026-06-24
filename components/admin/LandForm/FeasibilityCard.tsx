"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Rocket, ChevronUp, ChevronDown } from "lucide-react"
import SearchableSelect from "../SearchableSelect"
import { FullFormData } from "./LandFormRoot"

interface FeasibilityCardProps {
  formData: {
    roadAccess: boolean;
    roadWidthM: number | null;
    approvalType: string;
    cluCategory: string;
    municipalLimitType: string;
    accessType: string;
    greenBelt: boolean;
    greenBeltWidthM: number | null;
  };
  handleChange: (field: keyof FullFormData, value: string | number | boolean | null) => void;
  sectionsExpanded: { feasibility: boolean };
  toggleSection: (section: "feasibility") => void;
}

export default function FeasibilityCard({
  formData,
  handleChange,
  sectionsExpanded,
  toggleSection,
}: FeasibilityCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e7e5e4] p-6 md:p-8 shadow-sm space-y-6 w-full">
      {/* Header with Accordion Toggle for Mobile */}
      <div
        className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 cursor-pointer lg:cursor-default select-none"
        onClick={() => toggleSection("feasibility")}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100/50 shrink-0">
            <Rocket size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">LAND FEASIBILITY & PLANNING DETAILS</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Feasibility and development planning data</p>
          </div>
        </div>
        <button type="button" className="lg:hidden text-slate-400 hover:text-slate-600 transition">
          {sectionsExpanded.feasibility ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Collapsible Content */}
      <div className={`${sectionsExpanded.feasibility ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: Access & Environmental */}
          <div className="space-y-6">
            {/* Road Access Toggle */}
            <div className="space-y-4 bg-slate-50/30 p-5 rounded-2xl border border-slate-150/40">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-slate-800">Road Access</Label>
                  <p className="text-[10px] text-slate-400 font-medium">Does the land have direct road access?</p>
                </div>
                <div
                  className="flex items-center justify-between w-24 h-9 px-3 bg-white border border-slate-200 hover:border-slate-350 hover:bg-white rounded-xl transition-all cursor-pointer select-none shadow-sm"
                  onClick={() => handleChange("roadAccess", !formData.roadAccess)}
                >
                  <span className="text-xs font-bold text-slate-700">{formData.roadAccess ? 'Yes' : 'No'}</span>
                  <div className={`w-8 h-4 rounded-full relative p-0.5 transition-colors duration-200 shrink-0 ${formData.roadAccess ? 'bg-emerald-600' : 'bg-slate-200'}`}>
                    <div className={`w-3.5 h-3 bg-white rounded-full shadow-sm transition-transform duration-200 ${formData.roadAccess ? 'translate-x-3.5' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>

              {formData.roadAccess && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Road Width (Meters)</Label>
                  <div className="relative group">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Enter road width in meters"
                      value={formData.roadWidthM || ""}
                      onChange={(e) => handleChange("roadWidthM", parseFloat(e.target.value) || null)}
                      className="h-11 px-4 bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all font-semibold text-slate-900 text-xs rounded-xl"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200 select-none">Meters</span>
                  </div>
                </div>
              )}
            </div>

            {/* Green Belt Toggle */}
            <div className="space-y-4 bg-slate-50/30 p-5 rounded-2xl border border-slate-150/40">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold text-slate-800">Green Belt</Label>
                  <p className="text-[10px] text-slate-400 font-medium">Is the land affected by a green belt zone?</p>
                </div>
                <div
                  className="flex items-center justify-between w-24 h-9 px-3 bg-white border border-slate-200 hover:border-slate-350 hover:bg-white rounded-xl transition-all cursor-pointer select-none shadow-sm"
                  onClick={() => handleChange("greenBelt", !formData.greenBelt)}
                >
                  <span className="text-xs font-bold text-slate-700">{formData.greenBelt ? 'Yes' : 'No'}</span>
                  <div className={`w-8 h-4 rounded-full relative p-0.5 transition-colors duration-200 shrink-0 ${formData.greenBelt ? 'bg-emerald-600' : 'bg-slate-200'}`}>
                    <div className={`w-3.5 h-3 bg-white rounded-full shadow-sm transition-transform duration-200 ${formData.greenBelt ? 'translate-x-3.5' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>

              {formData.greenBelt && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Green Belt Width (Meters)</Label>
                  <div className="relative group">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Enter green belt width in meters"
                      value={formData.greenBeltWidthM || ""}
                      onChange={(e) => handleChange("greenBeltWidthM", parseFloat(e.target.value) || null)}
                      className="h-11 px-4 bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all font-semibold text-slate-900 text-xs rounded-xl"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200 select-none">Meters</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Planning & Zoning */}
          <div className="space-y-5">
            {/* Approval Type */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Approval Type <span className="text-red-500 font-extrabold">*</span></Label>
              <SearchableSelect
                value={formData.approvalType || ""}
                onChange={(val) => {
                  handleChange("approvalType", val);
                  if (val !== "CLU") {
                    handleChange("cluCategory", "");
                  }
                }}
                options={["CLU", "Urban Area", "Rural Area"]}
                placeholder="Select Approval Type"
              />
            </div>

            {/* CLU Category (conditional) */}
            {formData.approvalType === "CLU" && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">CLU Category <span className="text-red-500 font-extrabold">*</span></Label>
                <SearchableSelect
                  value={formData.cluCategory || ""}
                  onChange={(val) => handleChange("cluCategory", val)}
                  options={[
                    "Residential",
                    "Commercial",
                    "Industrial",
                    "Transport & Communication",
                    "Public Utilities",
                    "Public & Semi Public Utilities",
                    "Open Spaces",
                    "Agriculture Zone",
                    "Special Zone",
                    "Natural Conservation Zone",
                    "Mixed Land Use",
                    "Agriculture Deemed Zone"
                  ]}
                  placeholder="Select CLU Category"
                  searchPlaceholder="Search category..."
                />
              </div>
            )}

            {/* Municipal Limit Type */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Municipal Limit Type <span className="text-red-500 font-extrabold">*</span></Label>
              <SearchableSelect
                value={formData.municipalLimitType || ""}
                onChange={(val) => handleChange("municipalLimitType", val)}
                options={["Within Municipal Limits", "Outside Municipal Limits"]}
                placeholder="Select Municipal Limit Type"
              />
            </div>

            {/* Access Type */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Access Type <span className="text-red-500 font-extrabold">*</span></Label>
              <SearchableSelect
                value={formData.accessType || ""}
                onChange={(val) => handleChange("accessType", val)}
                options={["National Highway (NH)", "State Highway (SH)", "PWD Road", "Market Committee Road"]}
                placeholder="Select Access Type"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
