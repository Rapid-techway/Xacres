"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"
import { Trash2, FileImage, MapPin, Rocket, Plus, FileText, Map as MapIcon, Loader2, CheckCircle2, Circle, HelpCircle } from "lucide-react"
import { landService } from "@/services/land.service"
import { CreateFullLandPayload, LandImage, Centroid, GeoJsonFeatureCollection, FlattenedLand } from "@/lib/types"
import DistrictDropdown from "./DistrictDropdown"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Dynamically import PolygonMap to avoid SSR issues with Leaflet
const PolygonMap = dynamic(() => import("@/components/map/PolygonMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-50 animate-pulse rounded-[28px] flex items-center justify-center text-gray-400">Loading Map...</div>
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

  // Controlled form state exactly mapping to schema
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
      slug: generateSlug(val) // Always sync slug with title for now, or add check
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
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

  return (
    <TooltipProvider>
      <form onSubmit={handleSave} className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

      <div className="max-w-3xl mx-auto space-y-12">

        <div className="space-y-10">

          {/* Identity & Basic Info */}
          <section className="bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col gap-6 md:gap-8 transition-all hover:shadow-[0_20px_40_rgb(0,0,0,0.04)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-50 pb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" /></svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">Basic Info (Public)</h3>
              </div>
              
              <div className="hidden md:flex items-center gap-4 bg-gray-50/80 px-4 py-2 rounded-2xl border border-gray-100 hover:bg-white transition-all group/public cursor-pointer" onClick={() => handleChange("isPublic", !formData.isPublic)}>
                <div className="flex flex-col items-end">
                  <span className="text-[11px] font-bold text-gray-900 uppercase tracking-widest leading-none mb-0.5">List Publicly</span>
                  <span className={`text-[9px] font-bold uppercase transition-colors ${formData.isPublic ? "text-blue-600" : "text-gray-400"}`}>
                    {formData.isPublic ? "Visible" : "Hidden"}
                  </span>
                </div>
                <div className={`w-9 h-5 rounded-full relative p-1 transition-colors ${formData.isPublic ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${formData.isPublic ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>

               <div className="md:hidden flex items-center justify-between p-4 bg-gray-100 md:bg-gray-50/50 rounded-2xl border border-gray-200 md:border-transparent hover:bg-white hover:border-blue-100 transition-all cursor-pointer" onClick={() => handleChange("isPublic", !formData.isPublic)}>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-gray-900">List Publicly</p>
                      <p className="text-[10px] text-gray-500 font-medium">Visible to all visitors?</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative p-1 transition-colors ${formData.isPublic ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${formData.isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Land Title</Label>
                  <Input
                    placeholder="e.g. Rolling Hills Estate"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="h-12 px-5 bg-gray-100 md:bg-gray-50/50 border-gray-200 md:border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-100 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 ml-1">
                    <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Slug (Link Reference)</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle size={12} className="text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-gray-900 text-white border-none text-[10px] px-3 py-1.5 rounded-lg max-w-[200px]">
                        The slug is a permanent unique identifier used in the URL. It cannot be changed once the listing is created.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    placeholder="rolling-hills-estate"
                    value={formData.slug}
                    disabled={isEdit}
                    onChange={(e) => handleChange("slug", generateSlug(e.target.value))}
                    className={`h-12 px-5 border-gray-200 md:border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-100 transition-all font-mono text-xs ${
                      isEdit 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70" 
                        : "bg-gray-100 md:bg-gray-50/50"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Listing Price</Label>
                  <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-400 group-focus-within:text-blue-500">₹</span>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={formData.price ? formData.price / 10000000 : ""}
                      onChange={(e) => handleChange("price", (parseFloat(e.target.value) || 0) * 10000000)}
                      className="h-12 pl-10 pr-12 bg-gray-100 md:bg-gray-50/50 border-gray-200 md:border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-100 transition-all font-bold text-lg"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Cr</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Acreage</Label>
                  <div className="relative group">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.area}
                      onChange={(e) => handleChange("area", parseFloat(e.target.value) || 0)}
                      className="h-12 pl-5 pr-16 bg-gray-100 md:bg-gray-50/50 border-gray-200 md:border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Acres</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Property Type</Label>
                  <div className="relative group">
                    <select
                      value={formData.type}
                      onChange={(e) => handleChange("type", e.target.value)}
                      className="w-full h-12 rounded-2xl border-gray-200 md:border-transparent bg-gray-100 md:bg-gray-50/50 px-5 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-100 transition-all appearance-none cursor-pointer"
                    >
                      <option>Agricultural</option>
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Farming</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                 
                  
                  <div className="flex items-center justify-between p-4 bg-gray-100 md:bg-gray-50/50 rounded-2xl border border-gray-200 md:border-transparent hover:bg-white hover:border-blue-100 transition-all cursor-pointer" onClick={() => handleChange("roadAccess", !formData.roadAccess)}>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-gray-900">Road Access</p>
                      <p className="text-[10px] text-gray-500 font-medium">Primary road reaching land?</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative p-1 transition-colors ${formData.roadAccess ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${formData.roadAccess ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Location Details */}
          <section className="bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col gap-6 md:gap-8 transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
                <MapIcon size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">Location Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">District</Label>
                <DistrictDropdown
                  value={formData.district}
                  onChange={(val) => handleChange("district", val)}
                />
              </div>
              <div className="space-y-2.5">
                <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Village / Parish</Label>
                <Input
                  placeholder="Enter village"
                  value={formData.village}
                  onChange={(e) => handleChange("village", e.target.value)}
                  className="h-12 px-5 bg-gray-100 md:bg-gray-50/50 border-gray-200 md:border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-100 transition-all font-medium"
                />
              </div>
            </div>
          </section>

          {/* Boundary Definition */}
          <section className="bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col gap-6 md:gap-8 transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm">
                <MapPin size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">Boundary Definition</h3>
            </div>

            <div className="space-y-6">
              <div className="h-[450px] md:h-auto md:aspect-video w-full overflow-hidden rounded-[24px]">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Latitude</Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0.0000"
                    value={formData.latitude}
                    onChange={(e) => handleChange("latitude", parseFloat(e.target.value) || 0)}
                    className="h-12 px-5 bg-gray-100 md:bg-gray-50/50 border-gray-200 md:border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-100 transition-all font-mono text-sm"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Longitude</Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0.0000"
                    value={formData.longitude}
                    onChange={(e) => handleChange("longitude", parseFloat(e.target.value) || 0)}
                    className="h-12 px-5 bg-gray-100 md:bg-gray-50/50 border-gray-200 md:border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-100 transition-all font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Media Assets (Public) */}
          <section className="bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col gap-6 md:gap-8 transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-gray-50 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm">
                  <FileImage size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">Media Assets</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div
                className={`aspect-[16/10] rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center group transition-all duration-300 cursor-pointer overflow-hidden relative ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-100 md:bg-[#f9fafb] hover:bg-white hover:border-blue-200'
                }`}
                onClick={() => !uploading && (document.getElementById('fileUpload') as HTMLInputElement)?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-sm font-bold text-gray-500">Uploading files...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <p className="font-bold text-gray-900">Drag and drop images</p>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1">Support JPG, PNG, WEBP</p>
                  </>
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((img, i) => (
                  <div key={i} className={`aspect-square rounded-[18px] overflow-hidden group relative shadow-sm hover:shadow-md transition-all border-2 ${img.isPrimary ? 'border-blue-500' : 'border-transparent'}`}>
                    <Image 
                      src={img.url} 
                      alt="Land" 
                      fill 
                      unoptimized 
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 p-1.5 bg-black/20 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>

                    {/* Primary Toggle */}
                    <button
                      type="button"
                      onClick={() => togglePrimary(i)}
                      className={`absolute bottom-2 left-2 right-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${img.isPrimary
                          ? 'bg-blue-600 text-white opacity-100'
                          : 'bg-white/80 backdrop-blur-md text-gray-900 opacity-0 group-hover:opacity-100 hover:bg-white'
                        }`}
                    >
                      {img.isPrimary ? (
                        <>
                          <CheckCircle2 size={12} />
                          Primary
                        </>
                      ) : (
                        <>
                          <Circle size={12} />
                          Set Primary
                        </>
                      )}
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  disabled={uploading}
                  className="aspect-square rounded-[18px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => (document.getElementById('fileUpload') as HTMLInputElement)?.click()}
                >
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus size={20} />}
                  <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Add</span>
                </button>
              </div>
            </div>
          </section>

          {/* Listing Description (Public) */}
          <section className="bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col gap-6 transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
              <div className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center border border-gray-100 shadow-sm">
                <FileText size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">Public Listing Description</h3>
            </div>
            <Textarea
              placeholder="Describe the land, soil quality, neighborhood, and potential uses..."
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("description", e.target.value)}
              className="min-h-[160px] rounded-2xl bg-gray-100 md:bg-gray-50/50 border-gray-200 md:border-transparent focus:bg-white transition-all p-5"
            />
          </section>

          <div className="pt-8 border-t border-dashed border-gray-200">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h4 className="text-white font-bold text-lg">Private Admin Section</h4>
                <p className="text-gray-400 text-sm font-medium">Restricted fields for internal use only.</p>
              </div>
              <div className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                Internal Only
              </div>
            </div>
          </div>
          {/* Admin Pricing & Owner Detail */}
          <section className="bg-white rounded-[24px] md:rounded-[32px] p-5 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col gap-8 md:gap-10 transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.04)]">
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0-2.08-.402-2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">Admin Pricing</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div className="space-y-2.5">
                   <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Expected Price</Label>
                   <div className="relative group">
                     <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-400 group-focus-within:text-blue-500">₹</span>
                     <Input
                       type="number"
                       step="any"
                       value={formData.expectedPrice ? formData.expectedPrice / 10000000 : ""}
                       onChange={(e) => handleChange("expectedPrice", (parseFloat(e.target.value) || 0) * 10000000)}
                       className="h-12 pl-10 pr-12 bg-gray-100 md:bg-gray-50/50 border-gray-200 md:border-transparent rounded-2xl focus:bg-white font-bold text-lg"
                     />
                     <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Cr</span>
                   </div>
                 </div>
                 <div className="space-y-2.5">
                   <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Minimum Price</Label>
                   <div className="relative group">
                     <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-gray-400 group-focus-within:text-blue-500">₹</span>
                     <Input
                       type="number"
                       step="any"
                       value={formData.minimumPrice ? formData.minimumPrice / 10000000 : ""}
                       onChange={(e) => handleChange("minimumPrice", (parseFloat(e.target.value) || 0) * 10000000)}
                       className="h-12 pl-10 pr-12 bg-gray-100 md:bg-gray-50/50 border-gray-200 md:border-transparent rounded-2xl focus:bg-white font-bold text-lg"
                     />
                     <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Cr</span>
                   </div>
                 </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-100 md:bg-gray-50 rounded-2xl border border-gray-200 md:border-gray-100/50 cursor-pointer" onClick={() => handleChange("negotiable", !formData.negotiable)}>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-gray-900">Price Negotiable</p>
                  <p className="text-[10px] text-gray-500 font-medium">Allow counter offers?</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative p-1 transition-colors ${formData.negotiable ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${formData.negotiable ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-8 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">Owner Info & Admin Notes</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Owner Name</Label>
                  <Input value={formData.ownerName} onChange={(e) => handleChange("ownerName", e.target.value)} className="h-12 bg-gray-100 md:bg-gray-50/50 border-gray-200 md:border-transparent rounded-2xl focus:bg-white" />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Owner Phone</Label>
                   <Input value={formData.ownerPhone} onChange={(e) => handleChange("ownerPhone", e.target.value)} className="h-12 bg-gray-100 md:bg-gray-50/50 border-gray-200 md:border-transparent rounded-2xl focus:bg-white" />
                </div>
              </div>

              <div className="space-y-2.5 pt-4">
                <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Internal Admin Notes</Label>
                <Textarea
                  placeholder="Private notes..."
                  value={formData.adminNotes}
                  onChange={(e) => handleChange("adminNotes", e.target.value)}
                  className="min-h-[100px] rounded-2xl bg-gray-100 md:bg-gray-50/50 border-gray-200 md:border-transparent focus:bg-white transition-all p-5"
                />
              </div>
            </div>
          </section>



          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-4 pt-10 px-4 md:px-0">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 font-bold px-10 h-14 transition-all"
              onClick={() => router.back()}
            >
              Cancel & Back
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg shadow-blue-500/20 rounded-xl px-12 h-14 gap-2 transition-all active:scale-95"
            >
              {loading ? "Processing..." : (isEdit ? "Update Listing" : "Publish Property")}
              {!loading && <Rocket size={20} strokeWidth={2.5} />}
            </Button>
          </div>

        </div>
        </div>
      </form>
    </TooltipProvider>
  )
}
