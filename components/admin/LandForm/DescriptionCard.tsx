"use client"

import { Textarea } from "../../ui/textarea"
import { FileText, ChevronUp, ChevronDown } from "lucide-react"
import CopyAiPromptButton from "../CopyAiPromptButton"
import { FullFormData } from "./LandFormRoot"

interface DescriptionCardProps {
  formData: {
    description: string;
  };
  handleChange: (field: keyof FullFormData, value: string) => void;
  sectionsExpanded: { desc: boolean };
  toggleSection: (section: "desc") => void;
  getLandDataForAiPrompt: () => Record<string, unknown>;
  showToast: (msg: string) => void;
}

export default function DescriptionCard({
  formData,
  handleChange,
  sectionsExpanded,
  toggleSection,
  getLandDataForAiPrompt,
  showToast,
}: DescriptionCardProps) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-200/60 p-6 md:p-8 shadow-sm hover:shadow-md/20 transition-all duration-300 space-y-6">
      {/* Header with Accordion Toggle for Mobile */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4 select-none"
      >
        <div className="flex items-center gap-3 cursor-pointer lg:cursor-default" onClick={() => toggleSection("desc")}>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200/50 shadow-sm shrink-0">
            <FileText size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">PUBLIC DESCRIPTION</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Visible to all prospective buyers</p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <CopyAiPromptButton
            getLandData={getLandDataForAiPrompt}
            onSuccess={showToast}
          />
          <button type="button" className="lg:hidden text-slate-400 hover:text-slate-600 transition" onClick={() => toggleSection("desc")}>
            {sectionsExpanded.desc ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      <div className={`space-y-4 ${sectionsExpanded.desc ? 'block' : 'hidden lg:block'}`}>
        <Textarea
          placeholder="Describe the property: soil type, road width, nearby landmarks, water/electricity access, and suitable purposes..."
          value={formData.description}
          maxLength={2000}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("description", e.target.value)}
          className="min-h-[140px] rounded-xl bg-slate-50/40 border border-slate-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all p-4 text-xs font-semibold leading-relaxed text-slate-800 placeholder:text-slate-400/60 placeholder:font-normal"
        />
        <div className="text-right text-[10px] text-slate-400 font-bold tracking-wider">
          {formData.description.length} / 2000 CHARACTERS
        </div>
      </div>
    </div>
  )
}
