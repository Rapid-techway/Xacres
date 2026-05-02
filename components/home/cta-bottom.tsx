"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTABottom() {
  return (
    <div className="bg-[#05070a]">
      <section className="relative z-20 bg-[#f4f4f5] pt-32 pb-40 px-6 md:px-12 lg:px-24 rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">          <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <p className="font-['Syne'] font-bold text-[#7c5cfc] tracking-widest uppercase mb-6 text-sm">
            The Map is Waiting
          </p>
          <h2 className="font-['Archivo_Black'] text-6xl md:text-8xl lg:text-[10rem] text-[#050508] tracking-tighter uppercase leading-[0.8] mb-12">
            DISCOVER <br /> HARYANA
          </h2>

          <Link href="/lands" className="inline-block group relative">
            <div className="absolute inset-0 bg-[#7c5cfc] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative bg-[#050508] text-white px-12 py-5 rounded-full font-['Syne'] font-bold text-lg tracking-wide uppercase group-hover:bg-[#7c5cfc] transition-colors duration-500">
              Start Exploring
            </div>
          </Link>
        </motion.div>
        </div>
      </section>
    </div>
  );
}
