import { HeroSection } from "@/components/home/hero-xacres"
import { HaryanaFocusSection } from "@/components/home/haryana-focus-section"
import { HowItWorks } from "@/components/home/how-it-works"
import { WhyXacres } from "@/components/home/why-xacres"
import { CTASection } from "@/components/home/cta-section"
import { Footer } from "@/components/home/footer"

export default function Home() {
  return (
    <main className="bg-background">
      <HeroSection />
      <HaryanaFocusSection />
      <HowItWorks />
      <WhyXacres />
      <CTASection />
      <Footer />
    </main>
  )
}