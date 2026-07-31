import { apiClient } from './client';

export type ContactLeadPayload = {
  enquiry_type?: number;
  name: string;
  email?: string;
  mobile_number?: string;
  subject: string;
  message: string;
};

export type ContactLead = ContactLeadPayload & {
  id?: number;
  enquiry_type_name?: string;
  enquiry_type_slug?: string;
  status?: 'new' | string;
  admin_notes?: string;
  created?: string;
  updated?: string;
};

export const baseService = {
  getOfficerRanks: async () => {
    const response = await apiClient.get('/api/base/officer-ranks/');
    return response.data;
  },
  getDepartments: async () => {
    const response = await apiClient.get('/api/base/user-departments/');
    return response.data;
  },
  // Services
  getServices: async (params?: { is_featured?: boolean }) => {
    const query = params?.is_featured === undefined ? '' : `?is_featured=${params.is_featured}`;
    try {
      const response = await fetch(`https://bhli-backend.onrender.com/api/base/services/${query}`, {
        headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(5000), cache: 'no-store',
      });
      if (!response.ok) return [];
      return await response.json();
    } catch { return []; }
  },
  getServiceDetail: async (slug: string) => {
    try {
      const response = await fetch(`https://bhli-backend.onrender.com/api/base/services/${encodeURIComponent(slug)}/`, {
        headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(5000), cache: 'no-store',
      });
      if (!response.ok) return null;
      return await response.json();
    } catch { return null; }
  },
  // The backend currently has no enquiry-types resource. Empty data keeps the
  // forms on their local options without requesting known 404 endpoints.
  getEnquiryTypes: async (): Promise<{ success: boolean; count: number; data: Array<{ id: number; name: string; slug: string }> }> => (
    { success: true, count: 0, data: [] }
  ),
  getEnquiryTypeDetail: async (slug: string) => {
    void slug;
    return null;
  },

  // Contact Leads
  createContactLead: async (data: ContactLeadPayload): Promise<ContactLead> => {
    const response = await apiClient.post('/api/base/contacts/', data);
    return response.data?.data ?? response.data;
  }
};
