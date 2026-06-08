import { supabase } from '@/lib/supabase';
import { Land, LandAdmin, LandPolygon, CreateFullLandPayload, FlattenedLand } from '@/lib/types';

interface DbLand {
  id: string;
  title: string;
  slug: string;
  price: number;
  area: number;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  type: string;
  road_access: boolean;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface DbImage {
  url: string;
  is_primary?: boolean;
  isPrimary?: boolean;
}

interface DbAdmin {
  id?: string;
  land_id?: string;
  owner_name?: string;
  owner_phone?: string;
  expected_price?: number;
  minimum_price?: number;
  negotiable?: boolean;
  admin_notes?: string;
}

interface DbPolygon {
  id?: string;
  land_id?: string;
  polygon?: Record<string, unknown> | null;
}

// Helper to map Supabase database structures (snake_case) to Frontend structures (camelCase)
function mapDbLandToFrontend(
  dbLand: DbLand, 
  images: DbImage[] = [], 
  adminData: DbAdmin | null = null, 
  polygonData: DbPolygon | null = null
): FlattenedLand {
  return {
    id: dbLand.id,
    $id: dbLand.id, // Support Appwrite compatibility
    title: dbLand.title,
    slug: dbLand.slug,
    price: Number(dbLand.price),
    area: Number(dbLand.area),
    district: dbLand.district,
    village: dbLand.village,
    latitude: dbLand.latitude,
    longitude: dbLand.longitude,
    type: dbLand.type,
    roadAccess: dbLand.road_access,
    description: dbLand.description || '',
    isPublic: dbLand.is_public,
    createdAt: dbLand.created_at,
    updatedAt: dbLand.updated_at,
    images: images.map(img => ({
      url: img.url,
      isPrimary: !!(img.is_primary ?? img.isPrimary)
    })),
    // Private Admin fields (if loaded)
    ownerName: adminData?.owner_name || '',
    ownerPhone: adminData?.owner_phone || '',
    expectedPrice: adminData ? Number(adminData.expected_price) : undefined,
    minimumPrice: adminData ? Number(adminData.minimum_price) : undefined,
    negotiable: adminData?.negotiable ?? true,
    adminNotes: adminData?.admin_notes || '',
    // Polygon field (if loaded)
    polygon: polygonData?.polygon || null
  };
}

export const landService = {
  /**
   * Create a public land listing
   */
  async createLand(data: Omit<Land, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const { data: inserted, error } = await supabase
        .from('lands')
        .insert({
          title: data.title,
          slug: data.slug,
          price: data.price,
          area: data.area,
          district: data.district,
          village: data.village,
          latitude: data.latitude,
          longitude: data.longitude,
          type: data.type,
          road_access: data.roadAccess,
          description: data.description,
          is_public: data.isPublic
        })
        .select()
        .single();

      if (error) throw error;

      // Handle direct image insertion if images are included in main creation payload
      if (data.images && data.images.length > 0) {
        const imageInserts = data.images.map((img, idx) => ({
          land_id: inserted.id,
          url: img.url,
          is_primary: img.isPrimary,
          sort_order: idx
        }));
        const { error: imgError } = await supabase.from('land_images').insert(imageInserts);
        if (imgError) throw imgError;
      }

      return mapDbLandToFrontend(inserted, data.images || []) as unknown as Land;
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
      const { data: inserted, error } = await supabase
        .from('lands_admin')
        .insert({
          land_id: data.landId,
          owner_name: data.ownerName,
          owner_phone: data.ownerPhone,
          expected_price: data.expectedPrice,
          minimum_price: data.minimumPrice,
          negotiable: data.negotiable,
          admin_notes: data.adminNotes
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: inserted.id,
        $id: inserted.id,
        landId: inserted.land_id,
        ownerName: inserted.owner_name,
        ownerPhone: inserted.owner_phone,
        expectedPrice: Number(inserted.expected_price),
        minimumPrice: Number(inserted.minimum_price),
        negotiable: inserted.negotiable,
        adminNotes: inserted.admin_notes,
        createdAt: inserted.created_at,
        updatedAt: inserted.updated_at
      } as unknown as LandAdmin;
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
      const { data: inserted, error } = await supabase
        .from('lands_polygon')
        .insert({
          land_id: data.landId,
          polygon: data.polygon
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: inserted.id,
        $id: inserted.id,
        landId: inserted.land_id,
        polygon: inserted.polygon
      } as unknown as LandPolygon;
    } catch (error) {
      console.error('Error creating land polygon:', error);
      throw error;
    }
  },

  /**
   * Update public land listing
   */
  async updateLand(id: string, data: Partial<Omit<Land, 'id' | 'createdAt' | 'updatedAt'>>) {
    try {
      const payload: Record<string, unknown> = {};
      if (data.title !== undefined) payload.title = data.title;
      if (data.slug !== undefined) payload.slug = data.slug;
      if (data.price !== undefined) payload.price = data.price;
      if (data.area !== undefined) payload.area = data.area;
      if (data.district !== undefined) payload.district = data.district;
      if (data.village !== undefined) payload.village = data.village;
      if (data.latitude !== undefined) payload.latitude = data.latitude;
      if (data.longitude !== undefined) payload.longitude = data.longitude;
      if (data.type !== undefined) payload.type = data.type;
      if (data.roadAccess !== undefined) payload.road_access = data.roadAccess;
      if (data.description !== undefined) payload.description = data.description;
      if (data.isPublic !== undefined) payload.is_public = data.isPublic;

      const { data: updated, error } = await supabase
        .from('lands')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update images table if images array is passed
      if (data.images !== undefined) {
        await supabase.from('land_images').delete().eq('land_id', id);
        if (data.images.length > 0) {
          const imageInserts = data.images.map((img, idx) => ({
            land_id: id,
            url: img.url,
            is_primary: img.isPrimary,
            sort_order: idx
          }));
          const { error: imgError } = await supabase.from('land_images').insert(imageInserts);
          if (imgError) throw imgError;
        }
      }

      const finalImages = data.images || [];
      return mapDbLandToFrontend(updated, finalImages) as unknown as Land;
    } catch (error) {
      console.error('Error updating land:', error);
      throw error;
    }
  },

  async updateLandAdmin(id: string, data: Partial<Omit<LandAdmin, 'id' | 'landId' | 'createdAt' | 'updatedAt'>>) {
    try {
      const payload: Record<string, unknown> = {};
      if (data.ownerName !== undefined) payload.owner_name = data.ownerName;
      if (data.ownerPhone !== undefined) payload.owner_phone = data.ownerPhone;
      if (data.expectedPrice !== undefined) payload.expected_price = data.expectedPrice;
      if (data.minimumPrice !== undefined) payload.minimum_price = data.minimumPrice;
      if (data.negotiable !== undefined) payload.negotiable = data.negotiable;
      if (data.adminNotes !== undefined) payload.admin_notes = data.adminNotes;

      // Since updateLandAdmin historically accepts the primary key id of the lands_admin table,
      // but might sometimes be called with landId depending on orchestration:
      // Let's filter first by the table ID or update by matching either.
      const { data: updated, error } = await supabase
        .from('lands_admin')
        .update(payload)
        .or(`id.eq.${id},land_id.eq.${id}`)
        .select()
        .single();

      if (error) throw error;

      return {
        id: updated.id,
        $id: updated.id,
        landId: updated.land_id,
        ownerName: updated.owner_name,
        ownerPhone: updated.owner_phone,
        expectedPrice: Number(updated.expected_price),
        minimumPrice: Number(updated.minimum_price),
        negotiable: updated.negotiable,
        adminNotes: updated.admin_notes,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at
      } as unknown as LandAdmin;
    } catch (error) {
      console.error('Error updating land admin:', error);
      throw error;
    }
  },

  async updateLandPolygon(id: string, data: { polygon: Record<string, unknown> | null }) {
    try {
      const { data: updated, error } = await supabase
        .from('lands_polygon')
        .update({
          polygon: data.polygon
        })
        .or(`id.eq.${id},land_id.eq.${id}`)
        .select()
        .single();

      if (error) throw error;

      return {
        id: updated.id,
        $id: updated.id,
        landId: updated.land_id,
        polygon: updated.polygon
      } as unknown as LandPolygon;
    } catch (error) {
      console.error('Error updating land polygon:', error);
      throw error;
    }
  },

  /**
   * Orchestrator to create a full land record
   */
  async createFullLand(payload: CreateFullLandPayload) {
    try {
      // 1. Create public land
      const landResponse = await this.createLand(payload.land);
      const landId = landResponse.id || landResponse.$id;

      if (!landId) throw new Error('Failed to get land ID after creation');

      // 2. Create admin record
      const adminResponse = await this.createLandAdmin({
        ...payload.admin,
        landId
      });

      // 3. Create polygon record
      const polygonResponse = await this.createLandPolygon({
        landId,
        polygon: payload.polygon
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
   */
  async updateFullLand(landId: string, payload: CreateFullLandPayload) {
    try {
      // 1. Update public land
      const landResponse = await this.updateLand(landId, payload.land);

      // 2. Update admin details
      const { data: adminList } = await supabase
        .from('lands_admin')
        .select('id')
        .eq('land_id', landId);

      let adminResponse = null;
      if (adminList && adminList.length > 0) {
        adminResponse = await this.updateLandAdmin(adminList[0].id, payload.admin);
      } else {
        adminResponse = await this.createLandAdmin({ ...payload.admin, landId });
      }

      // 3. Update polygon boundary
      const { data: polygonList } = await supabase
        .from('lands_polygon')
        .select('id')
        .eq('land_id', landId);

      let polygonResponse = null;
      if (polygonList && polygonList.length > 0) {
        polygonResponse = await this.updateLandPolygon(polygonList[0].id, { polygon: payload.polygon });
      } else {
        polygonResponse = await this.createLandPolygon({ landId, polygon: payload.polygon });
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
   * Upload a file to Cloudflare R2
   */
  async uploadFile(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Search for Supabase session token in localStorage for authentication validation
      let token = '';
      const supabaseProject = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').split('.')[0] || '';
      const storageKey = `sb-${supabaseProject}-auth-token`;
      
      if (typeof window !== 'undefined') {
        const sessionStr = localStorage.getItem(storageKey);
        if (sessionStr) {
          try {
            const parsed = JSON.parse(sessionStr);
            token = parsed?.access_token || '';
          } catch {}
        }
      }

      if (!token) {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token || '';
      }

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Upload failed');
      }

      return await response.json(); // returns { success: true, $id: fileKey, url: publicUrl }
    } catch (error) {
      console.error('Error uploading file to R2 API:', error);
      throw error;
    }
  },

  /**
   * Get file view URL
   */
  async getFileView(fileId: string) {
    // R2 URLs are absolute and returned directly by the uploadFile API endpoint.
    // If only fileId is given, resolve using the public URL CDN prefix
    if (fileId.startsWith('http://') || fileId.startsWith('https://')) {
      return fileId;
    }
    const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
    return `${r2PublicUrl.replace(/\/$/, '')}/${fileId}`;
  },

  /**
   * Fetch all lands (public data) with compatibility for Appwrite query strings
   */
  async getLands(queries: string[] | { isPublic?: boolean, limit?: number } = []) {
    try {
      let isPublicOnly = true;
      let limit = 100;

      if (Array.isArray(queries)) {
        for (const q of queries) {
          if (q.includes('isPublic')) {
            isPublicOnly = q.includes('true');
          }
          if (q.includes('limit')) {
            const match = q.match(/limit\((\d+)\)/);
            if (match) limit = parseInt(match[1]);
          }
        }
      } else if (queries && typeof queries === 'object') {
        if (queries.isPublic !== undefined) isPublicOnly = queries.isPublic;
        if (queries.limit !== undefined) limit = queries.limit;
      }

      let query = supabase.from('lands').select('*', { count: 'exact' });

      if (isPublicOnly) {
        query = query.eq('is_public', true);
      }

      const { data: dbLands, error, count } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      if (!dbLands || dbLands.length === 0) {
        return { documents: [], total: 0 };
      }

      // Query images relationally in bulk to keep performance high
      const landIds = dbLands.map(l => l.id);
      const { data: dbImages, error: imgError } = await supabase
        .from('land_images')
        .select('*')
        .in('land_id', landIds)
        .order('sort_order', { ascending: true });

      if (imgError) throw imgError;

      const lands = dbLands.map(dbLand => {
        const images = dbImages?.filter(img => img.land_id === dbLand.id) || [];
        return mapDbLandToFrontend(dbLand, images);
      });

      return {
        documents: lands as unknown as Land[],
        total: count || lands.length
      };
    } catch (error) {
      console.error('Error fetching lands:', error);
      throw error;
    }
  },

  /**
   * Fetch full land data by landId
   */
  async getFullLandById(landId: string) {
    try {
      const { data: land, error: landError } = await supabase
        .from('lands')
        .select('*')
        .eq('id', landId)
        .single();

      if (landError) throw landError;

      const [imagesRes, adminRes, polygonRes] = await Promise.all([
        supabase.from('land_images').select('*').eq('land_id', landId).order('sort_order', { ascending: true }),
        supabase.from('lands_admin').select('*').eq('land_id', landId).maybeSingle(),
        supabase.from('lands_polygon').select('*').eq('land_id', landId).maybeSingle()
      ]);

      if (imagesRes.error) throw imagesRes.error;

      return {
        land: mapDbLandToFrontend(land, imagesRes.data || []) as unknown as Land,
        admin: adminRes.data ? {
          id: adminRes.data.id,
          $id: adminRes.data.id,
          landId: adminRes.data.land_id,
          ownerName: adminRes.data.owner_name,
          ownerPhone: adminRes.data.owner_phone,
          expectedPrice: Number(adminRes.data.expected_price),
          minimumPrice: Number(adminRes.data.minimum_price),
          negotiable: adminRes.data.negotiable,
          adminNotes: adminRes.data.admin_notes,
          createdAt: adminRes.data.created_at,
          updatedAt: adminRes.data.updated_at
        } as unknown as LandAdmin : null,
        polygon: polygonRes.data ? {
          id: polygonRes.data.id,
          $id: polygonRes.data.id,
          landId: polygonRes.data.land_id,
          polygon: polygonRes.data.polygon
        } as unknown as LandPolygon : null
      };
    } catch (error) {
      console.error('Error fetching full land by ID:', error);
      throw error;
    }
  },

  /**
   * Fetch dashboard statistics
   */
  async getDashboardStats() {
    try {
      const [totalRes, publicRes, recentLandsRes, leadsCountRes, recentLeadsRes] = await Promise.all([
        supabase.from('lands').select('id', { count: 'exact', head: true }),
        supabase.from('lands').select('id', { count: 'exact', head: true }).eq('is_public', true),
        supabase.from('lands').select('*').order('created_at', { ascending: false }).limit(4),
        supabase.from('land_leads').select('id', { count: 'exact', head: true }),
        supabase.from('land_leads').select('id, name, phone, budget, created_at, lands(title)').order('created_at', { ascending: false }).limit(4)
      ]);

      const total = totalRes.count || 0;
      const publicCount = publicRes.count || 0;
      const privateCount = total - publicCount;

      let recentLands: Land[] = [];
      if (recentLandsRes.data && recentLandsRes.data.length > 0) {
        const landIds = recentLandsRes.data.map(l => l.id);
        const { data: dbImages } = await supabase
          .from('land_images')
          .select('*')
          .in('land_id', landIds)
          .order('sort_order', { ascending: true });

        recentLands = recentLandsRes.data.map(dbLand => {
          const images = dbImages?.filter(img => img.land_id === dbLand.id) || [];
          return mapDbLandToFrontend(dbLand, images);
        }) as unknown as Land[];
      }

      return {
        total,
        publicCount,
        privateCount,
        leadsCount: leadsCountRes.count || 0,
        recentLands,
        recentLeads: recentLeadsRes.data || []
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Fetch single land listing by slug
   */
  async getLandBySlug(slug: string) {
    try {
      const { data: land, error } = await supabase
        .from('lands')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!land) return null;

      const { data: images } = await supabase
        .from('land_images')
        .select('*')
        .eq('land_id', land.id)
        .order('sort_order', { ascending: true });

      return mapDbLandToFrontend(land, images || []) as unknown as Land;
    } catch (error) {
      console.error('Error fetching land by slug:', error);
      throw error;
    }
  },

  /**
   * Fetch polygon boundary for a land
   */
  async getLandPolygonByLandId(landId: string) {
    try {
      const { data: polygonDoc, error } = await supabase
        .from('lands_polygon')
        .select('*')
        .eq('land_id', landId)
        .maybeSingle();

      if (error) throw error;
      if (!polygonDoc) return null;

      return {
        id: polygonDoc.id,
        $id: polygonDoc.id,
        landId: polygonDoc.land_id,
        polygon: polygonDoc.polygon
      } as unknown as LandPolygon;
    } catch (error) {
      console.error('Error fetching land polygon by ID:', error);
      throw error;
    }
  },

  /**
   * Fetch all lead submissions (for admin view)
   */
  async getLeads() {
    try {
      const { data, error } = await supabase
        .from('land_leads')
        .select(`
          id,
          land_id,
          name,
          phone,
          note,
          budget,
          created_at,
          lands (
            title,
            slug,
            district,
            village
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  /**
   * Delete a lead submission
   */
  async deleteLead(id: string) {
    try {
      const { error } = await supabase
        .from('land_leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }
};
