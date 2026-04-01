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
    <div className="p-1 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">All Lands</h1>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <span>{totalLands} Lands</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={18} />
            </button>
          </div>
          <Link href="/admin/lands/new">
            <Button className="bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg shadow-blue-500/20 rounded-xl px-6 h-11 gap-2 active:scale-95 transition-all">
              <Plus size={18} strokeWidth={2.5} />
              Add Land
            </Button>
          </Link>
        </div>
      </div>

      {/* Property Grid or List View (unified design for now) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-32 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent shadow-md"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Loading amazing properties...</p>
        </div>
      ) : lands.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-40 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-6">
            <LayoutGrid size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No lands found</h2>
          <p className="text-slate-500 mb-8 max-w-xs text-center font-medium">Get started by adding your first premium land parcel to the inventory.</p>
          <Link href="/admin/lands/new">
            <Button className="bg-blue-600 hover:bg-blue-700 font-extrabold text-white px-8 h-12 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
              Add New Land
            </Button>
          </Link>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10"
          : "grid grid-cols-1 gap-8"
        }>
          {lands.map((land) => {
            const primaryImage = land.images.find(img => img.isPrimary)?.url || land.images[0]?.url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800";
            const displayPrice = land.price || 0;
            const status = land.isPublic ? "public" : "private";

            return (
              <div
                key={land.$id}
                className={`
      group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative
      ${viewMode === 'grid'
                    ? 'flex flex-col rounded-2xl overflow-hidden'
                    : 'flex flex-col md:flex-row overflow-hidden rounded-2xl'
                  }
    `}
              >
                {/* Full Card Link overlay */}
                <Link href={`/admin/lands/${land.$id}`} className="absolute inset-0 z-10" />

                {/* Image */}
                <div className={`relative bg-gray-100 shrink-0 overflow-hidden
      ${viewMode === 'grid'
                    ? 'aspect-[4/3] w-full'
                    : 'w-full md:w-72 h-56 md:h-auto border-r border-gray-100'
                  }
    `}>
                  <Image
                    src={primaryImage}
                    alt={land.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Status */}
                  <div className="absolute top-3 right-3 pointer-events-none">
                    <span className={`
          px-3 py-1 rounded-md text-[11px] uppercase font-semibold tracking-wide
          ${status === "public"
                        ? "bg-green-600/90 text-white"
                        : "bg-gray-800/90 text-white"
                      }
        `}>
                      {status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className={`flex flex-col flex-1 p-5 ${viewMode === 'list' ? 'md:p-6' : 'pt-4'}`}>

                  {/* Meta */}
                  <div className="flex items-center text-gray-500 mb-2 pointer-events-none">
                    <MapPin size={14} className="text-gray-400 mr-1.5" />
                    <span className="text-sm font-medium uppercase tracking-wide">
                      {land.district}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm font-semibold text-gray-700">
                      {land.area} Acres
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg leading-snug font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors pointer-events-none">
                    {land.title}
                  </h3>

                  {/* Divider */}
                  <div className="h-px bg-gray-100 w-16 mb-4 pointer-events-none"></div>

                  {/* Footer */}
                  <div className="mt-auto flex items-end justify-between pt-1">

                    {/* Price */}
                    <div className="pointer-events-none">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Valuation
                      </p>
                      <p className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                        <IndianRupee size={18} strokeWidth={2.5} />
                        {formatPrice(displayPrice)}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="flex relative z-20">
                      <Link href={`/admin/lands/${land.$id}/edit`}>
                        <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 bg-gray-50 rounded-lg transition-all border border-gray-200">
                          <Edit2 size={15} />
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
