"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { checkAuth } from "@/lib/appwrite"

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-500">Checking authentication...</p>
    </div>
  )
}
