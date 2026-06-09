'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Play,
  Sparkles,
  ArrowUpRight,
  MapPin,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import Logo from '@/components/navbar/Logo';

export default function HeroLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black font-sans flex flex-col justify-between">
      {/* 🌲 Background Image with dark left gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/land-hero.png"
          alt="Haryana Agricultural Land Sunset"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center select-none"
        />
        {/* Left-heavy dark linear gradient to guarantee title readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/20 md:from-black/75 md:via-black/30 md:to-transparent z-10" />
      </div>

      {/* 🚀 Header Navigation */}
      <header className="relative w-full max-w-7xl mx-auto px-6 py-2 md:py-3 flex items-center justify-between z-30">
        <div className="h-14 flex items-center overflow-hidden  -ml-3">
          <Logo />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-10">
          <Link href="/lands" className="text-white font-semibold text-sm hover:text-white/80 transition relative pb-1.5 group">
            Lands
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
          </Link>
          <Link href="/ai" className="text-white/70 font-semibold text-sm hover:text-white transition pb-1.5">
            AI Search
          </Link>
          <Link href="#" className="text-white/70 font-semibold text-sm hover:text-white transition pb-1.5">
            About Us
          </Link>
          <Link href="#" className="text-white/70 font-semibold text-sm hover:text-white transition pb-1.5">
            Contact
          </Link>
        </nav>

        {/* Right CTA / Action buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/ai"
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 border-stone-800/40"
          >
            <Sparkles size={14} className="text-blue-400" />
            Chat with AI
          </Link>

          <Link
            href="/lands"
            className="w-10 h-10 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all active:scale-95"
            title="Explore Lands"
          >
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 text-white bg-white/5 border border-white/10 backdrop-blur-md rounded-xl hover:bg-white/10"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* 📱 Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-6 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="h-14 flex items-center overflow-hidden [&_img]:!h-14 [&_img]:!w-auto -ml-3">
                <Logo variant="light" />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white bg-white/10 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-6 mt-12">
              <Link
                href="/lands"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold text-white flex items-center justify-between"
              >
                Lands <ChevronRight size={18} className="text-stone-500" />
              </Link>
              <Link
                href="/ai"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold text-white flex items-center justify-between"
              >
                AI Search <ChevronRight size={18} className="text-stone-500" />
              </Link>
              <Link
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold text-white/70 flex items-center justify-between"
              >
                About Us <ChevronRight size={18} className="text-stone-500" />
              </Link>
              <Link
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold text-white/70 flex items-center justify-between"
              >
                Contact <ChevronRight size={18} className="text-stone-500" />
              </Link>
            </nav>
          </div>

          <div className="space-y-4 pb-8">
            <Link
              href="/ai"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-white/10 border border-white/20 text-white font-bold p-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/20 transition"
            >
              <Sparkles size={16} className="text-blue-400" />
              Chat with AI
            </Link>
          </div>
        </div>
      )}

      {/* 🎨 Main Hero Body / Grid Section */}
      <main className="relative w-full max-w-7xl mx-auto px-6 z-20 flex-grow flex flex-col lg:flex-row items-start lg:items-end justify-between pb-12 lg:pb-24 gap-12 mt-16 lg:mt-0">

        {/* Left Hero Title Area */}
        <div className="flex flex-col items-start max-w-2xl">
          <h1 className="text-[60px] sm:text-[80px] md:text-[100px] font-sans font-black tracking-tight leading-[0.95] text-white">
            <span
              className="
    block
    bg-gradient-to-b
    from-white/95
    via-[#fff6dc]/80
    to-[#f5d28e]/45
    bg-clip-text
    text-transparent

    drop-shadow-[0_4px_24px_rgba(255,220,150,0.22)]

    [text-shadow:
      0_1px_0_rgba(255,255,255,0.35),
      0_8px_32px_rgba(255,220,120,0.18)
    ]

    tracking-[-0.04em]
  "
            >
              Land.
            </span>

            <span
              className="
    block
    bg-gradient-to-b
    from-white/95
    via-[#fff6dc]/80
    to-[#f5d28e]/45
    bg-clip-text
    text-transparent

    drop-shadow-[0_4px_24px_rgba(255,220,150,0.22)]

    [text-shadow:
      0_1px_0_rgba(255,255,255,0.35),
      0_8px_32px_rgba(255,220,120,0.18)
    ]

    tracking-[-0.04em]
  "
            >
              Clarity.
            </span>
            <span className="block text-blue-600 relative mt-1">
              Haryana.
              <span className="absolute -bottom-3 left-0 w-24 h-[5px] bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.6)]" />
            </span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base font-semibold tracking-[0.2px] mt-10 max-w-md leading-relaxed uppercase opacity-90">
            Genuine land opportunities. <br />
            Direct. Verified. Hassle-free.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-8 w-full sm:w-auto">
            {/* Primary CTA */}
            <Link
              href="/lands"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white font-bold pl-7 pr-3 py-2.5 rounded-full transition-all flex items-center justify-between gap-4 shadow-lg shadow-blue-900/30 active:scale-[0.98] cursor-pointer"
            >
              <span className="text-[13px] tracking-wider uppercase">Explore Lands</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 shrink-0">
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </div>
            </Link>

            {/* Secondary Play Button */}
            <Link
              href="#"
              className="group flex items-center gap-3.5 hover:text-white text-stone-300 transition-colors py-2"
            >
              <div className="w-10 h-10 rounded-full border border-white/20 group-hover:border-white/50 bg-white/5 flex items-center justify-center text-white transition-all group-hover:scale-105 shrink-0">
                <Play size={14} fill="currentColor" className="translate-x-[1px]" />
              </div>
              <span className="text-xs font-black tracking-widest uppercase">See How It Works</span>
            </Link>
          </div>
        </div>

        {/* Right Glassmorphic Featured Card */}
        <div className="w-full lg:w-auto flex justify-end">
          <div className="w-full md:w-[400px] lg:w-[420px] bg-white/5 backdrop-blur-md border border-white/10 rounded-[28px] p-6 shadow-2xl shadow-black/40 flex items-center justify-between gap-4 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/15">
            <div className="flex items-center gap-5">
              {/* Pin Icon with glow */}
              <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                {/* Glow ring */}
                <div className="absolute inset-0 bg-blue-600/10 blur-md rounded-full pointer-events-none scale-75" />
                <MapPin className="text-blue-400 relative z-10" size={26} strokeWidth={2.5} />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-white font-bold text-lg leading-tight tracking-tight">Rohtak, Haryana</span>
                <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">2.5 Acre Agricultural Land</span>
                <span className="text-blue-400 font-black text-sm tracking-wide mt-1">₹ 38,00,000</span>
              </div>
            </div>

            <Link
              href="/lands"
              className="w-10 h-10 rounded-full border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-all active:scale-95 shrink-0"
              title="View Details"
            >
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
