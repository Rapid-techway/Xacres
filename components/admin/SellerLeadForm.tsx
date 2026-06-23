"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Check, 
  Phone, 
  Loader2, 
  User, 
  Compass, 
  Upload, 
  Trash2, 
  ExternalLink,
  X,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DistrictDropdown from "./DistrictDropdown";
import { sellerService } from "@/services/seller-lead.service";
import { landService } from "@/services/land.service";
import { SellerLead, SellerLeadImage } from "@/lib/types";
import Image from "next/image";

interface SellerLeadFormProps {
  initialData?: SellerLead | null;
}

export default function SellerLeadForm({ initialData = null }: SellerLeadFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form Fields State
  const [name, setName] = useState(initialData?.name || "");
  const [phone, setPhone] = useState(initialData?.phoneNumber || "");
  const [district, setDistrict] = useState(initialData?.district || "");
  const [locationName, setLocationName] = useState(initialData?.locationName || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [adminNotes, setAdminNotes] = useState(initialData?.adminNotes || "");

  // Image Upload State (Edit Mode: linked in DB; New Mode: temporary local strings)
  const [images, setImages] = useState<SellerLeadImage[]>(initialData?.images || []);
  const [tempImages, setTempImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lightbox State
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPhone(initialData.phoneNumber || "");
      setDistrict(initialData.district || "");
      setLocationName(initialData.locationName || "");
      setNotes(initialData.notes || "");
      setAdminNotes(initialData.adminNotes || "");
      setImages(initialData.images || []);
    }
  }, [initialData]);

  // Unified image array to render
  const displayImages = isEdit
    ? images.map(img => ({ id: img.id || "", url: img.imageUrl }))
    : tempImages.map(url => ({ id: url, url: url }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !district || !locationName.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isEdit && initialData?.id) {
        await sellerService.updateSellerLead(initialData.id, {
          name: name.trim(),
          phoneNumber: phone.trim(),
          district,
          locationName: locationName.trim(),
          notes: notes.trim() || undefined,
          adminNotes: adminNotes.trim() || undefined
        });
        router.push("/admin/seller-leads");
      } else {
        await sellerService.createSellerLead({
          name: name.trim(),
          phoneNumber: phone.trim(),
          district,
          locationName: locationName.trim(),
          notes: notes.trim() || undefined,
          adminNotes: adminNotes.trim() || undefined,
          imageUrls: tempImages
        });
        router.push("/admin/seller-leads");
      }
    } catch (err: unknown) {
      console.error("Error saving seller lead:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to save seller lead. Please try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);

  // Image Upload Handlers
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      // Upload to Cloudflare R2 inside 'seller-leads' subfolder
      const uploadRes = await landService.uploadFile(file, 'seller-leads');
      
      if (isEdit && initialData?.id) {
        // Link image to seller lead in database (Edit Mode)
        const newImg = await sellerService.addSellerLeadImage(initialData.id, uploadRes.url);
        setImages(prev => [...prev, newImg]);
      } else {
        // Local state accumulation (New Mode)
        setTempImages(prev => [...prev, uploadRes.url]);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await uploadFile(files[0]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
    await uploadFile(file);
  };

  const handleRemoveImage = async (imageId: string) => {
    if (!imageId) return;
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    if (isEdit) {
      try {
        await sellerService.deleteSellerLeadImage(imageId);
        setImages(prev => prev.filter(img => img.id !== imageId));
      } catch (err) {
        console.error("Failed to delete image:", err);
        alert("Failed to delete image. Please try again.");
      }
    } else {
      setTempImages(prev => prev.filter(url => url !== imageId));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 relative">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
          <Link href="/admin/seller-leads" className="hover:text-blue-650 transition-colors">Seller Leads</Link>
          <span className="mx-1.5 opacity-50 text-stone-400">/</span>
          <span className="text-stone-855 font-semibold">
            {isEdit ? `Edit: ${initialData?.name}` : "Add Seller Lead"}
          </span>
        </nav>
        <h1 className="text-4xl font-sans font-bold tracking-tight text-stone-900 leading-none">
          {isEdit ? "Edit Seller Lead Details" : "Add Seller Lead"}
        </h1>
        <p className="text-xs text-stone-505 mt-2 font-medium tracking-[0.15px]">
          {isEdit
            ? "Modify registered offline or online land seller details and upload documents."
            : "Manually register land seller details collected from offline channels (phone calls, meetings, referrals)."
          }
        </p>
      </div>

      {/* Main Grid - Always 2 column */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Form Fields Card */}
            <div className="bg-white border border-stone-200/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4 mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100/40">
                  <User size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-stone-800 uppercase tracking-widest leading-none">Seller Details</h3>
                  <p className="text-[10px] text-stone-405 font-bold mt-1 uppercase tracking-wider">Contact & Location Information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Seller Name */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider ml-0.5">
                    Seller Name *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                      <User size={14} />
                    </span>
                    <Input
                      type="text"
                      placeholder="Seller's full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
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
                      disabled={loading}
                      required
                      className="pl-9 h-11 bg-stone-50/40 border-stone-205 focus:border-blue-600 focus:bg-white focus:ring-blue-500/10 hover:border-stone-300 rounded-xl font-semibold text-xs text-stone-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* District */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-stone-505 uppercase tracking-wider ml-0.5">
                    District *
                  </Label>
                  <DistrictDropdown
                    value={district}
                    onChange={(val) => setDistrict(val)}
                  />
                </div>

                {/* Location Name */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-stone-505 uppercase tracking-wider ml-0.5">
                    Location Name *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                      <Compass size={14} />
                    </span>
                    <Input
                      type="text"
                      placeholder="Village, Tehsil, Sector, Colony..."
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      disabled={loading}
                      required
                      className="pl-9 h-11 bg-stone-50/40 border-stone-205 focus:border-blue-600 focus:bg-white focus:ring-blue-500/10 hover:border-stone-300 rounded-xl font-semibold text-xs text-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* Seller Notes */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-stone-505 uppercase tracking-wider ml-0.5">
                  Seller Notes / Description
                </Label>
                <Textarea
                  placeholder="Details provided by seller (e.g. size, road width, expected price, availability)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={loading}
                  rows={3}
                  className="min-h-24 rounded-xl bg-stone-50/40 border-stone-200 focus:border-blue-600 focus:bg-white focus:ring-blue-500/10 transition-all p-3.5 text-xs font-semibold leading-relaxed text-stone-850 placeholder:text-stone-400/60"
                />
              </div>

              {/* CRM Internal Notes */}
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-stone-505 uppercase tracking-wider ml-0.5">
                  Internal CRM Notes
                </Label>
                <Textarea
                  placeholder="Internal verification details, call summaries, evaluation, next actions..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  disabled={loading}
                  rows={3}
                  className="min-h-24 rounded-xl bg-stone-50/40 border-stone-200 focus:border-blue-600 focus:bg-white focus:ring-blue-500/10 transition-all p-3.5 text-xs font-semibold leading-relaxed text-stone-855 placeholder:text-stone-400/60"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-650 border border-red-150 rounded-xl text-xs font-semibold">
                  {error}
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200/60">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-705 hover:text-stone-950 hover:bg-stone-50 bg-white border border-stone-200 hover:border-blue-650/40 rounded-full transition flex items-center justify-center gap-1.5 shadow-sm h-9"
              >
                <ArrowLeft size={13} />
                Cancel
              </button>

              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#292524] hover:bg-[#0c0a09] border border-[#292524] hover:border-blue-655/30 text-white font-semibold shadow-sm rounded-full px-6 py-2.5 h-9 text-xs uppercase tracking-widest gap-2 transition-all focus:ring-2 focus:ring-blue-500/10 shrink-0"
              >
                {loading ? "Saving..." : (isEdit ? "Update Lead" : "Create Seller Lead")}
                {!loading && <Check size={13} strokeWidth={2.0} />}
              </Button>
            </div>

          </form>
        </div>

        {/* Right Column: Attached Lead Images */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm flex flex-col min-h-[440px] justify-between">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100/40">
                    <ImageIcon size={16} />
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-stone-800 uppercase tracking-widest leading-none">
                      Attached Lead Images
                    </h2>
                    <p className="text-[10px] text-stone-405 font-bold mt-1 uppercase tracking-wider">
                      Images uploaded by administrative staff
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-150 text-blue-750 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                  {displayImages.length} {displayImages.length === 1 ? 'Image' : 'Images'}
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
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleFileUploadClick}
                  className={`w-full py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition group cursor-pointer ${
                    isDragging 
                      ? "border-blue-600 bg-blue-50/50" 
                      : "border-stone-200 hover:border-blue-600/40 hover:bg-stone-50/30"
                  }`}
                >
                  <div className={`p-3 border rounded-xl transition shadow-sm ${
                    isDragging || uploading
                      ? "border-blue-100 bg-blue-50 text-blue-650"
                      : "bg-stone-50 border-stone-200 text-stone-400 group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600"
                  }`}>
                    {uploading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Upload size={20} />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-stone-850">
                      {uploading ? "Uploading image..." : "Upload New Image"}
                    </p>
                    <p className="text-[10px] text-stone-450 font-semibold uppercase tracking-wider mt-1">
                      {uploading ? "Please wait" : "Click or drag image here"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Images Grid */}
              {displayImages.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-stone-50 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 mx-auto">
                    <ImageIcon size={18} />
                  </div>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">No images attached</p>
                  <p className="text-[11px] text-stone-455 font-medium max-w-[240px] mx-auto leading-relaxed">
                    Upload land documents or lead photos to link them with this seller lead.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {displayImages.map((img) => (
                    <div 
                      key={img.id}
                      onClick={() => setActiveLightboxImage(img.url)}
                      className="group relative aspect-video bg-stone-50 border border-stone-150 rounded-xl overflow-hidden shadow-sm hover:shadow cursor-zoom-in transition"
                    >
                      <Image
                        src={img.url} 
                        alt="Lead Image" 
                        fill
                        className="object-cover select-none"
                      />
                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition duration-150" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setActiveLightboxImage(img.url)}
                          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-850 flex items-center justify-center transition shadow-md border-none cursor-pointer"
                          title="Open full size"
                        >
                          <ExternalLink size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
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

      {/* Image Lightbox Modal */}
      {activeLightboxImage && (
        <div 
          className="fixed inset-0 z-[110] bg-black/85 flex items-center justify-center p-4 animate-in fade-in duration-250"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={activeLightboxImage} 
              alt="Enlarged Lead Image" 
              className="max-w-full max-h-full object-contain rounded-lg select-none shadow-2xl"
            />
            <button 
              onClick={() => setActiveLightboxImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition backdrop-blur-md border border-white/15"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
