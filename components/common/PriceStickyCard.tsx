import { formatPrice } from "@/lib/utils"

interface PriceStickyCardProps {
  price: number
  area: number
  type: string
}

export default function PriceStickyCard({ price, area, type }: PriceStickyCardProps) {
  const pricePerAcre = price / area

  return (
    <div className="lg:relative">
      <div className="lg:sticky lg:top-24 bg-white border border-gray-200 rounded-3xl p-6 shadow-xl shadow-gray-100/50 space-y-6">
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">₹{formatPrice(price)}</span>
            <span className="text-gray-500 font-medium text-sm">total price</span>
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">₹{formatPrice(pricePerAcre)} per acre</p>
        </div>

        <div className="grid grid-cols-2 border border-gray-300 rounded-xl overflow-hidden divide-x divide-gray-300">
           <div className="p-3 bg-white">
              <p className="text-[10px] font-bold text-gray-900 uppercase">AREA</p>
              <p className="text-sm text-gray-600">{area} Acres</p>
           </div>
           <div className="p-3 bg-white">
              <p className="text-[10px] font-bold text-gray-900 uppercase">TYPE</p>
              <p className="text-sm text-gray-600">{type}</p>
           </div>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-4">
           <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium underline underline-offset-4 decoration-gray-200">Base Price</span>
              <span className="text-gray-900 font-semibold">₹{formatPrice(price)}</span>
           </div>
           <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100 pt-4">
              <span className="text-gray-900 font-bold">Total (INR)</span>
              <span className="text-gray-900 font-bold">₹{formatPrice(price)}</span>
           </div>
        </div>
      </div>
    </div>
  )
}
