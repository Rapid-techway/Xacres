'use client';

import Logo from './Logo';
import NavbarSearch from './NavbarSearch';
import MobileSearch from './MobileSearch';
import ViewToggle from './ViewToggle';
import { UserCircle2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  // Check if we are on a land detail page (e.g., /lands/some-id)
  const isLandDetailPage = pathname.startsWith('/lands/') && pathname !== '/lands';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
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

        {/* Right: User Actions / Admin Only Profile Icon */}
        <div className="hidden md:flex flex-1 flex justify-end min-w-[40px] sm:min-w-0">
          <button className="flex items-center gap-2 p-2 border border-border rounded-full hover:shadow-md transition-shadow bg-background">
            <UserCircle2 size={24} className="text-foreground/60" />
          </button>
        </div>
      </div>
    </header>
  );
}
