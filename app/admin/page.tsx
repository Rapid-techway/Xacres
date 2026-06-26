"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { checkAuth } from "@/lib/supabase"

export default function AdminRoot() {
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const user = await checkAuth()
        if (user) {
          router.replace("/admin/dashboard")
        } else {
          router.replace("/admin/login")
        }
      } catch (error) {
        console.error("Redirect check failed:", error)
        router.replace("/admin/login")
      }
    }

    handleRedirect()
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa]">
      <div className="text-center space-y-1.5">
        <h1 className="text-4xl font-black tracking-tight text-gray-900 font-sans">
          Xacres
        </h1>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          Admin Panel
        </p>
        <div className="pt-6 flex items-center justify-center gap-2 text-xs text-gray-400/70 font-semibold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
          Verifying Session
        </div>
      </div>
    </div>
  )
}
