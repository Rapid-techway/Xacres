import { Metadata } from "next"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { cache } from "react"

import { landService } from "@/services/land.service"
import { FlattenedLand } from "@/lib/types"
import LandView from "./LandView"

interface PageProps {
  params: Promise<{ slug: string }> // ✅ FIXED
}

/**
 * ✅ Cached fetch (single API call shared)
 */
const getLandCached = cache(async (slug: string) => {
  try {
    if (!slug) return null // safety

    const land = await landService.getLandBySlug(slug)
    if (!land) return null

    const polygonDoc = await landService.getLandPolygonByLandId(land.$id!)

    return {
      ...land,
      polygon: polygonDoc?.polygon || null,
      id: land.$id,
      $id: land.$id,
    } as FlattenedLand
  } catch (error) {
    console.error("Error fetching land:", error)
    return null
  }
})

/**
 * ✅ SEO + OG Metadata
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params // ✅ FIXED

  const land = await getLandCached(slug)

  if (!land) {
    return {
      title: "Property Not Found | Xacres",
      description:
        "The agricultural land you are looking for was not found or link is invalid.",
    }
  }

  const title = `${land.area} Acres ${land.type} Land in ${land.village}, ${land.district}, Haryana | Xacres`

  const description =
    land.description?.slice(0, 140) ||
    `${land.area} acre ${land.type} land for sale in ${land.village}, ${land.district}, Haryana. View map, images & contact details on Xacres.`

  const imageUrl = land.images?.[0]?.url || "/logoFull.png"

  return {
    title,
    description,

    alternates: {
      canonical: `/lands/${slug}`,
    },

    openGraph: {
      title,
      description,
      url: `/lands/${slug}`,
      type: "website",
      siteName: "Xacres",
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },

    robots: {
      index: true,
      follow: true,
    },

    keywords: [
      `${land.type} land in ${land.district}`,
      `land for sale in ${land.village}`,
      `${land.area} acre land Haryana`,
      `buy land in ${land.district}`,
    ],
  }
}

/**
 * ✅ Page
 */
export default async function PublicLandDetailsPage({ params }: PageProps) {
  const { slug } = await params // ✅ FIXED

  const data = await getLandCached(slug)

  // ❌ Not Found UI
  if (!data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-4">
          <Loader2 className="w-10 h-10 text-gray-300" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Property not found
        </h1>

        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          The agricultural land you are looking for might have been removed or
          the link is incorrect. Browse our latest verified listings below.
        </p>

        <Link
          href="/lands"
          className="inline-block bg-gray-900 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-100 active:scale-95"
        >
          Explore Verified Lands
        </Link>
      </div>
    )
  }

  // ✅ Render Client Component
  return <LandView data={data} />
}