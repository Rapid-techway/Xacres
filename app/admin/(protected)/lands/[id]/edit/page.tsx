"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronRight, Loader2 } from "lucide-react"
import LandForm from "@/components/admin/LandForm"
import { landService } from "@/services/land.service"
import { FlattenedLand } from "@/lib/types"

export default function EditLandPage() {
  const params = useParams()
  const id = params.id as string
  const [data, setData] = useState<FlattenedLand | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchLandData = useCallback(async () => {
    try {
      setLoading(true)
      const fullData = await landService.getFullLandById(id)
      
      // Flatten the data for the LandForm component
      const flattenedData: FlattenedLand = {
        ...fullData.land,
        ...fullData.admin,
        polygon: fullData.polygon?.polygon || null,
        // Ensure id is present for LandForm logic
        id: fullData.land.$id,
        $id: fullData.land.$id
      }
      
      setData(flattenedData)
    } catch (error) {
      console.error("Error fetching land:", error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchLandData()
    }
  }, [id, fetchLandData])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium font-serif italic">Curating property details...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumb Header */}
      <div>
        <nav className="flex items-center text-sm font-medium text-gray-500 mb-2">
          <Link href="/admin/lands" className="hover:text-blue-600 transition-colors">Lands</Link>
          <ChevronRight size={14} className="mx-1 opacity-50" />
          <Link href={`/admin/lands/${id}`} className="hover:text-blue-600 transition-colors">Property View</Link>
          <ChevronRight size={14} className="mx-1 opacity-50" />
          <span className="text-gray-900">Edit Mode</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{data?.title}</h1>
        <p className="text-gray-500 mt-1 font-medium">Listing ID: #{id}</p>
      </div>

      <LandForm initialData={data} />
    </div>
  )
}
