'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useScroll, motion, useTransform, MotionValue } from 'framer-motion';
import { ArrowUpRight, MapPin } from 'lucide-react';

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  // Animates word opacity from 0.25 (muted gray) to 1.0 (bright white) based on scroll progress
  const opacity = useTransform(progress, range, [0.25, 1]);
  
  return (
    <motion.span style={{ opacity }} className="inline-block mr-2 sm:mr-3 text-white">
      {children}
    </motion.span>
  );
}

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const text = "We are a team of visionary builders, strategists, and innovators dedicated to creating exceptional land discovery experiences. Our mission is to connect every piece of land with the right opportunity.";
  const words = text.split(' ');

  const listContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section className="w-full bg-[#f8f9fa] pb-24 md:px-6 font-sans">
      {/* 🖤 Premium Rounded Black Card */}
      <div className="max-w-[1380px] mx-auto bg-black border border-stone-900 rounded-[32px] p-6 md:p-12 lg:p-16 relative overflow-hidden z-10 shadow-2xl">
        
        {/* About Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-stone-900/60 border border-stone-800 rounded-full text-stone-300 font-semibold text-xs tracking-wide">
            About Xacres <span className="text-[10px] text-blue-500">✦</span>
          </span>
        </motion.div>

        {/* Scroll Reveals Text */}
        <motion.div 
          ref={containerRef} 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto text-center text-[22px] sm:text-[32px] lg:text-[38px] font-sans font-semibold tracking-[-0.03em] leading-[1.3] text-stone-500 mb-16 px-4"
        >
          {words.map((word, i) => {
            const start = 0.25 + (i / words.length) * 0.45;
            const end = start + 0.05;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </motion.div>

        {/* Bottom Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-6">
          
          {/* 🌎 Left Graphic Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 1.03 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-[#0c0c0e] border border-stone-900 rounded-3xl overflow-hidden relative min-h-[380px] lg:min-h-[460px] flex flex-col justify-end group"
          >
            {/* Haryana globe image background */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/world-haryana.png"
                alt="Haryana World Connection View"
                fill
                sizes="(max-w-7xl) 100vw, 50vw"
                className="object-cover object-center select-none transition-transform duration-700 group-hover:scale-102"
                priority
              />
              {/* Radial gradient overlay to darken borders */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/20 z-10" />
            </div>

            {/* Subtle moving light sweep effect */}
            <motion.div 
              initial={{ x: "-150%" }}
              animate={{ x: "150%" }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none z-15"
            />

            {/* Explore Badge/CTA */}
            <div className="absolute bottom-6 left-6 z-20">
              <Link
                href="/lands"
                className="inline-flex items-center gap-3 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white font-semibold pl-5 pr-2 py-1.5 rounded-full border border-white/10 text-xs transition-all active:scale-[0.98] group"
              >
                <span>Explore Haryana with Xacres</span>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={12} strokeWidth={2.5} />
                </div>
              </Link>
            </div>
          </motion.div>

          {/* 🛠️ Right Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-5 bg-[#0c0c0e] border border-stone-900 rounded-3xl p-8 flex flex-col justify-between"
          >
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-stone-900">
                <div className="flex items-center gap-2 text-stone-400 font-bold text-xs uppercase tracking-wider">
                  <span>Built for Haryana</span>
                  <MapPin size={12} className="text-stone-400" />
                </div>
                
                {/* Visual Chart Icon */}
                <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-850 flex items-center justify-center text-stone-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.5 4.5L21.75 7.5M21.75 7.5H16.5M21.75 7.5v5.25" />
                  </svg>
                </div>
              </div>

              {/* Title heading */}
              <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight mt-6">
                Building the future of <br />
                land discovery.
              </h4>
              <div className="w-16 h-[2px] bg-stone-800 rounded-full mt-4" />
            </div>

            {/* Bullet points list with staggered children reveal */}
            <motion.div 
              variants={listContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col gap-5 mt-8"
            >
              {/* Item 1 */}
              <motion.div 
                variants={listItemVariants}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-4 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-850 flex items-center justify-center text-stone-300 shrink-0">
                  {/* Verified Shield Icon */}
                  <svg className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">Verified Land Listings</h5>
                  <p className="text-stone-400 text-xs mt-1">Carefully verified for authenticity.</p>
                </div>
              </motion.div>

              <div className="h-px bg-stone-900 w-full" />

              {/* Item 2 */}
              <motion.div 
                variants={listItemVariants}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-4 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-850 flex items-center justify-center text-stone-300 shrink-0">
                  {/* Chat Message Bubble Icon */}
                  <svg className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">Direct & Transparent</h5>
                  <p className="text-stone-400 text-xs mt-1">Connect directly with land owners.</p>
                </div>
              </motion.div>

              <div className="h-px bg-stone-900 w-full" />

              {/* Item 3 */}
              <motion.div 
                variants={listItemVariants}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-4 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-850 flex items-center justify-center text-stone-300 shrink-0">
                  {/* Pin Outline Icon */}
                  <svg className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">Haryana First</h5>
                  <p className="text-stone-400 text-xs mt-1">Focused on every corner of Haryana.</p>
                </div>
              </motion.div>
            </motion.div>

          </motion.div>
          
        </div>

      </div>
    </section>
  );
}
