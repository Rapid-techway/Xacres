'use client';

import { forwardRef } from "react"
import { formatPrice } from "@/lib/utils"
import LeadForm from "./LeadForm"

interface PriceStickyCardProps {
  price: number
  area: number
  type: string
  title: string
  slug: string
  landId: string
}

const PriceStickyCard = forwardRef<HTMLDivElement, PriceStickyCardProps>(
  ({ price, area, type, title, slug, landId }, ref) => {

    const pricePerAcre = price / area

    const handleWhatsApp = () => {
      const url = `${window.location.origin}/lands/${slug}`;

      const message = `Hi, I am interested in this property: ${title}.\nCan I get more details on it?\nLink: ${url}`;

      const whatsappUrl = `https://wa.me/919817285068?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    };

    return (
      <div ref={ref} className="lg:relative">
        <div className="lg:sticky lg:top-24 bg-white border border-gray-200 rounded-3xl p-6 shadow-lg shadow-gray-100/40 space-y-6">

          {/* 🔥 PRICE SECTION */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-gray-900 tracking-tight">
                ₹ {formatPrice(price)}
              </span>
              <span className="text-gray-400 text-sm">
                total
              </span>
            </div>

            <p className="text-xs text-blue-600 font-medium">
              ₹{formatPrice(pricePerAcre)} per acre
            </p>
          </div>

          {/* 🔥 META INFO (lighter, no heavy box) */}
          <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50/60 rounded-xl px-4 py-3 px-10">
            <span>{area} Acres</span>
            <span className="text-gray-300">|</span>
            <span>{type}</span>
          </div>

          {/* 🔥 CTA */}
          <button
            onClick={handleWhatsApp}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Contact via WhatsApp
          </button>

          {/* Elegant OR divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">OR</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* Lead capture system */}
          <LeadForm landId={landId} landTitle={title} />

        </div>
      </div>
    );
  }
);

PriceStickyCard.displayName = "PriceStickyCard";

export default PriceStickyCard;