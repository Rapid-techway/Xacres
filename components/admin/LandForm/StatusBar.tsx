"use client"

import { Check, Copy } from "lucide-react"

interface StatusBarProps {
  isPublic: boolean;
  landId: string;
  copiedId: boolean;
  onCopyId: () => void;
}

export default function StatusBar({ isPublic, landId, copiedId, onCopyId }: StatusBarProps) {
  return (
    <div className="bg-white border border-slate-200/60 rounded-[20px] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm w-full">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${isPublic ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse' : 'bg-slate-300'}`}></span>
        <span className="text-xs font-semibold text-slate-650 flex items-center gap-2">
          Listing Status:
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${isPublic
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            : 'bg-slate-150 text-slate-600 border border-slate-200'
            }`}>
            {isPublic ? 'Listed Publicly' : 'Hidden Draft'}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
        <span>LISTING ID:</span>
        <span className="font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100/50">
          {landId}
        </span>
        <button
          type="button"
          onClick={onCopyId}
          className="text-slate-400 hover:text-emerald-600 hover:scale-105 transition active:scale-95 cursor-pointer"
          title="Copy Listing ID"
        >
          {copiedId ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
        </button>
      </div>
    </div>
  )
}
