import { LeonardoHero } from "@/components/home/leonardo-hero"
import { HeroScrubStory } from "@/components/home/hero-scrub-story"
import { ParallaxShowcase } from "@/components/home/parallax-showcase"
import { FeatureGrid } from "@/components/home/feature-grid"
import { CTABottom } from "@/components/home/cta-bottom"
import { Footer1 } from "@/components/home2/footer1"

export default function Home() {
  return (
    <main className="bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 3D Leonardo-style Hero */}
      <LeonardoHero />

      {/* These flow naturally after the hero unpins */}
      <HeroScrubStory />
      <ParallaxShowcase />
      <FeatureGrid />
      <CTABottom />
      <Footer1 />
    </main>
  )
}