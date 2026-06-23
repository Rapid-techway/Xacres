import { supabase } from '@/lib/supabase';
import { Broker, Land } from '@/lib/types';

interface DbBroker {
  id: string;
  broker_code: string;
  name: string;
  office_name: string | null;
  phone_number: string;
  alternate_phone_number: string | null;
  district: string;
  tehsil: string;
  address: string | null;
  google_location_url: string | null;
  experience_years: number;
  referred_by: string | null;
  reputation: 'SILVER' | 'GOLD' | 'DIAMOND';
  description: string | null;
  created_at: string;
  updated_at: string;
}interface DbBrokerWithRelations extends DbBroker {
  lands?: { id: string }[];
  broker_images?: { id: string; image_url: string; created_at: string }[];
}

interface DbLandSnippet {
  id: string;
  title: string;
  district: string;
  village: string;
  listed_price: number;
  area_acres: number;
  is_public: boolean;
  tehsil?: string | null;
}

function mapDbBrokerToFrontend(dbBroker: DbBrokerWithRelations, totalLands = 0): Broker {
  return {
    id: dbBroker.id,
    $id: dbBroker.id,
    brokerCode: dbBroker.broker_code,
    name: dbBroker.name,
    officeName: dbBroker.office_name || undefined,
    phoneNumber: dbBroker.phone_number,
    alternatePhoneNumber: dbBroker.alternate_phone_number || undefined,
    district: dbBroker.district,
    tehsil: dbBroker.tehsil,
    address: dbBroker.address || undefined,
    googleLocationUrl: dbBroker.google_location_url || undefined,
    experienceYears: dbBroker.experience_years,
    referredBy: dbBroker.referred_by || undefined,
    reputation: dbBroker.reputation,
    description: dbBroker.description || undefined,
    createdAt: dbBroker.created_at,
    updatedAt: dbBroker.updated_at,
    totalLands,
    images: dbBroker.broker_images?.map(img => ({
      id: img.id,
      brokerId: dbBroker.id,
      imageUrl: img.image_url,
      createdAt: img.created_at
    })) || []
  };
}

