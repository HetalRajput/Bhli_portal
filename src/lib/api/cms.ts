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

type ClientListResponse = {
  success: boolean;
  count: number;
  data: OurClient[];
};

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
  getServices: async (params?: any) => {
    const response = await apiClient.get('/api/base/services/', { params });
    return response.data;
  },
  getServiceDetail: async (slug: string, params?: any) => {
    const response = await apiClient.get(`/api/base/services/${slug}/`, { params });
    return response.data;
  },
  searchServiceItems: async (slug: string, query: string, page?: number, pageSize?: number) => {
    const trimmed = (query || '').trim();
    const params: Record<string, any> = {};
    if (page) params.page = page;
    if (pageSize) params.page_size = pageSize;

    try {
      if (trimmed) {
        params.q = trimmed;
        const response = await apiClient.get(`/api/base/services/${slug}/search/`, { params });
        return response.data;
      } else {
        const response = await apiClient.get(`/api/base/services/${slug}/`, { params });
        return response.data;
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        return { success: true, count: 0, results: [], data: [] };
      }
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
  getGallery: async (params?: any) => {
    const response = await apiClient.get('/api/base/gallery-albums/', { params });
    return response.data;
  },
  getTestimonials: async () => {
    const response = await apiClient.get('/api/base/testimonials/');
    return response.data;
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
    const response = await apiClient.get('/api/base/channel-partners/');
    return response.data;
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
