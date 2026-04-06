import { useState } from "react"
import { MapPin, Check, Share } from "lucide-react"
import { FlattenedLand } from "@/lib/types"
import { shareProperty } from "@/lib/utils"

interface SubHeaderInfoProps {
  data: FlattenedLand
}

export default function SubHeaderInfo({ data }: SubHeaderInfoProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const isCopied = await shareProperty({
      title: data.title,
      slug: data.slug,
      district: data.district,
      village: data.village,
      type: data.type
    });

    if (isCopied) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  return (
    <div className="space-y-4">

      <div className="flex flex-row md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">{data.title}</h1>
          <div className="flex items-center gap-1 text-sm text-gray-600 font-medium">
            <MapPin size={14} className="text-gray-400" />
            <span>{data.village}, {data.district}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <button
            onClick={handleShare}
            className={`flex items-center gap-1.5 transition-all px-2.5 py-1.5 rounded-lg ${copied ? "bg-emerald-50 text-emerald-600" : "hover:bg-gray-100 text-gray-700"
              }`}
          >
            {copied ? <Check size={16} /> : <Share size={16} />}

            {/* Hide on mobile, show from sm and above */}
            <span className="hidden sm:inline font-semibold">
              {copied ? "Copied!" : "Share"}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
