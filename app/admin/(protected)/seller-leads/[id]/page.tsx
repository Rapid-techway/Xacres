

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Phone, MapPin, Calendar, Loader2, Save, Upload, Trash2, ExternalLink, Image as ImageIcon, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sellerService } from "@/services/seller-lead.service"
import { landService } from "@/services/land.service"
import { SellerLead, SellerLeadImage } from "@/lib/types"
import Image from "next/image"

export default function SellerDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()

  const [lead, setLead] = useState<SellerLead | null>(null)
  const [images, setImages] = useState<SellerLeadImage[]>([])
  const [loading, setLoading] = useState(true)
  const [savingNotes, setSavingNotes] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notesText, setNotesText] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true)
      const res = await sellerService.getSellerLeadById(id)
      setLead(res)
      setNotesText(res.adminNotes || "")
      setImages(res.images || [])
    } catch (error) {
      console.error("Error fetching seller details:", error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchDetails()
    }
  }, [id, fetchDetails])

  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true)
      await sellerService.updateSellerLeadAdminNotes(id, notesText)
      alert("CRM notes updated successfully.")
    } catch (err) {
      console.error("Failed to update CRM notes:", err)
      alert("Failed to save notes. Please try again.")
    } finally {
      setSavingNotes(false)
    }
  }

  const handleFileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const file = files[0]
      // 1. Upload to Cloudflare R2 inside 'seller-leads' subfolder
      const uploadRes = await landService.uploadFile(file, 'seller-leads')

      // 2. Link image to seller lead in database
      const newImg = await sellerService.addSellerLeadImage(id, uploadRes.url)

      // 3. Update state
      setImages(prev => [...prev, newImg])
    } catch (err) {
      console.error("Image upload failed:", err)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return
    try {
      await sellerService.deleteSellerLeadImage(imageId)
      setImages(prev => prev.filter(img => img.id !== imageId))
    } catch (err) {
      console.error("Failed to delete image:", err)
      alert("Failed to delete image. Please try again.")
    }
  }

  const handleDeleteLead = async () => {
    if (!confirm("Are you sure you want to permanently delete this seller lead?")) return
    try {
      await sellerService.deleteSellerLead(id)
      router.push("/admin/seller-leads")
    } catch (err) {
      console.error("Failed to delete seller lead:", err)
      alert("Failed to delete lead. Please try again.")
    }
  }

  // Get Initials for Avatar
  const getInitials = (name: string) => {
    if (!name) return "S"
    return name.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Loading seller details...</p>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">Seller lead not found</h1>
        <p className="text-stone-505 text-sm">The lead profile you are trying to view does not exist or has been removed.</p>
        <Link href="/admin/seller-leads" className="inline-block bg-stone-900 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-wider">
          Back to Seller Leads
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
            <Link href="/admin/seller-leads" className="hover:text-blue-650 transition-colors">Seller Leads</Link>
            <span className="mx-1.5 opacity-50 text-stone-400">/</span>
            <span className="text-stone-850 font-semibold">{lead.name}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-sans font-bold tracking-tight text-stone-900 leading-none">
              {lead.name}
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-2 font-medium tracking-[0.15px] font-mono">
            Lead ID: {lead.id}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/seller-leads">
            <button className="bg-white hover:bg-stone-50 text-stone-700 font-semibold border border-stone-200 px-4.5 py-2 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm h-9 hover:border-blue-655/40">
              <ArrowLeft size={13} />
              All Seller Leads
            </button>
          </Link>
          <Link href={`/admin/seller-leads/${lead.id}/edit`}>
            <Button className="bg-[#292524] hover:bg-[#0c0a09] border border-[#292524] hover:border-blue-650/30 text-white font-semibold shadow-sm rounded-full px-5 py-2 h-9 text-xs uppercase tracking-widest gap-1.5 transition-all">
              <Edit3 size={13} />
              Edit Lead
            </Button>
          </Link>
          <Button
            onClick={handleDeleteLead}
            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 font-semibold shadow-sm rounded-full px-5 py-2 h-9 text-xs uppercase tracking-widest gap-1.5 transition-all"
          >
            <Trash2 size={13} />
            Delete Lead
          </Button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

        {/* Left Column - Seller Profile & Notes (6 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm space-y-6">
            {/* Avatar & Basic */}
            <div className="flex flex-col items-center text-center pb-5 border-b border-stone-100">
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100/60 text-blue-750 font-black text-xl flex items-center justify-center shadow-sm mb-3">
                {getInitials(lead.name)}
              </div>
              <h3 className="font-bold text-stone-900 text-base">{lead.name}</h3>
              <p className="font-semibold text-stone-500 text-xs mt-1">Submitted Land Details</p>
            </div>

            {/* Details Fields */}
            <div className="space-y-4 text-xs">
              {/* Phone */}
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Mobile Contact</p>
                <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Phone size={12} className="text-stone-400" />
                  <a href={`tel:${lead.phoneNumber}`} className="hover:text-blue-650 transition">{lead.phoneNumber}</a>
                </p>
              </div>

              {/* Territory */}
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">District</p>
                <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <MapPin size={12} className="text-stone-450" />
                  {lead.district}
                </p>
              </div>

              {/* Location Detail */}
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Location Name (Village/Sector/etc)</p>
                <p className="font-semibold text-stone-800">
                  {lead.locationName}
                </p>
              </div>

              {/* Created Date */}
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Received Date</p>
                <p className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Calendar size={12} className="text-stone-400" />
                  {lead.createdAt
                    ? new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '-'}
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Seller notes / descriptions</p>
                <p className="text-stone-700 italic bg-stone-50 border border-stone-150 p-3.5 rounded-xl leading-relaxed whitespace-pre-line">
                  {lead.notes ? `"${lead.notes}"` : "No description provided by the seller."}
                </p>
              </div>
            </div>
          </div>

          {/* CRM Internal Notes Card */}
          <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Internal CRM Notes</h3>
              <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider mt-0.5">
                Only visible to the Xacres Admin Team
              </p>
            </div>

            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Add call records, lead qualification state, pricing discussion, verification log..."
              rows={5}
              className="w-full p-4 bg-stone-50/50 border border-stone-200 hover:border-stone-300 focus:bg-white rounded-xl text-xs font-semibold transition-all outline-none resize-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-650"
            />

            <div className="flex justify-end">
              <Button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="bg-[#292524] hover:bg-[#0c0a09] border border-[#292524] text-white font-semibold text-xs uppercase tracking-widest rounded-full h-9 px-5 gap-1.5 transition shadow-sm"
              >
                {savingNotes ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    Save CRM Notes
                  </>
                )}
              </Button>
            </div>
          </div>

        </div>

        {/* Right Column - Attached Images Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm flex flex-col min-h-[400px] justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-sm font-sans font-bold text-stone-900 leading-tight">
                    Attached Property Images
                  </h2>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-0.5">
                    Images uploaded by administrative staff
                  </p>
                </div>
                <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-150 text-blue-700 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                  {images.length} {images.length === 1 ? 'Image' : 'Images'}
                </span>
              </div>

              {/* Upload area */}
              <div className="pt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                />
                <button
                  type="button"
                  onClick={handleFileUploadClick}
                  disabled={uploading}
                  className="w-full py-8 border-2 border-dashed border-stone-200 hover:border-blue-650/45 rounded-2xl flex flex-col items-center justify-center gap-3 transition group cursor-pointer"
                >
                  <div className="p-3 bg-stone-50 border border-stone-200 group-hover:border-blue-100 group-hover:bg-blue-50 text-stone-405 group-hover:text-blue-600 rounded-xl transition shadow-sm">
                    {uploading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Upload size={20} />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-stone-800">
                      {uploading ? "Uploading file to R2..." : "Upload New Image"}
                    </p>
                    <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider mt-0.5">
                      R2 bucket folder: seller-leads/
                    </p>
                  </div>
                </button>
              </div>

              {/* Images Grid */}
              {images.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-stone-50 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 mx-auto">
                    <ImageIcon size={18} />
                  </div>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">No images attached</p>
                  <p className="text-[11px] text-stone-450 font-medium max-w-[240px] mx-auto leading-relaxed">
                    Upload land documents or property photos to link them with this seller lead.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-video bg-stone-50 border border-stone-150 rounded-xl overflow-hidden shadow-sm hover:shadow transition"
                    >
                      <Image
                        src={img.imageUrl}
                        alt="Property Document"
                        fill
                        className="object-cover select-none"
                      />
                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition duration-150">
                        <a
                          href={img.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 flex items-center justify-center transition shadow-md"
                          title="Open full size"
                        >
                          <ExternalLink size={13} />
                        </a>
                        <button
                          onClick={() => handleDeleteImage(img.id!)}
                          className="w-8 h-8 rounded-full bg-red-650/90 hover:bg-red-600 text-white flex items-center justify-center transition shadow-md border-none cursor-pointer"
                          title="Delete image"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
