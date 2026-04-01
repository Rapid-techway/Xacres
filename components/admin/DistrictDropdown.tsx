"use client"

import { useState } from "react"
import { MapPin, Check, ChevronDown, Search } from "lucide-react"
import { HARYANA_DISTRICTS } from "@/lib/static"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DistrictDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DistrictDropdown({ value, onChange }: DistrictDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDistricts = HARYANA_DISTRICTS.filter(d => 
    d.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="w-full h-12 flex items-center justify-between px-5 bg-gray-50/50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-100 transition-all font-medium text-sm outline-none"
        >
          <span className={value ? "text-gray-900" : "text-gray-400"}>
            {value || "Select District"}
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-[--radix-dropdown-menu-trigger-width] p-3 bg-white border border-gray-100 rounded-3xl shadow-2xl z-[100]"
        align="start"
      >
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()} // Prevent Radix from closing on Space/Arrows in input
            className="w-full h-10 pl-10 pr-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"
            autoFocus
          />
        </div>
        
        <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-0.5">
          {filteredDistricts.length > 0 ? (
            filteredDistricts.map((district) => {
              const isSelected = value === district
              return (
                <DropdownMenuItem
                  key={district}
                  onSelect={() => {
                    onChange(district)
                    setSearchQuery("")
                  }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-all focus:bg-blue-50 focus:text-blue-600 ${
                    isSelected ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                      <MapPin size={12} />
                    </div>
                    <span className="text-sm">{district}</span>
                  </div>
                  {isSelected && <Check size={14} />}
                </DropdownMenuItem>
              )
            })
          ) : (
            <div className="py-8 text-center text-xs text-gray-400 font-medium">
              No matching districts
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
