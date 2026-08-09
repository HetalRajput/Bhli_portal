import { apiClient } from "./client";

export type FlightTripType = 0 | 1;
export type FlightServiceType = 1 | 2;
export type FlightCabin = "E" | "P" | "B" | "F";
export type PassengerType = "A" | "C" | "I";

export type FlightSearchPayload = {
  trip_type: FlightTripType;
  service_type: FlightServiceType;
  dep_city: string;
  arr_city: string;
  on_date: string;
  re_date: string | null;
  adults: number;
  children: number;
  infants: number;
  cabin: FlightCabin;
  fare_type: "A";
};

export type FlightPassengerPayload = {
  title: string;
  first_name: string;
  last_name: string;
  passenger_type: PassengerType;
  gender: "M" | "F" | "O";
  date_of_birth: string;
  passport_number: string;
  passport_issue_date: string | null;
  passport_expiry_date: string | null;
  passport_nationality: string;
  ssr_info?: Record<string, unknown>;
};

export type FlightBookingPayload = {
  service: number;
  search_session?: number;
  ref_id: string;
  flight_id: string;
  message?: string;
  passengers: FlightPassengerPayload[];
  mobile?: string;
  email?: string;
  first_pax_pan_no?: string;
  gst?: {
    gstNo: string;
    gstCompany: string;
    gstEmail: string;
    gstMobile: string;
    gstAddress: string;
  };
  ssr_details?: Record<string, unknown>;
};

export type FlightApiResponse = {
  success: boolean;
  message?: string;
  data?: Record<string, unknown>;
  ref_id?: string;
  search_flight_id?: string;
  booking_flight_id?: string;
};

const post = async (url: string, payload: unknown) =>
  (await apiClient.post<FlightApiResponse>(url, payload)).data;

export const flightService = {
  search: (payload: FlightSearchPayload) => post("/api/bookings/flight/search/", payload),
  fareDetails: (refId: string, flightId: string) =>
    post("/api/bookings/flight/fare-details/", { ref_id: refId, flight_id: flightId }),
  priceVerify: (refId: string, flightId: string) =>
    post("/api/bookings/flight/price-verify/", { ref_id: refId, flight_id: flightId }),
  fareRules: (refId: string, flightId: string) =>
    post("/api/bookings/flight/fare-rules/", { ref_id: refId, flight_id: flightId }),
  seats: (refId: string, flightId: string, passengers: FlightPassengerPayload[]) =>
    post("/api/bookings/flight/seats/", {
      ref_id: refId,
      flight_id: flightId,
      passengers,
    }),
  book: (payload: FlightBookingPayload) => post("/api/bookings/flight/book/", payload),
  history: (params?: { status?: string; date_from?: string; date_to?: string }) =>
    apiClient.get<FlightApiResponse>("/api/bookings/flight/history/", { params }).then((response) => response.data),
  status: (payload: { booking_id?: number; ref_id?: string }) =>
    post("/api/bookings/flight/status/", payload),
  cancel: (payload: {
    booking_id: number;
    pax_id?: string;
    pax_id_return?: string;
    cancel_mode?: number;
    cancel_remarks: string;
  }) => post("/api/bookings/flight/cancel/", payload),
  balance: () => apiClient.get<FlightApiResponse>("/api/bookings/flight/balance/").then((response) => response.data),
};
