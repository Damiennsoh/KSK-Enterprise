import { HeroSection } from "@/components/home/HeroSection"
import { BusinessCards } from "@/components/home/BusinessCards"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { WhyChooseUs } from "@/components/home/WhyChooseUs"
import { ContactCTA } from "@/components/home/ContactCTA"

/**
 * KSK Enterprise Homepage
 * Entry point showcasing all three business lines.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BusinessCards />
      <FeaturedProducts />
      <WhyChooseUs />
      <ContactCTA />
    </>
  )
}
