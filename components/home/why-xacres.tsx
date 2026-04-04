"use client"

import { Globe, ShieldCheck, Zap, MapPin } from "lucide-react"
import { motion } from "framer-motion"

const reasons = [
  {
    icon: Globe,
    title: "Map-first discovery",
    description: "Experience land browsing exactly how it should be. See locations, terrain, and landmarks visually before you visit.",
  },
  {
    icon: ShieldCheck,
    title: "No middlemen complexity",
    description: "Interact directly with sellers. We eliminate opaque processes and hidden commissions.",
  },
  {
    icon: Zap,
    title: "Fast & simple experience",
    description: "No endless forms or complex UIs. Search, explore, and connect in minutes, not days.",
  },
  {
    icon: MapPin,
    title: "Focused on Haryana",
    description: "Deep, hyperlocal insights and coverage. We know Haryana's land landscape better than anyone else.",
  },
]

export function WhyXacres() {
  return (
    <section className="w-full py-32 bg-background border-y border-border/50">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="md:w-1/3">
            <h2 className="text-3xl font-bold tracking-tight mb-6 sm:text-4xl">Why Choose Xacres?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We are reimagining how land is discovered and bought in Haryana. Our mission is to make real estate transparent and accessible to everyone.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <reason.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{reason.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
