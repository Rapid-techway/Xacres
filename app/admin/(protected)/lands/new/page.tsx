"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import LandForm from "@/components/admin/LandForm"

export default function NewLandPage() {
  return (
    <div className="p-2 max-w-3xl mx-auto space-y-8">
      {/* Breadcrumb Header */}
      <div>
        <nav className="flex items-center text-sm font-medium text-gray-500 mb-2">
          <Link href="/admin/lands" className="hover:text-blue-600 transition-colors">Lands</Link>
          <ChevronRight size={14} className="mx-1 opacity-50" />
          <span className="text-gray-900">Add New Listing</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create New Land Listing</h1>
        <p className="text-gray-500 mt-1">Define the architectural and geographic parameters of the property.</p>
      </div>

      <LandForm />
    </div>
  )
}
