'use client';

export default function HighlightsSection() {
  return (
    <section className="w-full bg-white py-16 md:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        
        {/* Top Content Row: Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column (span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 leading-tight">
              Smarter Way to<br />Discover Land
            </h2>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-md font-normal">
              Xacres is a map-first land discovery platform that helps you explore verified land opportunities across Haryana with speed, accuracy, and ease.
            </p>
          </div>

          {/* Right Column (span 7) */}
          <div className="lg:col-span-7">
            <h2 className="text-2xl md:text-[36px] leading-[1.25] tracking-tight text-neutral-800">
              <span className="font-bold text-neutral-900">Maximizing Property</span>{' '}
              <span className="font-light text-neutral-500">
                Growth Through Cutting-Edge Investment Strategies
              </span>
            </h2>
          </div>
        </div>

        {/* Bottom Row: Stats left-aligned, no vertical dividers, no top border */}
        <div className="mt-16 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 md:gap-x-12 pb-8">
          
          {/* Stat 1 */}
          <div className="flex flex-col items-start justify-start text-left">
            <span className="text-3xl md:text-5xl font-semibold text-neutral-900 tracking-tight">25+</span>
            <span className="text-neutral-500 text-xs md:text-sm font-normal mt-2.5 leading-tight">
              District Coverage
            </span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-start justify-start text-left">
            <span className="text-3xl md:text-5xl font-semibold text-neutral-900 tracking-tight">24/7</span>
            <span className="text-neutral-500 text-xs md:text-sm font-normal mt-2.5 leading-tight">
              AI Powered Land Discovery
            </span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-start justify-start text-left">
            <span className="text-3xl md:text-5xl font-semibold text-neutral-900 tracking-tight">92%</span>
            <span className="text-neutral-500 text-xs md:text-sm font-normal mt-2.5 leading-tight">
              Satellite Map Accuracy
            </span>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col items-start justify-start text-left">
            <span className="text-3xl md:text-5xl font-semibold text-neutral-900 tracking-tight">Instant</span>
            <span className="text-neutral-500 text-xs md:text-sm font-normal mt-2.5 leading-tight">
              WhatsApp Connect
            </span>
          </div>

        </div>

        {/* Single thin divider line at the very bottom of the section */}
        <div className="w-full h-[1px] bg-neutral-200" />

      </div>
    </section>
  );
}
