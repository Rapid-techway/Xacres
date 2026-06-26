"use client"

import Image from "next/image"
import { FileImage, Trash2, CheckCircle2, Circle, Plus, Loader2, ChevronUp, ChevronDown } from "lucide-react"
import { LandImage } from "@/lib/types"

interface MediaCardProps {
  formData: {
    images: LandImage[];
  };
  sectionsExpanded: { media: boolean };
  toggleSection: (section: "media") => void;
  uploading: boolean;
  isDragging: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  togglePrimary: (index: number) => void;
  removeImage: (index: number) => void;
}

export default function MediaCard({
  formData,
  sectionsExpanded,
  toggleSection,
  uploading,
  isDragging,
  handleImageUpload,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  togglePrimary,
  removeImage,
}: MediaCardProps) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-200/60 p-6 md:p-8 shadow-sm hover:shadow-md/20 transition-all duration-300 space-y-6">
      {/* Header with Accordion Toggle for Mobile */}
      <div
        className="flex items-center justify-between border-b border-slate-100 pb-4 cursor-pointer lg:cursor-default select-none"
        onClick={() => toggleSection("media")}
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
                sizes="33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Delete action overlay */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 p-1.5 bg-black/50 hover:bg-red-600 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
              >
                <Trash2 size={11} strokeWidth={2.5} />
              </button>

              {/* Primary toggle */}
              <button
                type="button"
                onClick={() => togglePrimary(i)}
                className={`absolute bottom-1.5 left-1.5 right-1.5 py-1 rounded-md text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all z-10 cursor-pointer ${img.isPrimary
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
  )
}
