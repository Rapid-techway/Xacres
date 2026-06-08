"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"
import {
  Trash2,
  FileImage,
  MapPin,
  Rocket,
  Plus,
  FileText,
  Map as MapIcon,
  Loader2,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Globe,
  Lock,
  Eye,
  ArrowLeft,
  Info,
  Phone,
  ChevronRight
} from "lucide-react"
import { landService } from "@/services/land.service"
import { CreateFullLandPayload, LandImage, Centroid, GeoJsonFeatureCollection, FlattenedLand } from "@/lib/types"
import DistrictDropdown from "./DistrictDropdown"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"

// Dynamically import PolygonMap to avoid SSR issues with Leaflet
const PolygonMap = dynamic(() => import("@/components/map/PolygonMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-50 animate-pulse rounded-[24px] flex items-center justify-center text-slate-400 font-semibold text-sm">Loading Interactive Map...</div>
})

interface LandFormProps {
  initialData?: FlattenedLand | null
}

interface FullFormData {
  title: string;
  slug: string;
  price: number;
  area: number;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  type: string;
  roadAccess: boolean;
  images: LandImage[];
  description: string;
  isPublic: boolean;
  polygon: Record<string, unknown> | null;
  ownerName: string;
  ownerPhone: string;
  expectedPrice: number;
  minimumPrice: number;
  negotiable: boolean;
  adminNotes: string;
}

