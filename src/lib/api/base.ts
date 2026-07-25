import { apiClient } from './client';

export const baseService = {
  // Services
  getServices: async (params?: { is_featured?: boolean }) => {
    const response = await apiClient.get('/api/base/services/', { params });
    return response.data;
  },
  getServiceDetail: async (slug: string) => {
    const response = await apiClient.get(`/api/base/services/${slug}/`);
    return response.data;
  },

  // Enquiry Types
  getEnquiryTypes: async () => {
    try {
      const response = await apiClient.get('/api/base/enquiry-types/');
      return response.data;
    } catch (e) {
      const response = await apiClient.get('/api/base/get-enquiry-types/');
      return response.data;
    }
  },
  getEnquiryTypeDetail: async (slug: string) => {
    const response = await apiClient.get(`/api/base/enquiry-types/${slug}/`);
    return response.data;
  },

  // Contact Leads
  createContactLead: async (data: {
    enquiry_type?: number;
    name: string;
    email?: string;
    mobile_number?: string;
    subject: string;
    message: string;
  }) => {
    const response = await apiClient.post('/api/base/contacts/', data);
    return response.data;
  }
};
