"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Map } from "lucide-react"

export function CTASection() {
  return (
    <section className="w-full py-24 bg-background">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-zinc-900 dark:bg-zinc-100 px-8 py-16 md:px-16 md:py-24 text-center text-white dark:text-zinc-900 shadow-2xl"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary blur-[100px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary blur-[100px] rounded-full" />
          </div>

          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Start exploring land today
            </h2>
            <p className="text-zinc-400 dark:text-zinc-500 text-lg md:text-xl">
              Discover verified land parcels across Haryana. Join hundreds of users finding their perfect property through our map-first platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="h-12 px-8 text-base bg-white text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 rounded-full">
                <Link href="/" className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  Open Map View
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base border-zinc-700 text-white dark:border-zinc-300 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full">
                <Link href="/lands" className="flex items-center gap-2">
                  Browse Lands
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
