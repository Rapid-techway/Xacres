"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { checkAuth } from "@/lib/appwrite"
import { Models } from "appwrite"
import { Compass, CheckCircle2, Grid3x3, MapPin } from "lucide-react"
import { landService } from "@/services/land.service"
import { Land } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

export default function AdminDashboard() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statsData, setStatsData] = useState<{
    total: number;
    publicCount: number;
    privateCount: number;
    recentLands: Land[];
  } | null>(null)
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
          setStatsData(dashboardStats)
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
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !statsData) return null

  const stats = [
    { label: "TOTAL LANDS", value: statsData.total.toLocaleString(), icon: Grid3x3, bg: "bg-blue-100", color: "text-blue-600" },
    { label: "PUBLIC", value: statsData.publicCount.toLocaleString(), icon: Compass, bg: "bg-indigo-100", color: "text-indigo-600" },
    { label: "PRIVATE", value: statsData.privateCount.toLocaleString(), icon: CheckCircle2, bg: "bg-emerald-100", color: "text-emerald-600" },
  ]

  const recentLands = statsData.recentLands

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">

      {/* HERO SECTION */}
      <div className="relative rounded-[32px] bg-gradient-to-br from-[#eef2ff] to-[#f8fafc] p-10 overflow-hidden border border-blue-100">
        <div className="max-w-xl">
          <p className="text-xs font-semibold text-blue-600 tracking-widest uppercase mb-2">
            Dashboard Overview
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Hello, Admin.
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your land portfolio with precision.
          </p>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                    {stat.label}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="text-blue-600" size={22} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-6 bg-white rounded-[32px] border border-gray-100 p-6 space-y-6 shadow-sm">

          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Lands
            </h2>
            <Link href="/admin/lands" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>

          {/* LIST */}
          <div className="space-y-4">
            {recentLands.map((land) => (
              <Link
                key={land.$id}
                href={`/admin/lands/${land.$id}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer"
              >
                {/* IMAGE */}
                <div className="w-20 h-16 rounded-lg overflow-hidden relative shrink-0">
                  <Image
                    src={land.images?.[0]?.url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=600"}
                    alt={land.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {land.title}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin size={12} />
                    {land.district}
                  </p>
                </div>

                {/* PRICE */}
                <div className="text-right whitespace-nowrap">
                  <p className="font-semibold text-blue-600">
                    ₹{formatPrice(land.price)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {land.area} acres
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-4">

          <div className="rounded-[32px] bg-blue-600 text-white p-8 h-full flex flex-col justify-between shadow-lg">

            <div>
              <h3 className="text-lg font-semibold mb-3">
                AI Valuation Suggestion
              </h3>
              <p className="text-sm text-blue-100 leading-relaxed">
                Based on market trends and nearby listings, this parcel is expected to grow by 8% in value. Consider revising pricing.
              </p>
            </div>

            <button className="mt-6 bg-white text-blue-600 font-semibold py-2 rounded-xl">
              Review Report
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
