import { supabase } from '@/lib/supabase';
import { SellerLead, SellerLeadImage } from '@/lib/types';

interface DbSellerLead {
  id: string;
  name: string;
  phone_number: string;
  district: string;
  location_name: string;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  seller_lead_images?: DbSellerLeadImage[];
}

interface DbSellerLeadImage {
  id: string;
  seller_lead_id: string;
  image_url: string;
  created_at: string;
}

function mapDbSellerLeadToFrontend(
  dbLead: DbSellerLead,
  dbImages: DbSellerLeadImage[] = []
): SellerLead {
  return {
    id: dbLead.id,
    name: dbLead.name,
    phoneNumber: dbLead.phone_number,
    district: dbLead.district,
    locationName: dbLead.location_name,
    notes: dbLead.notes || undefined,
    adminNotes: dbLead.admin_notes || undefined,
    createdAt: dbLead.created_at,
    images: dbImages.map(img => ({
      id: img.id,
      sellerLeadId: img.seller_lead_id,
      imageUrl: img.image_url,
      createdAt: img.created_at
    }))
  };
}

export const sellerService = {
  /**
   * Fetch all seller leads with optional filters
   */
  async getSellerLeads(filters?: {
    search?: string;
    district?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('seller_leads')
        .select('*', { count: 'exact' });

      // Apply search (matches name, phone, location name)
      if (filters?.search && filters.search.trim() !== '') {
        const searchVal = filters.search.trim();
        query = query.or(
          `name.ilike.%${searchVal}%,phone_number.ilike.%${searchVal}%,location_name.ilike.%${searchVal}%`
        );
      }

      // Apply filters
      if (filters?.district) {
        query = query.eq('district', filters.district);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Map DB leads to Frontend leads
      const leads = (data || []).map((dbLead: DbSellerLead) => {
        return mapDbSellerLeadToFrontend(dbLead, []);
      });

      return {
        documents: leads,
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching seller leads:', error);
      throw error;
    }
  },

  /**
   * Fetch seller lead details with images
   */
  async getSellerLeadById(id: string) {
    try {
      const { data: dbLead, error: leadError } = await supabase
        .from('seller_leads')
        .select('*')
        .eq('id', id)
        .single();

      if (leadError) throw leadError;

      const { data: dbImages, error: imagesError } = await supabase
        .from('seller_lead_images')
        .select('*')
        .eq('seller_lead_id', id)
        .order('created_at', { ascending: true });

      if (imagesError) throw imagesError;

      return mapDbSellerLeadToFrontend(dbLead, dbImages || []);
    } catch (error) {
      console.error('Error fetching seller lead by ID:', error);
      throw error;
    }
  },

  async createSellerLead(data: Omit<SellerLead, 'id' | 'createdAt' | 'images'> & { imageUrls?: string[] }) {
    try {
      const { data: inserted, error } = await supabase
        .from('seller_leads')
        .insert({
          name: data.name,
          phone_number: data.phoneNumber,
          district: data.district,
          location_name: data.locationName,
          notes: data.notes || null,
          admin_notes: data.adminNotes || null
        })
        .select()
        .single();

      if (error) throw error;

      let dbImages: DbSellerLeadImage[] = [];
      if (data.imageUrls && data.imageUrls.length > 0) {
        const imageRows = data.imageUrls.map(url => ({
          seller_lead_id: inserted.id,
          image_url: url
        }));

        const { data: insertedImages, error: imagesError } = await supabase
          .from('seller_lead_images')
          .insert(imageRows)
          .select();

        if (imagesError) throw imagesError;
        dbImages = insertedImages || [];
      }

      return mapDbSellerLeadToFrontend(inserted, dbImages);
    } catch (error) {
      console.error('Error creating seller lead:', error);
      throw error;
    }
  },

  /**
   * Update seller lead admin notes
   */
  async updateSellerLeadAdminNotes(id: string, adminNotes: string) {
    try {
      const { data: updated, error } = await supabase
        .from('seller_leads')
        .update({
          admin_notes: adminNotes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapDbSellerLeadToFrontend(updated, []);
    } catch (error) {
      console.error('Error updating seller lead admin notes:', error);
      throw error;
    }
  },

  /**
   * Update all details of a seller lead
   */
  async updateSellerLead(
    id: string,
    data: {
      name: string;
      phoneNumber: string;
      district: string;
      locationName: string;
      notes?: string;
      adminNotes?: string;
    }
  ) {
    try {
      const { data: updated, error } = await supabase
        .from('seller_leads')
        .update({
          name: data.name,
          phone_number: data.phoneNumber,
          district: data.district,
          location_name: data.locationName,
          notes: data.notes || null,
          admin_notes: data.adminNotes || null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapDbSellerLeadToFrontend(updated, []);
    } catch (error) {
      console.error('Error updating seller lead:', error);
      throw error;
    }
  },

  /**
   * Associate an uploaded image to a seller lead
   */
  async addSellerLeadImage(sellerLeadId: string, imageUrl: string) {
    try {
      const { data: inserted, error } = await supabase
        .from('seller_lead_images')
        .insert({
          seller_lead_id: sellerLeadId,
          image_url: imageUrl
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: inserted.id,
        sellerLeadId: inserted.seller_lead_id,
        imageUrl: inserted.image_url,
        createdAt: inserted.created_at
      } as SellerLeadImage;
    } catch (error) {
      console.error('Error adding seller lead image:', error);
      throw error;
    }
  },

  /**
   * Remove an image from a seller lead
   */
  async deleteSellerLeadImage(imageId: string) {
    try {
      const { error } = await supabase
        .from('seller_lead_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting seller lead image:', error);
      throw error;
    }
  },

  /**
   * Delete a seller lead
   */
  async deleteSellerLead(id: string) {
    try {
      const { error } = await supabase
        .from('seller_leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting seller lead:', error);
      throw error;
    }
  }
};
