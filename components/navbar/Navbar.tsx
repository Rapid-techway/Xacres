import Logo from './Logo';
import NavbarSearch from './NavbarSearch';
import { UserCircle2 } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <Logo />
        </div>

        {/* Center: Search Filters */}
        <div className="flex-[2] flex justify-center px-4">
          <NavbarSearch />
        </div>

        {/* Right: User Actions / Admin Only Profile Icon */}
        <div className="flex-1 flex justify-end">
          <button className="flex items-center gap-2 p-2 border border-border rounded-full hover:shadow-md transition-shadow bg-background">
            <UserCircle2 size={24} className="text-foreground/60" />
          </button>
        </div>
      </div>
    </header>
  );
}
