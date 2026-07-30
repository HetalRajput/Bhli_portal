import { apiClient } from "./client";

export type BookingGuestInput = { name: string; age: number; gender: "male" | "female" | "other" };
export type BookingRequestInput = {
  service: number; service_item?: number; check_in_date?: string; check_in_time?: string;
  check_out_date?: string; check_out_time?: string; number_of_rooms?: number; spouse_included?: boolean;
  budget_amount?: string | number; td_tariff_amount?: string | number; details?: Record<string, unknown>;
  message?: string; guests: BookingGuestInput[]; consent_to_contact?: boolean;
};
export type SimpleBookingInput = { service: number; date: string; message?: string; consent_to_contact?: boolean };

export const bookingService = {
  createGenericBooking: async (data: BookingRequestInput) => (await apiClient.post("/api/bookings/requests/", data)).data,
  createSimpleBooking: async (data: SimpleBookingInput) => (await apiClient.post("/api/bookings/requests/simple/", data)).data,
  listBookings: async (params?: { service?: number; service_slug?: string; status?: string }) => (await apiClient.get("/api/bookings/requests/history/", { params })).data,
  getBookingById: async (id: number) => (await apiClient.get(`/api/bookings/requests/${id}/`)).data,
  cancelBooking: async (id: number, reason?: string) => (await apiClient.post(`/api/bookings/requests/${id}/cancel/`, { reason: reason?.trim() || "" })).data,
};
