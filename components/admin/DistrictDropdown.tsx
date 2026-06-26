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

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.stopPropagation();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const content = e.currentTarget.closest('[role="menu"]') as HTMLElement;
      if (content) {
        const firstItem = content.querySelector('[role="menuitem"]') as HTMLElement;
        if (firstItem) {
          firstItem.focus();
        }
      }
      return;
    }

    if (e.key === "Escape") {
      return;
    }

    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Enter") {
      e.stopPropagation();
    }
  };

  const handleItemKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowUp" && index === 0) {
      e.preventDefault();
      const content = e.currentTarget.closest('[role="menu"]') as HTMLElement;
      if (content) {
        const input = content.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) {
          input.focus();
          const val = input.value;
          input.value = "";
          input.value = val;
        }
      }
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="w-full h-11 flex items-center justify-between px-4 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all font-semibold text-sm text-slate-800 outline-none cursor-pointer"
        >
          <span className={value ? "text-slate-900" : "text-slate-400 font-medium"}>
            {value || "Select District"}
          </span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-250 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-[--radix-dropdown-menu-trigger-width] p-2 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-[100] animate-in fade-in-50 zoom-in-95 duration-150"
        align="start"
      >
        <div className="relative mb-2">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full h-9 pl-9 pr-3 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 outline-none"
            autoFocus
          />
        </div>
        
        <div className="max-h-52 overflow-y-auto custom-scrollbar space-y-0.5">
          {filteredDistricts.length > 0 ? (
            filteredDistricts.map((district, index) => {
              const isSelected = value === district
              return (
                <DropdownMenuItem
                  key={district}
                  onSelect={() => {
                    onChange(district)
                    setSearchQuery("")
                  }}
                  onKeyDown={(e) => handleItemKeyDown(e, index)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all focus:bg-emerald-50 focus:text-emerald-700 outline-none ${
                    isSelected ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-650 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-md ${isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                      <MapPin size={11} />
                    </div>
                    <span className="text-xs">{district}</span>
                  </div>
                  {isSelected && <Check size={12} className="text-emerald-600" />}
                </DropdownMenuItem>
              )
            })
          ) : (
            <div className="py-6 text-center text-xs text-slate-400 font-medium">
              No matching districts
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
