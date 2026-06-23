"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Globe, ChevronUp, ChevronDown, Info, Unlock, Lock } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FullFormData } from "./LandFormRoot"

interface PublicInfoCardProps {
  formData: {
    title: string;
    slug: string;
    listedPrice: number;
    area: number;
    landType: string;
  };
  handleChange: (field: keyof FullFormData, value: string | number | boolean) => void;
  sectionsExpanded: { publicInfo: boolean };
  toggleSection: (section: "publicInfo") => void;
  areaUnit: "acre" | "sqyard";
  setAreaUnit: (unit: "acre" | "sqyard") => void;
  areaInputVal: string;
  setAreaInputVal: (val: string) => void;
  customizeTitle: boolean;
  setCustomizeTitle: (val: boolean) => void;
}

export default function PublicInfoCard({
  formData,
  handleChange,
  sectionsExpanded,
  toggleSection,
  areaUnit,
  setAreaUnit,
  areaInputVal,
  setAreaInputVal,
  customizeTitle,
  setCustomizeTitle,
}: PublicInfoCardProps) {

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/60 p-6 md:p-8 shadow-sm hover:shadow-md/20 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Header with Accordion Toggle for Mobile */}
        <div
          className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 cursor-pointer lg:cursor-default select-none"
          onClick={() => toggleSection("publicInfo")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50/50 text-emerald-600 flex items-center justify-center border border-emerald-100/30 shadow-sm shrink-0">
              <Globe size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">PUBLIC LISTING INFORMATION</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Visible to all prospective buyers</p>
            </div>
          </div>
          <button type="button" className="lg:hidden text-slate-400 hover:text-slate-600 transition">
            {sectionsExpanded.publicInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Collapsible Content */}
        <div className={`space-y-6 ${sectionsExpanded.publicInfo ? 'block' : 'hidden lg:block'}`}>

          {/* Land Title and Slug Container */}
          <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-150/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Land Title <span className="text-red-500 font-extrabold">*</span></Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-slate-450 hover:text-slate-650 flex items-center p-0.5 rounded transition-colors hover:bg-slate-100/50 cursor-pointer">
                      <Info size={13} className="shrink-0" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-slate-950 text-slate-100 border border-slate-800 text-xs px-3 py-2 rounded-xl max-w-md break-all font-mono shadow-xl"
                  >
                    <span className="font-sans font-extrabold block mb-1 text-[9px] text-slate-400 uppercase tracking-widest">SEO Slug Preview</span>
                    {formData.slug || "Will be auto-generated..."}
                  </TooltipContent>
                </Tooltip>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCustomizeTitle(!customizeTitle);
                  if (customizeTitle) {
                    // Let the parent effect handle or prompt title generation
                    handleChange("title", "");
                  }
                }}
                className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-all select-none cursor-pointer"
              >
                {customizeTitle ? (
                  <>
                    <Unlock size={11} />
                    <span>Lock (Auto)</span>
                  </>
                ) : (
                  <>
                    <Lock size={11} />
                    <span>Unlock (Edit)</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <Input
                placeholder="Title will be auto-generated..."
                value={formData.title}
                readOnly={!customizeTitle}
                onChange={(e) => handleChange("title", e.target.value)}
                className={`h-11 px-4 border rounded-xl transition-all font-semibold text-slate-900 text-sm placeholder:text-slate-400/60 w-full ${!customizeTitle
                  ? "bg-slate-100/70 border-slate-200 cursor-not-allowed select-text text-slate-600 font-semibold"
                  : "bg-white border-emerald-500/30 hover:border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
                  }`}
              />
            </div>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider ml-0.5 mt-1 flex items-center gap-1">
              <span>Generated automatically from location. Hover the info icon to preview the URL slug.</span>
            </p>
          </div>

          {/* Grid: Price and Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Listing Price (INR) <span className="text-red-500 font-extrabold">*</span></Label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
                <Input
                  type="number"
                  step="any"
                  placeholder="e.g. 2.5"
                  value={formData.listedPrice ? formData.listedPrice / 10000000 : ""}
                  onChange={(e) => handleChange("listedPrice", (parseFloat(e.target.value) || 0) * 10000000)}
                  className="h-11 pl-7 pr-14 bg-slate-50/40 border border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all font-extrabold text-sm text-slate-950 placeholder:text-slate-400/60 placeholder:font-normal"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Crore</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">
                  Area (Acres) <span className="text-red-500 font-extrabold">*</span>
                </Label>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[9px] font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => {
                      setAreaUnit('acre');
                      const val = formData.area ? String(formData.area) : "";
                      setAreaInputVal(val);
                    }}
                    className={`px-2 py-0.5 rounded-md transition-all select-none cursor-pointer ${areaUnit === 'acre'
                      ? 'bg-white shadow-xs text-slate-800'
                      : 'text-slate-400 hover:text-slate-600'
                      }`}
                  >
                    Acre
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAreaUnit('sqyard');
                      const sqYards = formData.area ? parseFloat((formData.area * 4840).toFixed(2)) : 0;
                      setAreaInputVal(sqYards ? String(sqYards) : "");
                    }}
                    className={`px-2 py-0.5 rounded-md transition-all select-none cursor-pointer ${areaUnit === 'sqyard'
                      ? 'bg-white shadow-xs text-slate-800'
                      : 'text-slate-400 hover:text-slate-600'
                      }`}
                  >
                    Sq Yards
                  </button>
                </div>
              </div>

              <div className="relative group">
                <Input
                  type="number"
                  step="any"
                  placeholder={areaUnit === 'acre' ? "Enter land area in acres" : "e.g. 26620"}
                  value={areaInputVal}
                  onChange={(e) => {
                    const valStr = e.target.value;
                    setAreaInputVal(valStr);
                    const parsed = parseFloat(valStr) || 0;
                    if (areaUnit === 'acre') {
                      handleChange("area", parsed);
                    } else {
                      handleChange("area", parseFloat((parsed / 4840).toFixed(6)));
                    }
                  }}
                  className="h-11 pl-4 pr-16 bg-slate-50/40 border border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all font-bold text-slate-950 text-sm placeholder:text-slate-400/60 placeholder:font-normal"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200 select-none">
                  {areaUnit === 'acre' ? 'Acres' : 'Sq Yds'}
                </span>
              </div>

              {/* Live conversion helper badge */}
              {areaUnit === 'sqyard' && formData.area > 0 && (
                <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider ml-0.5 flex items-center gap-1.5 animate-in fade-in duration-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Saves as ≈ {formData.area} Acres</span>
                </p>
              )}
            </div>
          </div>

          {/* Property Category (Full Row now) */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Property Category</Label>
            <div className="relative">
              <select
                value={formData.landType}
                onChange={(e) => handleChange("landType", e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/40 hover:border-slate-300 px-4 text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option>Agricultural</option>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Farming</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={14} className="opacity-70" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
