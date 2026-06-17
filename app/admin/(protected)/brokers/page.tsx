"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Plus, Search, Users, Briefcase, Phone, Calendar, Eye, Edit2, Loader2, RefreshCw, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DistrictDropdown from "@/components/admin/DistrictDropdown"
import { brokerService } from "@/services/broker.service"
import { Broker } from "@/lib/types"
import { HARYANA_TEHSILS } from "@/lib/static"

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  // Filters State
  const [search, setSearch] = useState("")
  const [district, setDistrict] = useState("")
  const [tehsil, setTehsil] = useState("")
  const [reputation, setReputation] = useState("")
  const [page, setPage] = useState(1)
  const limit = 10

  const fetchBrokers = useCallback(async () => {
    try {
      setLoading(true)
      const res = await brokerService.getBrokers({
        search,
        district,
        tehsil,
        reputation,
        page,
        limit
      })
      setBrokers(res.documents)
      setTotal(res.total)
    } catch (error) {
      console.error("Error fetching brokers:", error)
    } finally {
      setLoading(false)
    }
  }, [search, district, tehsil, reputation, page])

  useEffect(() => {
    fetchBrokers()
  }, [fetchBrokers])

  const handleResetFilters = () => {
    setSearch("")
    setDistrict("")
    setTehsil("")
    setReputation("")
    setPage(1)
  }

  // Page Calculations
  const totalPages = Math.ceil(total / limit)
  const startIdx = (page - 1) * limit + 1
  const endIdx = Math.min(page * limit, total)

  // Helper for reputation badges
  const getReputationBadge = (rep: string) => {
    const cleanRep = rep.toUpperCase();
    if (cleanRep === 'SILVER') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
          Silver
        </span>
      )
    } else if (cleanRep === 'GOLD') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
          Gold
        </span>
      )
    } else {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
          Diamond
        </span>
      )
    }
  }

  // Get Initials for Avatar
  const getInitials = (name: string) => {
    if (!name) return "B"
    return name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase()
  }

  return (
    <div className="p-1 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-blue-650 tracking-widest uppercase mb-1">
            Haryana Partner Network
          </p>
          <h1 className="text-4xl font-sans font-bold tracking-tight text-stone-900">
            Brokers
          </h1>
          <p className="text-xs text-stone-500 font-medium tracking-[0.15px]">
            Manage broker network and listings across Haryana
          </p>
        </div>

        <Link href="/admin/brokers/new">
          <Button className="bg-[#292524] hover:bg-[#0c0a09] text-white hover:border-blue-650/30 border border-[#292524] focus:ring-2 focus:ring-blue-500/10 font-semibold text-xs uppercase tracking-widest rounded-full px-5 h-9 gap-2 transition-all shadow-sm">
            <Plus size={14} strokeWidth={2.5} />
            Add Broker
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Search broker name, code or mobile..."
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
                setTehsil("") // Reset tehsil on district change
                setPage(1)
              }}
            />
          </div>

          {/* Tehsil dropdown */}
          <div className="w-full sm:w-48 relative">
            <select
              value={tehsil}
              onChange={(e) => {
                setTehsil(e.target.value)
                setPage(1)
              }}
              disabled={!district}
              className="w-full h-11 rounded-xl border border-stone-200 bg-stone-50 hover:border-stone-300 px-4 text-xs font-semibold text-stone-850 focus:bg-white focus:border-emerald-600 focus:ring-emerald-500/10 focus:outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-stone-800"
            >
              <option value="">
                {district ? "All Tehsils" : "Select District First"}
              </option>
              {district && (HARYANA_TEHSILS[district] || []).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
              <ChevronDown size={14} className="opacity-70" />
            </div>
          </div>

          {/* Reputation select */}
          <div className="w-full sm:w-48 relative">
            <select
              value={reputation}
              onChange={(e) => {
                setReputation(e.target.value)
                setPage(1)
              }}
              className="w-full h-11 rounded-xl border border-stone-200 bg-stone-50 hover:border-stone-300 px-4 text-xs font-semibold text-stone-850 focus:bg-white focus:border-emerald-600 focus:ring-emerald-500/10 focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">All Reputations</option>
              <option value="SILVER">Silver</option>
              <option value="GOLD">Gold</option>
              <option value="DIAMOND">Diamond</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(search || district || tehsil || reputation) && (
            <button
              onClick={handleResetFilters}
              className="h-9 px-4 rounded-full border border-dashed border-stone-200 hover:border-stone-400 text-xs font-semibold text-stone-600 hover:text-stone-900 transition flex items-center gap-1.5 ml-auto"
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
          <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Loading broker directory...</p>
        </div>
      ) : brokers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-32 bg-white rounded-2xl border border-dashed border-stone-200/80 shadow-sm text-center">
          <div className="w-12 h-12 bg-stone-50 rounded-full border border-[#e7e5e4] flex items-center justify-center text-stone-400 mb-6 mx-auto">
            <Users size={20} />
          </div>
          <h2 className="text-xl font-sans font-bold text-stone-900 mb-2">No brokers found</h2>
          <p className="text-stone-500 text-xs mb-6 max-w-sm mx-auto font-medium leading-relaxed">
            {search || district || tehsil || reputation 
              ? "We couldn't find any broker matching your filters. Try widening your search queries or resetting filters." 
              : "Register your first broker partner in Haryana to start linking land listings."}
          </p>
          {(search || district || tehsil || reputation) ? (
            <Button onClick={handleResetFilters} className="bg-[#292524] hover:bg-[#0c0a09] font-semibold text-xs uppercase tracking-widest text-white px-6 h-9 rounded-full shadow-sm">
              Clear Search & Filters
            </Button>
          ) : (
            <Link href="/admin/brokers/new">
              <Button className="bg-[#292524] hover:bg-[#0c0a09] font-semibold text-xs uppercase tracking-widest text-white px-6 h-9 rounded-full shadow-sm">
                Add Broker Partner
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
                    <th className="p-4 pl-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">Broker</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Broker Code</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">District</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Tehsil</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-center">Experience</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Reputation</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Mobile</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-center">Total Lands</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Joined Date</th>
                    <th className="p-4 pr-6 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans text-xs">
                  {brokers.map((broker) => (
                    <tr key={broker.id} className="hover:bg-stone-50/50 transition-colors group">
                      {/* Name & Office */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100/60 text-blue-700 font-extrabold flex items-center justify-center shrink-0 shadow-sm">
                            {getInitials(broker.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-900 truncate max-w-[150px]">{broker.name}</p>
                            {broker.officeName ? (
                              <p className="text-[10px] text-stone-400 truncate max-w-[150px] flex items-center gap-0.5">
                                <Briefcase size={9} />
                                {broker.officeName}
                              </p>
                            ) : (
                              <p className="text-[10px] text-stone-300 font-medium italic">Individual</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="p-4 font-mono font-bold text-stone-605 tracking-tight">
                        {broker.brokerCode}
                      </td>

                      {/* District */}
                      <td className="p-4 font-semibold text-stone-800">
                        {broker.district}
                      </td>

                      {/* Tehsil */}
                      <td className="p-4 text-stone-600">
                        {broker.tehsil}
                      </td>

                      {/* Experience */}
                      <td className="p-4 text-center font-bold text-stone-700">
                        {broker.experienceYears} yrs
                      </td>

                      {/* Reputation */}
                      <td className="p-4">
                        {getReputationBadge(broker.reputation)}
                      </td>

                      {/* Mobile */}
                      <td className="p-4 text-stone-700 font-semibold flex items-center gap-1.5 mt-3 border-none">
                        <Phone size={11} className="text-stone-400" />
                        {broker.mobileNumber}
                      </td>

                      {/* Total Lands */}
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                          broker.totalLands && broker.totalLands > 0 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-150" 
                            : "bg-stone-50 text-stone-400 border-stone-200"
                        }`}>
                          {broker.totalLands || 0} {broker.totalLands === 1 ? 'Land' : 'Lands'}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="p-4 text-stone-450 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} className="text-stone-300" />
                          <span>
                            {broker.createdAt 
                              ? new Date(broker.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) 
                              : '-'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/brokers/${broker.id}`}>
                            <button
                              title="View Details"
                              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition"
                            >
                              <Eye size={13} />
                            </button>
                          </Link>
                          <Link href={`/admin/brokers/${broker.id}/edit`}>
                            <button
                              title="Edit Broker"
                              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-850 transition"
                            >
                              <Edit2 size={13} />
                            </button>
                          </Link>
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
                  Showing {startIdx}-{endIdx} of {total} brokers
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
                        className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-extrabold shadow-sm transition-all ${
                          isSelected 
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
    </div>
  )
}
