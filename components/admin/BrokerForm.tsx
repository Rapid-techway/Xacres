"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, Award, Briefcase, Phone, MapPin, Loader2, Building, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import DistrictDropdown from "./DistrictDropdown"
import { brokerService } from "@/services/broker.service"
import { Broker } from "@/lib/types"
import { HARYANA_TEHSILS } from "@/lib/static"

interface BrokerFormProps {
  initialData?: Broker | null
}

interface FullBrokerFormData {
  name: string
  officeName: string
  mobileNumber: string
  alternateMobileNumber: string
  district: string
  tehsil: string
  address: string
  googleLocationUrl: string
  experienceYears: number
  referredBy: string
  reputation: 'SILVER' | 'GOLD' | 'DIAMOND'
  description: string
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
    mobileNumber: initialData?.mobileNumber || "",
    alternateMobileNumber: initialData?.alternateMobileNumber || "",
    district: initialData?.district || "",
    tehsil: initialData?.tehsil || "",
    address: initialData?.address || "",
    googleLocationUrl: initialData?.googleLocationUrl || "",
    experienceYears: initialData?.experienceYears || 0,
    referredBy: initialData?.referredBy || "",
    reputation: initialData?.reputation || "SILVER",
    description: initialData?.description || ""
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

  const handleChange = (field: keyof FullBrokerFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      alert("Broker Name is required.")
      return
    }
    if (!formData.mobileNumber.trim()) {
      alert("Mobile Number is required.")
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

              {/* Mobile and Alternate Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-450"><Phone size={13} /></span>
                    <Input
                      placeholder="e.g. 98120XXXXX"
                      value={formData.mobileNumber}
                      onChange={(e) => handleChange("mobileNumber", e.target.value)}
                      className="h-11 pl-9 pr-4 bg-stone-50/40 border-stone-200 rounded-xl focus:border-emerald-600 focus:bg-white focus:ring-emerald-500/10 transition-all font-semibold text-stone-900 text-sm placeholder:text-stone-400/60"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                    Alternate Mobile
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-450"><Phone size={13} /></span>
                    <Input
                      placeholder="e.g. 94160XXXXX"
                      value={formData.alternateMobileNumber}
                      onChange={(e) => handleChange("alternateMobileNumber", e.target.value)}
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
    </form>
  )
}
