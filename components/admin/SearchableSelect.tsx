"use client"

import { useState } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder = "Search...",
  disabled = false
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOptions = options.filter(o => 
    o.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="w-full h-11 flex items-center justify-between px-4 bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 transition-all font-semibold text-xs text-slate-800 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
          <span className={value ? "text-slate-900 font-semibold" : "text-slate-400 font-medium"}>
            {value || placeholder}
          </span>
          <ChevronDown size={14} className={`text-slate-450 transition-transform duration-250 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-[--radix-dropdown-menu-trigger-width] p-2 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-[100] animate-in fade-in-50 zoom-in-95 duration-150"
        align="start"
      >
        {options.length >= 5 && (
          <div className="relative mb-2">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()} // Prevent Radix from closing on space key
              className="w-full h-9 pl-9 pr-3 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 outline-none"
              autoFocus
            />
          </div>
        )}
        
        <div className="max-h-52 overflow-y-auto custom-scrollbar space-y-0.5">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => {
              const isSelected = value === opt
              return (
                <DropdownMenuItem
                  key={opt}
                  onSelect={() => {
                    onChange(opt)
                    setSearchQuery("")
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all focus:bg-emerald-50 focus:text-emerald-700 outline-none text-xs ${
                    isSelected ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-650 font-medium"
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <Check size={12} className="text-emerald-600" />}
                </DropdownMenuItem>
              )
            })
          ) : (
            <div className="py-6 text-center text-xs text-slate-400 font-medium">
              No matching options
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
