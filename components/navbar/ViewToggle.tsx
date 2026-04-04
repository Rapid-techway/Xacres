'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ViewToggle() {
  const pathname = usePathname();

  const isMapActive = pathname === '/';
  const isLandsActive = pathname === '/lands';

  return (
    <div className="flex items-center gap-4 px-2">
      <Link 
        href="/" 
        className="relative group py-2.5 outline-none"
      >
        <div className={`flex items-center gap-2.5 text-[15px] font-medium transition-colors duration-300 ${isMapActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>
          <Map size={18} strokeWidth={isMapActive ? 2.5 : 2} />
          <span>Map</span>
        </div>
        
        {/* Consistent Bold Underline */}
        {isMapActive ? (
          <motion.div
            layoutId="nav-underline"
            className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full shadow-[0_1px_4px_rgba(var(--primary),0.2)]"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        ) : (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
        )}
      </Link>

      <div className="w-[1px] h-5 bg-gray-200 mx-1" />

      <Link 
        href="/lands" 
        className="relative group py-2.5 outline-none"
      >
        <div className={`flex items-center gap-2.5 text-[15px] font-medium transition-colors duration-300 ${isLandsActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>
          <LayoutGrid size={18} strokeWidth={isLandsActive ? 2.5 : 2} />
          <span>Lands</span>
        </div>

        {/* Consistent Bold Underline */}
        {isLandsActive ? (
          <motion.div
            layoutId="nav-underline"
            className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full shadow-[0_1px_4px_rgba(var(--primary),0.2)]"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        ) : (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
        )}
      </Link>
    </div>
  );
}