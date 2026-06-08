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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent shadow-lg shadow-blue-500/10"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Loading leads pipeline...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-blue-600 tracking-widest uppercase mb-1">
            CRM Inbox
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Inquiries & Leads
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Review and follow up with potential buyers interested in your listings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchLeads} 
            variant="outline" 
            className="rounded-xl h-11 border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all font-medium text-sm flex items-center gap-2"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-blue-100 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Leads</span>
              <p className="text-3xl font-extrabold text-slate-900">{leads.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Inbox size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-emerald-100 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Leads Today</span>
              <p className="text-3xl font-extrabold text-slate-900">
                {leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <Calendar size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unique Contacts</span>
              <p className="text-3xl font-extrabold text-slate-900">
                {new Set(leads.map(l => l.phone)).size}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Phone size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-purple-100 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Properties</span>
              <p className="text-3xl font-extrabold text-slate-900">
                {new Set(leads.filter(l => l.land_id).map(l => l.land_id)).size}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <MapPin size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search leads by name, phone, listing, district or village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-sm font-medium transition-all shadow-sm outline-none"
            />
          </div>
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Showing {filteredLeads.length} of {leads.length} leads
          </div>
        </div>

        {/* Content list */}
        {filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="w-14 h-14 bg-slate-50 border border-slate-100 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
              <Inbox size={26} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Leads Found</h3>
            <p className="text-sm text-slate-500 max-w-sm font-medium">
              {searchTerm ? "No results match your search term. Try adjusting your keywords." : "No buyer inquiries have been submitted yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 pl-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact Detail</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Land Listing</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Message & Notes</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Budget Preference</th>
                  <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Received At</th>
                  <th className="p-4 pr-6 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors group">
                    {/* User Profile Info */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200/50 border border-slate-200/30 flex items-center justify-center text-slate-600 font-bold text-xs uppercase shadow-sm">
                          {lead.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {lead.name}
                          </div>
                          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                            <span>{lead.phone}</span>
                            <button 
                              onClick={() => handleCopy(lead.phone, lead.id)}
                              className="text-slate-400 hover:text-slate-600 transition"
                              title="Copy Phone Number"
                            >
                              {copiedId === lead.id ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
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
                            className="font-semibold text-slate-800 hover:text-blue-600 transition flex items-center gap-1 truncate text-sm"
                          >
                            {lead.lands.title}
                            <ExternalLink size={12} className="text-slate-400 shrink-0" />
                          </Link>
                          <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5 flex items-center gap-1">
                            <MapPin size={10} />
                            {lead.lands.village}, {lead.lands.district}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium italic">Deleted Listing (ID: {lead.land_id.substring(0, 8)}...)</span>
                      )}
                    </td>

                    {/* Message Note */}
                    <td className="p-4 max-w-[280px]">
                      {lead.note ? (
                        <div className="flex gap-2">
                          <FileText size={14} className="text-slate-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3">
                            {lead.note}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 font-medium italic">No message provided</span>
                      )}
                    </td>

                    {/* Budget preference */}
                    <td className="p-4">
                      {lead.budget ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-xl text-xs font-semibold border border-amber-100/30">
                          <Wallet size={12} />
                          {lead.budget}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium italic">Not specified</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="p-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
                      {formatDate(lead.created_at)}
                    </td>

                    {/* Table Actions */}
                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={`tel:${lead.phone}`}
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                          title="Call Lead"
                        >
                          <Phone size={14} />
                        </a>
                        <button 
                          onClick={() => handleDelete(lead.id)}
                          disabled={deletingId === lead.id}
                          className="w-8 h-8 rounded-lg border border-red-100 bg-white flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm disabled:opacity-50"
                          title="Delete Lead"
                        >
                          <Trash2 size={14} />
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
