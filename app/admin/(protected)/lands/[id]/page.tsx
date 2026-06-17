"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import LandAdminView from "@/components/admin/LandAdminView"
import { landService } from "@/services/land.service"
import { brokerService } from "@/services/broker.service"

import { FlattenedLand } from "@/lib/types"

export default function ViewLandPage() {
  const params = useParams()
  const id = params.id as string
  const [data, setData] = useState<FlattenedLand | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchLandData = useCallback(async () => {
    try {
      setLoading(true)
      const fullData = await landService.getFullLandById(id)
      
      let brokerData = null
      if (fullData.land.brokerId) {
        try {
          brokerData = await brokerService.getBrokerById(fullData.land.brokerId)
        } catch (err) {
          console.error("Error fetching linked broker details:", err)
        }
      }
      
      const flattenedData: FlattenedLand = {
        ...fullData.land,
        ...fullData.admin,
        polygon: fullData.polygon?.polygon || null,
        id: fullData.land.$id,
        $id: fullData.land.$id,
        broker: brokerData || undefined
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
        <p className="text-gray-500 font-medium italic">Loading property details...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
        <p className="text-gray-500 text-sm">The land record you are looking for does not exist or has been removed.</p>
        <Link href="/admin/lands" className="inline-block bg-gray-900 text-white px-6 py-2 rounded-xl font-bold">
          Back to Inventory
        </Link>
      </div>
    )
  }

  return <LandAdminView data={data} />
}
