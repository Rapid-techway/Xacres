"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function HeroScrubStory() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative z-30 bg-[#f4f4f5] text-[#050508] pt-32 pb-32 px-6 md:px-12 lg:px-24 rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-['Syne'] font-bold text-[#7c5cfc] tracking-widest uppercase mb-6 text-sm">
            The Xacres Standard
          </p>
          <h2 className="font-['Archivo_Black'] text-5xl md:text-7xl lg:text-[7.5rem] tracking-tighter uppercase leading-[0.85] mb-8">
            NOT YOUR <br /> AVERAGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c5cfc] to-[#5b3fcf]">MARKETPLACE.</span>
          </h2>
          <p className="max-w-2xl text-lg md:text-xl font-medium text-gray-600 leading-relaxed font-['Syne']">
            We don&apos;t allow anyone to just post a listing. Every single land parcel on Xacres is meticulously vetted, verified, and listed <strong className="text-black">exclusively by our administrative team</strong>. We filter the noise so you only see high-potential, authentic lands.
          </p>
        </motion.div>

        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mt-32"
        >
          <StepCard 
            num="01" 
            title="Admin Curated" 
            desc="No spam, no fake listings. Only our expert admins can upload and approve land records."
            delay={0.1}
            isInView={isInView}
          />
          <StepCard 
            num="02" 
            title="Map-First UI" 
            desc="Visualize land exactly where it sits. See highways, canals, and neighboring plots instantly."
            delay={0.2}
            isInView={isInView}
          />
          <StepCard 
            num="03" 
            title="Direct Access" 
            desc="Find a plot you like? Get the exact details and connect instantly without opaque agency barriers."
            delay={0.3}
            isInView={isInView}
          />
        </div>
      </div>
    </section>
  );
}

interface StepCardProps {
  num: string;
  title: string;
  desc: string;
  delay: number;
  isInView: boolean;
}

function StepCard({ num, title, desc, delay, isInView }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className="flex flex-col border-t-2 border-gray-200 pt-8 relative group"
    >
      <div className="absolute top-0 left-0 w-0 h-[2px] bg-[#7c5cfc] group-hover:w-full transition-all duration-700 ease-out" />
      <span className="font-['Archivo_Black'] text-6xl text-gray-300 mb-6 group-hover:text-[#7c5cfc] transition-colors duration-500">{num}</span>
      <h3 className="font-['Archivo_Black'] text-2xl tracking-tight uppercase mb-4">{title}</h3>
      <p className="font-['Syne'] text-gray-600 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}
