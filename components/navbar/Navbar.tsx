'use client';

import Logo from './Logo';
import NavbarSearch from './NavbarSearch';
import MobileSearch from './MobileSearch';
import ViewToggle from './ViewToggle';
import { Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useSavedLandsStore } from '@/store/useSavedLandsStore';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();
  const { loadSaved } = useSavedLandsStore();

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);
  
  // Check if we are on a land detail page (e.g., /lands/some-id)
  const isLandDetailPage = pathname.startsWith('/lands/') && pathname !== '/lands';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border rounded-b-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 h-20 flex items-center justify-between relative sm:gap-2">
        {/* Left: Logo - Hidden on very small mobile to give space to search */}
        <div className="flex-1 flex justify-start min-w-[150px] sm:min-w-0 ">
          <Logo />
        </div>

        {/* Center: Search Filters OR View Toggle */}
        <div className="flex-[2] flex justify-center sm:px-4 min-w-0">
          {isLandDetailPage ? (
            <ViewToggle />
          ) : (
            <>
              <div className="hidden md:block w-full">
                <NavbarSearch />
              </div>
              <div className="block md:hidden w-full justify-center">
                <MobileSearch />
              </div>
            </>
          )}
        </div>

        {/* Right: Saved Properties Link */}
        <div className="hidden md:flex flex-1 flex justify-end min-w-[40px] sm:min-w-0">
          <Link 
            href="/saved"
            className={`flex items-center justify-center p-2.5 border rounded-full hover:shadow-md hover:scale-105 active:scale-95 transition-all bg-background text-stone-600 ${
              pathname === '/saved' ? 'border-red-200 text-red-500 bg-red-50/20' : 'border-border'
            }`}
            title="Saved Properties"
          >
            <Heart size={20} className={pathname === '/saved' ? 'fill-red-500 text-red-500' : ''} />
          </Link>
        </div>
      </div>
    </header>
  );
}
