"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "../../ui/textarea"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../ui/sheet"
import { Lock, ChevronUp, ChevronDown, Phone, Search, Plus, ExternalLink, RefreshCw } from "lucide-react"
import { Broker } from "@/lib/types"
import { FullFormData } from "./LandFormRoot"

interface AdminOnlyCardProps {
  formData: {
    expectedPrice: number;
    minimumPrice: number;
    negotiable: boolean;
    contactType: "OWNER" | "BROKER";
    ownerName: string;
    ownerPhoneNumber: string;
    brokerId: string;
    adminNotes: string;
  };
  handleChange: (field: keyof FullFormData, value: string | number | boolean | null) => void;
  sectionsExpanded: { adminOnly: boolean };
  toggleSection: (section: "adminOnly") => void;
  brokers: Broker[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isSheetOpen: boolean;
  setIsSheetOpen: (val: boolean) => void;
  refreshBrokers: () => Promise<void>;
}

export default function AdminOnlyCard({
  formData,
  handleChange,
  sectionsExpanded,
  toggleSection,
  brokers,
  searchQuery,
  setSearchQuery,
  isSheetOpen,
  setIsSheetOpen,
  refreshBrokers,
}: AdminOnlyCardProps) {
  return (
    <div className="bg-white rounded-[24px] border border-purple-100/70 shadow-sm overflow-hidden w-full hover:shadow-md/20 transition-all duration-300">
      {/* Section Header with Accordion Toggle */}
      <div
        className="bg-purple-50/50 border-b border-purple-100/60 px-6 py-4 flex items-center justify-between cursor-pointer lg:cursor-default select-none"
        onClick={() => toggleSection("adminOnly")}
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
                <div className={`w-8 h-4 rounded-full relative p-0.5 transition-colors duration-200 shrink-0 ${formData.negotiable ? 'bg-purple-600' : 'bg-slate-200'}`}>
                  <div className={`w-3.5 h-3 bg-white rounded-full shadow-sm transition-transform duration-200 ${formData.negotiable ? 'translate-x-4' : 'translate-x-0'}`} />
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
                        value={formData.ownerPhoneNumber}
                        onChange={(e) => handleChange("ownerPhoneNumber", e.target.value)}
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
                            b.phoneNumber.toLowerCase().includes(q)
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
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase border shrink-0 ${selectedBroker.reputation === 'DIAMOND'
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
                                    <span>{selectedBroker.phoneNumber}</span>
                                  </div>
                                  <SheetTrigger asChild>
                                    <button
                                      type="button"
                                      className="text-[10px] font-bold text-purple-600 hover:text-purple-750 uppercase tracking-wider cursor-pointer bg-transparent border-0 outline-none"
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
                                  className="w-full h-24 rounded-xl border border-dashed border-slate-305 hover:border-purple-500 hover:bg-purple-50/10 hover:text-purple-650 transition-all flex flex-col items-center justify-center gap-1.5 text-slate-400 cursor-pointer bg-transparent"
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

                              <div className="p-4 pb-2 border-b border-stone-50 bg-stone-50/30 flex items-center justify-between gap-3">
                                <a
                                  href="/admin/brokers"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-8 px-3.5 bg-slate-100 hover:bg-slate-200 border border-stone-200 text-stone-700 font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                                >
                                  <Plus size={11} strokeWidth={2.5} />
                                  New Broker
                                  <ExternalLink size={10} />
                                </a>

                                <button
                                  type="button"
                                  onClick={refreshBrokers}
                                  className="h-8 px-3.5 bg-white hover:bg-slate-50 border border-stone-200 text-stone-700 font-semibold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                                >
                                  <RefreshCw size={11} />
                                  Refresh List
                                </button>
                              </div>

                              <div className="p-4 border-b border-stone-50 bg-stone-50/30">
                                <div className="relative group">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-455">
                                    <Search size={14} />
                                  </span>
                                  <input
                                    type="text"
                                    placeholder="Search name, code, or phone number..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 pl-9 pr-4 bg-white border border-slate-200 hover:border-slate-350 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/10 text-xs rounded-xl outline-none"
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
                                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-2 relative overflow-hidden group ${isSelected
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
                                          <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase border shrink-0 ${b.reputation === 'DIAMOND'
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
                                            <span>{b.phoneNumber}</span>
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
  )
}
