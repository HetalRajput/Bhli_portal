import { apiClient } from "./client";

export type BookingGuestInput = { name: string; age: number; gender: "male" | "female" | "other" };
export type BookingGuest = BookingGuestInput & { id?: number };
export type BookingGuestDetails = { adults: BookingGuest[]; children: BookingGuest[] };

export type BookingRequest = {
  id: number;
  user?: number;
  service: number;
  service_name: string;
  service_slug: string;
  service_item?: number | null;
  service_item_title?: string;
  service_item_city?: string;
  service_item_location?: string;
  number_of_guests?: number;
  message?: string;
  consent_to_contact?: boolean;
  status: string;
  remarks?: string;
  admin_notes?: string;
  guests: BookingGuest[];
  guest_details?: BookingGuestDetails;
  created: string;
  updated: string;
  details?: Record<string, unknown>;
  // Cruise-specific fields (explicitly typed for type-safe JSX rendering)
  destination?: string;
  departure_port?: string;
  departure_month?: string;
  departure_year?: string;
  nights?: number;
  number_of_passengers?: number;
  [key: string]: unknown;
};

export type BookingHistoryResponse = {
  success: boolean;
  count: number;
  data: BookingRequest[];
};

export type BookingRequestInput = {
  service: number; service_item?: number; check_in_date?: string; check_in_time?: string;
  check_out_date?: string; check_out_time?: string; number_of_rooms?: number; spouse_included?: boolean;
  budget_amount?: string | number; td_tariff_amount?: string | number; details?: Record<string, unknown>;
  message?: string; guests: BookingGuestInput[]; consent_to_contact?: boolean;
};
export type SimpleBookingInput = { service: number; date: string; message?: string; consent_to_contact?: boolean };

export const bookingService = {
  createTypedBooking: async <T = Record<string, unknown>>(slug: string, data: Record<string, unknown>) => (
    await apiClient.post<T>(`/api/bookings/${encodeURIComponent(slug)}/`, data)
  ).data,
  createGenericBooking: async (data: BookingRequestInput) => (await apiClient.post("/api/bookings/requests/", data)).data,
  createSimpleBooking: async (data: SimpleBookingInput) => (await apiClient.post("/api/bookings/requests/simple/", data)).data,
  listBookings: async (params?: { service?: number; service_slug?: string; status?: string }) => (
    await apiClient.get<BookingHistoryResponse>("/api/bookings/requests/history/", { params })
  ).data,
  getBookingById: async (id: number) => {
    const payload = (await apiClient.get<BookingRequest | { success: boolean; data: BookingRequest }>(`/api/bookings/requests/${id}/`)).data;
    return "data" in payload ? payload.data : payload;
  },
  cancelBooking: async (id: number, reason?: string) => (await apiClient.post(`/api/bookings/requests/${id}/cancel/`, { reason: reason?.trim() || "" })).data,
};
