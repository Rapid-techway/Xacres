'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IndianRupee, Sprout } from 'lucide-react';
import { Land } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface LandCardProps {
  land: Land;
}

export default function LandCard({ land }: LandCardProps) {
  const primaryImage = land.images.find(img => img.isPrimary)?.url || 
                       land.images[0]?.url || 
                       "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="group cursor-pointer flex flex-col gap-3">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-200">
        <Link href={`/lands/${land.slug}`}>
          <Image
            src={primaryImage}
            alt={land.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <Link href={`/lands/${land.slug}`} className="flex-1">
            <h3 className="font-bold text-[15px] text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {land.village}, {land.district}
            </h3>
          </Link>
        </div>
        
        <p className="text-[14px] text-gray-500 flex items-center gap-1.5 font-medium">
          <Sprout size={14} className="text-gray-400" />
          {land.area} Acres • {land.type || 'Agricultural'}
        </p>
        
        <p className="text-[14px] text-gray-500 font-medium">
          Available now
        </p>

        <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
          <span className="flex items-center text-[16px] font-bold text-gray-900">
            <IndianRupee size={14} strokeWidth={3} className="mr-0.5" />
            {formatPrice(land.price)}
          </span >
          <span className="text-[14px] text-gray-500 font-medium">total</span>
          <span className="mx-1 text-gray-300">•</span>
          <span className="text-[14px] text-gray-500 font-medium">
            ₹{formatPrice(Math.round(land.price / land.area))}/ac
          </span>
        </div>
      </div>
    </div>
  );
}
