'use client';

import Image from 'next/image';
import { Mic } from 'lucide-react';

export default function ValuesSection() {
  return (
    <section className="w-full bg-[#f8f9fa] pb-24 px-4 md:px-6 font-sans">
      <div className="max-w-[1380px] mx-auto">
        
        {/* 🚀 Header: Title on Left, Description on Right */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 lg:mb-16">
          <div className="max-w-2xl">
            {/* Category tag */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-stone-500 uppercase mb-4">
              <span className="w-[3px] h-3 bg-blue-600 rounded-full" />
              <span>Our Values</span>
            </div>
            
            {/* Main title */}
            <h2 className="text-[36px] sm:text-[46px] lg:text-[56px] font-sans font-black tracking-tight leading-[1.08] text-stone-900">
              Designed for <br />
              modern land <span className="text-blue-600">discovery.</span>
            </h2>
          </div>
          
          <div className="max-w-md">
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed font-medium">
              Xacres brings technology and real-world insights together to make land search simple, visual and reliable.
            </p>
          </div>
        </div>

        {/* 📦 Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: Real Area Visualization (Left Tall Card) */}
          <div className="lg:col-span-4 bg-stone-950 rounded-3xl overflow-hidden relative min-h-[380px] sm:min-h-[460px] lg:min-h-[580px] flex flex-col justify-end p-6 sm:p-8 border border-stone-200/20 shadow-md">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/bento-image.png"
                alt="Real Area Visualization Aerial Sunset"
                fill
                sizes="(max-w-7xl) 100vw, 33vw"
                className="object-cover object-center select-none"
                priority
              />
              {/* Overlay gradient to darken bottom for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 z-10" />
            </div>

            {/* Bottom Content */}
            <div className="relative z-20">
              <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
                Real Area <br />
                Visualization
              </h3>
              <div className="w-10 h-[2px] bg-white rounded-full mt-4 mb-4" />
              <p className="text-stone-200 text-sm leading-relaxed font-medium">
                See the actual area with high quality maps and real world views.
              </p>
            </div>
          </div>

          {/* Card 2: AI Assisted Search (Middle Tall Card) */}
          <div className="lg:col-span-3 bg-[#0c0c0e] border border-stone-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[380px] sm:min-h-[460px] lg:min-h-[580px] shadow-sm">
            <div>
              {/* Soundwave wavebar logo */}
              <div className="flex items-center gap-1 mb-8">
                <span className="w-[3px] h-3 bg-white/40 rounded-full" />
                <span className="w-[3px] h-6 bg-white/75 rounded-full" />
                <span className="w-[3px] h-4 bg-white/60 rounded-full" />
                <span className="w-[3px] h-7 bg-white/90 rounded-full" />
                <span className="w-[3px] h-5 bg-white/50 rounded-full" />
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                AI Assisted <br />
                Search
              </h3>
              <div className="w-10 h-[2px] bg-blue-600 rounded-full mt-4 mb-4" />
              <p className="text-stone-400 text-sm leading-relaxed font-medium">
                Search naturally using voice or conversation.
              </p>
            </div>

            {/* Bottom active voice visualizer graphic */}
            <div className="w-full flex flex-col gap-6 items-center">
              {/* Animated waveform loops */}
              <div className="w-full flex items-center justify-center gap-1.5 h-16 opacity-75">
                <span className="w-[3px] h-6 bg-blue-500/40 rounded-full animate-pulse" />
                <span className="w-[3px] h-10 bg-blue-500/70 rounded-full animate-pulse [animation-delay:0.1s]" />
                <span className="w-[3px] h-14 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <span className="w-[3px] h-8 bg-blue-400 rounded-full animate-pulse [animation-delay:0.3s]" />
                <span className="w-[3px] h-12 bg-blue-500/80 rounded-full animate-pulse [animation-delay:0.15s]" />
                <span className="w-[3px] h-5 bg-blue-500/40 rounded-full animate-pulse [animation-delay:0.4s]" />
              </div>

              {/* Mic Icon circle */}
              <div className="w-12 h-12 rounded-full border border-stone-800 bg-stone-900/30 flex items-center justify-center text-white shadow-inner">
                <Mic size={16} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Right Column Bento Box Wrapper */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Card 3: Easy to Connect via WhatsApp (Top Horizontal Card) */}
            <div className="bg-white border border-stone-200/35 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[220px] lg:h-[280px]">
              <div>
                {/* Custom dark WhatsApp logo */}
                <svg className="w-8 h-8 text-stone-900 mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>

                <h3 className="text-xl font-bold text-stone-900 tracking-tight leading-tight">
                  Easy to Connect via WhatsApp
                </h3>
                <div className="w-10 h-[2px] bg-stone-300 rounded-full mt-3 mb-3" />
                <p className="text-stone-500 text-sm leading-relaxed font-medium">
                  Connect directly with us in one tap. No middlemen.
                </p>
              </div>
            </div>

            {/* Nested Row (2 side-by-side cards at the bottom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:h-[280px]">
              
              {/* Card 4: Send Requests */}
              <div className="bg-[#edf4ff] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[190px] lg:min-h-0">
                <div>
                  {/* Outline Chat Icon */}
                  <svg className="w-8 h-8 text-stone-900 mb-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 18a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 13.517 3.5 12.79 3.5 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>

                  <h3 className="text-xl font-bold text-stone-900 tracking-tight leading-tight">
                    Send Requests
                  </h3>
                  <div className="w-10 h-[2px] bg-blue-600 rounded-full mt-3 mb-3" />
                  <p className="text-stone-500 text-xs leading-relaxed font-medium">
                    Send property requests and get notified when matching lands are available.
                  </p>
                </div>
              </div>

              {/* Card 5: Verified Listings */}
              <div className="bg-white border border-stone-200/35 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[190px] lg:min-h-0">
                <div>
                  {/* Outline Shield Icon */}
                  <svg className="w-8 h-8 text-stone-900 mb-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>

                  <h3 className="text-xl font-bold text-stone-900 tracking-tight leading-tight">
                    Verified Listings
                  </h3>
                  <div className="w-10 h-[2px] bg-stone-300 rounded-full mt-3 mb-3" />
                  <p className="text-stone-500 text-xs leading-relaxed font-medium">
                    Every listing is verified for transparency and trust.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
