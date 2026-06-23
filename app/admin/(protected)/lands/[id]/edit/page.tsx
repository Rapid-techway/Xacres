"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import LandForm from "@/components/admin/LandForm/LandFormRoot"
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
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <LandForm initialData={data} />
    </div>
  )
}
