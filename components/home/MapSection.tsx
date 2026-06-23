import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function MapSection() {
  const districts = ['Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Jhajjar', 'Gurugram'];

  return (
    <section className="relative w-full bg-[#f8f9fa] py-20 lg:py-28 overflow-hidden font-sans border-t border-slate-100">
      {/* 🌟 Radial white glow behind the map for visual depth */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-white/0 to-white/70 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* 📝 Left Content Column */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Pill Badge */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-stone-500 uppercase mb-4">
              <span className="w-[3px] h-3 bg-blue-600 rounded-full" />
              <span>What we do</span>
            </div>

            {/* Heading */}
            <h2 className="text-[40px] sm:text-[52px] lg:text-[60px] font-sans font-black tracking-tight leading-[1.08] text-stone-900 mt-6">
              Connecting Land <br className="hidden sm:inline" />
              With Technology To <br />
              <span className="block text-blue-600 mt-1">Simplify Land Buying.</span>
            </h2>

            {/* Description */}
            <p className="text-stone-500 text-sm sm:text-base md:text-md leading-relaxed mt-6 max-w-xl font-medium">
              Xacres is a map-first land discovery platform that helps you explore, evaluate and connect with verified land opportunities across Haryana.
            </p>

            {/* CTA Button */}
            <div className="mt-8">
              <Link
                href="/lands"
                className="inline-flex items-center gap-4 bg-stone-950 hover:bg-stone-900 text-white font-semibold pl-6 pr-2 py-2 rounded-full transition-all active:scale-[0.98] shadow-md group"
              >
                <span className="text-sm">Explore Haryana Map</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-950 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </div>
              </Link>
            </div>

            {/* Top Districts Section */}
            <div className="mt-14 w-full">
              <h3 className="text-lg font-black text-stone-900 tracking-tight">
                Top Districts In Haryana
              </h3>

              <div className="flex flex-wrap gap-3 mt-4">
                {districts.map((district) => (
                  <Link
                    key={district}
                    href={`/lands?district=${district}`}
                    className="bg-white hover:bg-stone-50 text-stone-800 font-bold px-5 py-2.5 rounded-full text-xs transition-all border border-stone-200/40 hover:border-stone-300/60 shadow-sm active:scale-95 hover:shadow"
                  >
                    {district}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* 🗺️ Right Map Column */}
          <div className="lg:col-span-6 flex items-center justify-center relative mt-8 lg:mt-0 -mx-6 w-[calc(100%+3rem)] lg:mx-0 lg:w-full">
            {/* White/Soft glow backdrop wrapper */}
            <div className="relative w-full max-w-[780px] aspect-square flex items-center justify-center">
              {/* Radial glow background directly behind the map */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/80 to-transparent rounded-full opacity-70 blur-2xl z-0 scale-110" />

              <div className="relative w-full h-full z-10 scale-[1.6] lg:scale-[1.35]">
                <Image
                  src="/images/haryana-map.webp"
                  alt="Haryana Interactive District Map"
                  fill
                  sizes="(max-w-7xl) 100vw, 50vw"
                  className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.12)] select-none filter brightness-100"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
