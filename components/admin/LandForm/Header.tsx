"use client"

import Link from "next/link"
import { ChevronRight, Eye, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  isEdit: boolean;
  loading: boolean;
  slug: string;
}

export default function Header({ isEdit, loading, slug }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <nav className="flex items-center text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
          <Link href="/admin/lands" className="hover:text-blue-650 transition-colors">Lands</Link>
          <ChevronRight size={12} className="mx-1 opacity-55 text-stone-450" />
          <span className="text-stone-800 font-semibold">{isEdit ? "Edit Land Listing" : "Add New Listing"}</span>
        </nav>
        <h1 className="text-4xl font-sans font-bold tracking-tight text-stone-900 leading-none">
          {isEdit ? "Edit Land" : "Create Land Listing"}
        </h1>
        <p className="text-xs text-stone-500 mt-1 font-medium tracking-[0.15px]">
          Manage property details, location, pricing and admin information.
        </p>
      </div>

      {/* Header Action Buttons (hidden on mobile, matches top right header buttons in mockup) */}
      <div className="hidden md:flex items-center gap-3">
        {isEdit && (
          <Link
            href={`/lands/${slug}`}
            target="_blank"
            className="bg-white hover:bg-stone-50 text-stone-700 font-semibold border border-[#e7e5e4] px-4 py-2 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm h-9 hover:border-blue-650/40 select-none"
          >
            <Eye size={13} />
            Preview
          </Link>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#292524] hover:bg-[#0c0a09] border border-[#292524] hover:border-blue-600/30 text-white font-semibold shadow-sm rounded-full px-5 py-2 h-9 text-xs uppercase tracking-widest gap-1.5 transition-all focus:ring-2 focus:ring-blue-500/10 shrink-0 select-none"
        >
          {loading ? "Saving..." : "Save & Update"}
          {!loading && <Check size={13} strokeWidth={2.5} />}
        </Button>
      </div>
    </div>
  )
}
