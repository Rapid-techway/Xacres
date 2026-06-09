"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { checkAuth } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { 
  Inbox, 
  Search, 
  Trash2, 
  Phone, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Wallet, 
  FileText,
  Copy,
  Check,
  RefreshCw
} from "lucide-react"
import { landService } from "@/services/land.service"
import { Button } from "@/components/ui/button"

interface Lead {
  id: string
  land_id: string
  name: string
  phone: string
  note: string | null
  budget: string | null
  created_at: string
  lands: {
    title: string
    slug: string
    district: string
    village: string
  } | null
}

interface DbLeadResponse {
  id: string
  land_id: string
  name: string
  phone: string
  note: string | null
  budget: string | null
  created_at: string
  lands: {
    title: string
    slug: string
    district: string
    village: string
  } | {
    title: string
    slug: string
    district: string
    village: string
  }[] | null
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

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
        console.error("Auth check or leads load failed:", err)
        router.replace("/admin/login")
      }
    }
    initPage()
  }, [router])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const data = await landService.getLeads()
      // Map and cast to Lead structure
      const mapped = (data || []).map((item: DbLeadResponse) => {
        const rawLand = item.lands
        const landObj = Array.isArray(rawLand) ? rawLand[0] : rawLand

        return {
          id: item.id,
          land_id: item.land_id,
          name: item.name,
          phone: item.phone,
          note: item.note,
          budget: item.budget,
          created_at: item.created_at,
          lands: landObj ? {
            title: landObj.title,
            slug: landObj.slug,
            district: landObj.district,
            village: landObj.village
          } : null
        }
      })
      setLeads(mapped)
      setFilteredLeads(mapped)
    } catch (err) {
      console.error("Error loading leads:", err)
    } finally {
      setLoading(false)
    }
  }

  // Filter leads on search change
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) {
      setFilteredLeads(leads)
      return
    }

    const filtered = leads.filter(lead => {
      const nameMatch = lead.name.toLowerCase().includes(term)
      const phoneMatch = lead.phone.toLowerCase().includes(term)
      const noteMatch = lead.note?.toLowerCase().includes(term) || false
      const budgetMatch = lead.budget?.toLowerCase().includes(term) || false
      const landMatch = lead.lands?.title.toLowerCase().includes(term) || 
                        lead.lands?.district.toLowerCase().includes(term) || 
                        lead.lands?.village.toLowerCase().includes(term) || false

      return nameMatch || phoneMatch || noteMatch || budgetMatch || landMatch
    })
    setFilteredLeads(filtered)
  }, [searchTerm, leads])

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this lead?")) return
    
    try {
      setDeletingId(id)
      await landService.deleteLead(id)
      setLeads(prev => prev.filter(l => l.id !== id))
    } catch (err) {
      console.error("Failed to delete lead:", err)
      alert("Failed to delete lead. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (loading && leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-32 space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
        <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Loading leads pipeline...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-blue-605 tracking-widest uppercase mb-1">
            CRM Inbox
          </p>
          <h1 className="text-4xl font-sans font-bold tracking-tight text-stone-900">
            Inquiries & Leads
          </h1>
          <p className="text-xs text-stone-500 font-medium tracking-[0.15px] mt-1">
            Review and follow up with potential buyers interested in your listings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchLeads} 
            variant="outline" 
            className="rounded-full h-9 border-[#e7e5e4] hover:border-blue-650/40 text-stone-700 bg-white hover:bg-stone-50 hover:text-stone-900 transition-all font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-xl p-3.5 sm:p-5 border border-[#e7e5e4] shadow-sm hover:shadow-md transition-shadow duration-150 flex items-center justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[8.5px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-widest truncate block">Total Leads</span>
            <p className="text-xl sm:text-3xl font-sans font-bold text-stone-900 leading-none">{leads.length}</p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
            <Inbox className="size-3.5 sm:size-4.5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 sm:p-5 border border-[#e7e5e4] shadow-sm hover:shadow-md transition-shadow duration-150 flex items-center justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[8.5px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-widest truncate block">Leads Today</span>
            <p className="text-xl sm:text-3xl font-sans font-bold text-stone-900 leading-none">
              {leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">
            <Calendar className="size-3.5 sm:size-4.5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 sm:p-5 border border-[#e7e5e4] shadow-sm hover:shadow-md transition-shadow duration-150 flex items-center justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[8.5px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-widest truncate block">Unique Contacts</span>
            <p className="text-xl sm:text-3xl font-sans font-bold text-stone-900 leading-none">
              {new Set(leads.map(l => l.phone)).size}
            </p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">
            <Phone className="size-3.5 sm:size-4.5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 sm:p-5 border border-[#e7e5e4] shadow-sm hover:shadow-md transition-shadow duration-150 flex items-center justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 min-w-0">
            <span className="text-[8.5px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-widest truncate block">Active Properties</span>
            <p className="text-xl sm:text-3xl font-sans font-bold text-stone-900 leading-none">
              {new Set(leads.filter(l => l.land_id).map(l => l.land_id)).size}
            </p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">
            <MapPin className="size-3.5 sm:size-4.5" />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-[#e7e5e4] shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-[#e7e5e4] bg-[#fafafa] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Search leads by name, phone, listing, district or village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-white border border-[#e7e5e4] focus:border-blue-650 focus:ring-2 focus:ring-blue-500/10 rounded-full text-xs font-semibold tracking-[0.15px] outline-none transition-all shadow-sm"
            />
          </div>
          
          <div className="text-[10px] font-bold text-stone-455 uppercase tracking-widest whitespace-nowrap">
            Showing {filteredLeads.length} of {leads.length} leads
          </div>
        </div>

        {/* Content list */}
        {filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="w-12 h-12 bg-stone-50 border border-[#e7e5e4] text-stone-350 rounded-full flex items-center justify-center mb-4">
              <Inbox size={20} />
            </div>
            <h3 className="text-lg font-sans font-semibold text-stone-900 mb-1">No Leads Found</h3>
            <p className="text-xs text-stone-500 max-w-sm font-medium leading-relaxed">
              {searchTerm ? "No results match your search term. Try adjusting your keywords." : "No buyer inquiries have been submitted yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#e7e5e4]">
                  <th className="p-4 pl-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Contact Detail</th>
                  <th className="p-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Target Land Listing</th>
                  <th className="p-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Message & Notes</th>
                  <th className="p-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Budget Preference</th>
                  <th className="p-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Received At</th>
                  <th className="p-4 pr-6 text-right text-[10px] font-bold text-stone-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e5e4]">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-stone-50/30 transition-colors group">
                    {/* User Profile Info */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10.5px] uppercase shadow-sm">
                          {lead.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900 text-sm">
                            {lead.name}
                          </div>
                          <div className="text-[10px] text-stone-500 font-medium flex items-center gap-1.5 mt-0.5">
                            <span>{lead.phone}</span>
                            <button 
                              onClick={() => handleCopy(lead.phone, lead.id)}
                              className="text-stone-400 hover:text-stone-600 transition"
                              title="Copy Phone Number"
                            >
                              {copiedId === lead.id ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Listing Interest */}
                    <td className="p-4">
                      {lead.lands ? (
                        <div className="max-w-[240px]">
                          <Link 
                            href={`/lands/${lead.lands.slug}`}
                            target="_blank" 
                            className="font-semibold text-stone-800 hover:text-blue-650 transition flex items-center gap-1 truncate text-xs"
                          >
                            {lead.lands.title}
                            <ExternalLink size={11} className="text-stone-400 shrink-0" />
                          </Link>
                          <div className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                            <MapPin size={9} />
                            {lead.lands.village}, {lead.lands.district}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400 font-medium italic">Deleted Listing (ID: {lead.land_id.substring(0, 8)}...)</span>
                      )}
                    </td>

                    {/* Message Note */}
                    <td className="p-4 max-w-[280px]">
                      {lead.note ? (
                        <div className="flex gap-2">
                          <FileText size={13} className="text-stone-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-stone-600 leading-relaxed font-medium line-clamp-3">
                            {lead.note}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-stone-300 font-medium italic">No message provided</span>
                      )}
                    </td>

                    {/* Budget preference */}
                    <td className="p-4">
                      {lead.budget ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-full text-[10px] font-semibold border border-stone-200/50">
                          <Wallet size={10} className="text-stone-500" />
                          {lead.budget}
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400 font-medium italic">Not specified</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="p-4 text-xs font-semibold text-stone-500 whitespace-nowrap">
                      {formatDate(lead.created_at)}
                    </td>

                    {/* Table Actions */}
                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a 
                          href={`tel:${lead.phone}`}
                          className="w-7 h-7 rounded-full border border-[#e7e5e4] bg-white flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all shadow-sm"
                          title="Call Lead"
                        >
                          <Phone size={12} />
                        </a>
                        <button 
                          onClick={() => handleDelete(lead.id)}
                          disabled={deletingId === lead.id}
                          className="w-7 h-7 rounded-full border border-red-100 bg-white flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-650 transition-all shadow-sm disabled:opacity-50"
                          title="Delete Lead"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
