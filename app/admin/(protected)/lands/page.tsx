"use client"

import Link from "next/link"
import Image from "next/image"
import { Plus, Edit2, MapPin, LayoutGrid, List, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { landService } from "@/services/land.service"
import { Land } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

export default function LandsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [lands, setLands] = useState<Land[]>([])
  const [loading, setLoading] = useState(true)
  const [totalLands, setTotalLands] = useState(0)

  useEffect(() => {
    fetchLands()
  }, [])

  const fetchLands = async () => {
    try {
      setLoading(true)
      const { documents, total } = await landService.getLands()
      setLands(documents as Land[])
      setTotalLands(total)
    } catch (error) {
      console.error("Error fetching lands:", error)
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="p-1 max-w-7xl mx-auto space-y-10">

      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mb-1">Haryana Inventory</p>
          <h1 className="text-4xl font-sans font-bold tracking-tight text-stone-900">All Lands</h1>
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-wider">
            <span>{totalLands} Listings</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#fafafa] p-1 rounded-full border border-[#e7e5e4]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-650' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-650' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <List size={15} />
            </button>
          </div>
          <Link href="/admin/lands/new">
            <Button className="bg-[#292524] hover:bg-[#0c0a09] text-white hover:border-blue-600/30 border border-[#292524] focus:ring-2 focus:ring-blue-500/10 font-semibold text-xs uppercase tracking-widest rounded-full px-5 h-9 gap-2 transition-all shadow-sm">
              <Plus size={14} strokeWidth={2.5} />
              Add Land
            </Button>
          </Link>
        </div>
      </div>

      {/* Property Grid or List View (unified design for now) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-32 space-y-4">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Loading amazing properties...</p>
        </div>
      ) : lands.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-40 bg-white rounded-2xl border border-dashed border-[#e7e5e4]">
          <div className="w-12 h-12 bg-stone-50 rounded-full border border-[#e7e5e4] flex items-center justify-center text-stone-400 mb-6">
            <LayoutGrid size={20} />
          </div>
          <h2 className="text-xl font-sans font-bold text-stone-900 mb-2">No lands found</h2>
          <p className="text-stone-500 text-xs mb-6 max-w-xs text-center font-medium leading-relaxed">Get started by adding your first premium land parcel to the inventory.</p>
          <Link href="/admin/lands/new">
            <Button className="bg-[#292524] hover:bg-[#0c0a09] font-semibold text-xs uppercase tracking-widest text-white px-6 h-10 rounded-full shadow-sm">
              Add New Land
            </Button>
          </Link>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
          : "grid grid-cols-1 gap-6"
        }>
          {lands.map((land) => {
            const primaryImage = land.images.find(img => img.isPrimary)?.url || land.images[0]?.url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800";
            const displayPrice = land.price || 0;
            const status = land.isPublic ? "public" : "private";

            return (
              <div
                key={land.$id}
                className={`
                  group bg-white border border-[#e7e5e4] shadow-sm hover:shadow-md transition-all duration-200 relative
                  ${viewMode === 'grid'
                    ? 'flex flex-col rounded-xl overflow-hidden'
                    : 'flex flex-col md:flex-row overflow-hidden rounded-xl'
                  }
                `}
              >
                {/* Full Card Link overlay */}
                <Link href={`/admin/lands/${land.$id}`} className="absolute inset-0 z-10" />

                {/* Image */}
                <div className={`relative bg-stone-50 shrink-0 overflow-hidden
                  ${viewMode === 'grid'
                    ? 'aspect-[4/3] w-full'
                    : 'w-full md:w-72 h-52 md:h-auto border-r border-[#e7e5e4]'
                  }
                `}>
                  <Image
                    src={primaryImage}
                    alt={land.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-102"
                  />

                  {/* Status */}
                  <div className="absolute top-3 right-3 pointer-events-none">
                    <span className={`
                      px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider bg-white/95 backdrop-blur-md shadow-sm border
                      ${status === "public"
                        ? "text-emerald-700 border-emerald-100"
                        : "text-stone-700 border-stone-200"
                      }
                    `}>
                      {status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className={`flex flex-col flex-1 p-5 ${viewMode === 'list' ? 'md:p-6' : 'pt-4'}`}>

                  {/* Meta */}
                  <div className="flex items-center text-stone-500 mb-2 pointer-events-none">
                    <MapPin size={11} className="text-stone-400 mr-1" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      {land.district}
                    </span>
                    <span className="mx-2 text-stone-300">•</span>
                    <span className="text-[10px] font-bold text-stone-600 bg-stone-50 border border-stone-200/50 px-2 py-0.5 rounded">
                      {land.area} Acres
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg leading-snug font-sans font-semibold text-stone-900 mb-3 line-clamp-2 transition-colors pointer-events-none">
                    {land.title}
                  </h3>

                  {/* Divider */}
                  <div className="h-px bg-stone-100 w-12 mb-4 pointer-events-none"></div>

                  {/* Footer */}
                  <div className="mt-auto flex items-end justify-between pt-1">

                    {/* Price */}
                    <div className="pointer-events-none">
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">
                        Valuation
                      </p>
                      <p className="text-2xl font-sans font-bold text-stone-950 flex items-center gap-0.5">
                        <IndianRupee size={15} strokeWidth={2.0} className="text-stone-700 -mt-0.5" />
                        {formatPrice(displayPrice)}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="flex relative z-20">
                      <Link href={`/admin/lands/${land.$id}/edit`}>
                        <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-50 bg-white rounded-full border border-[#e7e5e4] hover:border-blue-650/40 transition-all h-8 uppercase tracking-wider">
                          <Edit2 size={11} />
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination & Footer summary */}
      {/* <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Showing {lands.length} of {totalLands} lands</p>
        <div className="flex items-center gap-1.5 p-1 bg-gray-50/80 rounded-2xl border border-gray-100">
          <button className="h-9 px-4 rounded-xl text-xs font-bold text-gray-400 hover:text-gray-900 hover:bg-white transition-all">Previous</button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20">1</button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold text-gray-500 hover:bg-white hover:text-gray-900 transition-all">2</button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold text-gray-500 hover:bg-white hover:text-gray-900 transition-all">3</button>
          <span className="px-2 text-gray-300">...</span>
          <button className="h-9 px-4 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-white transition-all flex items-center gap-1">
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div> */}
    </div>
  )
}
