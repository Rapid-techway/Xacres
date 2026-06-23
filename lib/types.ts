export interface LandImage {
  url: string;
  isPrimary: boolean;
}

export interface Land {
  $id?: string;
  id?: string;
  title: string;
  slug: string;
  listedPrice: number;
  area: number;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  landType: string;
  roadAccess: boolean;
  images: LandImage[];
  description: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
  brokerId?: string | null;
  tehsil?: string | null;
  listingNumber?: number | null;
  roadWidthM?: number | null;
  approvalType?: string | null;
  cluCategory?: string | null;
  municipalLimitType?: string | null;
  accessType?: string | null;
  greenBelt?: boolean;
  greenBeltWidthM?: number | null;
}

export interface LandAdmin {
  $id?: string;
  id?: string;
  landId: string;
  contactType: 'OWNER' | 'BROKER';
  ownerName?: string | null;
  ownerPhoneNumber?: string | null;
  expectedPrice: number;
  minimumPrice: number;
  negotiable: boolean;
  adminNotes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LandPolygon {
  $id?: string;
  id?: string;
  landId: string;
  polygon: Record<string, unknown> | null; // GeoJSON
}

export interface FlattenedLand extends Land {
  contactType?: 'OWNER' | 'BROKER';
  ownerName?: string | null;
  ownerPhoneNumber?: string | null;
  expectedPrice?: number;
  minimumPrice?: number;
  negotiable?: boolean;
  adminNotes?: string;
  polygon?: Record<string, unknown> | null;
  broker?: Broker;
}

export interface BrokerImage {
  id?: string;
  brokerId?: string;
  imageUrl: string;
  createdAt?: string;
}

export interface Broker {
  id?: string;
  $id?: string;
  brokerCode: string;
  name: string;
  officeName?: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  district: string;
  tehsil: string;
  address?: string;
  googleLocationUrl?: string;
  experienceYears: number;
  referredBy?: string;
  reputation: 'SILVER' | 'GOLD' | 'DIAMOND';
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  totalLands?: number;
  images?: BrokerImage[];
}

export interface CreateFullLandPayload {
  land: Omit<Land, "id" | "createdAt" | "updatedAt">;
  admin: Omit<LandAdmin, "id" | "landId" | "createdAt" | "updatedAt">;
  polygon: Record<string, unknown> | null; // GeoJSON
}


// Shared TypeScript types for polygon mapping

export type GeoJsonCoordinate = [number, number]; // [lng, lat]
export type GeoJsonRing = GeoJsonCoordinate[];

export interface GeoJsonPolygonGeometry {
  type: 'Polygon';
  coordinates: GeoJsonRing[];
}

export interface GeoJsonFeature {
  type: 'Feature';
  geometry: GeoJsonPolygonGeometry;
  properties: Record<string, unknown>;
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

export interface Centroid {
  lat: number;
  lng: number;
}

export interface PolygonMapProps {
  onPolygonComplete?: (polygon: GeoJsonFeatureCollection | null, centroid: Centroid) => void;
  initialPolygon?: GeoJsonFeatureCollection | null;
  initialCenter?: Centroid | null;
  readOnly?: boolean;
}

export interface SubMapViewProps {
  initialPolygon?: GeoJsonFeatureCollection | null;
  initialCenter?: Centroid | null;
  village?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
}

// Helper: Close a GeoJSON ring (add first point at end if not already closed)
export const closeRing = (coordinates: GeoJsonCoordinate[]): GeoJsonRing => {
  if (coordinates.length === 0) return [];
  
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  
  // Check if ring is already closed
  const isClosed = first[0] === last[0] && first[1] === last[1];
  
  if (isClosed) {
    return [...coordinates];
  }
  
  return [...coordinates, [first[0], first[1]]];
};

// Helper: Remove closing coordinate for editing (return unique vertices only)
export const getEditableVertices = (ring: GeoJsonRing): GeoJsonCoordinate[] => {
  if (ring.length <= 1) return ring;
  
  // GeoJSON rings are closed (first === last), so remove the last duplicate
  return ring.slice(0, -1);
};

// Example GeoJSON for reference
export const EXAMPLE_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.0856, 28.7041],
            [76.0956, 28.7041],
            [76.0956, 28.7141],
            [76.0856, 28.7141],
            [76.0856, 28.7041]
          ]
        ]
      },
      properties: {}
    }
  ]
};

export interface SellerLead {
  id?: string;
  name: string;
  phoneNumber: string;
  district: string;
  locationName: string;
  notes?: string;
  adminNotes?: string;
  createdAt?: string;
  images?: SellerLeadImage[];
}

export interface SellerLeadImage {
  id?: string;
  sellerLeadId?: string;
  imageUrl: string;
  createdAt?: string;
}
