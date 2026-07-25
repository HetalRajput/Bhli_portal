import { apiClient } from './client';

export const cmsService = {
  getServices: async (params?: any) => {
    const response = await apiClient.get('/api/base/services/', { params });
    return response.data;
  },
  getServiceDetail: async (slug: string) => {
    const response = await apiClient.get(`/api/base/services/${slug}/`);
    return response.data;
  },
  searchServiceItems: async (slug: string, query: string) => {
    const response = await apiClient.get(`/api/base/services/${slug}/search/`, {
      params: { q: query }
    });
    return response.data;
  },
  getClients: async (params?: any) => {
    const response = await apiClient.get('/api/base/our-clients/', { params });
    return response.data;
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

