"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { TooltipProvider } from "@/components/ui/tooltip"
import { landService } from "@/services/land.service"
import { brokerService } from "@/services/broker.service"
import { CreateFullLandPayload, LandImage, FlattenedLand, Broker } from "@/lib/types"
import { HARYANA_TEHSILS, HARYANA_TEHSIL_VILLAGES } from "@/lib/static"

// Import card subcomponents
import Header from "./Header"
import StatusBar from "./StatusBar"
import PublicInfoCard from "./PublicInfoCard"
import LocationCard from "./LocationCard"
import MapCard from "./MapCard"
import FeasibilityCard from "./FeasibilityCard"
import MediaCard from "./MediaCard"
import DescriptionCard from "./DescriptionCard"
import AdminOnlyCard from "./AdminOnlyCard"
import FooterActions from "./FooterActions"

interface LandFormProps {
  initialData?: FlattenedLand | null
}

export interface FullFormData {
  title: string;
  slug: string;
  listedPrice: number;
  area: number;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  landType: string;
  roadAccess: boolean;
  images: LandImage[];
  description: string;
  isPublic: boolean;
  polygon: Record<string, unknown> | null;
  contactType: 'OWNER' | 'BROKER';
  ownerName: string;
  ownerPhoneNumber: string;
  expectedPrice: number;
  minimumPrice: number;
  negotiable: boolean;
  adminNotes: string;
  brokerId: string;
  tehsil: string;
  roadWidthM: number | null;
  approvalType: string;
  cluCategory: string;
  municipalLimitType: string;
  accessType: string;
  greenBelt: boolean;
  greenBeltWidthM: number | null;
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
  const [mapVersion, setMapVersion] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

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
    if (formData.landType && formData.landType.trim() !== '') {
      data.landType = formData.landType
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
    if (formData.roadAccess && formData.roadWidthM !== null && formData.roadWidthM !== undefined) {
      data.roadWidthM = formData.roadWidthM
    }
    if (formData.approvalType && formData.approvalType.trim() !== '') {
      data.approvalType = formData.approvalType
    }
    if (formData.approvalType === 'CLU' && formData.cluCategory && formData.cluCategory.trim() !== '') {
      data.cluCategory = formData.cluCategory
    }
    if (formData.municipalLimitType && formData.municipalLimitType.trim() !== '') {
      data.municipalLimitType = formData.municipalLimitType
    }
    if (formData.accessType && formData.accessType.trim() !== '') {
      data.accessType = formData.accessType
    }
    if (formData.greenBelt !== undefined) {
      data.greenBelt = formData.greenBelt
    }
    if (formData.greenBelt && formData.greenBeltWidthM !== null && formData.greenBeltWidthM !== undefined) {
      data.greenBeltWidthM = formData.greenBeltWidthM
    }
    return data
  }

  // Mobile Accordion state toggles
  const [sectionsExpanded, setSectionsExpanded] = useState({
    publicInfo: true,
    location: true,
    map: true,
    feasibility: true,
    media: true,
    desc: true,
    adminOnly: true
  })

  // Controlled form state matching schema
  const [formData, setFormData] = useState<FullFormData>({
    // Public Land Table
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    listedPrice: initialData?.listedPrice || 0,
    area: initialData?.area || 0,
    district: initialData?.district || "",
    tehsil: initialData?.tehsil || getInitialTehsil() || "",
    village: initialData?.village || "",
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    landType: initialData?.landType || "Agricultural",
    roadAccess: initialData?.roadAccess ?? true,
    images: (initialData?.images?.map((img: string | LandImage) => {
      if (typeof img === 'string') return { url: img, isPrimary: false };
      return { url: img.url || "", isPrimary: !!img.isPrimary };
    }) || []) as LandImage[],
    description: initialData?.description || "",
    isPublic: initialData?.isPublic ?? true,
    polygon: initialData?.polygon || null,
    brokerId: initialData?.brokerId || "",
    roadWidthM: initialData?.roadWidthM || null,
    approvalType: initialData?.approvalType || "",
    cluCategory: initialData?.cluCategory || "",
    municipalLimitType: initialData?.municipalLimitType || "",
    accessType: initialData?.accessType || "",
    greenBelt: initialData?.greenBelt ?? false,
    greenBeltWidthM: initialData?.greenBeltWidthM || null,

    // Private Admin Table
    contactType: initialData?.contactType || (initialData?.brokerId ? "BROKER" : "OWNER"),
    ownerName: initialData?.ownerName || "",
    ownerPhoneNumber: initialData?.ownerPhoneNumber || "",
    expectedPrice: initialData?.expectedPrice || initialData?.listedPrice || 0,
    minimumPrice: initialData?.minimumPrice || ((initialData?.listedPrice || 0) * 0.9),
    negotiable: initialData?.negotiable ?? true,
    adminNotes: initialData?.adminNotes || ""
  })

  const availableTehsils = formData.district ? HARYANA_TEHSILS[formData.district] || [] : []
  const availableVillages = selectedTehsil ? HARYANA_TEHSIL_VILLAGES[selectedTehsil] || [] : []

  const refreshBrokers = useCallback(async () => {
    try {
      const res = await brokerService.getBrokers({ limit: 1000 })
      setBrokers(res.documents)
    } catch (err) {
      console.error("Failed to load brokers for selection:", err)
    }
  }, [])

  // Load brokers on mount
  useEffect(() => {
    refreshBrokers()
  }, [refreshBrokers])

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

  const isInitialMount = useRef(true);

