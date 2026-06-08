"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { checkAuth } from "@/lib/supabase"
import { 
  Compass, 
  CheckCircle2, 
  Grid3x3, 
  MapPin, 
  Inbox, 
  ArrowRight,
  Clock,
  Sparkles
} from "lucide-react"
import { landService } from "@/services/land.service"
import { Land } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

interface DashboardLead {
  id: string
  name: string
  phone: string
  budget: string | null
  created_at: string
  lands: {
    title: string
  } | null
}

interface StatsData {
  total: number
  publicCount: number
  privateCount: number
  leadsCount: number
  recentLands: Land[]
  recentLeads: DashboardLead[]
}

export default function AdminDashboard() {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currentUser, dashboardStats] = await Promise.all([
          checkAuth(),
          landService.getDashboardStats()
        ])

        if (currentUser) {
          setUser(currentUser)
          // Map backend leads data structure cleanly
          setStatsData({
            total: dashboardStats.total,
            publicCount: dashboardStats.publicCount,
            privateCount: dashboardStats.privateCount,
            leadsCount: dashboardStats.leadsCount,
            recentLands: dashboardStats.recentLands,
            recentLeads: (dashboardStats.recentLeads || []).map((lead: { id: string; name: string; phone: string; budget: string | null; created_at: string; lands: unknown }) => {
              const landData = lead.lands as { title: string } | null
              return {
                id: lead.id,
                name: lead.name,
                phone: lead.phone,
                budget: lead.budget,
                created_at: lead.created_at,
                lands: landData ? { title: landData.title } : null
              }
            })
          })
        } else {
          router.replace("/admin/login")
        }
      } catch (error) {
        console.error("Data fetch failed:", error)
        router.replace("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-32">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent shadow-lg"></div>
      </div>
    )
  }

  if (!user || !statsData) return null

  const stats = [
    { label: "TOTAL INVENTORY", value: statsData.total.toLocaleString(), subtitle: "Active parcels", icon: Grid3x3, bg: "from-blue-500/10 to-indigo-500/5", iconColor: "text-blue-600", borderColor: "border-blue-100/30" },
    { label: "PUBLIC LISTINGS", value: statsData.publicCount.toLocaleString(), subtitle: "Visible to buyers", icon: Compass, bg: "from-indigo-500/10 to-purple-500/5", iconColor: "text-indigo-600", borderColor: "border-indigo-100/30" },
    { label: "PRIVATE INVENTORY", value: statsData.privateCount.toLocaleString(), subtitle: "Draft / Unlisted", icon: CheckCircle2, bg: "from-emerald-500/10 to-teal-500/5", iconColor: "text-emerald-600", borderColor: "border-emerald-100/30" },
    { label: "TOTAL INQUIRIES", value: statsData.leadsCount.toLocaleString(), subtitle: "CRM Pipeline", icon: Inbox, bg: "from-amber-500/10 to-orange-500/5", iconColor: "text-amber-600", borderColor: "border-amber-100/30" },
  ]

  const recentLands = statsData.recentLands
  const recentLeads: DashboardLead[] = statsData.recentLeads

  const formatLeadTime = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return "Just now"
    if (hours === 1) return "1 hr ago"
    if (hours < 24) return `${hours} hrs ago`
    return new Date(dateString).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HERO SECTION */}
      <div className="relative rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        <div className="relative max-w-xl z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles size={12} />
            Control Hub
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-slate-400 text-sm font-medium max-w-sm">
            Monitor real-time buyer inquiries, listing analytics, and update your premium Haryana land inventory.
          </p>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`bg-white rounded-[24px] p-6 border ${stat.borderColor} shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-extrabold text-slate-900 leading-none">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {stat.subtitle}
                  </p>
                </div>

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bg} flex items-center justify-center ${stat.iconColor} group-hover:scale-110 transition-transform`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT COLUMN: Recent Lands */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-6 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Recent Inventory
                </h2>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Newly Added Listings</p>
              </div>
              <Link 
                href="/admin/lands" 
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-all uppercase tracking-wider flex items-center gap-1"
              >
                All Lands
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-4">
              {recentLands.length === 0 ? (
                <p className="text-slate-400 text-sm font-medium italic text-center py-10">No properties in inventory</p>
              ) : (
                recentLands.map((land) => (
                  <Link
                    key={land.id || land.$id}
                    href={`/admin/lands/${land.id || land.$id}`}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group"
                  >
                    <div className="w-16 h-14 rounded-xl overflow-hidden relative shrink-0 bg-slate-100 border border-slate-100">
                      <Image
                        src={land.images?.[0]?.url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=200"}
                        alt={land.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate text-sm leading-snug">
                        {land.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-slate-400" />
                        {land.village}, {land.district}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-blue-600 text-sm">
                        ₹{formatPrice(land.price)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        {land.area} acres
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Leads */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-6 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Recent Inquiries
                </h2>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Live Lead Feed</p>
              </div>
              <Link 
                href="/admin/leads" 
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-all uppercase tracking-wider flex items-center gap-1"
              >
                Open CRM
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-4">
              {recentLeads.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Inbox size={24} className="mx-auto text-slate-300" />
                  <p className="text-slate-400 text-sm font-medium italic">No buyer inquiries received yet</p>
                </div>
              ) : (
                recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/40 relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0 border border-blue-100/50">
                        {lead.name.substring(0, 2).toUpperCase()}
                      </div>
                      
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-900 text-sm truncate">
                          {lead.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5 truncate">
                          <span>{lead.lands?.title || 'General Interest'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-0.5">
                      <p className="text-[10px] text-slate-400 font-semibold flex items-center justify-end gap-1.5">
                        <Clock size={10} />
                        {formatLeadTime(lead.created_at)}
                      </p>
                      {lead.budget ? (
                        <div className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-[10px] font-bold border border-amber-100/40">
                          {lead.budget}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 italic font-medium">No budget</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
