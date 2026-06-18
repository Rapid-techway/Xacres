'use client';

import { motion } from 'framer-motion';

export default function HighlightsSection() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return (
    <section className="w-full bg-white py-16 md:py-20 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        
        {/* Top Content Row: Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column (span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <motion.h2 
              initial={{ opacity: 0.4, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 leading-tight"
            >
              Smarter Way to<br />Discover Land
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-md font-normal"
            >
              Xacres is a map-first land discovery platform that helps you explore verified land opportunities across Haryana with speed, accuracy, and ease.
            </motion.p>
          </div>

          {/* Right Column (span 7) */}
          <div className="lg:col-span-7">
            <motion.h2 
              initial={{ opacity: 0.3, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl md:text-[36px] leading-[1.25] tracking-tight text-neutral-800"
            >
              <span className="font-bold text-neutral-900">Maximizing Property</span>{' '}
              <span className="font-light text-neutral-500">
                Growth Through Cutting-Edge Investment Strategies
              </span>
            </motion.h2>
          </div>
        </div>

        {/* Bottom Row: Stats left-aligned, animated stagger, no vertical dividers */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 md:gap-x-12 pb-8"
        >
          {/* Stat 1 */}
          <motion.div variants={itemVariants} className="flex flex-col items-start justify-start text-left">
            <span className="text-3xl md:text-5xl font-semibold text-neutral-900 tracking-tight">25+</span>
            <span className="text-neutral-500 text-xs md:text-sm font-normal mt-2.5 leading-tight">
              District Coverage
            </span>
          </motion.div>

          {/* Stat 2 */}
          <motion.div variants={itemVariants} className="flex flex-col items-start justify-start text-left">
            <span className="text-3xl md:text-5xl font-semibold text-neutral-900 tracking-tight">24/7</span>
            <span className="text-neutral-500 text-xs md:text-sm font-normal mt-2.5 leading-tight">
              AI Powered Land Discovery
            </span>
          </motion.div>

          {/* Stat 3 */}
          <motion.div variants={itemVariants} className="flex flex-col items-start justify-start text-left">
            <span className="text-3xl md:text-5xl font-semibold text-neutral-900 tracking-tight">92%</span>
            <span className="text-neutral-500 text-xs md:text-sm font-normal mt-2.5 leading-tight">
              Satellite Map Accuracy
            </span>
          </motion.div>

          {/* Stat 4 */}
          <motion.div variants={itemVariants} className="flex flex-col items-start justify-start text-left">
            <span className="text-3xl md:text-5xl font-semibold text-neutral-900 tracking-tight">Instant</span>
            <span className="text-neutral-500 text-xs md:text-sm font-normal mt-2.5 leading-tight">
              WhatsApp Connect
            </span>
          </motion.div>
        </motion.div>

        {/* Single thin divider line that animates horizontally */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0 }}
          className="w-full h-[1px] bg-neutral-200"
        />

      </div>
    </section>
  );
}
