"use client"

import { Search, Map as MapIcon, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"

const steps = [
  {
    icon: Search,
    title: "Search Location",
    description: "Find land by district or area. Use our filters to narrow down your search based on size and price.",
  },
  {
    icon: MapIcon,
    title: "Explore on Map",
    description: "View available land parcels visually. Get a clear perspective of the surroundings and accessibility.",
  },
  {
    icon: MessageSquare,
    title: "Connect Instantly",
    description: "Contact owners directly. No middlemen, no hidden fees. Just direct communication for better deals.",
  },
]

export function HowItWorks() {
  return (
    <section className="w-full py-24 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4 sm:text-4xl">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discovering land in Haryana has never been this simple. Just three easy steps to find your next property.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-none bg-transparent group hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300 rounded-2xl">
                <CardHeader className="pt-8 px-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <CardDescription className="text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
