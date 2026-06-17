"use client"

import { useState, useEffect } from "react"
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
  Unlock,
  Eye,
  ArrowLeft,
  Info,
  Phone,
  ChevronRight,
  Search
} from "lucide-react"
import { landService } from "@/services/land.service"
import { brokerService } from "@/services/broker.service"
import { CreateFullLandPayload, LandImage, Centroid, GeoJsonFeatureCollection, FlattenedLand, Broker } from "@/lib/types"
import DistrictDropdown from "./DistrictDropdown"
import { HARYANA_TEHSILS, HARYANA_TEHSIL_VILLAGES } from "@/lib/static"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { KMLUpload } from "./kml/KMLUpload"
import CopyAiPromptButton from "./CopyAiPromptButton"

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
  contactType: 'OWNER' | 'BROKER';
  ownerName: string;
  ownerPhone: string;
  expectedPrice: number;
  minimumPrice: number;
  negotiable: boolean;
  adminNotes: string;
  brokerId: string;
  tehsil: string;
}

export default function LandForm({ initialData = null }: LandFormProps) {
  const router = useRouter()
  const isEdit = !!initialData
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [areaUnit, setAreaUnit] = useState<'acre' | 'sqyard'>('acre')
  const [areaInputVal, setAreaInputVal] = useState<string>("")
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Find tehsil based on initial village
  const getInitialTehsil = () => {
    if (initialData?.tehsil) return initialData.tehsil
    if (!initialData?.village) return ""
    const villageName = initialData.village
    const found = Object.keys(HARYANA_TEHSIL_VILLAGES).find(tehsil => 
      HARYANA_TEHSIL_VILLAGES[tehsil].includes(villageName)
    )
    return found || ""
  }

  const [selectedTehsil, setSelectedTehsil] = useState<string>(getInitialTehsil)

  // Title generation helper
  const getGeneratedTitle = (area: number, village: string, tehsil: string, district: string) => {
    const areaVal = area || 0;
    const vilVal = village?.trim() || "[Village]";
    const tehVal = tehsil?.trim() || "[Tehsil]";
    const distVal = district?.trim() || "[District]";
    return `${areaVal} Acre Land in ${vilVal}, ${tehVal}, ${distVal}`;
  }

  // Slug generation helper
  const getGeneratedSlug = (area: number, village: string, tehsil: string, district: string, listingNum: string | number) => {
    const areaStr = String(area || 0);
    const cleanStr = (s: string) => (s || '').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const vilStr = cleanStr(village) || 'village';
    const tehStr = cleanStr(tehsil) || 'tehsil';
    const distStr = cleanStr(district) || 'district';
    return `${areaStr}-acre-land-in-${vilStr}-${tehStr}-${distStr}-haryana-${listingNum}`;
  }

  // Check if title is custom on edit load
  const isTitleCustomOnInit = () => {
    if (!initialData) return false;
    const defaultTitle = getGeneratedTitle(
      initialData.area || 0,
      initialData.village || "",
      initialData.tehsil || "",
      initialData.district || ""
    );
    return initialData.title !== defaultTitle;
  }

  const [customizeTitle, setCustomizeTitle] = useState(isTitleCustomOnInit())

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(current => current === message ? null : current)
    }, 3000)
  }

  const getLandDataForAiPrompt = () => {
    const data: Record<string, unknown> = {}
    if (formData.area && formData.area > 0) {
      data.area = formData.area
    }
    if (formData.type && formData.type.trim() !== '') {
      data.landType = formData.type
    }
    if (formData.district && formData.district.trim() !== '' && formData.district !== 'district') {
      data.district = formData.district
    }
    if (formData.tehsil && formData.tehsil.trim() !== '' && formData.tehsil !== 'tehsil') {
      data.tehsil = formData.tehsil
    }
    if (formData.village && formData.village.trim() !== '' && formData.village !== 'village') {
      data.village = formData.village
    }
    if (formData.roadAccess !== undefined) {
      data.roadAccess = formData.roadAccess
    }
    return data
  }

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
    tehsil: initialData?.tehsil || getInitialTehsil() || "",
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
    brokerId: initialData?.brokerId || "",

    // Private Admin Table
    contactType: initialData?.contactType || (initialData?.brokerId ? "BROKER" : "OWNER"),
    ownerName: initialData?.ownerName || "",
    ownerPhone: initialData?.ownerPhone || "",
    expectedPrice: initialData?.expectedPrice || initialData?.price || 0,
    minimumPrice: initialData?.minimumPrice || ((initialData?.price || 0) * 0.9),
    negotiable: initialData?.negotiable ?? true,
    adminNotes: initialData?.adminNotes || ""
  })

  const availableTehsils = formData.district ? HARYANA_TEHSILS[formData.district] || [] : []
  const availableVillages = selectedTehsil ? HARYANA_TEHSIL_VILLAGES[selectedTehsil] || [] : []

  // Load brokers on mount
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const res = await brokerService.getBrokers({ limit: 1000 })
        setBrokers(res.documents)
      } catch (err) {
        console.error("Failed to load brokers for selection:", err)
      }
    }
    fetchBrokers()
  }, [])

  const [isDragging, setIsDragging] = useState(false)
  const [mapVersion, setMapVersion] = useState(0)

  // Sync title and slug dynamically
  useEffect(() => {
    const listingNum = initialData?.listingNumber || "[listing_number]"
    const generatedSlug = getGeneratedSlug(
      formData.area,
      formData.village,
      selectedTehsil,
      formData.district,
      listingNum
    )

    if (!customizeTitle) {
      const generatedTitle = getGeneratedTitle(
        formData.area,
        formData.village,
        selectedTehsil,
        formData.district
      )
      setFormData(prev => ({
        ...prev,
        title: generatedTitle,
        slug: generatedSlug
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        slug: generatedSlug
      }))
    }
  }, [formData.area, formData.village, selectedTehsil, formData.district, customizeTitle, initialData?.listingNumber])

  // Sync external changes of formData.area back to local display input
  useEffect(() => {
    if (formData.area === 0) {
      if (areaInputVal !== "") setAreaInputVal("");
      return;
    }

    const currentVal = parseFloat(areaInputVal) || 0;
    if (areaUnit === 'acre') {
      if (Math.abs(currentVal - formData.area) > 0.0001) {
        setAreaInputVal(String(formData.area));
      }
    } else {
      const expectedSqYards = formData.area * 4840;
      if (Math.abs(currentVal - expectedSqYards) > 0.1) {
        setAreaInputVal(String(parseFloat(expectedSqYards.toFixed(2))));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.area, areaUnit])

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
    if (!formData.tehsil.trim()) {
      alert("Tehsil is required.");
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
    if (formData.contactType === "OWNER") {
      if (!formData.ownerName.trim()) {
        alert("Owner Full Name is required.");
        return;
      }
      if (!formData.ownerPhone.trim()) {
        alert("Owner Contact Phone is required.");
        return;
      }
    } else {
      if (!formData.brokerId) {
        alert("Broker Selection is required.");
        return;
      }
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
          brokerId: formData.contactType === 'BROKER' ? (formData.brokerId || null) : null,
          tehsil: formData.tehsil || null
        },
        admin: {
          contactType: formData.contactType,
          ownerName: formData.contactType === 'OWNER' ? formData.ownerName : null,
          ownerPhone: formData.contactType === 'OWNER' ? formData.ownerPhone : null,
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
      <form onSubmit={handleSave} className="space-y-8 pb-20 w-full">

        {/* BREADCRUMB HEADER (Replicating exact desktop header matching image mockup) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex items-center text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
              <Link href="/admin/lands" className="hover:text-blue-650 transition-colors">Lands</Link>
              <ChevronRight size={12} className="mx-1 opacity-55 text-stone-450" />
              <span className="text-stone-800 font-semibold">{isEdit ? "Edit Land Listing" : "Add New Listing"}</span>
            </nav>
            <h1 className="text-4xl font-sans font-bold tracking-tight text-stone-900 leading-none">
              {isEdit ? "Edit Land" : "Create Land Listing"}
            </h1>
            <p className="text-xs text-stone-500 mt-1 font-medium tracking-[0.15px]">
              Manage property details, location, pricing and admin information.
            </p>
          </div>

          {/* Header Action Buttons (hidden on mobile, matches top right header buttons in mockup) */}
          <div className="hidden md:flex items-center gap-3">
            {isEdit && (
              <Link
                href={`/lands/${formData.slug}`}
                target="_blank"
                className="bg-white hover:bg-stone-50 text-stone-700 font-semibold border border-[#e7e5e4] px-4 py-2 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm h-9 hover:border-blue-650/40"
              >
                <Eye size={13} />
                Preview
              </Link>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#292524] hover:bg-[#0c0a09] border border-[#292524] hover:border-blue-600/30 text-white font-semibold shadow-sm rounded-full px-5 py-2 h-9 text-xs uppercase tracking-widest gap-1.5 transition-all focus:ring-2 focus:ring-blue-500/10 shrink-0"
            >
              {loading ? "Saving..." : "Save & Update"}
              {!loading && <Check size={13} strokeWidth={2.5} />}
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

                 {/* Land Title and Slug Container (Slug is hidden and shown in tooltip) */}
                <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-150/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Land Title <span className="text-red-500 font-extrabold">*</span></Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-slate-450 hover:text-slate-650 flex items-center p-0.5 rounded transition-colors hover:bg-slate-100/50">
                            <Info size={13} className="shrink-0" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="right"
                          className="bg-slate-950 text-slate-100 border border-slate-800 text-xs px-3 py-2 rounded-xl max-w-md break-all font-mono shadow-xl"
                        >
                          <span className="font-sans font-extrabold block mb-1 text-[9px] text-slate-400 uppercase tracking-widest">SEO Slug Preview</span>
                          {formData.slug || "Will be auto-generated..."}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomizeTitle(!customizeTitle);
                        if (customizeTitle) {
                          const generated = getGeneratedTitle(
                            formData.area,
                            formData.village,
                            selectedTehsil,
                            formData.district
                          );
                          handleChange("title", generated);
                        }
                      }}
                      className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-all select-none"
                    >
                      {customizeTitle ? (
                        <>
                          <Unlock size={11} />
                          <span>Lock (Auto)</span>
                        </>
                      ) : (
                        <>
                          <Lock size={11} />
                          <span>Unlock (Edit)</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      placeholder="Title will be auto-generated..."
                      value={formData.title}
                      readOnly={!customizeTitle}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className={`h-11 px-4 border rounded-xl transition-all font-semibold text-slate-900 text-sm placeholder:text-slate-400/60 w-full ${
                        !customizeTitle
                          ? "bg-slate-100/70 border-slate-200 cursor-not-allowed select-text text-slate-600 font-semibold"
                          : "bg-white border-emerald-500/30 hover:border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
                      }`}
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider ml-0.5 mt-1 flex items-center gap-1">
                    <span>Generated automatically from location. Hover the info icon to preview the URL slug.</span>
                  </p>
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
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">
                        Total Area <span className="text-red-500 font-extrabold">*</span>
                      </Label>
                      <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[9px] font-bold uppercase tracking-wider">
                        <button
                          type="button"
                          onClick={() => {
                            setAreaUnit('acre');
                            const val = formData.area ? String(formData.area) : "";
                            setAreaInputVal(val);
                          }}
                          className={`px-2 py-0.5 rounded-md transition-all select-none cursor-pointer ${
                            areaUnit === 'acre'
                              ? 'bg-white shadow-xs text-slate-800'
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          Acre
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAreaUnit('sqyard');
                            const sqYards = formData.area ? parseFloat((formData.area * 4840).toFixed(2)) : 0;
                            setAreaInputVal(sqYards ? String(sqYards) : "");
                          }}
                          className={`px-2 py-0.5 rounded-md transition-all select-none cursor-pointer ${
                            areaUnit === 'sqyard'
                              ? 'bg-white shadow-xs text-slate-800'
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          Sq Yards
                        </button>
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <Input
                        type="number"
                        step="any"
                        placeholder={areaUnit === 'acre' ? "e.g. 5.5" : "e.g. 26620"}
                        value={areaInputVal}
                        onChange={(e) => {
                          const valStr = e.target.value;
                          setAreaInputVal(valStr);
                          const parsed = parseFloat(valStr) || 0;
                          if (areaUnit === 'acre') {
                            handleChange("area", parsed);
                          } else {
                            handleChange("area", parseFloat((parsed / 4840).toFixed(6)));
                          }
                        }}
                        className="h-11 pl-4 pr-16 bg-slate-50/40 border border-slate-200 hover:border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all font-bold text-slate-950 text-sm placeholder:text-slate-400/60 placeholder:font-normal"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200 select-none">
                        {areaUnit === 'acre' ? 'Acres' : 'Sq Yds'}
                      </span>
                    </div>

                    {/* Live conversion helper badge */}
                    {areaUnit === 'sqyard' && formData.area > 0 && (
                      <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider ml-0.5 flex items-center gap-1.5 animate-in fade-in duration-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Saves as ≈ {formData.area} Acres</span>
                      </p>
                    )}
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
                    onChange={(val) => {
                      handleChange("district", val)
                      setSelectedTehsil("")
                      handleChange("tehsil", "")
                      handleChange("village", "")
                    }}
                  />
                </div>

                {/* Tehsil Dropdown */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Tehsil <span className="text-red-500 font-extrabold">*</span></Label>
                  <div className="relative">
                    <select
                      value={selectedTehsil}
                      onChange={(e) => {
                        const val = e.target.value
                        setSelectedTehsil(val)
                        handleChange("tehsil", val)
                        handleChange("village", "")
                      }}
                      disabled={!formData.district}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/40 hover:border-slate-300 px-4 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-emerald-500/10 focus:outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={14} className="opacity-75" />
                    </div>
                  </div>
                </div>

                {/* Village Dropdown */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Village / Locality <span className="text-red-500 font-extrabold">*</span></Label>
                  <div className="relative">
                    <select
                      value={formData.village}
                      onChange={(e) => handleChange("village", e.target.value)}
                      disabled={!selectedTehsil}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/40 hover:border-slate-300 px-4 text-xs font-semibold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-emerald-500/10 focus:outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {selectedTehsil ? "Select Village" : "Select Tehsil First"}
                      </option>
                      {availableVillages.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                      {formData.village && !availableVillages.includes(formData.village) && (
                        <option value={formData.village}>{formData.village}</option>
                      )}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={14} className="opacity-75" />
                    </div>
                  </div>
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
        <div className="bg-white rounded-xl border border-[#e7e5e4] p-6 md:p-8 shadow-sm space-y-6 w-full">
          {/* Header with Accordion Toggle for Mobile */}
          <div
            className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 cursor-pointer lg:cursor-default select-none"
            onClick={() => toggleSection('map')}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100/50 shrink-0">
                <MapIcon size={16} />
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
            <div className="lg:col-span-7 h-[360px] md:h-[400px] w-full overflow-hidden rounded-xl border border-[#e7e5e4] shadow-inner relative">
              <PolygonMap
                key={`map-${mapVersion}`}
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
                    className="h-11 px-4 bg-slate-50/40 border border-slate-200 hover:border-slate-350 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all font-mono text-xs text-slate-700 font-semibold placeholder:text-slate-400/60 placeholder:font-normal"
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
                    className="h-11 px-4 bg-slate-50/40 border border-slate-200 hover:border-slate-350 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all font-mono text-xs text-slate-700 font-semibold placeholder:text-slate-400/60 placeholder:font-normal"
                  />
                </div>

                {/* KML Boundary Import Section */}
                <div className="pt-2 border-t border-slate-100 mt-2">
                  <KMLUpload
                    onImportSuccess={(result) => {
                      setFormData(prev => ({
                        ...prev,
                        polygon: result.polygon as unknown as Record<string, unknown> | null,
                        latitude: result.centroid.lat,
                        longitude: result.centroid.lng,
                        area: result.acreage
                      }));
                      // Force map remount to draw new coordinates
                      setMapVersion(v => v + 1);
                    }}
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
              className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4 select-none"
            >
              <div className="flex items-center gap-3 cursor-pointer lg:cursor-default" onClick={() => toggleSection('desc')}>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200/50 shadow-sm shrink-0">
                  <FileText size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">PUBLIC DESCRIPTION</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Visible to all prospective buyers</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 justify-between sm:justify-end">
                <CopyAiPromptButton
                  getLandData={getLandDataForAiPrompt}
                  onSuccess={showToast}
                />
                <button type="button" className="lg:hidden text-slate-400 hover:text-slate-600 transition" onClick={() => toggleSection('desc')}>
                  {sectionsExpanded.desc ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
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

              {/* Box B: Contact & Source Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <span className="w-1 h-3.5 bg-indigo-500 rounded-full"></span>
                  <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Contact & Source Details</h5>
                </div>

                <div className="space-y-4">
                  {/* Contact Source selector */}
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Contact Source</Label>
                    <div className="flex items-center gap-6 mt-1 bg-slate-50/40 border border-slate-200/60 p-3 rounded-xl">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="contactType"
                          value="OWNER"
                          checked={formData.contactType === "OWNER"}
                          onChange={() => handleChange("contactType", "OWNER")}
                          className="w-4 h-4 text-purple-600 border-slate-350 focus:ring-purple-500 focus:ring-2"
                        />
                        <span>Direct Owner</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="contactType"
                          value="BROKER"
                          checked={formData.contactType === "BROKER"}
                          onChange={() => handleChange("contactType", "BROKER")}
                          className="w-4 h-4 text-purple-600 border-slate-350 focus:ring-purple-500 focus:ring-2"
                        />
                        <span>Broker</span>
                      </label>
                    </div>
                  </div>

                  {formData.contactType === "OWNER" ? (
                    <>
                      {/* Owner Full Name */}
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Owner Full Name <span className="text-red-500 font-extrabold">*</span></Label>
                        <Input
                          placeholder="e.g. Ramesh Kumar"
                          value={formData.ownerName}
                          onChange={(e) => handleChange("ownerName", e.target.value)}
                          className="h-11 px-4 bg-slate-50/40 border border-slate-200 hover:border-slate-350 focus:border-purple-600 focus:bg-white focus:ring-2 focus:ring-purple-500/10 font-semibold text-slate-900 text-xs rounded-xl placeholder:text-slate-400/60 placeholder:font-normal"
                        />
                      </div>

                      {/* Owner Contact Phone */}
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
                    </>
                  ) : (
                    <>
                      {/* Searchable Broker Sheet Trigger & Selection */}
                      <div className="space-y-1.5 relative">
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-0.5">Select Broker <span className="text-red-500 font-extrabold">*</span></Label>
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                          {(() => {
                            const selectedBroker = brokers.find(b => b.id === formData.brokerId || b.$id === formData.brokerId);
                            const filteredBrokers = brokers.filter(b => {
                              const q = searchQuery.toLowerCase();
                              return (
                                b.name.toLowerCase().includes(q) ||
                                b.brokerCode.toLowerCase().includes(q) ||
                                b.mobileNumber.toLowerCase().includes(q)
                              );
                            });

                            return (
                              <>
                                {selectedBroker ? (
                                  <div className="bg-slate-50/40 rounded-xl border border-stone-200 p-4 shadow-xs space-y-3 relative overflow-hidden group hover:bg-white transition-all">
                                    {/* Accent decoration */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600"></div>
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <p className="text-[9px] font-bold text-purple-600 uppercase tracking-widest mb-0.5">Assigned Partner Broker</p>
                                        <h4 className="text-sm font-semibold text-stone-900 leading-tight">{selectedBroker.name}</h4>
                                        <p className="text-[10px] text-stone-500 mt-1 font-mono">
                                          Code: {selectedBroker.brokerCode} &bull; {selectedBroker.district}, {selectedBroker.tehsil}
                                        </p>
                                      </div>
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase border shrink-0 ${
                                        selectedBroker.reputation === 'DIAMOND' 
                                          ? 'bg-cyan-50 text-cyan-700 border-cyan-100'
                                          : selectedBroker.reputation === 'GOLD'
                                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                                          : 'bg-slate-50 text-slate-700 border-slate-100'
                                      }`}>
                                        {selectedBroker.reputation}
                                      </span>
                                    </div>
                                    
                                    <div className="pt-2.5 border-t border-stone-150/60 flex items-center justify-between text-[11px] font-semibold text-stone-600">
                                      <div className="flex items-center gap-1.5">
                                        <Phone size={12} className="text-stone-400" />
                                        <span>{selectedBroker.mobileNumber}</span>
                                      </div>
                                      <SheetTrigger asChild>
                                        <button
                                          type="button"
                                          className="text-[10px] font-bold text-purple-600 hover:text-purple-750 uppercase tracking-wider cursor-pointer"
                                        >
                                          Change Broker
                                        </button>
                                      </SheetTrigger>
                                    </div>
                                  </div>
                                ) : (
                                  <SheetTrigger asChild>
                                    <button
                                      type="button"
                                      className="w-full h-24 rounded-xl border border-dashed border-slate-305 hover:border-purple-500 hover:bg-purple-50/10 hover:text-purple-650 transition-all flex flex-col items-center justify-center gap-1.5 text-slate-400 cursor-pointer"
                                    >
                                      <Plus size={18} strokeWidth={2.5} />
                                      <span className="text-[10px] font-black uppercase tracking-widest">Select Partner Broker</span>
                                    </button>
                                  </SheetTrigger>
                                )}

                                <SheetContent className="p-0 bg-white border-l border-stone-200">
                                  <SheetHeader className="p-6 border-b border-stone-100">
                                    <SheetTitle className="text-base font-sans font-bold text-stone-900 leading-none">Select Partner Broker</SheetTitle>
                                    <SheetDescription className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                                      Search and assign a broker from your registered Haryana partner network.
                                    </SheetDescription>
                                  </SheetHeader>
                                  
                                  <div className="p-4 border-b border-stone-50 bg-stone-50/30">
                                    <div className="relative group">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450">
                                        <Search size={14} />
                                      </span>
                                      <Input
                                        type="text"
                                        placeholder="Search name, code, or phone number..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-10 pl-9 pr-4 bg-white border border-slate-200 hover:border-slate-350 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/10 text-xs rounded-xl"
                                        autoFocus
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="overflow-y-auto flex-1 p-6 space-y-4 max-h-[calc(100vh-180px)]">
                                    {filteredBrokers.length > 0 ? (
                                      filteredBrokers.map((b) => {
                                        const isSelected = b.id === formData.brokerId || b.$id === formData.brokerId;
                                        return (
                                          <div
                                            key={b.id || b.$id}
                                            onClick={() => {
                                              handleChange("brokerId", (b.id || b.$id) as string);
                                              setIsSheetOpen(false);
                                              setSearchQuery("");
                                            }}
                                            className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-2 relative overflow-hidden group ${
                                              isSelected 
                                                ? 'border-purple-600 bg-purple-50/10 shadow-xs ring-1 ring-purple-500/10' 
                                                : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/40 bg-white'
                                            }`}
                                          >
                                            {isSelected && (
                                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600"></div>
                                            )}
                                            <div className="flex items-start justify-between gap-3">
                                              <div>
                                                <h4 className="text-sm font-semibold text-stone-900 group-hover:text-purple-650 transition-colors">
                                                  {b.name}
                                                </h4>
                                                <p className="text-[10px] text-stone-500 font-mono mt-0.5">
                                                  Code: {b.brokerCode}
                                                </p>
                                              </div>
                                              <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase border shrink-0 ${
                                                b.reputation === 'DIAMOND' 
                                                  ? 'bg-cyan-50 text-cyan-700 border-cyan-100'
                                                  : b.reputation === 'GOLD'
                                                  ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                  : 'bg-slate-50 text-slate-700 border-slate-100'
                                              }`}>
                                                {b.reputation}
                                              </span>
                                            </div>
                                            
                                            <div className="pt-2 border-t border-stone-100/50 flex flex-col gap-1 text-[10px] text-stone-500">
                                              <div className="flex items-center gap-1.5">
                                                <span className="font-semibold text-stone-700">Region:</span>
                                                <span>{b.district}, {b.tehsil}</span>
                                              </div>
                                              <div className="flex items-center gap-1.5">
                                                <span className="font-semibold text-stone-700">Phone:</span>
                                                <span>{b.mobileNumber}</span>
                                              </div>
                                              {b.officeName && (
                                                <div className="flex items-center gap-1.5">
                                                  <span className="font-semibold text-stone-700">Office:</span>
                                                  <span className="truncate max-w-[200px]">{b.officeName}</span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <div className="p-8 text-center text-xs text-slate-400 font-medium bg-stone-50/30 rounded-xl border border-dashed border-stone-200">
                                        No brokers found matching &quot;{searchQuery}&quot;
                                      </div>
                                    )}
                                  </div>
                                </SheetContent>
                              </>
                            );
                          })()}
                        </Sheet>
                      </div>
                    </>
                  )}
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#e7e5e4] w-full">
          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-stone-950 hover:bg-stone-50 bg-white border border-[#e7e5e4] hover:border-blue-650/40 rounded-full transition flex items-center justify-center gap-1.5 shadow-sm h-9"
            onClick={() => router.back()}
          >
            <ArrowLeft size={13} />
            Back to Lands
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Publish / Save & Update Listing */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#292524] hover:bg-[#0c0a09] border border-[#292524] hover:border-blue-600/30 text-white font-semibold shadow-sm rounded-full px-6 py-2.5 h-9 text-xs uppercase tracking-widest gap-2 transition-all focus:ring-2 focus:ring-blue-500/10 shrink-0"
            >
              {loading ? "Processing..." : (isEdit ? "Save & Update Listing" : "Publish Listing")}
              {!loading && <Rocket size={13} strokeWidth={2.0} />}
            </Button>
          </div>
        </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-full shadow-lg border border-stone-800 animate-in fade-in slide-in-from-bottom-4 duration-300 font-semibold tracking-wide uppercase flex items-center gap-2 select-none pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {toastMessage}
        </div>
      )}
      </form>
    </TooltipProvider>
  )
}
