"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Check, Award, Briefcase, Phone, MapPin, Loader2, Building, ChevronDown, Trash2, FileImage, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import DistrictDropdown from "./DistrictDropdown"
import { brokerService } from "@/services/broker.service"
import { landService } from "@/services/land.service"
import { Broker } from "@/lib/types"
import { HARYANA_TEHSILS } from "@/lib/static"

interface BrokerFormProps {
  initialData?: Broker | null
}

interface FullBrokerFormData {
  name: string
  officeName: string
  phoneNumber: string
  alternatePhoneNumber: string
  district: string
  tehsil: string
  address: string
  googleLocationUrl: string
  experienceYears: number
  referredBy: string
  reputation: 'SILVER' | 'GOLD' | 'DIAMOND'
  description: string
  images: { id?: string; brokerId?: string; imageUrl: string; createdAt?: string }[]
}

export default function BrokerForm({ initialData = null }: BrokerFormProps) {
  const router = useRouter()
  const isEdit = !!initialData
  const [loading, setLoading] = useState(false)
  const [previewCode, setPreviewCode] = useState("")
  const [generatingCode, setGeneratingCode] = useState(false)

  // Form State
  const [formData, setFormData] = useState<FullBrokerFormData>({
    name: initialData?.name || "",
    officeName: initialData?.officeName || "",
    phoneNumber: initialData?.phoneNumber || "",
    alternatePhoneNumber: initialData?.alternatePhoneNumber || "",
    district: initialData?.district || "",
    tehsil: initialData?.tehsil || "",
    address: initialData?.address || "",
    googleLocationUrl: initialData?.googleLocationUrl || "",
    experienceYears: initialData?.experienceYears || 0,
    referredBy: initialData?.referredBy || "",
    reputation: initialData?.reputation || "SILVER",
    description: initialData?.description || "",
    images: initialData?.images || []
  })

  const availableTehsils = formData.district ? HARYANA_TEHSILS[formData.district] || [] : []

  const { district: formDistrict, tehsil: formTehsil, reputation: formReputation } = formData

  // Watch for Code Preview triggers: district, tehsil, reputation
  useEffect(() => {
    const fetchCodePreview = async () => {
      if (!formDistrict || !formTehsil || !formReputation) {
        setPreviewCode("")
        return
      }

      setGeneratingCode(true)
      try {
        const generated = await brokerService.generateBrokerCode(formDistrict, formTehsil, formReputation)
        setPreviewCode(generated)
      } catch (err) {
        console.error("Error previewing broker code:", err)
      } finally {
        setGeneratingCode(false)
      }
    }

    if (!isEdit) {
      fetchCodePreview()
    } else {
      setPreviewCode(initialData?.brokerCode || "")
    }
  }, [formDistrict, formTehsil, formReputation, isEdit, initialData])

  const handleChange = <K extends keyof FullBrokerFormData>(field: K, value: FullBrokerFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedEnlargedImage, setSelectedEnlargedImage] = useState<string | null>(null)

  const uploadFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [...formData.images];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedFile = await landService.uploadFile(file, "brokers");
        const imageUrl = await landService.getFileView(uploadedFile.$id);

        newImages.push({
          imageUrl
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

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      alert("Broker Name is required.")
      return
    }
    if (!formData.phoneNumber.trim()) {
      alert("Phone Number is required.")
      return
    }
    if (!formData.district.trim()) {
      alert("District is required.")
      return
    }
    if (!formData.tehsil.trim()) {
      alert("Tehsil is required.")
      return
    }

    setLoading(true)
    try {
      if (isEdit && initialData?.id) {
        await brokerService.updateBroker(initialData.id, formData)
      } else {
        await brokerService.createBroker(formData)
      }
      router.push("/admin/brokers")
    } catch (error) {
      console.error("Failed to save broker:", error)
      alert("Error saving broker. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20 w-full max-w-5xl mx-auto">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
          <Link href="/admin/brokers" className="hover:text-blue-650 transition-colors">Brokers</Link>
          <span className="mx-1.5 opacity-50 text-stone-400">/</span>
          <span className="text-stone-800 font-semibold">{isEdit ? "Edit Broker" : "Register Broker"}</span>
        </nav>
        <h1 className="text-4xl font-sans font-bold tracking-tight text-stone-900 leading-none">
          {isEdit ? "Edit Broker Profile" : "Register New Broker"}
        </h1>
        <p className="text-xs text-stone-500 mt-2 font-medium tracking-[0.15px]">
          Create confidential records and generate system tracking keys for partner brokers.
        </p>
      </div>

      {/* Broker Code Preview Bar (Read Only) */}
      <div className="bg-white border border-stone-200/60 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm w-full">
        <div>
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-0.5">
            System Code Assignment
          </span>
          <p className="text-[11px] text-stone-500 font-medium">
            Generated automatically based on district sequence serials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-extrabold text-stone-450 uppercase tracking-wider">
            Broker Code:
          </span>
          <div className="bg-stone-50 px-3.5 py-1.5 rounded-xl border border-stone-200/80 min-w-44 flex items-center justify-center">
            {generatingCode ? (
              <Loader2 className="w-4 h-4 text-stone-400 animate-spin" />
            ) : (
              <span className={`font-mono text-xs font-extrabold tracking-wider ${previewCode ? 'text-stone-850' : 'text-stone-400 italic font-sans font-normal'}`}>
                {previewCode || "Waiting for inputs..."}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Form Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Basic & Contact Information */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-6 md:p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100/40">
                <Briefcase size={16} />
              </div>
              <div>
                <h3 className="text-xs font-black text-stone-800 uppercase tracking-widest leading-none">Broker Profile</h3>
                <p className="text-[10px] text-stone-405 font-bold mt-1 uppercase tracking-wider">Personal and business information</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                  Broker Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. Pawan Beniwal"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="h-11 px-4 bg-stone-50/40 border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:ring-emerald-500/10 transition-all font-semibold text-stone-900 text-sm placeholder:text-stone-400/60"
                />
              </div>

              {/* Office Name */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                  Office / Agency Name
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"><Building size={14} /></span>
                  <Input
                    placeholder="e.g. Beniwal Real Estate"
                    value={formData.officeName}
                    onChange={(e) => handleChange("officeName", e.target.value)}
                    className="h-11 pl-9 pr-4 bg-stone-50/40 border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:ring-emerald-500/10 transition-all font-semibold text-stone-900 text-sm placeholder:text-stone-400/60"
                  />
                </div>
              </div>

              {/* Phone and Alternate Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-455"><Phone size={13} /></span>
                    <Input
                      placeholder="e.g. 98120XXXXX"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange("phoneNumber", e.target.value)}
                      className="h-11 pl-9 pr-4 bg-stone-50/40 border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:ring-emerald-500/10 transition-all font-semibold text-stone-900 text-sm placeholder:text-stone-400/60"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                    Alternate Phone
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-455"><Phone size={13} /></span>
                    <Input
                      placeholder="e.g. 94160XXXXX"
                      value={formData.alternatePhoneNumber}
                      onChange={(e) => handleChange("alternatePhoneNumber", e.target.value)}
                      className="h-11 pl-9 pr-4 bg-stone-50/40 border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:ring-emerald-500/10 transition-all font-semibold text-stone-900 text-sm placeholder:text-stone-400/60"
                    />
                  </div>
                </div>
              </div>

              {/* Referred By */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                  Referred By (Optional)
                </Label>
                <Input
                  placeholder="e.g. Jaibir Singh / Staff member"
                  value={formData.referredBy}
                  onChange={(e) => handleChange("referredBy", e.target.value)}
                  className="h-11 px-4 bg-stone-50/40 border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:ring-emerald-500/10 transition-all font-semibold text-stone-900 text-sm placeholder:text-stone-400/60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Jurisdiction & Reputation */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4 mb-6">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100/40">
              <Award size={16} />
            </div>
            <div>
              <h3 className="text-xs font-black text-stone-800 uppercase tracking-widest leading-none">Jurisdiction & Tier</h3>
              <p className="text-[10px] text-stone-405 font-bold mt-1 uppercase tracking-wider">Territory, Tier and Experience level</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* District Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                District <span className="text-red-500">*</span>
              </Label>
              <DistrictDropdown
                value={formData.district}
                onChange={(val) => {
                  handleChange("district", val)
                  handleChange("tehsil", "") // Reset tehsil on district change
                }}
              />
            </div>

            {/* Tehsil Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                Tehsil <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <select
                  value={formData.tehsil}
                  onChange={(e) => handleChange("tehsil", e.target.value)}
                  disabled={!formData.district}
                  className="w-full h-11 rounded-xl border border-stone-200 bg-stone-50 hover:border-stone-300 px-4 text-xs font-semibold text-stone-850 focus:bg-white focus:border-emerald-600 focus:ring-emerald-500/10 focus:outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-stone-800"
                >
                  <option value="">
                    {formData.district ? "Select Tehsil" : "Select District First"}
                  </option>
                  {availableTehsils.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                  <ChevronDown size={14} className="opacity-70" />
                </div>
              </div>
            </div>

            {/* Experience and Reputation Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                  Experience Years
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 5"
                  min="0"
                  value={formData.experienceYears || ""}
                  onChange={(e) => handleChange("experienceYears", parseInt(e.target.value, 10) || 0)}
                  className="h-11 px-4 bg-stone-50/40 border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:ring-emerald-500/10 transition-all font-semibold text-stone-950 text-sm placeholder:text-stone-400/60"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                  Reputation Tier
                </Label>
                <div className="relative">
                  <select
                    value={formData.reputation}
                    onChange={(e) => handleChange("reputation", e.target.value as 'SILVER' | 'GOLD' | 'DIAMOND')}
                    className="w-full h-11 rounded-xl border border-stone-200 bg-stone-50 hover:border-stone-300 px-4 text-xs font-semibold text-stone-850 focus:bg-white focus:border-emerald-600 focus:ring-emerald-500/10 focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="SILVER">Silver</option>
                    <option value="GOLD">Gold</option>
                    <option value="DIAMOND">Diamond</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Google Location URL */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                Google Location Link (Maps)
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"><MapPin size={13} /></span>
                <Input
                  placeholder="https://maps.google.com/?q=..."
                  value={formData.googleLocationUrl}
                  onChange={(e) => handleChange("googleLocationUrl", e.target.value)}
                  className="h-11 pl-9 pr-4 bg-stone-50/40 border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:ring-emerald-500/10 transition-all font-semibold text-stone-900 text-xs placeholder:text-stone-400/60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Sections: Address & Description */}
      <div className="bg-white rounded-2xl border border-stone-200/60 p-6 md:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Office Address */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
              Office / Business Address
            </Label>
            <Textarea
              placeholder="Full office address details..."
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="min-h-24 rounded-xl bg-stone-50/40 border-stone-200 focus:border-emerald-600 focus:bg-white focus:ring-emerald-500/10 transition-all p-3.5 text-xs font-semibold leading-relaxed text-stone-800 placeholder:text-stone-400/60"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
              Notes & Description
            </Label>
            <Textarea
              placeholder="Add professional background, active regions, or trusted notes..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="min-h-24 rounded-xl bg-stone-50/40 border-stone-200 focus:border-emerald-600 focus:bg-white focus:ring-emerald-500/10 transition-all p-3.5 text-xs font-semibold leading-relaxed text-stone-800 placeholder:text-stone-400/60"
            />
          </div>
        </div>
      </div>

      {/* Card 3: Broker Images (Visual Assets) */}
      <div className="bg-white rounded-2xl border border-stone-200/60 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4 mb-4">
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-655 flex items-center justify-center border border-orange-100/40">
            <FileImage size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black text-stone-800 uppercase tracking-widest leading-none">Broker Images</h3>
            <p className="text-[10px] text-stone-405 font-bold mt-1 uppercase tracking-wider">Upload profile, office, team, or license photos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {/* Left Column: Drag & Drop Container */}
          <div className="md:col-span-1">
            <div
              className={`aspect-video md:aspect-square w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center group transition-all duration-200 cursor-pointer overflow-hidden ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/10'
                  : 'border-stone-200 bg-stone-50/30 hover:bg-white hover:border-emerald-500/60'
              }`}
              onClick={() => !uploading && (document.getElementById('brokerImageUpload') as HTMLInputElement)?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-1.5 p-2 text-center">
                  <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                  <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest animate-pulse">Uploading...</p>
                </div>
              ) : (
                <div className="text-center p-2">
                  <div className="w-7 h-7 rounded-lg bg-white shadow-xs border border-stone-150 flex items-center justify-center mx-auto text-stone-500 group-hover:scale-105 group-hover:text-emerald-600 transition-all mb-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="font-extrabold text-stone-850 text-[10px] leading-tight">Drag & drop</p>
                  <p className="text-[8px] text-stone-400 font-bold uppercase tracking-wider mt-0.5 leading-tight">or browse</p>
                </div>
              )}
            </div>
          </div>
          
          <input
            type="file"
            id="brokerImageUpload"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />

          {/* Right Column: Uploaded Images Grid */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {formData.images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden group relative border border-stone-200 bg-stone-50/50 shadow-xs"
                >
                  <Image
                    src={img.imageUrl}
                    alt={`Broker photo ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedEnlargedImage(img.imageUrl)}
                  />

                  {/* Delete action overlay */}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 p-1.5 bg-black/60 hover:bg-red-650 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer shadow-xs"
                  >
                    <Trash2 size={11} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>

            {formData.images.length === 0 && (
              <div className="h-24 flex items-center justify-center border border-dashed border-stone-200 bg-stone-50/10 rounded-2xl p-4 text-center">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none">No images uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200/60">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-stone-950 hover:bg-stone-50 bg-white border border-stone-200 hover:border-blue-650/40 rounded-full transition flex items-center justify-center gap-1.5 shadow-sm h-9"
        >
          <ArrowLeft size={13} />
          Cancel
        </button>

        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-[#292524] hover:bg-[#0c0a09] border border-[#292524] hover:border-blue-650/30 text-white font-semibold shadow-sm rounded-full px-6 py-2.5 h-9 text-xs uppercase tracking-widest gap-2 transition-all focus:ring-2 focus:ring-blue-500/10 shrink-0"
        >
          {loading ? "Processing..." : (isEdit ? "Update Profile" : "Register Broker")}
          {!loading && <Check size={13} strokeWidth={2.0} />}
        </Button>
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
                src={selectedEnlargedImage}
                alt="Enlarged view"
                width={800}
                height={600}
                className="object-contain rounded-lg max-h-[80vh] w-auto max-w-full shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
