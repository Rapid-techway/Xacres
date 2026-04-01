import { Ruler, Navigation, Tag, Info } from "lucide-react"
import { FlattenedLand } from "@/lib/types"

interface SubLandDetailsProps {
  data: FlattenedLand
}

export default function SubLandDetails({ data }: SubLandDetailsProps) {
  return (
    <>
      {/* Summary Info */}
      <div className="pb-8 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {data.type} property in {data.district}
        </h2>
        <p className="text-gray-600 mt-1">
          {data.area} Acres · {data.village} · {data.roadAccess ? "Road Access" : "No Road Access"}
        </p>
      </div>

      {/* Description */}
      <div className="pb-10 border-b border-gray-200">
        <div className="flex items-center py-1">
          <h3 className="text-lg font-semibold text-gray-900">
            More about this land
          </h3>
        </div>

        <p className="text-gray-700 leading-relaxed text-sm lg:text-base max-w-3xl">
          {data.description ||
            "This property hasn&apos;t provided a detailed description yet. Please contact the administrator for more information regarding soil quality, connectivity, and development potential."}
        </p>
      </div>

      {/* Quick Facts */}
      <div className="pb-10 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">What this property offers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <Ruler size={24} className="text-gray-400 stroke-1" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{data.area} Total Acres</p>
              <p className="text-xs text-gray-500">Ample space for {data.type.toLowerCase()} development</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Navigation size={24} className="text-gray-400 stroke-1" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{data.roadAccess ? "Primary Road" : "Path Access"}</p>
              <p className="text-xs text-gray-500">{data.roadAccess ? "Direct connectivity to highway" : "Limited accessibility"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Tag size={24} className="text-gray-400 stroke-1" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{data.type} Zoning</p>
              <p className="text-xs text-gray-500">Categorized under {data.type.toLowerCase()} use</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Info size={24} className="text-gray-400 stroke-1" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Verified Listing</p>
              <p className="text-xs text-gray-500">Documented and mapped accurately</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