export const brokerService = {
  /**
   * Fetch all brokers with optional search and filters
   */
  async getBrokers(filters?: {
    search?: string;
    district?: string;
    tehsil?: string;
    reputation?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Select broker along with its associated lands IDs to compute land counts
      let query = supabase
        .from('brokers')
        .select('*, lands(id)', { count: 'exact' });

      // Apply search
      if (filters?.search && filters.search.trim() !== '') {
        const searchVal = filters.search.trim();
        query = query.or(
          `name.ilike.%${searchVal}%,broker_code.ilike.%${searchVal}%,phone_number.ilike.%${searchVal}%,office_name.ilike.%${searchVal}%`
        );
      }

      // Apply filters
      if (filters?.district) {
        query = query.eq('district', filters.district);
      }
      if (filters?.tehsil) {
        query = query.eq('tehsil', filters.tehsil);
      }
      if (filters?.reputation) {
        query = query.eq('reputation', filters.reputation.toUpperCase());
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const brokers = (data || []).map((dbBroker: DbBrokerWithRelations) => {
        const landCount = dbBroker.lands ? dbBroker.lands.length : 0;
        return mapDbBrokerToFrontend(dbBroker, landCount);
      });

      return {
        documents: brokers,
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching brokers:', error);
      throw error;
    }
  },

  /**
   * Get single broker details by ID
   */
  async getBrokerById(id: string) {
    try {
      const { data, error } = await supabase
        .from('brokers')
        .select('*, broker_images(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return mapDbBrokerToFrontend(data);
    } catch (error) {
      console.error('Error fetching broker by ID:', error);
      throw error;
    }
  },

  /**
   * Get single broker along with details of all lands managed by them
   */
  async getBrokerByIdWithLands(id: string) {
    try {
      const { data, error } = await (supabase
        .from('brokers')
        .select('*, broker_images(*), lands(id, title, district, tehsil, village, listed_price, area_acres, is_public)')
        .eq('id', id)
        .single() as unknown as Promise<{ data: (DbBrokerWithRelations & { lands: DbLandSnippet[] | null }) | null; error: unknown }>);

      if (error) throw error;
      if (!data) throw new Error('Broker not found');

      const lands: Land[] = (data.lands || []).map((l: DbLandSnippet) => ({
        id: l.id,
        $id: l.id,
        title: l.title,
        slug: '',
        district: l.district,
        tehsil: l.tehsil || null,
        village: l.village,
        listedPrice: Number(l.listed_price),
        area: Number(l.area_acres),
        isPublic: l.is_public,
        images: [],
        description: '',
        landType: '',
        roadAccess: false,
        latitude: 0,
        longitude: 0
      }));

      const broker = mapDbBrokerToFrontend(data, lands.length);

      return {
        broker,
        lands
      };
    } catch (error) {
      console.error('Error fetching broker with lands:', error);
      throw error;
    }
  },

  /**
   * Auto-generate a unique broker code based on district-wise serials
   */
  async generateBrokerCode(district: string, tehsil: string, reputation: 'SILVER' | 'GOLD' | 'DIAMOND') {
    if (!district || !tehsil || !reputation) return '';

    try {
      // Find latest broker in selected district to calculate serial
      const { data, error } = await supabase
        .from('brokers')
        .select('broker_code')
        .eq('district', district.trim())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextSerial = 1;

      if (data && data.length > 0) {
        const latestCode = data[0].broker_code;
        const parts = latestCode.split('/');
        const lastPart = parts[parts.length - 1];
        const parsedSerial = parseInt(lastPart, 10);
        if (!isNaN(parsedSerial)) {
          nextSerial = parsedSerial + 1;
        }
      }

      const serialStr = String(nextSerial).padStart(3, '0');
      const repCode = reputation === 'SILVER' ? 's' : reputation === 'GOLD' ? 'g' : 'd';
      
      const cleanDistrict = district.trim().toLowerCase().replace(/\s+/g, '-');
      const cleanTehsil = tehsil.trim().toLowerCase().replace(/\s+/g, '-');

      return `${cleanDistrict}/${cleanTehsil}/${repCode}/${serialStr}`;
    } catch (error) {
      console.error('Error generating broker code:', error);
      return '';
    }
  },

  /**
   * Create new broker
   */
  async createBroker(data: Omit<Broker, 'id' | 'brokerCode' | 'createdAt' | 'updatedAt' | 'totalLands'>) {
    try {
      // Re-generate broker_code server-side just before insertion for consistency
      const brokerCode = await this.generateBrokerCode(data.district, data.tehsil, data.reputation);
      
      if (!brokerCode) {
        throw new Error('Failed to generate a valid broker code');
      }

      const { data: inserted, error } = await supabase
        .from('brokers')
        .insert({
          broker_code: brokerCode,
          name: data.name,
          office_name: data.officeName || null,
          phone_number: data.phoneNumber,
          alternate_phone_number: data.alternatePhoneNumber || null,
          district: data.district,
          tehsil: data.tehsil,
          address: data.address || null,
          google_location_url: data.googleLocationUrl || null,
          experience_years: data.experienceYears || 0,
          referred_by: data.referredBy || null,
          reputation: data.reputation,
          description: data.description || null
        })
        .select()
        .single();

      if (error) throw error;

      // Handle direct image insertion if images are included
      if (data.images && data.images.length > 0) {
        const imageInserts = data.images.map((img) => ({
          broker_id: inserted.id,
          image_url: img.imageUrl
        }));
        const { error: imgError } = await supabase.from('broker_images').insert(imageInserts);
        if (imgError) throw imgError;
      }

      return this.getBrokerById(inserted.id);
    } catch (error) {
      console.error('Error creating broker:', error);
      throw error;
    }
  },

  /**
   * Update existing broker
   */
  async updateBroker(id: string, data: Partial<Omit<Broker, 'id' | 'brokerCode' | 'createdAt' | 'updatedAt' | 'totalLands'>>) {
    try {
      const payload: Record<string, string | number | null> = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.officeName !== undefined) payload.office_name = data.officeName || null;
      if (data.phoneNumber !== undefined) payload.phone_number = data.phoneNumber;
      if (data.alternatePhoneNumber !== undefined) payload.alternate_phone_number = data.alternatePhoneNumber || null;
      if (data.district !== undefined) payload.district = data.district;
      if (data.tehsil !== undefined) payload.tehsil = data.tehsil;
      if (data.address !== undefined) payload.address = data.address || null;
      if (data.googleLocationUrl !== undefined) payload.google_location_url = data.googleLocationUrl || null;
      if (data.experienceYears !== undefined) payload.experience_years = data.experienceYears;
      if (data.referredBy !== undefined) payload.referred_by = data.referredBy || null;
      if (data.reputation !== undefined) payload.reputation = data.reputation;
      if (data.description !== undefined) payload.description = data.description || null;

      const { error } = await supabase
        .from('brokers')
        .update(payload)
        .eq('id', id);

      if (error) throw error;

      // Sync images if passed
      if (data.images !== undefined) {
        await supabase.from('broker_images').delete().eq('broker_id', id);
        if (data.images.length > 0) {
          const imageInserts = data.images.map((img) => ({
            broker_id: id,
            image_url: img.imageUrl
          }));
          const { error: imgError } = await supabase.from('broker_images').insert(imageInserts);
          if (imgError) throw imgError;
        }
      }

      return this.getBrokerById(id);
    } catch (error) {
      console.error('Error updating broker:', error);
      throw error;
    }
  },

  /**
   * Delete a broker
   */
  async deleteBroker(id: string) {
    try {
      const { error } = await supabase
        .from('brokers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting broker:', error);
      throw error;
    }
  }
};
