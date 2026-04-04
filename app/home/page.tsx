import { HeroSection } from "@/components/home/hero-xacres"
import { HaryanaFocusSection } from "@/components/home/haryana-focus-section"
import { HowItWorks } from "@/components/home/how-it-works"
import { WhyXacres } from "@/components/home/why-xacres"
import { CTASection } from "@/components/home/cta-section"
import { Footer1 } from "@/components/home/footer1"

export default function Home() {
  return (
    <main className="bg-background">
      <HeroSection />
      <HaryanaFocusSection />
      <HowItWorks />
      <WhyXacres />
      <CTASection />
      <Footer1 />
    </main>
  )
}