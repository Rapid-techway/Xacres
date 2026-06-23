"use client"

import { ArrowLeft, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FooterActionsProps {
  isEdit: boolean;
  loading: boolean;
  onBack: () => void;
}

export default function FooterActions({ isEdit, loading, onBack }: FooterActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#e7e5e4] w-full">
      <button
        type="button"
        className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-stone-950 hover:bg-stone-50 bg-white border border-[#e7e5e4] hover:border-blue-650/40 rounded-full transition flex items-center justify-center gap-1.5 shadow-sm h-9 cursor-pointer"
        onClick={onBack}
      >
        <ArrowLeft size={13} />
        Back to Lands
      </button>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-[#292524] hover:bg-[#0c0a09] border border-[#292524] hover:border-blue-600/30 text-white font-semibold shadow-sm rounded-full px-6 py-2.5 h-9 text-xs uppercase tracking-widest gap-2 transition-all focus:ring-2 focus:ring-blue-500/10 shrink-0 select-none"
        >
          {loading ? "Processing..." : (isEdit ? "Save & Update Listing" : "Publish Listing")}
          {!loading && <Rocket size={13} strokeWidth={2.0} />}
        </Button>
      </div>
    </div>
  )
}
