"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, type Variants } from "framer-motion"
import { ArrowRight, MapPin } from "lucide-react"
import CanvasTrail from "../ui/canvas"
import { useEffect } from "react"

export function HeroSection() {
  useEffect(() => {
    const trail = new CanvasTrail('canvas')
    return () => trail.destroy()
  }, [])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 text-center bg-background">

      {/* 🌍 Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white via-neutral-100 to-white dark:from-black dark:via-neutral-900 dark:to-black" />

      {/* 🟢 Canvas (IMPORTANT) */}
      <canvas
        id="canvas"
        className="pointer-events-none absolute inset-0 z-[1] opacity-60" />

      {/* 🟢 Dotted Overlay (above canvas , below content) */}
      <div className="absolute inset-0 z-[2] opacity-25 
        bg-[radial-gradient(circle,rgba(0,0,0,0.15)_1px,transparent_1px)] 
        [background-size:20px_20px] 
        dark:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)]" 
      />

      {/* 🧠 Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
            <MapPin className="h-4 w-4" />
            Map-first Land Discovery
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="mb-6 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl text-foreground"
        >
          Discover Land
          <br />
          Like Never Before
          <br />
          <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            On The Map
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mb-10 max-w-2xl text-lg md:text-xl text-muted-foreground"
        >
          Explore verified land parcels across Haryana. 
          Search by district, view on map, and connect instantly.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/">
            <Button size="lg" className="gap-2">
              Open Map View
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/lands">
            <Button size="lg" variant="outline">
              Browse Lands
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}