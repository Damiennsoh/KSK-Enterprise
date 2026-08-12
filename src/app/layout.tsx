import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { CartProvider } from "@/context/CartContext"
import { headers } from "next/headers"

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
  const headersList = headers()
  const pathname = headersList.get("x-pathname") || "/"
  const isAdmin = pathname.startsWith("/admin")

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          {!isAdmin && <Header />}
          <main className="flex-1">{children}</main>
          {!isAdmin && <Footer />}
        </CartProvider>
      </body>
    </html>
  )
}
