"use client"

import { useState, useEffect } from "react"
import { 
  User, 
  Phone, 
  MapPin, 
  Compass, 
  Briefcase, 
  Loader2, 
  CheckCircle2, 
  ChevronDown, 
  Search, 
  Check 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HARYANA_DISTRICTS } from "@/lib/static"
import { landService } from "@/services/land.service"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LandOption {
  id: string
  title: string
  village: string
  district: string
}

interface BuyerLeadSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function BuyerLeadSheet({ open, onOpenChange, onSuccess }: BuyerLeadSheetProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [buyerDistrict, setBuyerDistrict] = useState("")
  const [interestedDistrict, setInterestedDistrict] = useState("")
  const [purchasePurpose, setPurchasePurpose] = useState("")
  const [selectedLandId, setSelectedLandId] = useState("")
  
  // Lands Data States
  const [lands, setLands] = useState<LandOption[]>([])
  const [loadingLands, setLoadingLands] = useState(false)
  const [landSearchQuery, setLandSearchQuery] = useState("")
  const [isLandDropdownOpen, setIsLandDropdownOpen] = useState(false)

  // Submit States
  const [submitting, setSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  // Fetch lands for association
  useEffect(() => {
    if (open) {
      const fetchLands = async () => {
        try {
          setLoadingLands(true)
          const res = await landService.getLands({ isPublic: false, limit: 1000 })
          const options = (res.documents || []).map(doc => ({
            id: doc.id || "",
            title: doc.title,
            village: doc.village,
            district: doc.district
          }))
          setLands(options)
        } catch (err) {
          console.error("Failed to fetch lands for dropdown:", err)
        } finally {
          setLoadingLands(false)
        }
      }
      fetchLands()
      
      // Reset form states on reopen
      setName("")
      setPhone("")
      setBuyerDistrict("")
      setInterestedDistrict("")
      setPurchasePurpose("")
      setSelectedLandId("")
      setIsSuccess(false)
      setError("")
    }
  }, [open])

  // Handlers for searchable select
  const selectedLand = lands.find(l => l.id === selectedLandId)
  
  const filteredLands = lands.filter(l => 
    l.title.toLowerCase().includes(landSearchQuery.toLowerCase()) ||
    l.village.toLowerCase().includes(landSearchQuery.toLowerCase()) ||
    l.district.toLowerCase().includes(landSearchQuery.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !buyerDistrict || !interestedDistrict || !purchasePurpose || !selectedLandId) {
      setError("Please fill in all required fields.")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/buyer-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          landId: selectedLandId,
          name: name.trim(),
          phoneNumber: phone.trim(),
          buyerDistrict,
          interestedDistrict,
          purchasePurpose
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit buyer lead.")
      }

      setIsSuccess(true)
      setTimeout(() => {
        onSuccess()
        onOpenChange(false)
      }, 1800)
    } catch (err) {
      console.error("Lead submission error:", err)
      setError(err instanceof Error ? err.message : "Failed to save buyer lead. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg p-6 overflow-y-auto bg-white border-l border-stone-200">
        <SheetHeader className="pb-4 border-b border-stone-150 p-0 mb-6">
          <div>
            <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-150 text-blue-750 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
              Buyer Lead
            </span>
          </div>
          <SheetTitle className="text-2xl font-sans font-bold text-stone-900 pt-2">
            Add Buyer Lead
          </SheetTitle>
          <SheetDescription className="text-xs text-stone-500 font-medium leading-relaxed">
            Record details of leads received through offline channels (calls, personal references, etc.).
          </SheetDescription>
        </SheetHeader>

        {isSuccess ? (
          <div className="py-16 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={28} strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-stone-900 text-lg">Lead Registered</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                Buyer inquiry has been registered successfully. Telegram notification has been sent.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Associated Land Listing Searchable Select */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                Associated Land Listing *
              </Label>
              <DropdownMenu open={isLandDropdownOpen} onOpenChange={setIsLandDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    disabled={loadingLands || submitting}
                    className="w-full h-11 flex items-center justify-between px-4 bg-stone-50/40 border border-stone-205 hover:border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-semibold text-xs text-stone-800 outline-none cursor-pointer disabled:opacity-50 select-none text-left"
                  >
                    <span className={selectedLand ? "text-stone-900 font-semibold truncate" : "text-stone-400 font-medium"}>
                      {loadingLands 
                        ? "Loading listed properties..." 
                        : selectedLand 
                          ? `${selectedLand.title} (${selectedLand.village}, ${selectedLand.district})` 
                          : "Select Property Listing"}
                    </span>
                    <ChevronDown size={14} className={`text-stone-400 transition-transform duration-200 ${isLandDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent 
                  className="w-[--radix-dropdown-menu-trigger-width] p-2 bg-white border border-stone-200/85 rounded-2xl shadow-xl z-[100] animate-in fade-in-50 zoom-in-95 duration-150"
                  align="start"
                >
                  <div className="relative mb-2">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search land by name, village, or district..."
                      value={landSearchQuery}
                      onChange={(e) => setLandSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()} // Prevent space from closing dropdown
                      className="w-full h-9 pl-9 pr-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 outline-none"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-52 overflow-y-auto custom-scrollbar space-y-0.5">
                    {filteredLands.length > 0 ? (
                      filteredLands.map((land) => {
                        const isSelected = selectedLandId === land.id
                        return (
                          <DropdownMenuItem
                            key={land.id}
                            onSelect={() => {
                              setSelectedLandId(land.id)
                              setLandSearchQuery("")
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all focus:bg-blue-50 focus:text-blue-700 outline-none text-xs ${
                              isSelected ? "bg-blue-50 text-blue-700 font-bold" : "text-stone-650 font-medium"
                            }`}
                          >
                            <div className="truncate pr-4">
                              <p className="font-semibold truncate">{land.title}</p>
                              <p className="text-[9px] text-stone-400 font-bold uppercase mt-0.5 tracking-wider truncate">
                                {land.village}, {land.district}
                              </p>
                            </div>
                            {isSelected && <Check size={12} className="text-blue-600 shrink-0" />}
                          </DropdownMenuItem>
                        )
                      })
                    ) : (
                      <div className="py-6 text-center text-xs text-stone-400 font-medium">
                        No lands match search query
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Buyer Name */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                Buyer Name *
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                  <User size={14} />
                </span>
                <Input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  required
                  className="pl-9 h-11 bg-stone-50/40 border-stone-205 focus:border-blue-600 focus:bg-white focus:ring-blue-500/10 hover:border-stone-300 rounded-xl font-semibold text-xs text-stone-900"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                Phone Number *
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                  <Phone size={14} />
                </span>
                <Input
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={submitting}
                  required
                  className="pl-9 h-11 bg-stone-50/40 border-stone-205 focus:border-blue-600 focus:bg-white focus:ring-blue-500/10 hover:border-stone-300 rounded-xl font-semibold text-xs text-stone-900"
                />
              </div>
            </div>

            {/* Lives In District */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                District They Live In *
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                  <MapPin size={14} />
                </span>
                <select
                  value={buyerDistrict}
                  onChange={(e) => setBuyerDistrict(e.target.value)}
                  disabled={submitting}
                  required
                  className="w-full h-11 pl-9 pr-10 bg-stone-50/40 border border-stone-205 focus:border-blue-600 focus:bg-white focus:ring-blue-500/10 hover:border-stone-300 rounded-xl font-semibold text-xs text-stone-900 appearance-none outline-none cursor-pointer"
                >
                  <option value="" disabled hidden>Select Buyer&apos;s Home District</option>
                  {HARYANA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                  <ChevronDown size={14} />
                </span>
              </div>
            </div>

            {/* Target District of Interest */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                District of Interest *
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                  <Compass size={14} />
                </span>
                <select
                  value={interestedDistrict}
                  onChange={(e) => setInterestedDistrict(e.target.value)}
                  disabled={submitting}
                  required
                  className="w-full h-11 pl-9 pr-10 bg-stone-50/40 border border-stone-205 focus:border-blue-600 focus:bg-white focus:ring-blue-500/10 hover:border-stone-300 rounded-xl font-semibold text-xs text-stone-900 appearance-none outline-none cursor-pointer"
                >
                  <option value="" disabled hidden>Select Target District</option>
                  {HARYANA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                  <ChevronDown size={14} />
                </span>
              </div>
            </div>

            {/* Purchase Purpose */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-stone-505 uppercase tracking-wider ml-0.5">
                Purpose of Purchase *
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                  <Briefcase size={14} />
                </span>
                <select
                  value={purchasePurpose}
                  onChange={(e) => setPurchasePurpose(e.target.value)}
                  disabled={submitting}
                  required
                  className="w-full h-11 pl-9 pr-10 bg-stone-50/40 border border-stone-205 focus:border-blue-600 focus:bg-white focus:ring-blue-500/10 hover:border-stone-300 rounded-xl font-semibold text-xs text-stone-900 appearance-none outline-none cursor-pointer"
                >
                  <option value="" disabled hidden>Select Purpose of Purchase</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Investment">Investment</option>
                  <option value="Commercial">Commercial</option>
                </select>
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                  <ChevronDown size={14} />
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-650 border border-red-150 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end pt-4 border-t border-stone-150">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#292524] hover:bg-[#0c0a09] border border-[#292524] hover:border-blue-655/30 text-white font-semibold shadow-sm rounded-full px-6 py-2.5 h-9 text-xs uppercase tracking-widest gap-2 transition-all focus:ring-2 focus:ring-blue-500/10 shrink-0 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Saving Lead...
                  </>
                ) : (
                  "Create Buyer Lead"
                )}
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
