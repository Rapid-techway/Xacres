import { Ruler, Navigation, Tag, Info } from "lucide-react"
import { FlattenedLand } from "@/lib/types"

interface SubLandDetailsProps {
  data: FlattenedLand
}

export default function SubLandDetails({ data }: SubLandDetailsProps) {
  return (
    <div className="space-y-10">

      {/* 🔥 HERO SUMMARY */}
      <div className="space-y-3 pb-6 border-b border-gray-200">
        
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">
          {data.landType} land in {data.district}
        </h2>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
          <span>{data.area} Acres</span>
          <span className="text-gray-300">•</span>
          <span>{data.village}</span>

          {data.roadAccess && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-blue-600 font-medium">Road Access</span>
            </>
          )}
        </div>
      </div>

      {/* 🔥 DESCRIPTION */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-[3px] h-5 bg-blue-500 rounded-full"></span>
          About this land
        </h3>

        <p className="text-gray-700 leading-relaxed text-sm sm:text-base max-w-2xl pl-3">
          {data.description ||
            "This property hasn’t provided a detailed description yet. Contact for more details."}
        </p>
      </div>

      {/* 🔥 QUICK FACTS */}
      <div className="space-y-5">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-[3px] h-5 bg-blue-500 rounded-full"></span>
          What this property offers
        </h3>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 pl-3">

          {/* Area */}
          <div className="group p-3 sm:p-4 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm transition">
            <div className="flex items-center justify-between mb-2">
              <Ruler size={18} className="text-gray-500 group-hover:text-blue-600 transition" />
            </div>

            <p className="text-sm font-semibold text-gray-900">
              {data.area} Acres
            </p>
            <p className="text-[11px] text-gray-500">
              {data.landType}
            </p>
          </div>

          {/* Road */}
          <div className="group p-3 sm:p-4 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm transition">
            <div className="flex items-center justify-between mb-2">
              <Navigation size={18} className="text-gray-500 group-hover:text-blue-600 transition" />
            </div>

            <p className="text-sm font-semibold text-gray-900">
              {data.roadAccess ? "Road Access" : "Path Access"}
            </p>
            <p className="text-[11px] text-gray-500">
              {data.roadAccess 
                ? (data.roadWidthM ? `${data.roadWidthM} Meters Width` : "Connected")
                : "Limited"
              }
            </p>
          </div>

          {/* Type */}
          <div className="group p-3 sm:p-4 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm transition">
            <div className="flex items-center justify-between mb-2">
              <Tag size={18} className="text-gray-500 group-hover:text-blue-600 transition" />
            </div>

            <p className="text-sm font-semibold text-gray-900">
              {data.landType}
            </p>
            <p className="text-[11px] text-gray-500">
              Land type
            </p>
          </div>

          {/* Verified */}
          <div className="group p-3 sm:p-4 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm transition">
            <div className="flex items-center justify-between mb-2">
              <Info size={18} className="text-gray-500 group-hover:text-blue-600 transition" />
            </div>

            <p className="text-sm font-semibold text-gray-900">
              Verified
            </p>
            <p className="text-[11px] text-gray-500">
              Documented
            </p>
          </div>

        </div>
      </div>

      {/* 🔥 FEASIBILITY & PLANNING DETAILS */}
      <div className="space-y-5">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-[3px] h-5 bg-blue-500 rounded-full"></span>
          Feasibility & Planning
        </h3>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 pl-3">
          {/* Approval Type */}
          <div className="group p-3 sm:p-4 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm transition">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Approval Type</p>
            <p className="text-sm font-semibold text-gray-900">
              {data.approvalType || "Not Specified"}
            </p>
            {data.approvalType === "CLU" && data.cluCategory && (
              <p className="text-xs text-gray-600 mt-1 font-medium">
                {data.cluCategory}
              </p>
            )}
          </div>

          {/* Municipal Limits */}
          <div className="group p-3 sm:p-4 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm transition">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Municipal Jurisdiction</p>
            <p className="text-sm font-semibold text-gray-900">
              {data.municipalLimitType || "Not Specified"}
            </p>
          </div>

          {/* Access Road */}
          <div className="group p-3 sm:p-4 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm transition">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Road Connection</p>
            <p className="text-sm font-semibold text-gray-900">
              {data.roadAccess ? (data.accessType || "Yes (Road Connected)") : "Path Access Only"}
            </p>
          </div>

          {/* Green Belt Zone */}
          <div className="group p-3 sm:p-4 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm transition">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Green Belt Zone</p>
            <p className="text-sm font-semibold text-gray-900">
              {data.greenBelt ? "Yes (Within Green Belt)" : "No (Free Zone)"}
            </p>
            {data.greenBelt && data.greenBeltWidthM ? (
              <p className="text-xs text-gray-600 mt-1 font-medium">
                Width: {data.greenBeltWidthM} Meters
              </p>
            ) : null}
          </div>
        </div>
      </div>

    </div>
  )
}