import { HeroSection } from "@/components/home/HeroSection"
import { BusinessCards } from "@/components/home/BusinessCards"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { WhyChooseUs } from "@/components/home/WhyChooseUs"
import { ContactCTA } from "@/components/home/ContactCTA"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: slides } = await supabase
    .from("hero_slides")
    .select("id, eyebrow, title, description, cta_label, cta_href, image_url")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  return (
    <>
      <HeroSection slides={slides ?? undefined} />
      <BusinessCards />
      <FeaturedProducts />
      <WhyChooseUs />
      <ContactCTA />
    </>
  )
}
