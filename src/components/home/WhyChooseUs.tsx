import { Shield, Truck, Headphones, Award } from "lucide-react"

/**
 * Why Choose Us section on homepage.
 * Highlights key value propositions.
 */
export function WhyChooseUs() {
  const reasons = [
    {
      icon: Shield,
      title: "Trusted Quality",
      description:
        "All our products and services meet the highest standards. From hand-woven smocks to construction materials, quality is guaranteed.",
    },
    {
      icon: Truck,
      title: "Reliable Delivery",
      description:
        "We deliver construction materials across Wa and surrounding areas. Timely and dependable service every time.",
    },
    {
      icon: Headphones,
      title: "Customer Support",
      description:
        "Reach us anytime at 0242 070 938 or 0202 348 762. We're here to help with your orders, bookings, and inquiries.",
    },
    {
      icon: Award,
      title: "Local Expertise",
      description:
        "Proudly based in Wa, Upper West Region. We understand the local market and serve our community with dedication.",
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-ksk-dark mb-4">
            Why Choose KSK Enterprise?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We combine traditional craftsmanship with modern service to deliver
            the best experience for our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="text-center p-6 rounded-xl bg-ksk-cream/50 hover:bg-ksk-cream transition-colors"
            >
              <div className="w-14 h-14 bg-ksk-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <reason.icon className="w-7 h-7 text-ksk-gold" />
              </div>
              <h3 className="text-lg font-bold text-ksk-dark mb-2">
                {reason.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
