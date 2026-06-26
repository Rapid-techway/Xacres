"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Users, 
  Phone, 
  Calendar, 
  Eye, 
  Trash2, 
  Loader2, 
  RefreshCw, 
  Edit3, 
  MapPin, 
  FileText, 
  Image as ImageIcon, 
  X,
  Save
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DistrictDropdown from "@/components/admin/DistrictDropdown"
import { sellerService } from "@/services/seller-lead.service"
import { SellerLead } from "@/lib/types"
import { checkAuth } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetPortal,
} from "@/components/ui/sheet"

export default function AdminSellerLeadsPage() {
  const [leads, setLeads] = useState<SellerLead[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  // Filters State
  const [search, setSearch] = useState("")
  const [district, setDistrict] = useState("")
  const [page, setPage] = useState(1)
  const limit = 10
  const router = useRouter()

  // Sheet State
  const [selectedLead, setSelectedLead] = useState<SellerLead | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [fetchingDetails, setFetchingDetails] = useState(false)
  const [crmNotes, setCrmNotes] = useState("")
  const [savingNotes, setSavingNotes] = useState(false)

  // Lightbox State
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true)
      const res = await sellerService.getSellerLeads({
        search,
        district,
        page,
        limit
      })
      setLeads(res.documents)
      setTotal(res.total)
    } catch (error) {
      console.error("Error fetching seller leads:", error)
    } finally {
      setLoading(false)
    }
  }, [search, district, page])

  useEffect(() => {
    const initPage = async () => {
      try {
        const currentUser = await checkAuth()
        if (currentUser) {
          await fetchLeads()
        } else {
          router.replace("/admin/login")
        }
      } catch (err) {
        console.error("Auth check failed:", err)
        router.replace("/admin/login")
      }
    }
    initPage()
  }, [router, fetchLeads])

  const handleResetFilters = () => {
    setSearch("")
    setDistrict("")
    setPage(1)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this seller lead?")) return
    try {
      await sellerService.deleteSellerLead(id)
      setLeads(prev => prev.filter(l => l.id !== id))
      setTotal(t => t - 1)
      if (selectedLead?.id === id) {
        setIsSheetOpen(false)
      }
    } catch (err) {
      console.error("Failed to delete seller lead:", err)
      alert("Failed to delete lead. Please try again.")
    }
  }

  // Open Details in Side Sheet
  const handleOpenDetails = async (id: string) => {
    try {
      setFetchingDetails(true)
      const fullLead = await sellerService.getSellerLeadById(id)
      setSelectedLead(fullLead)
      setCrmNotes(fullLead.adminNotes || "")
      setIsSheetOpen(true)
    } catch (err) {
      console.error("Failed to load seller lead details:", err)
      alert("Failed to load details. Please try again.")
    } finally {
      setFetchingDetails(false)
    }
  }

  // Save CRM Internal Notes
  const handleSaveNotes = async () => {
    if (!selectedLead?.id) return
    try {
      setSavingNotes(true)
      await sellerService.updateSellerLeadAdminNotes(selectedLead.id, crmNotes)
      
      // Update local state list
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, adminNotes: crmNotes } : l))
      
      // Update selected lead state
      setSelectedLead(prev => prev ? { ...prev, adminNotes: crmNotes } : null)
      
      alert("CRM notes updated successfully.")
    } catch (err) {
      console.error("Failed to save CRM notes:", err)
      alert("Failed to save notes. Please try again.")
    } finally {
      setSavingNotes(false)
    }
  }

  // Page Calculations
  const totalPages = Math.ceil(total / limit)
  const startIdx = (page - 1) * limit + 1
  const endIdx = Math.min(page * limit, total)

  // Get Initials for Avatar
  const getInitials = (name: string) => {
    if (!name) return "S"
    return name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase()
  }

  return (
    <div className="p-1 max-w-7xl mx-auto space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-blue-655 tracking-widest uppercase mb-1">
            Seller Pipeline
          </p>
          <h1 className="text-4xl font-sans font-bold tracking-tight text-stone-900">
            Seller Leads
          </h1>
          <p className="text-xs text-stone-505 font-medium tracking-[0.15px]">
            Review, evaluate, and manage offline and online property submission leads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {fetchingDetails && (
            <div className="flex items-center gap-1.5 text-xs text-stone-400 font-semibold uppercase tracking-wider">
              <Loader2 size={13} className="animate-spin text-blue-600" />
              Loading Details...
            </div>
          )}
          <Link href="/admin/seller-leads/new">
            <Button className="bg-[#292524] hover:bg-[#0c0a09] text-white hover:border-blue-655/30 border border-[#292524] focus:ring-2 focus:ring-blue-500/10 font-semibold text-xs uppercase tracking-widest rounded-full px-5 h-9 gap-2 transition-all shadow-sm">
              <Plus size={14} strokeWidth={2.5} />
              Add Seller Lead
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Search seller name, phone number, location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-10 h-11 bg-stone-50/40 border-stone-200 focus:border-emerald-600 focus:ring-emerald-500/10 hover:border-stone-300 rounded-xl font-semibold text-sm placeholder:text-stone-400/70"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* District Dropdown */}
          <div className="w-full sm:w-60">
            <DistrictDropdown
              value={district}
              onChange={(val) => {
                setDistrict(val)
                setPage(1)
              }}
            />
          </div>

          {/* Clear Filters Button */}
          {(search || district) && (
            <button
              onClick={handleResetFilters}
              className="h-9 px-4 rounded-full border border-dashed border-stone-200 hover:border-stone-400 text-xs font-semibold text-stone-605 hover:text-stone-900 transition flex items-center gap-1.5 ml-auto"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-32 space-y-4 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Loading seller submissions...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-32 bg-white rounded-2xl border border-dashed border-stone-200/80 shadow-sm text-center">
          <div className="w-12 h-12 bg-stone-50 rounded-full border border-[#e7e5e4] flex items-center justify-center text-stone-400 mb-6 mx-auto">
            <Users size={20} />
          </div>
          <h2 className="text-xl font-sans font-bold text-stone-900 mb-2">No seller leads found</h2>
          <p className="text-stone-500 text-xs mb-6 max-w-sm mx-auto font-medium leading-relaxed">
            {search || district
              ? "We couldn't find any seller lead matching your filters. Try widening your search queries or resetting filters."
              : "No seller land details have been submitted yet. Create one manually to register offline leads."}
          </p>
          {(search || district) ? (
            <Button onClick={handleResetFilters} className="bg-[#292524] hover:bg-[#0c0a09] font-semibold text-xs uppercase tracking-widest text-white px-6 h-9 rounded-full shadow-sm">
              Clear Search & Filters
            </Button>
          ) : (
            <Link href="/admin/seller-leads/new">
              <Button className="bg-[#292524] hover:bg-[#0c0a09] font-semibold text-xs uppercase tracking-widest text-white px-6 h-9 rounded-full shadow-sm">
                Add Seller Lead
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/50">
                    <th className="p-4 pl-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">Seller Name</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Phone Number</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">District</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Location Name</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Created Date</th>
                    <th className="p-4 pr-6 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans text-xs">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-stone-50/50 transition-colors group">
                      {/* Name */}
                      <td className="p-4 pl-6 font-semibold text-stone-900">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100/60 text-blue-700 font-extrabold flex items-center justify-center shrink-0 shadow-sm">
                            {getInitials(lead.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-900">{lead.name}</p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="p-4 text-stone-700 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <Phone size={11} className="text-stone-400" />
                          {lead.phoneNumber}
                        </div>
                      </td>

                      {/* District */}
                      <td className="p-4 font-semibold text-stone-800">
                        {lead.district}
                      </td>

                      {/* Location Name */}
                      <td className="p-4 text-stone-600 font-medium">
                        {lead.locationName}
                      </td>

                      {/* Created Date */}
                      <td className="p-4 text-stone-450 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} className="text-stone-300" />
                          <span>
                            {lead.createdAt
                              ? new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                              : '-'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="View Details & Notes"
                            onClick={() => handleOpenDetails(lead.id!)}
                            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-505 hover:text-stone-800 transition"
                          >
                            <Eye size={13} />
                          </button>
                          
                          <Link href={`/admin/seller-leads/${lead.id}/edit`}>
                            <button
                              title="Edit Lead"
                              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-505 hover:text-stone-800 transition"
                            >
                              <Edit3 size={13} />
                            </button>
                          </Link>

                          <button
                            title="Delete Lead"
                            onClick={() => handleDelete(lead.id!)}
                            className="p-1.5 rounded-full hover:bg-red-50 text-stone-400 hover:text-red-650 transition"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-stone-100 bg-stone-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Showing {startIdx}-{endIdx} of {total} leads
                </p>
                <div className="flex items-center gap-1.5 p-1 bg-stone-50 rounded-2xl border border-stone-200/50">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className="h-8 px-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 hover:bg-white disabled:text-stone-300 disabled:hover:bg-transparent transition-all"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isSelected = page === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-extrabold shadow-sm transition-all ${isSelected
                            ? "bg-[#292524] text-white"
                            : "text-stone-500 hover:bg-white hover:text-stone-900"
                          }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    className="h-8 px-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 hover:bg-white disabled:text-stone-300 disabled:hover:bg-transparent transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide-out details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent 
          className="w-full sm:max-w-md md:max-w-lg p-6 overflow-y-auto bg-white border-l border-stone-200"
          onPointerDownOutside={(e) => {
            if (activeLightboxImage) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            if (activeLightboxImage) {
              e.preventDefault();
            }
          }}
        >
          {selectedLead && (
            <div className="space-y-6">
              
              {/* Header block */}
              <SheetHeader className="pb-4 border-b border-stone-150 p-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-150 text-blue-750 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                      Seller Lead Profile
                    </span>
                    <Link href={`/admin/seller-leads/${selectedLead.id}/edit`} onClick={() => setIsSheetOpen(false)}>
                      <button 
                        title="Edit Seller Lead"
                        className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition flex items-center justify-center cursor-pointer"
                      >
                        <Edit3 size={13} />
                      </button>
                    </Link>
                  </div>
                </div>
                <SheetTitle className="text-2xl font-sans font-bold text-stone-900 pt-2">
                  {selectedLead.name}
                </SheetTitle>
                <SheetDescription className="text-[11px] text-stone-500 font-mono mt-0.5">
                  Lead ID: {selectedLead.id}
                </SheetDescription>
              </SheetHeader>

              {/* Basic Fields Card */}
              <div className="bg-stone-50/50 border border-stone-200/60 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  {/* Contact Phone */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Mobile Contact</span>
                    <a 
                      href={`tel:${selectedLead.phoneNumber}`} 
                      className="font-bold text-stone-900 hover:text-blue-650 transition text-sm flex items-center gap-1.5"
                    >
                      <Phone size={13} className="text-stone-400" />
                      {selectedLead.phoneNumber}
                    </a>
                  </div>

                  {/* Created Date */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Date Received</span>
                    <span className="font-bold text-stone-800 text-sm flex items-center gap-1.5">
                      <Calendar size={13} className="text-stone-400" />
                      {selectedLead.createdAt 
                        ? new Date(selectedLead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) 
                        : '-'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-stone-200/50 my-2" />

                {/* Location */}
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Territory & Location</span>
                  <span className="font-bold text-stone-800 text-sm flex items-center gap-1.5">
                    <MapPin size={13} className="text-stone-400 shrink-0" />
                    <span className="line-clamp-2">{selectedLead.locationName}, {selectedLead.district}</span>
                  </span>
                </div>
              </div>

              {/* Seller Notes / Description */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Seller Description / Notes</span>
                <div className="bg-white border border-stone-200/60 p-4 rounded-xl leading-relaxed text-xs text-stone-700 whitespace-pre-line shadow-xs">
                  {selectedLead.notes ? `"${selectedLead.notes}"` : "No description provided by the seller."}
                </div>
              </div>

              {/* Lead Image Gallery (Read-Only) */}
              <div className="space-y-3 pt-4 border-t border-stone-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={14} className="text-stone-500" />
                    <span className="text-[10px] font-black text-stone-800 uppercase tracking-widest">Lead Images</span>
                  </div>
                  <span className="text-[9px] font-bold text-stone-505 bg-stone-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {selectedLead.images?.length || 0} files
                  </span>
                </div>

                {selectedLead.images && selectedLead.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedLead.images.map((img, idx) => (
                      <div 
                        key={img.id || img.imageUrl || idx}
                        onClick={() => setActiveLightboxImage(img.imageUrl)}
                        className="relative aspect-video bg-stone-50 border border-stone-150 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <Image 
                          src={img.imageUrl} 
                          alt="Lead Image" 
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover select-none"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 bg-stone-50/50 border border-stone-200 border-dashed rounded-xl text-center space-y-1">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">No images attached</p>
                    <p className="text-[10px] text-stone-450 max-w-[220px] mx-auto leading-relaxed font-semibold">
                      To upload photos, edit this lead.
                    </p>
                  </div>
                )}
              </div>

              {/* CRM internal notes (Editable) */}
              <div className="space-y-3 pt-4 border-t border-stone-150">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-stone-505" />
                  <span className="text-[10px] font-black text-stone-800 uppercase tracking-widest">Internal CRM Notes</span>
                </div>
                
                <textarea
                  value={crmNotes}
                  onChange={(e) => setCrmNotes(e.target.value)}
                  placeholder="Record calls, qualification details, follow-ups, internal records..."
                  rows={4}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 hover:border-stone-300 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-650 rounded-xl text-xs font-semibold outline-none resize-none transition-all"
                />

                <div className="flex justify-end pt-1">
                  <Button
                    onClick={handleSaveNotes}
                    disabled={savingNotes || crmNotes === (selectedLead.adminNotes || "")}
                    className="bg-[#292524] hover:bg-[#0c0a09] border border-[#292524] text-white disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200 font-bold text-xs uppercase tracking-widest rounded-full h-9 px-4.5 gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    {savingNotes ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={12} />
                        Save CRM Notes
                      </>
                    )}
                  </Button>
                </div>
              </div>

            </div>
          )}
        </SheetContent>

        {/* Image Lightbox Modal */}
        {activeLightboxImage && (
          <SheetPortal>
            <div 
              className="fixed inset-0 z-[110] bg-black/75 flex items-center justify-center p-4 animate-in fade-in duration-200 backdrop-blur-xs"
              style={{ pointerEvents: "auto" }}
              onClick={() => setActiveLightboxImage(null)}
            >
              <div className="relative max-w-4xl max-h-[85vh] p-4 flex items-center justify-center">
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setActiveLightboxImage(null)}
                  className="absolute -top-10 right-2 p-2 bg-stone-900/80 text-white rounded-full hover:bg-stone-950 hover:scale-105 transition-all z-[10000] cursor-pointer"
                >
                  <X size={16} />
                </button>
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <Image 
                    src={activeLightboxImage} 
                    alt="Enlarged Lead Image" 
                    width={800}
                    height={600}
                    className="object-contain rounded-lg max-h-[80vh] w-auto max-w-full shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </SheetPortal>
        )}
      </Sheet>

    </div>
  )
}
