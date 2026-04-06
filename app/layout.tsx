import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://xacres.com"),

  title: {
    default: "Xacres – Discover Agricultural Land in Haryana",
    template: "%s | Xacres",
  },

  description:
    "Explore agricultural, residential, and highway land for sale in Haryana. Discover land on map, view details, and contact owners directly on Xacres.",

  keywords: [
    "land for sale Haryana",
    "agricultural land Haryana",
    "plots in Haryana",
    "buy land India",
    "land near me",
    "farm land Haryana",
    "Xacres",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Xacres – Discover Agricultural Land in Haryana",
    description:
      "Explore land listings across Haryana with map-based discovery. View details, images, and connect directly with land owners.",
    url: "/",
    siteName: "Xacres",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/logoFull.png", // ✅ your OG image
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Xacres – Discover Agricultural Land in Haryana",
    description:
      "Find agricultural land in Haryana with map-based exploration.",
    images: ["/logoFull.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  manifest: "/manifest.json",
}

export const viewport = {
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased bg-white text-gray-900">
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}