import { apiClient } from './client';

export const authService = {
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