  // Auto-focus map on District, Tehsil, or Village selection using Nominatim geocoding
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const district = formData.district;
    const tehsil = selectedTehsil;
    const village = formData.village;

    if (!district) return;

    let query = `${district}, Haryana, India`;
    if (tehsil) {
      query = `${tehsil}, ${district}, Haryana, India`;
      if (village) {
        query = `${village}, ${tehsil}, ${district}, Haryana, India`;
      }
    }

    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);

          setFormData(prev => {
            if (prev.latitude === lat && prev.longitude === lng) return prev;
            return {
              ...prev,
              latitude: lat,
              longitude: lng
            };
          });
        }
      } catch (error) {
        console.error("Failed to geocode location:", error);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchCoordinates();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formData.district, selectedTehsil, formData.village]);

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
    if (!formData.listedPrice || formData.listedPrice <= 0) {
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
      if (!formData.ownerPhoneNumber.trim()) {
        alert("Owner Contact Phone is required.");
        return;
      }
    } else {
      if (!formData.brokerId) {
        alert("Broker Selection is required.");
        return;
      }
    }
    if (!formData.approvalType) {
      alert("Approval Type is required.");
      return;
    }
    if (formData.approvalType === "CLU" && !formData.cluCategory) {
      alert("CLU Category is required when Approval Type is CLU.");
      return;
    }
    if (!formData.municipalLimitType) {
      alert("Municipal Limit Type is required.");
      return;
    }
    if (!formData.accessType) {
      alert("Access Type is required.");
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
          listedPrice: formData.listedPrice,
          area: formData.area,
          district: formData.district,
          village: formData.village,
          latitude: formData.latitude,
          longitude: formData.longitude,
          landType: formData.landType,
          roadAccess: formData.roadAccess,
          images: formData.images,
          description: formData.description,
          isPublic: formData.isPublic,
          brokerId: formData.contactType === 'BROKER' ? (formData.brokerId || null) : null,
          tehsil: formData.tehsil || null,
          roadWidthM: formData.roadAccess ? formData.roadWidthM : null,
          approvalType: formData.approvalType || null,
          cluCategory: formData.approvalType === 'CLU' ? formData.cluCategory : null,
          municipalLimitType: formData.municipalLimitType || null,
          accessType: formData.accessType || null,
          greenBelt: formData.greenBelt,
          greenBeltWidthM: formData.greenBelt ? formData.greenBeltWidthM : null
        },
        admin: {
          contactType: formData.contactType,
          ownerName: formData.contactType === 'OWNER' ? formData.ownerName : null,
          ownerPhoneNumber: formData.contactType === 'OWNER' ? formData.ownerPhoneNumber : null,
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
        {/* Render Header */}
        <Header
          isEdit={isEdit}
          loading={loading}
          slug={formData.slug}
        />

        {/* Render Status Bar */}
        <StatusBar
          isPublic={formData.isPublic}
          landId={(initialData?.id || initialData?.$id || 'draft-uuid-key') as string}
          copiedId={copiedId}
          onCopyId={copyListingId}
        />

        {/* Render Public Listing Information & Location Details columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          <PublicInfoCard
            formData={formData}
            handleChange={handleChange}
            sectionsExpanded={sectionsExpanded}
            toggleSection={toggleSection}
            areaUnit={areaUnit}
            setAreaUnit={setAreaUnit}
            areaInputVal={areaInputVal}
            setAreaInputVal={setAreaInputVal}
            customizeTitle={customizeTitle}
            setCustomizeTitle={setCustomizeTitle}
          />

          <LocationCard
            formData={formData}
            handleChange={handleChange}
            sectionsExpanded={sectionsExpanded}
            toggleSection={toggleSection}
            selectedTehsil={selectedTehsil}
            setSelectedTehsil={setSelectedTehsil}
            availableTehsils={availableTehsils}
            availableVillages={availableVillages}
          />
        </div>

        {/* Render Map boundaries */}
        <MapCard
          formData={formData}
          handleChange={handleChange}
          sectionsExpanded={sectionsExpanded}
          toggleSection={toggleSection}
          mapVersion={mapVersion}
          setMapVersion={setMapVersion}
          setFormData={setFormData}
        />

        {/* Render Land Feasibility Planning */}
        <FeasibilityCard
          formData={formData}
          handleChange={handleChange}
          sectionsExpanded={sectionsExpanded}
          toggleSection={toggleSection}
        />

        {/* Render Visual Assets & Public Description columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          <MediaCard
            formData={formData}
            sectionsExpanded={sectionsExpanded}
            toggleSection={toggleSection}
            uploading={uploading}
            isDragging={isDragging}
            handleImageUpload={handleImageUpload}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            togglePrimary={togglePrimary}
            removeImage={removeImage}
          />

          <DescriptionCard
            formData={formData}
            handleChange={handleChange}
            sectionsExpanded={sectionsExpanded}
            toggleSection={toggleSection}
            getLandDataForAiPrompt={getLandDataForAiPrompt}
            showToast={showToast}
          />
        </div>

        {/* Render Admin Only Section */}
        <AdminOnlyCard
          formData={formData}
          handleChange={handleChange}
          sectionsExpanded={sectionsExpanded}
          toggleSection={toggleSection}
          brokers={brokers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={setIsSheetOpen}
          refreshBrokers={refreshBrokers}
        />

        {/* Render Footer Actions */}
        <FooterActions
          isEdit={isEdit}
          loading={loading}
          onBack={() => router.back()}
        />

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
