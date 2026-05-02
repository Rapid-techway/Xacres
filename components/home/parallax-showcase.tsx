"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const districts1 = ["Rohtak", "Hisar", "Karnal", "Panipat", "Sonipat", "Jind", "Sirsa"];
const districts2 = ["Gurugram", "Faridabad", "Ambala", "Bhiwani", "Kurukshetra", "Rewari", "Kaithal"];

export function ParallaxShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-20%", "0%"]);

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-[#050508] py-32 md:py-48 text-white">
      
      <div className="max-w-4xl mx-auto px-6 md:px-12 mb-24 md:mb-40 text-center relative z-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-['Syne'] font-bold text-[#7c5cfc] tracking-widest uppercase mb-6 text-sm"
        >
          Hyper-Local Focus
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-['Archivo_Black'] text-5xl md:text-7xl lg:text-[7rem] tracking-tighter uppercase leading-[0.9] mb-8"
        >
          Mapping the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b5563] to-[#9ca3af]">Heartland</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="font-['Syne'] text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto"
        >
          From canal-fed farmlands in Hisar to highway-adjacent plots in Rohtak, our administrators are constantly charting high-potential zones across all 22 districts of Haryana.
        </motion.p>
      </div>

      <div className="flex flex-col gap-8 md:gap-12 opacity-50 relative z-10">
        <motion.div style={{ x: x1 }} className="flex whitespace-nowrap gap-8 md:gap-16 items-center">
          {[...districts1, ...districts1, ...districts1, ...districts1].map((d, i) => (
            <span 
              key={`d1-${i}`} 
              className="font-['Archivo_Black'] text-6xl md:text-8xl lg:text-[9rem] tracking-tighter uppercase text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.8)] hover:[-webkit-text-stroke:2px_#7c5cfc] transition-colors duration-500 cursor-default"
            >
              {d}
            </span>
          ))}
        </motion.div>
        
        <motion.div style={{ x: x2 }} className="flex whitespace-nowrap gap-8 md:gap-16 items-center">
          {[...districts2, ...districts2, ...districts2, ...districts2].map((d, i) => (
            <span 
              key={`d2-${i}`} 
              className="font-['Archivo_Black'] text-6xl md:text-8xl lg:text-[9rem] tracking-tighter uppercase text-white hover:text-[#7c5cfc] transition-colors duration-500 cursor-default"
            >
              {d}
            </span>
          ))}
        </motion.div>
      </div>
      
      {/* Edge Gradients to blend the marquee smoothly */}
      <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-[#050508] to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-[#050508] to-transparent z-20 pointer-events-none" />

    </section>
  );
}
