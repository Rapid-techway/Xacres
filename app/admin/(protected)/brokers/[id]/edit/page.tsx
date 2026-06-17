"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import BrokerForm from "@/components/admin/BrokerForm"
import { brokerService } from "@/services/broker.service"
import { Broker } from "@/lib/types"

export default function EditBrokerPage() {
  const params = useParams()
  const id = params.id as string
  const [broker, setBroker] = useState<Broker | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchBroker = useCallback(async () => {
    try {
      setLoading(true)
      const data = await brokerService.getBrokerById(id)
      setBroker(data)
    } catch (error) {
      console.error("Error fetching broker for edit:", error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchBroker()
    }
  }, [id, fetchBroker])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-605 animate-spin" />
        <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Loading broker profile...</p>
      </div>
    )
  }

  if (!broker) {
    return (
      <div className="p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">Broker not found</h1>
        <p className="text-stone-500 text-sm">The broker profile you are trying to edit does not exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <BrokerForm initialData={broker} />
    </div>
  )
}
