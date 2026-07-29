import { apiClient } from './client';

export const bookingService = {
  createGenericBooking: async (data: any) => {
    const response = await apiClient.post('/api/bookings/requests/', data);
    return response.data;
  },
  listBookings: async (params?: { service_type?: string; status?: string }) => {
    const response = await apiClient.get('/api/bookings/requests/history/', { params });
    return response.data;
  },
  getBookingById: async (id: number) => {
    const response = await apiClient.get(`/api/bookings/requests/${id}/`);
    return response.data;
  },
  createHotelBooking: async (data: any) => {
    const response = await apiClient.post('/api/bookings/hotel/', data);
    return response.data;
  },
  createFlightBooking: async (data: any) => {
    const response = await apiClient.post('/api/bookings/flight/', data);
    return response.data;
  },
  createBusBooking: async (data: any) => {
    const response = await apiClient.post('/api/bookings/bus/', data);
    return response.data;
  },
  createTrainBooking: async (data: any) => {
    const response = await apiClient.post('/api/bookings/train/', data);
    return response.data;
  },
  createTaxiBooking: async (data: any) => {
    const response = await apiClient.post('/api/bookings/taxi/', data);
    return response.data;
  },
  createCruiseBooking: async (data: any) => {
    const response = await apiClient.post('/api/bookings/cruise/', data);
    return response.data;
  },
  createHolidayPackageBooking: async (data: any) => {
    const response = await apiClient.post('/api/bookings/holiday-packages/', data);
    return response.data;
  },
  createVisaBooking: async (data: any) => {
    const response = await apiClient.post('/api/bookings/visa/', data);
    return response.data;
  },
  createDefenceHelpDeskBooking: async (data: any) => {
    const response = await apiClient.post('/api/bookings/defence-help-desk/', data);
    return response.data;
  },
  createGovernmentBooking: async (data: any) => {
    const response = await apiClient.post('/api/bookings/government-bookings/', data);
    return response.data;
  }
};
