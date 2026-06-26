"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Edit3, Phone, Briefcase, MapPin, Award, Calendar, ExternalLink, Loader2, Map, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { brokerService } from "@/services/broker.service"
import { Broker, Land } from "@/lib/types"
import { formatPrice } from "@/lib/utils"

export default function BrokerDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const [broker, setBroker] = useState<Broker | null>(null)
  const [lands, setLands] = useState<Land[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEnlargedImage, setSelectedEnlargedImage] = useState<string | null>(null)

  const fetchBrokerDetails = useCallback(async () => {
    try {
      setLoading(true)
      const res = await brokerService.getBrokerByIdWithLands(id)
      setBroker(res.broker)
      setLands(res.lands)
    } catch (error) {
      console.error("Error fetching broker details:", error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchBrokerDetails()
    }
  }, [id, fetchBrokerDetails])

  // Helper for reputation badges
  const getReputationBadge = (rep: string) => {
    const cleanRep = rep.toUpperCase();
    if (cleanRep === 'SILVER') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-650 border border-slate-200">
          Silver Tier
        </span>
      )
    } else if (cleanRep === 'GOLD') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
          Gold Tier
        </span>
      )
    } else {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-750 border border-indigo-200">
          Diamond Tier
        </span>
      )
    }
  }

  // Get Initials for Avatar
  const getInitials = (name: string) => {
    if (!name) return "B"
    return name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Loading partner details...</p>
      </div>
    )
  }

  if (!broker) {
    return (
      <div className="p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">Broker not found</h1>
        <p className="text-stone-505 text-sm">The broker profile you are trying to view does not exist or has been removed.</p>
        <Link href="/admin/brokers" className="inline-block bg-stone-900 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-wider">
          Back to Brokers
        </Link>
      </div>
    )
  }

  return (
    <div className="p-1 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
            <Link href="/admin/brokers" className="hover:text-blue-650 transition-colors">Brokers</Link>
            <span className="mx-1.5 opacity-50 text-stone-400">/</span>
            <span className="text-stone-850 font-semibold">{broker.name}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-sans font-bold tracking-tight text-stone-900 leading-none">
              {broker.name}
            </h1>
            {getReputationBadge(broker.reputation)}
          </div>
          <p className="text-xs text-stone-500 mt-2 font-medium tracking-[0.15px] font-mono">
            System ID: {broker.id}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/brokers">
            <button className="bg-white hover:bg-stone-50 text-stone-700 font-semibold border border-stone-200 px-4.5 py-2 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm h-9 hover:border-blue-650/40">
              <ArrowLeft size={13} />
              All Brokers
            </button>
          </Link>
          <Link href={`/admin/brokers/${broker.id}/edit`}>
            <Button className="bg-[#292524] hover:bg-[#0c0a09] border border-[#292524] hover:border-blue-650/30 text-white font-semibold shadow-sm rounded-full px-5 py-2 h-9 text-xs uppercase tracking-widest gap-1.5 transition-all">
              <Edit3 size={13} />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Broker Details Top Row */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Column - Profile Card */}
        <div className="w-full md:w-80 lg:w-[350px] shrink-0">
          <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm space-y-6">
            {/* Avatar & Basic */}
            <div className="flex flex-col items-center text-center pb-5 border-b border-stone-100">
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100/60 text-blue-750 font-black text-xl flex items-center justify-center shadow-sm mb-3">
                {getInitials(broker.name)}
              </div>
              <h3 className="font-bold text-stone-900 text-base">{broker.name}</h3>
              <p className="font-mono text-xs font-bold text-stone-500 tracking-tight mt-1">{broker.brokerCode}</p>
              
              {broker.officeName ? (
                <p className="text-xs text-stone-500 font-medium mt-2 bg-stone-50 border border-stone-150 px-3 py-1 rounded-full flex items-center gap-1">
                  <Briefcase size={12} className="text-stone-400" />
                  {broker.officeName}
                </p>
              ) : (
                <p className="text-xs text-stone-404 italic font-medium mt-2">Individual Broker</p>
              )}
            </div>

            {/* Details Fields */}
            <div className="space-y-4 text-xs">
              {/* Mobile Contact */}
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Mobile Contact</p>
                <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Phone size={12} className="text-stone-400" />
                  {broker.phoneNumber}
                </p>
                {broker.alternatePhoneNumber && (
                  <p className="font-semibold text-stone-855 flex items-center gap-1.5 pl-4.5 text-[11px]">
                    <span className="text-[9px] text-stone-400">Alt:</span>
                    {broker.alternatePhoneNumber}
                  </p>
                )}
              </div>

              {/* Territory Coverage */}
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Jurisdiction</p>
                <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <MapPin size={12} className="text-stone-450" />
                  {broker.district}, {broker.tehsil}
                </p>
              </div>

              {/* Experience */}
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Experience</p>
                <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Award size={12} className="text-stone-400" />
                  {broker.experienceYears} Years Active
                </p>
              </div>

              {/* Referral */}
              {broker.referredBy && (
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Referred By</p>
                  <p className="font-semibold text-stone-800">
                    {broker.referredBy}
                  </p>
                </div>
              )}

              {/* Joined Date */}
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Partner Since</p>
                <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Calendar size={12} className="text-stone-400" />
                  {broker.createdAt 
                    ? new Date(broker.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) 
                    : '-'}
                </p>
              </div>

              {/* Google Location Link */}
              {broker.googleLocationUrl && (
                <div className="pt-2">
                  <a 
                    href={broker.googleLocationUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full h-8 border border-stone-200 hover:border-blue-650/40 hover:bg-stone-50 text-stone-700 font-semibold px-4 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <MapPin size={11} className="text-red-500" />
                    Office Location Map
                    <ExternalLink size={10} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Stack of Notes & Gallery */}
        <div className="flex-1 w-full space-y-6">
          {/* Description Card */}
          {broker.description && (
            <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm space-y-2.5 w-full">
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Internal Broker Notes</p>
              <p className="text-xs text-stone-750 font-sans italic leading-relaxed">
                &ldquo;{broker.description}&rdquo;
              </p>
            </div>
          )}

          {/* Images Card */}
          {broker.images && broker.images.length > 0 && (
            <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm space-y-3 w-full">
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Broker Gallery</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {broker.images.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden relative border border-stone-150 cursor-pointer bg-stone-50 hover:opacity-90 transition-opacity"
                  >
                    <Image
                      src={img.imageUrl}
                      alt={`Broker gallery image ${i + 1}`}
                      fill
                      sizes="33vw"
                      className="object-cover"
                      onClick={() => setSelectedEnlargedImage(img.imageUrl)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Managed Land Listings - Full Width Row */}
      <div className="w-full space-y-6">
        <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between gap-4 bg-stone-50/20">
              <div>
                <h2 className="text-sm font-sans font-bold text-stone-900 leading-tight">
                  Managed Land Listings
                </h2>
                <p className="text-[10px] text-stone-405 font-bold uppercase tracking-wider mt-0.5">
                  Confidential register of inventory associated with this broker
                </p>
              </div>
              <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-150 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                {lands.length} {lands.length === 1 ? 'Listing' : 'Listings'}
              </span>
            </div>

            {lands.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                <div className="w-12 h-12 bg-stone-50 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 mb-4 mx-auto">
                  <Map size={18} />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">No lands linked</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                  There are no land listings assigned to this broker. Go to Lands and link properties to associate them with this broker.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/50">
                      <th className="p-4 pl-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">Land Title</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">District</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Village</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Price</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-center">Area</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</th>
                      <th className="p-4 pr-6 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-sans text-xs">
                    {lands.map((land) => (
                      <tr key={land.id} className="hover:bg-stone-50/50 transition-colors group">
                        {/* Title */}
                        <td className="p-4 pl-6 font-semibold text-stone-900 group-hover:text-blue-650 max-w-[200px] truncate">
                          <Link href={`/admin/lands/${land.id}/edit`}>
                            {land.title}
                          </Link>
                        </td>

                        {/* District */}
                        <td className="p-4 text-stone-605 font-bold uppercase tracking-wide text-[10px]">
                          {land.district}
                        </td>

                        {/* Village */}
                        <td className="p-4 text-stone-600">
                          {land.village}
                        </td>

                        {/* Price */}
                        <td className="p-4 text-right font-extrabold text-stone-900 whitespace-nowrap">
                          ₹{formatPrice(land.listedPrice)}
                        </td>

                        {/* Area */}
                        <td className="p-4 text-center font-bold text-stone-705">
                          {land.area} Acres
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                            land.isPublic 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : "bg-stone-50 text-stone-500 border-stone-200"
                          }`}>
                            {land.isPublic ? 'Public' : 'Private'}
                          </span>
                        </td>

                        {/* Edit Button */}
                        <td className="p-4 pr-6 text-right">
                          <Link href={`/admin/lands/${land.id}/edit`}>
                            <button
                              title="Edit Land Listing"
                              className="px-3 py-1.5 border border-stone-200 hover:border-blue-655/40 hover:bg-stone-50 text-[10px] font-bold uppercase tracking-wider text-stone-700 rounded-full transition-all"
                            >
                              Edit Land
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      {/* Lightbox Enlarged View Modal */}
      {selectedEnlargedImage && (
        <div
          className="fixed inset-0 bg-black/75 z-[9999] flex items-center justify-center animate-in fade-in duration-200 backdrop-blur-xs"
          onClick={() => setSelectedEnlargedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] p-4 flex items-center justify-center">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedEnlargedImage(null)}
              className="absolute -top-10 right-2 p-2 bg-stone-900/80 text-white rounded-full hover:bg-stone-950 hover:scale-105 transition-all z-[10000] cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <Image
                src={selectedEnlargedImage as string}
                alt="Enlarged view"
                width={800}
                height={600}
                className="object-contain rounded-lg max-h-[80vh] w-auto max-w-full shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
