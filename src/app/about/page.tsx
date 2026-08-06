import { MapPin, Phone, Award, Users, Truck, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ksk-cream">
      {/* Hero */}
      <div className="bg-ksk-dark py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About KSK Enterprise</h1>
          <p className="text-xl text-gray-400">Serving Wa and the Upper West Region with pride since our founding.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-ksk-dark mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              KSK Enterprise was founded in Wa, Upper West Region, Ghana, with a simple mission: to provide quality products
              and services that meet the everyday needs of our community. What started as a small venture has grown into a
              trusted name across three key business lines.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We take pride in promoting local craftsmanship through our hand-woven traditional smocks, supporting local
              artisans and preserving the rich cultural heritage of the Upper West Region.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our car rental service has become a go-to for weddings, corporate events, and personal travel. Meanwhile, our
              construction division supplies builders and contractors with reliable materials and skilled labour.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-200">
              <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800" alt="KSK Enterprise" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-ksk-gold rounded-xl flex items-center justify-center shadow-lg">
              <div className="text-center">
                <span className="block text-3xl font-bold text-ksk-dark">3</span>
                <span className="text-xs font-semibold text-ksk-dark">Business Lines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-ksk-dark text-center mb-10">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Customer First", desc: "Every decision we make starts with our customers needs and satisfaction." },
              { icon: Award, title: "Quality Guaranteed", desc: "We never compromise on the quality of our products or services." },
              { icon: Users, title: "Community Focused", desc: "We are proud to be part of Wa and invest back into our community." },
              { icon: Truck, title: "Reliable Delivery", desc: "Timely delivery of materials and dependable vehicle availability." },
              { icon: MapPin, title: "Local Expertise", desc: "Deep understanding of the Upper West Region market and needs." },
              { icon: Phone, title: "Always Reachable", desc: "Call us anytime at 0242 070 938 or 0202 348 762." },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-6 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-ksk-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-ksk-gold" />
                </div>
                <h3 className="font-bold text-ksk-dark mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl p-8 border border-gray-100 text-center">
          <MapPin className="w-8 h-8 text-ksk-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-ksk-dark mb-2">Visit Us</h2>
          <p className="text-gray-600 mb-4">We are located in the heart of Wa, Upper West Region, Ghana.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-ksk-gold" />0242 070 938</span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-ksk-gold" />0202 348 762</span>
          </div>
          <p className="text-sm text-gray-500 mt-4">Mon - Sat: 8:00 AM - 6:00 PM</p>
        </div>
      </div>
    </div>
  )
}
