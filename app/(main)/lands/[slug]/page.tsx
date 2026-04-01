import { Metadata } from "next"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { landService } from "@/services/land.service"
import { FlattenedLand } from "@/lib/types"
import LandView from "./LandView"

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Fetch land data on the server
 */
async function getLandData(slug: string): Promise<FlattenedLand | null> {
  try {
    // 1. Fetch land by slug
    const land = await landService.getLandBySlug(slug)
    
    if (!land) return null

    // 2. Fetch polygon by land ID
    const polygonDoc = await landService.getLandPolygonByLandId(land.$id!)
    
    // 3. Compose FlattenedLand (Public Version)
    return {
      ...land,
      polygon: polygonDoc?.polygon || null,
      id: land.$id,
      $id: land.$id
    }
  } catch (error) {
    console.error("Error fetching land details on server:", error)
    return null
  }
}

/**
 * Dynamic Metadata Generation for SEO & OG
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const land = await landService.getLandBySlug(slug)

  if (!land) {
    return {
      title: "Property Not Found | Xacres",
      description: "The agricultural land you are looking for was not found or link is invalid."
    }
  }

  const title = `${land.area} Acres ${land.type} in ${land.village} | Xacres`
  const description = land.description?.slice(0, 160) || `Buy premium ${land.type} land in ${land.district}, Haryana. Verified listing on Xacres.`
  const imageUrl = land.images?.[0]?.url || ""

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    }
  }
}

export default async function PublicLandDetailsPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getLandData(slug)

  // Property Not Found State
  if (!data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-4">
          <Loader2 className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Property not found</h1>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          The agricultural land you are looking for might have been removed or the link is incorrect. 
          Browse our latest verified listings below.
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

  // Render Client-side View
  return <LandView data={data} />
}
