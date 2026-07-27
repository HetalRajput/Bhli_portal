import { apiClient } from './client';

export type SignupPayload = {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  service_number: string;
  officer_rank: number;
  employee_id: string;
  department: number;
};

export type UserProfile = {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile_number?: string;
  image?: string | null;
  service_number?: string;
  officer_rank?: number;
  officer_rank_name?: string;
  employee_id?: string;
  department?: number;
  department_name?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdatePayload = Partial<Pick<UserProfile,
  'first_name' | 'last_name' | 'email' | 'mobile_number' |
  'service_number' | 'officer_rank' | 'employee_id' | 'department'
>>;

export const authService = {
  signup: async (data: SignupPayload) => {
    const response = await apiClient.post('/api/accounts/auth/signup/', data);
    return response.data;
  },
  sendOtp: async (email: string) => {
    const response = await apiClient.post('/api/accounts/auth/send-otp/', { email });
    return response.data;
  },
  verifyOtp: async (email: string, request_id: string, otp: string) => {
    const response = await apiClient.post('/api/accounts/auth/verify-otp/', { email, request_id, otp });
    return response.data;
  },
  refreshToken: async (refresh: string) => {
    const response = await apiClient.post('/api/accounts/auth/token/refresh/', { refresh });
    return response.data;
  },
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/api/accounts/profile/');
    return response.data?.data ?? response.data;
  },
  updateProfile: async (data: ProfileUpdatePayload): Promise<UserProfile> => {
    const response = await apiClient.patch('/api/accounts/profile/', data);
    return response.data?.data ?? response.data;
  },
  updateProfileImage: async (image: File | null): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append('image', image ?? '');
    const response = await apiClient.patch('/api/accounts/profile/image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data ?? response.data;
  },
  logout: async (refresh: string) => {
    const response = await apiClient.post('/api/accounts/auth/logout/', { refresh });
    return response.data;
  }
};
