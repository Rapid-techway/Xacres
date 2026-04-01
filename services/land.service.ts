import { databases, ID, Query, storage } from '@/lib/appwrite';
import { Land, LandAdmin, LandPolygon, CreateFullLandPayload } from '@/lib/types';

// TODO: Replace with actual IDs from Appwrite Console
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'xacres_db';
const LANDS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_LAND_COLLECTION_ID || 'lands';
const LANDS_ADMIN_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_LAND_ADMIN_COLLECTION_ID || 'lands_admin';
const LANDS_POLYGON_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_LAND_POLYGON_COLLECTION_ID || 'lands_polygon';
const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || 'land-images';

export const landService = {
  /**
   * Create a public land listing
   */
  async createLand(data: Omit<Land, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const payload = {
        ...data,
        images: Array.isArray(data.images) ? JSON.stringify(data.images) : data.images
      };
      const response = await databases.createDocument(
        DATABASE_ID,
        LANDS_COLLECTION_ID,
        ID.unique(),
        payload
      );
      return {
        ...response,
        images: typeof response.images === 'string' ? JSON.parse(response.images) : response.images
      } as unknown as Land;
    } catch (error) {
      console.error('Error creating land:', error);
      throw error;
    }
  },

  /**
   * Create admin-only details for a land listing
   */
  async createLandAdmin(data: Omit<LandAdmin, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        LANDS_ADMIN_COLLECTION_ID,
        ID.unique(),
        data
      );
      return response as unknown as LandAdmin;
    } catch (error) {
      console.error('Error creating land admin details:', error);
      throw error;
    }
  },

  /**
   * Create polygon boundary for a land
   */
  async createLandPolygon(data: Omit<LandPolygon, 'id'>) {
    try {
      const payload = {
        ...data,
        polygon: typeof data.polygon === 'object' ? JSON.stringify(data.polygon) : data.polygon
      };
      const response = await databases.createDocument(
        DATABASE_ID,
        LANDS_POLYGON_COLLECTION_ID,
        ID.unique(),
        payload
      );
      return {
        ...response,
        polygon: typeof response.polygon === 'string' ? JSON.parse(response.polygon) : response.polygon
      } as unknown as LandPolygon;
    } catch (error) {
      console.error('Error creating land polygon:', error);
      throw error;
    }
  },

  /**
   * Update public land listing
   */
  async updateLand(id: string, data: Partial<Omit<Land, "id" | "createdAt" | "updatedAt">>) {
    try {
      const payload = {
        ...data,
        images: Array.isArray(data.images) ? JSON.stringify(data.images) : data.images
      };
      const response = await databases.updateDocument(
        DATABASE_ID,
        LANDS_COLLECTION_ID,
        id,
        payload
      );
      return {
        ...response,
        images: typeof response.images === 'string' ? JSON.parse(response.images) : response.images
      } as unknown as Land;
    } catch (error) {
      console.error("Error updating land:", error);
      throw error;
    }
  },

  async updateLandAdmin(id: string, data: Partial<Omit<LandAdmin, "id" | "landId" | "createdAt" | "updatedAt">>) {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        LANDS_ADMIN_COLLECTION_ID,
        id,
        data
      );
      return response as unknown as LandAdmin;
    } catch (error) {
      console.error("Error updating land admin:", error);
      throw error;
    }
  },

  async updateLandPolygon(id: string, data: { polygon: Record<string, unknown> | null }) {
    try {
      const payload = {
        ...data,
        polygon: typeof data.polygon === 'object' ? JSON.stringify(data.polygon) : data.polygon
      };
      const response = await databases.updateDocument(
        DATABASE_ID,
        LANDS_POLYGON_COLLECTION_ID,
        id,
        payload
      );
      return {
        ...response,
        polygon: typeof response.polygon === 'string' ? JSON.parse(response.polygon) : response.polygon
      } as unknown as LandPolygon;
    } catch (error) {
      console.error("Error updating land polygon:", error);
      throw error;
    }
  },

  /**
   * Orchestrator to create a full land record across multiple collections
   * FLOW: 1. Create land -> 2. Create land_admin -> 3. Create land_polygon
   */
  async createFullLand(payload: CreateFullLandPayload) {
    try {
      // 1. Create public land document
      const landResponse = await this.createLand(payload.land);
      const landId = landResponse.$id; // Appwrite document has $id

      if (!landId) throw new Error('Failed to get land ID after creation');

      // 2. Create admin document with landId reference
      const adminResponse = await this.createLandAdmin({
        ...payload.admin,
        landId,
      });

      // 3. Create polygon document with landId reference
      const polygonResponse = await this.createLandPolygon({
        landId,
        polygon: payload.polygon,
      });

      return { 
        land: landResponse, 
        admin: adminResponse, 
        polygon: polygonResponse 
      };
    } catch (error) {
      console.error('Error in createFullLand operation:', error);
      throw error;
    }
  },

  /**
   * Orchestrator to update a full land record
   * Uses landId to find related admin and polygon documents
   */
  async updateFullLand(landId: string, payload: CreateFullLandPayload) {
    try {
      // 1. Update public land document
      const landResponse = await this.updateLand(landId, payload.land);

      // 2. Find and update admin document
      const adminList = await databases.listDocuments(
        DATABASE_ID,
        LANDS_ADMIN_COLLECTION_ID,
        [Query.equal('landId', landId)]
      );
      
      let adminResponse = null;
      if (adminList.documents.length > 0) {
        adminResponse = await this.updateLandAdmin(adminList.documents[0].$id, payload.admin);
      }

      // 3. Find and update polygon document
      const polygonList = await databases.listDocuments(
        DATABASE_ID,
        LANDS_POLYGON_COLLECTION_ID,
        [Query.equal('landId', landId)]
      );
      
      let polygonResponse = null;
      if (polygonList.documents.length > 0) {
        polygonResponse = await this.updateLandPolygon(polygonList.documents[0].$id, {
          polygon: payload.polygon
        });
      }

      return {
        land: landResponse,
        admin: adminResponse,
        polygon: polygonResponse
      };
    } catch (error) {
      console.error('Error in updateFullLand operation:', error);
      throw error;
    }
  },

  /**
   * Upload a file to Appwrite storage
   */
  async uploadFile(file: File) {
    try {
      const response = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file
      );
      return response;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  /**
   * Get file view URL (original file, no transformation)
   */
  async getFileView(fileId: string) {
    try {
      const url = storage.getFileView(STORAGE_BUCKET_ID, fileId);
      return url.toString();
    } catch (error) {
      console.error('Error getting file view:', error);
      throw error;
    }
  },

  /**
   * Fetch all lands (public data)
   */
  async getLands(queries: string[] = []) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LANDS_COLLECTION_ID,
        [Query.orderDesc('$createdAt'), ...queries]
      );
      
      const lands = response.documents.map(land => ({
        ...land,
        images: typeof land.images === 'string' ? JSON.parse(land.images) : land.images,
      }));

      return {
        documents: lands as unknown as Land[],
        total: response.total
      };
    } catch (error) {
      console.error('Error fetching lands:', error);
      throw error;
    }
  },

  /**
   * Fetch full land data (public + admin + polygon) by landId ($id of land document)
   */
  async getFullLandById(landId: string) {
    try {
      const land = await databases.getDocument(
        DATABASE_ID,
        LANDS_COLLECTION_ID,
        landId
      );

      const adminList = await databases.listDocuments(
        DATABASE_ID,
        LANDS_ADMIN_COLLECTION_ID,
        [Query.equal('landId', landId)]
      );
      
      const polygonList = await databases.listDocuments(
        DATABASE_ID,
        LANDS_POLYGON_COLLECTION_ID,
        [Query.equal('landId', landId)]
      );

      return {
        land: {
          ...land,
          images: typeof land.images === 'string' ? JSON.parse(land.images) : land.images
        } as unknown as Land,
        admin: (adminList.documents[0] || null) as unknown as LandAdmin | null,
        polygon: (polygonList.documents[0] ? {
          ...polygonList.documents[0],
          polygon: typeof polygonList.documents[0].polygon === 'string' 
            ? JSON.parse(polygonList.documents[0].polygon) 
            : polygonList.documents[0].polygon
        } : null) as unknown as LandPolygon | null
      };
    } catch (error) {
      console.error('Error fetching full land by ID:', error);
      throw error;
    }
  },

  /**
   * Fetch dashboard statistics and recent lands
   */
  async getDashboardStats() {
    try {
      const [totalRes, publicRes, recentRes] = await Promise.all([
        databases.listDocuments(DATABASE_ID, LANDS_COLLECTION_ID, [Query.limit(1)]),
        databases.listDocuments(DATABASE_ID, LANDS_COLLECTION_ID, [
          Query.equal("isPublic", true),
          Query.limit(1),
        ]),
        databases.listDocuments(DATABASE_ID, LANDS_COLLECTION_ID, [
          Query.orderDesc("$createdAt"),
          Query.limit(4),
        ]),
      ]);

      const total = totalRes.total;
      const publicCount = publicRes.total;
      const privateCount = total - publicCount;

      const recentLands = recentRes.documents.map(land => ({
        ...land,
        images: typeof land.images === 'string' ? JSON.parse(land.images) : land.images,
      })) as unknown as Land[];

      return {
        total,
        publicCount,
        privateCount,
        recentLands
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Fetch a single land document by its slug
   */
  async getLandBySlug(slug: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LANDS_COLLECTION_ID,
        [Query.equal('slug', slug), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      const land = response.documents[0];
      return {
        ...land,
        images: typeof land.images === 'string' ? JSON.parse(land.images) : land.images
      } as unknown as Land;
    } catch (error) {
      console.error('Error fetching land by slug:', error);
      throw error;
    }
  },

  /**
   * Fetch polygon document for a specific land ID
   */
  async getLandPolygonByLandId(landId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LANDS_POLYGON_COLLECTION_ID,
        [Query.equal('landId', landId), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      const polygonDoc = response.documents[0];
      return {
        ...polygonDoc,
        polygon: typeof polygonDoc.polygon === 'string' 
          ? JSON.parse(polygonDoc.polygon) 
          : polygonDoc.polygon
      } as unknown as LandPolygon;
    } catch (error) {
      console.error('Error fetching land polygon by ID:', error);
      throw error;
    }
  }
};