export default function LandForm({ initialData = null }: LandFormProps) {
  const router = useRouter()
  const isEdit = !!initialData
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState(false)

  // Mobile Accordion state toggles
  const [sectionsExpanded, setSectionsExpanded] = useState({
    publicInfo: true,
    location: true,
    map: true,
    media: true,
    desc: true,
    adminOnly: true
  })

  // Controlled form state matching schema
  const [formData, setFormData] = useState<FullFormData>({
    // Public Land Table
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    price: initialData?.price || 0,
    area: initialData?.area || 0,
    district: initialData?.district || "",
    village: initialData?.village || "",
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    type: initialData?.type || "Agricultural",
    roadAccess: initialData?.roadAccess ?? true,
    images: (initialData?.images?.map((img: string | LandImage) => {
      if (typeof img === 'string') return { url: img, isPrimary: false };
      return { url: img.url || "", isPrimary: !!img.isPrimary };
    }) || []) as LandImage[],
    description: initialData?.description || "",
    isPublic: initialData?.isPublic ?? true,
    polygon: initialData?.polygon || null,

    // Private Admin Table
    ownerName: initialData?.ownerName || "",
    ownerPhone: initialData?.ownerPhone || "",
    expectedPrice: initialData?.expectedPrice || initialData?.price || 0,
    minimumPrice: initialData?.minimumPrice || ((initialData?.price || 0) * 0.9),
    negotiable: initialData?.negotiable ?? true,
    adminNotes: initialData?.adminNotes || ""
  })

  const [isDragging, setIsDragging] = useState(false)

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  const handleTitleChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: generateSlug(val) // Sync slug with title
    }))
  }

  const handleChange = (field: keyof FullFormData, value: string | number | boolean | LandImage[] | Record<string, unknown> | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const uploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: LandImage[] = [...formData.images];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedFile = await landService.uploadFile(file);
        const imageUrl = await landService.getFileView(uploadedFile.$id);

        // If it's the first image ever, make it primary
        const isPrimary = newImages.length === 0;

        newImages.push({
          url: imageUrl,
          isPrimary
        });
      }
      setFormData(prev => ({ ...prev, images: newImages }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      uploadFiles(files);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    uploadFiles(files);
  };

  const togglePrimary = (index: number) => {
    const updatedImages = formData.images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    // If we removed the primary image, make the first one primary
    if (formData.images[index].isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  const copyListingId = () => {
    const id = initialData?.id || initialData?.$id || "draft-listing-id"
    navigator.clipboard.writeText(id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.title.trim()) {
      alert("Land Title is required.");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      alert("Listing Price must be greater than 0.");
      return;
    }
    if (!formData.area || formData.area <= 0) {
      alert("Total Area must be greater than 0.");
      return;
    }
    if (!formData.district.trim()) {
      alert("Haryana District is required.");
      return;
    }
    if (!formData.village.trim()) {
      alert("Village / Locality is required.");
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      alert("Centroid Latitude and Longitude are required. Please draw boundaries or set points on the map.");
      return;
    }
    if (!formData.ownerName.trim()) {
      alert("Owner Full Name is required.");
      return;
    }
    if (!formData.ownerPhone.trim()) {
      alert("Owner Contact Phone is required.");
      return;
    }
    if (!formData.images || formData.images.length === 0) {
      alert("At least one property image must be uploaded.");
      return;
    }

    setLoading(true)

    try {
      const payload: CreateFullLandPayload = {
        land: {
          title: formData.title,
          slug: formData.slug,
          price: formData.price,
          area: formData.area,
          district: formData.district,
          village: formData.village,
          latitude: formData.latitude,
          longitude: formData.longitude,
          type: formData.type,
          roadAccess: formData.roadAccess,
          images: formData.images,
          description: formData.description,
          isPublic: formData.isPublic,
        },
        admin: {
          ownerName: formData.ownerName,
          ownerPhone: formData.ownerPhone,
          expectedPrice: formData.expectedPrice,
          minimumPrice: formData.minimumPrice,
          negotiable: formData.negotiable,
          adminNotes: formData.adminNotes,
        },
        polygon: formData.polygon
      }

      if (isEdit && (initialData?.$id || initialData?.id)) {
        await landService.updateFullLand((initialData?.$id || initialData?.id) as string, payload)
      } else {
        await landService.createFullLand(payload)
      }
      router.push("/admin/lands")
    } catch (error) {
      console.error("Failed to save land:", error)
      alert("Error saving land. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (sectionKey: keyof typeof sectionsExpanded) => {
    setSectionsExpanded(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  return (
    <TooltipProvider>
      <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 w-full">

        {/* BREADCRUMB HEADER (Replicating exact desktop header matching image mockup) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex items-center text-sm font-medium text-slate-500 mb-2">
              <Link href="/admin/lands" className="hover:text-blue-650 transition-colors">Lands</Link>
              <ChevronRight size={14} className="mx-1.5 opacity-55" />
              <span className="text-slate-900">{isEdit ? "Edit Land Listing" : "Add New Listing"}</span>
            </nav>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
              {isEdit ? "Edit Land Listing" : "Create Land Listing"}
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">
              Manage property details, location, pricing and admin information.
            </p>
          </div>

          {/* Header Action Buttons (hidden on mobile, matches top right header buttons in mockup) */}
          <div className="hidden md:flex items-center gap-3">
            {isEdit && (
              <Link
                href={`/lands/${formData.slug}`}
                target="_blank"
                className="bg-white hover:bg-slate-50 text-slate-700 font-extrabold border border-slate-200 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm h-10"
              >
                <Eye size={14} />
                Preview Listing
              </Link>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 font-extrabold text-white shadow-md shadow-emerald-500/10 rounded-xl px-6 py-2.5 h-10 text-xs uppercase tracking-wider gap-2 transition-all active:scale-[0.97]"
            >
              {loading ? "Saving..." : "Save & Update"}
              {!loading && <Check size={14} strokeWidth={2.5} />}
            </Button>
          </div>
        </div>

        {/* STATUS BAR (matches image status block) */}
        <div className="bg-white border border-slate-200/60 rounded-[20px] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm w-full">
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${formData.isPublic ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse' : 'bg-slate-300'}`}></span>
            <span className="text-xs font-semibold text-slate-650 flex items-center gap-2">
              Listing Status:
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${formData.isPublic
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-slate-150 text-slate-600 border border-slate-200'
                }`}>
                {formData.isPublic ? 'Listed Publicly' : 'Hidden Draft'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span>LISTING ID:</span>
            <span className="font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100/50">
              {initialData?.id || initialData?.$id || 'draft-uuid-key'}
            </span>
            <button
              type="button"
              onClick={copyListingId}
              className="text-slate-400 hover:text-emerald-600 hover:scale-105 transition active:scale-95"
              title="Copy Listing ID"
            >
              {copiedId ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            </button>
          </div>
        </div>

        {/* TWO-COLUMN GRID: Public Information & Location Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">

          {/* Box 1: Public Listing Information */}
          <div className="bg-white rounded-[24px] border border-slate-200/60 p-6 md:p-8 shadow-sm hover:shadow-md/20 transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Header with Accordion Toggle for Mobile */}
              <div
                className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 cursor-pointer lg:cursor-default select-none"
                onClick={() => toggleSection('publicInfo')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50/50 text-emerald-600 flex items-center justify-center border border-emerald-100/30 shadow-sm shrink-0">
                    <Globe size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">PUBLIC LISTING INFORMATION</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Visible to all prospective buyers</p>
                  </div>
                </div>
                <button type="button" className="lg:hidden text-slate-400 hover:text-slate-600 transition">
                  {sectionsExpanded.publicInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Collapsible Content */}
              <div className={`space-y-6 ${sectionsExpanded.publicInfo ? 'block' : 'hidden lg:block'}`}>

                {/* Land Title and Slug Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Land Title */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Land Title <span className="text-red-500 font-extrabold">*</span></Label>
                    <Input
                      placeholder="e.g. 5 Acre Highway Touch Commercial Land"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="h-11 px-4 bg-slate-50/40 border border-slate-200 rounded-xl hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all font-semibold text-slate-900 text-sm placeholder:text-slate-400/60 placeholder:font-normal"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Slug (Reference Key)</Label>
                    <Input
                      placeholder="e.g. 5-acre-highway-touch-commercial-land"
                      value={formData.slug}
                      disabled={isEdit}
                      onChange={(e) => handleChange("slug", generateSlug(e.target.value))}
                      className={`h-11 px-4 border rounded-xl transition-all font-mono text-xs ${isEdit
                        ? "bg-slate-100 text-slate-450 border-slate-200 cursor-not-allowed border-dashed"
                        : "bg-slate-50/40 border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 placeholder:text-slate-400/60 placeholder:font-normal"
                        }`}
                    />
                  </div>
                </div>

                {/* Grid: Price and Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Listing Price (INR) <span className="text-red-500 font-extrabold">*</span></Label>
                    <div className="relative group">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g. 2.5"
                        value={formData.price ? formData.price / 10000000 : ""}
                        onChange={(e) => handleChange("price", (parseFloat(e.target.value) || 0) * 10000000)}
                        className="h-11 pl-7 pr-14 bg-slate-50/40 border border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all font-extrabold text-sm text-slate-950 placeholder:text-slate-400/60 placeholder:font-normal"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Crore</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Total Area (Acre) <span className="text-red-500 font-extrabold">*</span></Label>
                    <div className="relative group">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 5.5"
                        value={formData.area || ""}
                        onChange={(e) => handleChange("area", parseFloat(e.target.value) || 0)}
                        className="h-11 pl-4 pr-14 bg-slate-50/40 border border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all font-bold text-slate-950 text-sm placeholder:text-slate-400/60 placeholder:font-normal"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Acres</span>
                    </div>
                  </div>
                </div>

                {/* Grid: Category and Road Access */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Property Category */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Property Category</Label>
                    <div className="relative">
                      <select
                        value={formData.type}
                        onChange={(e) => handleChange("type", e.target.value)}
                        className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/40 hover:border-slate-300 px-4 text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option>Agricultural</option>
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Farming</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={14} className="opacity-70" />
                      </div>
                    </div>
                  </div>

                  {/* Road Access toggle wrapper aligned to Category */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Primary Road Access</Label>
                    <div
                      className="flex items-center justify-between h-11 px-4 bg-slate-50/40 border border-slate-200 hover:border-slate-300 hover:bg-white focus-within:ring-2 focus-within:ring-emerald-500/10 rounded-xl transition-all cursor-pointer select-none"
                      onClick={() => handleChange("roadAccess", !formData.roadAccess)}
                    >
                      <span className="text-xs font-semibold text-slate-700">Direct Road Access</span>
                      <div className={`w-8.5 h-4.5 rounded-full relative p-0.5 transition-colors duration-200 shrink-0 ${formData.roadAccess ? 'bg-emerald-600' : 'bg-slate-200'}`}>
                        <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${formData.roadAccess ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Box 2: Location Details */}
          <div className="bg-white rounded-[24px] border border-slate-200/60 p-6 md:p-8 shadow-sm hover:shadow-md/20 transition-all duration-300 flex flex-col justify-between">
            <div className="flex-1">
              {/* Header with Accordion Toggle for Mobile */}
              <div
                className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 cursor-pointer lg:cursor-default select-none"
                onClick={() => toggleSection('location')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50/50 text-emerald-600 flex items-center justify-center border border-emerald-100/30 shadow-sm shrink-0">
                    <MapPin size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">LOCATION DETAILS</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Location information visible publicly</p>
                  </div>
                </div>
                <button type="button" className="lg:hidden text-slate-400 hover:text-slate-600 transition">
                  {sectionsExpanded.location ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Collapsible Content */}
              <div className={`space-y-5 ${sectionsExpanded.location ? 'block' : 'hidden lg:block'}`}>
                {/* District */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Haryana District <span className="text-red-500 font-extrabold">*</span></Label>
                  <DistrictDropdown
                    value={formData.district}
                    onChange={(val) => handleChange("district", val)}
                  />
                </div>

                {/* Village */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Village / Locality <span className="text-red-500 font-extrabold">*</span></Label>
                  <Input
                    placeholder="e.g. Sampla / Khanda Kheri"
                    value={formData.village}
                    onChange={(e) => handleChange("village", e.target.value)}
                    className="h-11 px-4 bg-slate-50/40 border border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all font-semibold text-slate-900 text-sm placeholder:text-slate-400/60 placeholder:font-normal"
                  />
                </div>
              </div>
            </div>

            {/* Landscape graphic callout box (matches reference image exactly) */}
            <div className={`mt-6 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/20 flex gap-4.5 relative overflow-hidden ${sectionsExpanded.location ? 'flex' : 'hidden lg:flex'} h-[88px] items-center`}>
              <div className="w-9 h-9 rounded-xl bg-white text-emerald-600 border border-emerald-100/60 shadow-sm flex items-center justify-center shrink-0 z-10">
                <MapIcon size={16} />
              </div>
              <div className="space-y-0.5 z-10">
                <p className="text-xs font-extrabold text-emerald-800 leading-tight">Accurate location details</p>
                <p className="text-[10px] text-emerald-600 font-semibold leading-relaxed max-w-[240px]">Help buyers discover your property easily and improve search relevance.</p>
              </div>
              {/* Premium Inline SVG Illustrating Grass, Hills, and a Small House */}
              <div className="absolute right-0 bottom-0 top-0 w-[140px] hidden sm:block pointer-events-none opacity-90 select-none">
                <svg viewBox="0 0 140 88" fill="none" className="w-full h-full object-cover">
                  <path d="M-10 88 C 30 50, 60 70, 150 45 L 150 88 Z" fill="#ecfdf5" />
                  <path d="M20 88 C 70 40, 95 62, 150 35 L 150 88 Z" fill="#d1fae5" />
                  <path d="M60 88 C 90 30, 110 52, 150 25 L 150 88 Z" fill="#a7f3d0" />
                  {/* tiny house */}
                  <rect x="112" y="18" width="12" height="10" fill="#f4f4f5" rx="0.5" />
                  <polygon points="109,18 127,18 118,10" fill="#f43f5e" />
                  <rect x="116.5" y="22" width="3" height="6" fill="#71717a" />
                  {/* tiny sun */}
                  <circle cx="20" cy="20" r="6" fill="#fef08a" />
                  <circle cx="20" cy="20" r="4.2" fill="#fde047" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* FULL WIDTH: Map Boundaries & Centroid */}
        <div className="bg-white rounded-[24px] border border-slate-200/60 p-6 md:p-8 shadow-sm hover:shadow-md/20 transition-all duration-300 space-y-6 w-full animate-in fade-in duration-300">
          {/* Header with Accordion Toggle for Mobile */}
          <div
            className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 cursor-pointer lg:cursor-default select-none"
            onClick={() => toggleSection('map')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/30 shadow-sm shrink-0">
                <MapIcon size={18} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">MAP BOUNDARIES & CENTROID</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Draw the property boundary on the map</p>
              </div>
            </div>
            <button type="button" className="lg:hidden text-slate-400 hover:text-slate-600 transition">
              {sectionsExpanded.map ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Collapsible Content */}
          <div className={`grid grid-cols-1 lg:grid-cols-10 gap-6 ${sectionsExpanded.map ? 'grid' : 'hidden lg:grid'}`}>

            {/* Map Canvas */}
            <div className="lg:col-span-7 h-[360px] md:h-[400px] w-full overflow-hidden rounded-[20px] border border-slate-200/80 shadow-inner relative">
              <PolygonMap
                initialPolygon={formData.polygon as GeoJsonFeatureCollection | null}
                onPolygonComplete={(poly: GeoJsonFeatureCollection | null, centroid: Centroid) => {
                  setFormData(prev => ({
                    ...prev,
                    polygon: poly as Record<string, unknown> | null,
                    latitude: centroid.lat,
                    longitude: centroid.lng
                  }))
                }}
              />
            </div>

            {/* Map inputs / Centroid details on the right */}
            <div className="lg:col-span-3 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Latitude (Centroid) <span className="text-red-500 font-extrabold">*</span></Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="28.70515975"
                    value={formData.latitude || ""}
                    onChange={(e) => handleChange("latitude", parseFloat(e.target.value) || 0)}
                    className="h-11 px-4 bg-slate-50/40 border border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all font-mono text-xs text-slate-700 font-semibold animate-in fade-in placeholder:text-slate-400/60 placeholder:font-normal"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Longitude (Centroid) <span className="text-red-500 font-extrabold">*</span></Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="76.08435125"
                    value={formData.longitude || ""}
                    onChange={(e) => handleChange("longitude", parseFloat(e.target.value) || 0)}
                    className="h-11 px-4 bg-slate-50/40 border border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all font-mono text-xs text-slate-700 font-semibold animate-in fade-in placeholder:text-slate-400/60 placeholder:font-normal"
                  />
                </div>
              </div>

              {/* Tip box */}
              <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100/20 flex gap-3.5">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider block">Centroid Placement</span>
                  <p className="text-[10px] text-blue-600 font-semibold leading-relaxed">
                    Use centroid coordinates for precise search query matches and map camera positioning.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* TWO-COLUMN GRID: Visual Assets & Public Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">

          {/* Column 1: Visual Assets */}
          <div className="bg-white rounded-[24px] border border-slate-200/60 p-6 md:p-8 shadow-sm hover:shadow-md/20 transition-all duration-300 space-y-6">
            {/* Header with Accordion Toggle for Mobile */}
            <div
              className="flex items-center justify-between border-b border-slate-100 pb-4 cursor-pointer lg:cursor-default select-none"
              onClick={() => toggleSection('media')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100/30 shadow-sm shrink-0">
                  <FileImage size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">VISUAL ASSETS <span className="text-red-500 font-extrabold">*</span></h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Upload property images</p>
                </div>
              </div>
              <button type="button" className="lg:hidden text-slate-400 hover:text-slate-600 transition">
                {sectionsExpanded.media ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Collapsible Content */}
            <div className={`space-y-5 ${sectionsExpanded.media ? 'block' : 'hidden lg:block'}`}>
              <div
                className={`aspect-[2.8/1] w-full rounded-[20px] border-2 border-dashed flex flex-col items-center justify-center group transition-all duration-205 cursor-pointer overflow-hidden ${isDragging
                  ? 'border-emerald-500 bg-emerald-50/10'
                  : 'border-slate-200 bg-slate-50/30 hover:bg-white hover:border-emerald-500/60'
                  }`}
                onClick={() => !uploading && (document.getElementById('fileUpload') as HTMLInputElement)?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">Uploading files...</p>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mx-auto text-slate-500 group-hover:scale-105 group-hover:text-emerald-600 transition-all mb-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <p className="font-extrabold text-slate-800 text-xs">Drag & drop images here</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">or click to browse. JPG, PNG, WEBP</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />

              {/* Image list */}
              <div className="grid grid-cols-3 gap-3">
                {formData.images.map((img, i) => (
                  <div key={i} className={`aspect-square rounded-[16px] overflow-hidden group relative border transition-all ${img.isPrimary ? 'border-emerald-600 ring-2 ring-emerald-500/10 shadow-sm' : 'border-slate-150'}`}>
                    <Image
                      src={img.url}
                      alt="Listing photo thumbnail"
                      fill
                      unoptimized
                      sizes="33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Delete action overlay */}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-black/50 hover:bg-red-600 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <Trash2 size={11} strokeWidth={2.5} />
                    </button>

                    {/* Primary toggle */}
                    <button
                      type="button"
                      onClick={() => togglePrimary(i)}
                      className={`absolute bottom-1.5 left-1.5 right-1.5 py-1 rounded-md text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all z-10 ${img.isPrimary
                        ? 'bg-emerald-600 text-white opacity-100 shadow-sm shadow-emerald-600/20'
                        : 'bg-white/90 backdrop-blur-md text-slate-900 opacity-0 group-hover:opacity-100 hover:bg-white'
                        }`}
                    >
                      {img.isPrimary ? (
                        <>
                          <CheckCircle2 size={9} />
                          Primary
                        </>
                      ) : (
                        <>
                          <Circle size={9} />
                          Set Primary
                        </>
                      )}
                    </button>
                  </div>
                ))}

                {/* Plus add box */}
                <button
                  type="button"
                  disabled={uploading}
                  className="aspect-square rounded-[16px] border border-dashed border-slate-350 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-500/60 transition-all bg-slate-50/30 hover:bg-white cursor-pointer"
                  onClick={() => (document.getElementById('fileUpload') as HTMLInputElement)?.click()}
                >
                  <Plus size={18} strokeWidth={2.5} />
                  <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Add More</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Public Description */}
          <div className="bg-white rounded-[24px] border border-slate-200/60 p-6 md:p-8 shadow-sm hover:shadow-md/20 transition-all duration-300 space-y-6">
            {/* Header with Accordion Toggle for Mobile */}
            <div
              className="flex items-center justify-between border-b border-slate-100 pb-4 cursor-pointer lg:cursor-default select-none"
              onClick={() => toggleSection('desc')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200/50 shadow-sm shrink-0">
                  <FileText size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">PUBLIC DESCRIPTION</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Visible to all prospective buyers</p>
                </div>
              </div>
              <button type="button" className="lg:hidden text-slate-400 hover:text-slate-600 transition">
                {sectionsExpanded.desc ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Collapsible Content */}
            <div className={`space-y-4 ${sectionsExpanded.desc ? 'block' : 'hidden lg:block'}`}>
              <Textarea
                placeholder="Describe the property: soil type, road width, nearby landmarks, water/electricity access, and suitable purposes..."
                value={formData.description}
                maxLength={2000}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("description", e.target.value)}
                className="min-h-[140px] rounded-xl bg-slate-50/40 border border-slate-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all p-4 text-xs font-semibold leading-relaxed text-slate-800 placeholder:text-slate-400/60 placeholder:font-normal"
              />
              <div className="text-right text-[10px] text-slate-400 font-bold tracking-wider">
                {formData.description.length} / 2000 CHARACTERS
              </div>
            </div>
          </div>

        </div>        {/* FULL WIDTH: Admin Only Section */}
        <div className="bg-white rounded-[24px] border border-purple-100/70 shadow-sm overflow-hidden w-full hover:shadow-md/20 transition-all duration-300">

          {/* Section Header with Accordion Toggle */}
          <div
            className="bg-purple-50/50 border-b border-purple-100/60 px-6 py-4 flex items-center justify-between cursor-pointer lg:cursor-default select-none"
            onClick={() => toggleSection('adminOnly')}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center border border-purple-200/50 shadow-sm shrink-0">
                <Lock size={16} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-xs font-black text-purple-950 uppercase tracking-widest leading-none">ADMIN ONLY SECTION</h4>
                <p className="text-[10px] text-purple-600/80 font-bold mt-1 uppercase tracking-wider">This information is only visible to admin users</p>
              </div>
            </div>
            <button type="button" className="lg:hidden text-purple-400 hover:text-purple-600 transition">
              {sectionsExpanded.adminOnly ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Collapsible Content */}
          <div className={`p-6 md:p-8 space-y-8 ${sectionsExpanded.adminOnly ? 'block' : 'hidden lg:block'}`}>

            {/* 3-Column Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Box A: Pricing & Negotiation */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <span className="w-1 h-3.5 bg-purple-500 rounded-full"></span>
                  <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Pricing & Negotiation</h5>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Expected Price (INR)</Label>
                    <div className="relative group">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g. 2.7"
                        value={formData.expectedPrice ? formData.expectedPrice / 10000000 : ""}
                        onChange={(e) => handleChange("expectedPrice", (parseFloat(e.target.value) || 0) * 10000000)}
                        className="h-11 pl-7 pr-14 bg-slate-50/40 border border-slate-200 hover:border-slate-350 focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-500/10 transition-all font-extrabold text-xs text-slate-900 placeholder:text-slate-400/60 placeholder:font-normal"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Crore</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Minimum Price (INR)</Label>
                    <div className="relative group">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">₹</span>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g. 2.3"
                        value={formData.minimumPrice ? formData.minimumPrice / 10000000 : ""}
                        onChange={(e) => handleChange("minimumPrice", (parseFloat(e.target.value) || 0) * 10000000)}
                        className="h-11 pl-7 pr-14 bg-slate-50/40 border border-slate-200 hover:border-slate-350 focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-500/10 transition-all font-extrabold text-xs text-slate-900 placeholder:text-slate-400/60 placeholder:font-normal"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Crore</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between h-11 px-4 bg-slate-50/40 border border-slate-200 hover:border-slate-300 hover:bg-white focus-within:ring-2 focus-within:ring-purple-500/10 rounded-xl transition-all cursor-pointer select-none" onClick={() => handleChange("negotiable", !formData.negotiable)}>
                    <span className="text-xs font-semibold text-slate-700">Is Price Negotiable?</span>
                    <div className={`w-8.5 h-4.5 rounded-full relative p-0.5 transition-colors duration-200 shrink-0 ${formData.negotiable ? 'bg-purple-600' : 'bg-slate-200'}`}>
                      <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${formData.negotiable ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Box B: Owner Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <span className="w-1 h-3.5 bg-indigo-500 rounded-full"></span>
                  <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Owner Information</h5>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Owner Full Name <span className="text-red-500 font-extrabold">*</span></Label>
                    <Input
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.ownerName}
                      onChange={(e) => handleChange("ownerName", e.target.value)}
                      className="h-11 px-4 bg-slate-50/40 border border-slate-200 hover:border-slate-350 focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-500/10 font-semibold text-slate-900 text-xs rounded-xl placeholder:text-slate-400/60 placeholder:font-normal"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Owner Contact Phone <span className="text-red-500 font-extrabold">*</span></Label>
                    <div className="relative group">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"><Phone size={13} /></span>
                      <Input
                        placeholder="e.g. 9876543210"
                        value={formData.ownerPhone}
                        onChange={(e) => handleChange("ownerPhone", e.target.value)}
                        className="h-11 pl-9 pr-4 bg-slate-50/40 border border-slate-200 hover:border-slate-350 focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-500/10 font-semibold text-slate-900 text-xs rounded-xl placeholder:text-slate-400/60 placeholder:font-normal"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Box C: Admin Notes */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <span className="w-1 h-3.5 bg-purple-500 rounded-full"></span>
                  <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Admin Notes</h5>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Internal Admin Notes</Label>
                  <Textarea
                    placeholder="Internal confidential notes, e.g. registry papers verified, negotiation limits..."
                    value={formData.adminNotes}
                    maxLength={1000}
                    onChange={(e) => handleChange("adminNotes", e.target.value)}
                    className="min-h-[110px] rounded-xl bg-slate-50/40 border border-slate-200 hover:border-slate-350 focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-500/10 transition-all p-3.5 text-xs font-semibold leading-relaxed text-slate-800 placeholder:text-slate-400/60 placeholder:font-normal"
                  />
                  <div className="text-right text-[10px] text-slate-400 font-bold tracking-wider">
                    {formData.adminNotes.length} / 1000 CHARACTERS
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Confidential Banner */}
            <div className="pt-4 border-t border-purple-100/50 flex items-center gap-2 text-[10px] font-bold text-purple-600/85 uppercase tracking-wider">
              <Lock size={12} className="text-purple-600 shrink-0" />
              <span>Confidential: </span>
              <span className="normal-case text-slate-500 font-medium">This information is for internal administrative use only and will not be published.</span>
            </div>

          </div>
        </div>

        {/* FOOTER ACTIONS BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 w-full">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-650 hover:text-slate-900 hover:bg-slate-50 bg-white border border-slate-200/80 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
            onClick={() => router.back()}
          >
            <ArrowLeft size={14} />
            Back to Lands
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Publish / Save & Update Listing */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 font-extrabold text-white shadow-md shadow-emerald-500/10 rounded-xl px-8 py-3 h-11 text-xs uppercase tracking-wider gap-2 transition-all active:scale-[0.97] shrink-0"
            >
              {loading ? "Processing..." : (isEdit ? "Save & Update Listing" : "Publish Listing")}
              {!loading && <Rocket size={14} strokeWidth={2.5} />}
            </Button>
          </div>
        </div>

      </form>
    </TooltipProvider>
  )
}
