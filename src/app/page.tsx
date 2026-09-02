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
    .select("id, eyebrow, title, description, cta_label, cta_href, image_url, display_order")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  const prioritizedSlides = [...(slides ?? [])].sort((a, b) => {
    const aFashion = a.cta_href === "/fashion" ? 0 : 1
    const bFashion = b.cta_href === "/fashion" ? 0 : 1
    return aFashion - bFashion || (a.display_order ?? 0) - (b.display_order ?? 0)
  })

  return (
    <>
      <HeroSection slides={prioritizedSlides.length ? prioritizedSlides : undefined} />
      <FeaturedProducts />
      <BusinessCards />
      <WhyChooseUs />
      <ContactCTA />
    </>
  )
}
