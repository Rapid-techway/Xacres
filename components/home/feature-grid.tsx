"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Map, Lock, Zap } from "lucide-react";

const features = [
  { title: "Admin Exclusivity", desc: "No public listings. Only admins can create and verify land records to guarantee absolute trust and quality.", colSpan: "md:col-span-2", icon: ShieldCheck, bg: "bg-[#f4f4f5]", dark: false },
  { title: "Spatial UX", desc: "Explore Haryana via an immersive interactive map.", colSpan: "md:col-span-1", icon: Map, bg: "bg-[#e8e0ff]", dark: false },
  { title: "Data Integrity", desc: "Exact coordinates, genuine photos, and verified sizing.", colSpan: "md:col-span-1", icon: Lock, bg: "bg-[#f4f4f5]", dark: false },
  { title: "Zero Noise", desc: "Skip the endless scrolling of fake properties. We've done the filtering for you.", colSpan: "md:col-span-2", icon: Zap, bg: "bg-[#050508]", dark: true },
];

export function FeatureGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 bg-white px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
          <h2 className="font-['Archivo_Black'] text-5xl md:text-7xl uppercase tracking-tighter leading-[0.9] text-[#050508]">
            Built on <br/><span className="text-[#6b4cff]">Trust</span>
          </h2>
          <p className="font-['Syne'] text-gray-500 max-w-sm text-lg font-medium pb-2">
            The platform is engineered to remove friction, eliminate scams, and present only the finest parcels.
          </p>
        </div>
        
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 md:p-10 flex flex-col justify-between overflow-hidden group ${f.colSpan} ${f.bg}`}
            >
              <div className="relative z-10">
                <f.icon className={`w-10 h-10 ${f.dark ? "text-[#7c5cfc]" : "text-[#050508]"}`} strokeWidth={1.5} />
              </div>
              <div className="relative z-10 max-w-md">
                <h3 className={`font-['Archivo_Black'] text-3xl uppercase tracking-tight mb-3 ${f.dark ? "text-white" : "text-[#050508]"}`}>{f.title}</h3>
                <p className={`font-['Syne'] font-medium text-lg leading-relaxed ${f.dark ? "text-gray-400" : "text-gray-600"}`}>{f.desc}</p>
              </div>
              
              {/* Subtle hover effect */}
              <div className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px] transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${f.dark ? "bg-[#7c5cfc]/30" : "bg-[#7c5cfc]/10"}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
