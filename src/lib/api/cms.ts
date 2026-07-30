import { apiClient } from './client';

export type Banner = {
  id: number;
  title: string;
  slug?: string;
  subtitle: string;
  description?: string;
  image: string;
  website_url?: string;
  link_url?: string;
  open_in_new_tab?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

type BannerListResponse = {
  success: boolean;
  count: number;
  data: Banner[];
};

export type OurClient = {
  id: number;
  category: number;
  category_name: string;
  category_slug: string;
  name: string;
  slug: string;
  label: string;
  description: string;
  logo: string;
  website_url: string;
  account_status_label: string;
  has_active_account: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

type ClientListResponse = {
  success: boolean;
  count: number;
  data: OurClient[];
};

export type ChannelPartner = {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  image: string;
  website_url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

type ChannelPartnerListResponse = {
  success: boolean;
  count: number;
  data: ChannelPartner[];
};

export type GalleryImage = {
  id: number; title: string; slug: string; image: string;
  category_label: string; caption: string; description: string; alt_text: string;
  is_cover: boolean; is_active: boolean; display_order: number;
  created_at: string; updated_at: string;
};

export type GalleryAlbum = {
  id: number; category: number; category_name: string; category_slug: string;
  title: string; slug: string; subtitle: string; description: string;
  is_featured: boolean; is_active: boolean; display_order: number;
  created_at: string; updated_at: string; images: GalleryImage[];
};

type GalleryListResponse = { success: boolean; count: number; data: GalleryAlbum[] };

export type Testimonial = {
  id: number;
  name: string;
  designation: string;
  organization: string;
  message: string;
  rating: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

type TestimonialListResponse = { success: boolean; count: number; data: Testimonial[] };
export const cmsService = {
  getBanners: async () => {
    try {
      const response = await apiClient.get<Banner[] | BannerListResponse>('/api/base/banners/');
      return Array.isArray(response.data) ? response.data : response.data.data ?? [];
    } catch (error) {
      console.warn('[Banners API] Using the homepage fallback banners.', error);
      return [];
    }
  },
  getServices: async (params?: Record<string, string | number | boolean>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([key, value]) => searchParams.set(key, String(value)));
    const query = searchParams.toString();
    const url = `https://bhli-backend.onrender.com/api/base/services/${query ? `?${query}` : ''}`;

    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
        cache: 'no-store',
      });
      if (!response.ok) return [];
      return await response.json();
    } catch {
      return [];
    }
  },
  getServiceDetail: async (slug: string, params?: Record<string, string | number | boolean>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([key, value]) => searchParams.set(key, String(value)));
    const query = searchParams.toString();
    const url = `https://bhli-backend.onrender.com/api/base/services/${encodeURIComponent(slug)}/${query ? `?${query}` : ''}`;

    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
        cache: 'no-store',
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },
  searchServiceItems: async (slug: string, query: string, page?: number, pageSize?: number) => {
    const params = new URLSearchParams();
    const trimmed = (query || '').trim();
    if (trimmed) params.set('q', trimmed);
    if (page) params.set('page', String(page));
    if (pageSize) params.set('page_size', String(pageSize));
    const endpoint = trimmed ? `${encodeURIComponent(slug)}/search/` : `${encodeURIComponent(slug)}/`;

    try {
      const response = await fetch(`https://bhli-backend.onrender.com/api/base/services/${endpoint}?${params.toString()}`, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
        cache: 'no-store',
      });
      if (response.status === 404) return { success: true, count: 0, results: [], data: [] };
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  },
  getClients: async (params?: Record<string, string | number | boolean>) => {
    try {
      const response = await apiClient.get<OurClient[] | ClientListResponse>('/api/base/our-clients/', { params });
      return Array.isArray(response.data) ? response.data : response.data.data ?? [];
    } catch (error) {
      console.warn('[Clients API] Using the homepage fallback partners.', error);
      return [];
    }
  },
  getTeam: async () => {
    const response = await apiClient.get('/api/base/team-members/');
    return response.data;
  },
  getGallery: async (params?: Record<string, string | number | boolean>) => {
    const response = await apiClient.get<GalleryAlbum[] | GalleryListResponse>('/api/base/gallery-albums/', { params });
    return Array.isArray(response.data) ? response.data : response.data.data ?? [];
  },
  getGalleryAlbum: async (slug: string) => {
    const response = await apiClient.get<GalleryAlbum | { success: boolean; data: GalleryAlbum }>(
      `/api/base/gallery-albums/${encodeURIComponent(slug)}/`
    );
    return 'data' in response.data ? response.data.data : response.data;
  },
  getTestimonials: async () => {
    const response = await apiClient.get<Testimonial[] | TestimonialListResponse>('/api/base/testimonials/');
    return Array.isArray(response.data) ? response.data : response.data.data ?? [];
  },
  getFaqs: async () => {
    const response = await apiClient.get('/api/base/faqs/');
    return response.data;
  },
  getContactInformation: async () => {
    const response = await apiClient.get('/api/base/contact-information/');
    return response.data;
  },
  getChannelPartners: async () => {
    const response = await apiClient.get<ChannelPartner[] | ChannelPartnerListResponse>('/api/base/channel-partners/');
    return Array.isArray(response.data) ? response.data : response.data.data ?? [];
  },
  getClientCategories: async () => {
    const response = await apiClient.get('/api/base/client-categories/');
    return response.data;
  },
  getGalleryCategories: async () => {
    const response = await apiClient.get('/api/base/gallery-categories/');
    return response.data;
  },
  getEvents: async () => {
    const response = await apiClient.get('/api/base/events/');
    return response.data;
  },
  getEventDetail: async (slug: string) => {
    const response = await apiClient.get(`/api/base/events/${slug}/`);
    return response.data;
  }
};
