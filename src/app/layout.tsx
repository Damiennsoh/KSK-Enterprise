import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { CartProvider } from "@/context/CartContext"

export const metadata: Metadata = {
  title: "KSK Enterprise | Fashion, Car Rentals & Construction - Wa, Ghana",
  description:
    "KSK Enterprise - Your trusted partner in Wa, Upper West Region, Ghana. We offer traditional smocks and fugus, car rentals for weddings and personal use, and quality building materials with construction services.",
  keywords: [
    "KSK Enterprise",
    "smocks",
    "fugu",
    "car rental",
    "construction materials",
    "Wa Ghana",
    "Upper West Region",
    "building materials",
    "traditional clothing Ghana",
  ],
  authors: [{ name: "KSK Enterprise" }],
  openGraph: {
    title: "KSK Enterprise | Fashion, Car Rentals & Construction",
    description: "Your trusted partner in Wa, Upper West Region, Ghana",
    type: "website",
    locale: "en_GH",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
