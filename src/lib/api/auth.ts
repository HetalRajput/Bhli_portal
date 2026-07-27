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
  }
};
