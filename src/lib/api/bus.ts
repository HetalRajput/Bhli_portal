import { apiClient } from "./client";

export type BusCity = { id: number; name: string; slug: string };
export type BusCitiesResponse = { success: boolean; count: number; data: BusCity[] };

export type BusBookingPayload = {
  service: number;
  from_city: number;
  to_city: number;
  journey_date: string;
  preferred_departure_time?: string;
  return_journey: boolean;
  return_date?: string | null;
  number_of_passengers: number;
  passenger_type: "adult" | "child" | "senior_citizen";
  bus_type?: "ac_sleeper" | "ac_seater" | "ac_semi_sleeper" | "non_ac_sleeper" | "non_ac_seater" | "volvo_premium" | "electric";
  seat_preference?: "window" | "aisle" | "any";
  preferred_bus_operator?: string;
  pickup_point_preference?: string;
  drop_point_preference?: string;
  full_name: string;
  mobile_number: string;
  email?: string;
  id_proof_type?: string;
  id_proof_number?: string;
  hotel_required: boolean;
  transfer_required: boolean;
  gst_invoice_required: boolean;
  gst_number?: string;
  special_assistance_remarks?: string;
  message?: string;
  consent_to_contact: boolean;
  declaration_accepted: true;
};

export type BusBookingResponse = {
  success: boolean;
  message?: string;
  data?: { id?: number; booking?: { id?: number } };
  errors?: Record<string, string[]>;
};

export const busService = {
  cities: async (search = "") => (
    await apiClient.get<BusCitiesResponse>("/api/bookings/bus/cities/", { params: search ? { search } : undefined })
  ).data,
  createBooking: async (payload: BusBookingPayload) => (
    await apiClient.post<BusBookingResponse>("/api/bookings/bus-ticket-booking/", payload)
  ).data,
};
