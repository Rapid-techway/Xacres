"use client"

import { motion } from "framer-motion"

export function HaryanaFocusSection() {
  return (
    <section className="relative w-full py-24 overflow-hidden bg-background">
      {/* Abstract Background - Dotted pattern */}
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
        <svg
          className="h-full w-full"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="currentColor" className="text-muted-foreground/40" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Subtle Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full z-0" />

      <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4"
        >
          <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
            Regional Focus
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Built for Haryana
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            We focus where it matters — making land discovery simple in Haryana. 
            From Gurgaon to Panchkula, we help you find the right parcel.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
