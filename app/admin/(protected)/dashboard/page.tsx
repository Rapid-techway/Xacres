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
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (!user || !statsData) return null

  const stats = [
    { label: "TOTAL INVENTORY", value: statsData.total.toLocaleString(), subtitle: "Active parcels", icon: Grid3x3, bg: "bg-blue-50/50 border border-blue-100/30", iconColor: "text-blue-600" },
    { label: "PUBLIC LISTINGS", value: statsData.publicCount.toLocaleString(), subtitle: "Visible to buyers", icon: Compass, bg: "bg-stone-50 border border-stone-100", iconColor: "text-stone-700" },
    { label: "PRIVATE INVENTORY", value: statsData.privateCount.toLocaleString(), subtitle: "Draft / Unlisted", icon: CheckCircle2, bg: "bg-stone-50 border border-stone-100", iconColor: "text-stone-700" },
    { label: "TOTAL INQUIRIES", value: statsData.leadsCount.toLocaleString(), subtitle: "CRM Pipeline", icon: Inbox, bg: "bg-stone-50 border border-stone-100", iconColor: "text-stone-700" },
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
    <div className="max-w-[1400px] mx-auto space-y-8">

      {/* HERO SECTION */}
      <div className="relative rounded-2xl bg-white border border-[#e7e5e4] p-8 overflow-hidden shadow-sm">
        {/* Soft atmospheric blurred peach and lavender gradient blooms in the background */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#f4c5a8]/25 blur-3xl pointer-events-none" />
        <div className="absolute right-20 -bottom-10 w-60 h-60 rounded-full bg-[#a8c8e8]/25 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50/50 border border-blue-100/50 text-blue-700 rounded-full text-[10px] font-semibold uppercase tracking-widest">
            <Sparkles size={11} />
            Control Hub
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-sans font-bold text-stone-900 tracking-tight leading-none">
              Welcome back, {user.name.split(' ')[0]}
            </h1>
            <p className="text-stone-500 text-sm tracking-[0.15px] max-w-md">
              Monitor real-time buyer inquiries, listing analytics, and update your premium Haryana land inventory.
            </p>
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-3.5 sm:p-5 border border-[#e7e5e4] shadow-sm hover:shadow-md transition-shadow duration-150 flex items-center justify-between gap-2"
            >
              <div className="space-y-1 sm:space-y-1.5 min-w-0">
                <p className="text-[8.5px] sm:text-[10px] font-bold tracking-widest text-stone-400 uppercase truncate">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-3xl font-sans font-bold text-stone-900 leading-none">
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-xs text-stone-500 font-medium truncate">
                  {stat.subtitle}
                </p>
              </div>

              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${stat.bg} flex items-center justify-center ${stat.iconColor} shrink-0`}>
                <Icon className="size-3.5 sm:size-4.5" />
              </div>
            </div>
          )
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT COLUMN: Recent Lands */}
        <div className="bg-white rounded-xl border border-[#e7e5e4] p-6 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-sans font-semibold text-stone-900">
                  Recent Inventory
                </h2>
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">Newly Added Listings</p>
              </div>
              <Link 
                href="/admin/lands" 
                className="text-[11px] font-semibold text-stone-900 border border-[#e7e5e4] bg-white hover:bg-stone-50 px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 transition-all h-8"
              >
                All Lands
                <ArrowRight size={11} />
              </Link>
            </div>

            <div className="space-y-3.5">
              {recentLands.length === 0 ? (
                <p className="text-stone-400 text-sm font-medium italic text-center py-10">No properties in inventory</p>
              ) : (
                recentLands.map((land) => (
                  <Link
                    key={land.id || land.$id}
                    href={`/admin/lands/${land.id || land.$id}`}
                    className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-stone-50/50 transition border border-transparent hover:border-[#e7e5e4] group"
                  >
                    <div className="w-14 h-12 rounded-lg overflow-hidden relative shrink-0 bg-stone-50 border border-[#e7e5e4]">
                      <Image
                        src={land.images?.[0]?.url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=200"}
                        alt={land.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-stone-950 truncate text-sm leading-snug">
                        {land.title}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-stone-400" />
                        {land.village}, {land.district}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-sans font-semibold text-stone-900 text-[14px]">
                        ₹{formatPrice(land.price)}
                      </p>
                      <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">
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
        <div className="bg-white rounded-xl border border-[#e7e5e4] p-6 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-sans font-semibold text-stone-900">
                  Recent Inquiries
                </h2>
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">Live Lead Feed</p>
              </div>
              <Link 
                href="/admin/leads" 
                className="text-[11px] font-semibold text-stone-900 border border-[#e7e5e4] bg-white hover:bg-stone-50 px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 transition-all h-8"
              >
                Open CRM
                <ArrowRight size={11} />
              </Link>
            </div>

            <div className="space-y-3.5">
              {recentLeads.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Inbox size={20} className="mx-auto text-stone-350" />
                  <p className="text-stone-400 text-sm font-medium italic">No buyer inquiries received yet</p>
                </div>
              ) : (
                recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#e7e5e4] bg-[#fafafa] relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-bold shrink-0">
                        {lead.name.substring(0, 2).toUpperCase()}
                      </div>
                      
                      <div className="min-w-0">
                        <h4 className="font-medium text-stone-950 text-sm truncate">
                          {lead.name}
                        </h4>
                        <p className="text-xs text-stone-500 font-medium flex items-center gap-1 mt-0.5 truncate">
                          <span>{lead.lands?.title || 'General Interest'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-0.5">
                      <p className="text-[10px] text-stone-400 font-semibold flex items-center justify-end gap-1">
                        <Clock size={10} />
                        {formatLeadTime(lead.created_at)}
                      </p>
                      {lead.budget ? (
                        <div className="inline-block px-2.5 py-0.5 bg-stone-200/50 text-stone-700 rounded-full text-[9px] font-bold border border-stone-200">
                          {lead.budget}
                        </div>
                      ) : (
                        <div className="text-[9px] text-stone-400 italic font-medium">No budget</div>
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

