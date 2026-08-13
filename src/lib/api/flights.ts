import { apiClient } from "./client";

export type FlightTripType = 0 | 1;
export type FlightServiceType = 1 | 2;
export type FlightCabin = "E" | "P" | "B" | "F";
export type PassengerType = "A" | "C" | "I";
export type FlightPassengerGender = "male" | "female" | "other";
export type FlightJsonRecord = Record<string, unknown>;

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
  gender: FlightPassengerGender;
  date_of_birth: string;
  passport_number: string;
  passport_issue_date: string | null;
  passport_expiry_date: string | null;
  passport_nationality: string;
  ssr_info?: FlightJsonRecord;
};

export type FlightReferencePayload = {
  ref_id: string;
  flight_id: string;
};

export type FlightSeatDetailsPayload = FlightReferencePayload & {
  passengers: FlightPassengerPayload[];
};

export type FlightGstPayload = {
  gstNo: string;
  gstCompany: string;
  gstEmail: string;
  gstMobile: string;
  gstAddress: string;
};

export type FlightBookingPayload = FlightReferencePayload & {
  service: number;
  search_session: number;
  message?: string;
  passengers: FlightPassengerPayload[];
  mobile?: string;
  email?: string;
  first_pax_pan_no?: string;
  gst?: FlightGstPayload;
  ssr_details?: FlightJsonRecord;
};

export type FlightApiResponse<TData = FlightJsonRecord> = {
  success: boolean;
  message?: string;
  data?: TData;
  ref_id?: string;
  search_flight_id?: string;
  booking_flight_id?: string;
};

export type FlightSearchResponseData = FlightJsonRecord & {
  search_session?: number | string;
  ref_id?: string;
  search_flight_id?: string;
  provider_response?: unknown;
};

export type FlightFareDetailsData = FlightJsonRecord & {
  results?: FlightJsonRecord[];
  Status?: FlightJsonRecord;
};

export type FlightProviderOperationData = FlightJsonRecord & {
  success?: boolean | number | string;
  errorDesc?: string;
  message?: string;
};

export type FlightStatusPayload =
  | { booking_id: number; ref_id?: never }
  | { booking_id?: never; ref_id: string };

const FLIGHT_REQUEST_TIMEOUT_MS = 75_000;

const post = async <TData = FlightJsonRecord>(url: string, payload: unknown) =>
  (await apiClient.post<FlightApiResponse<TData>>(url, payload, { timeout: FLIGHT_REQUEST_TIMEOUT_MS })).data;

export const flightService = {
  search: (payload: FlightSearchPayload) =>
    post<FlightSearchResponseData>("/api/bookings/flight/search/", payload),
  fareDetails: (refId: string, flightId: string) =>
    post<FlightFareDetailsData>("/api/bookings/flight/fare-details/", {
      ref_id: refId,
      flight_id: flightId,
    }),
  priceVerify: (refId: string, flightId: string) =>
    post<FlightProviderOperationData>("/api/bookings/flight/price-verify/", {
      ref_id: refId,
      flight_id: flightId,
    }),
  fareRules: (refId: string, flightId: string) =>
    post<FlightProviderOperationData>("/api/bookings/flight/fare-rules/", {
      ref_id: refId,
      flight_id: flightId,
    }),
  seats: (refId: string, flightId: string, passengers: FlightPassengerPayload[]) =>
    post<FlightProviderOperationData>("/api/bookings/flight/seats/", {
      ref_id: refId,
      flight_id: flightId,
      passengers,
    } satisfies FlightSeatDetailsPayload),
  book: (payload: FlightBookingPayload) =>
    post<FlightJsonRecord>("/api/bookings/flight/book/", payload),
  history: (params?: { status?: string; date_from?: string; date_to?: string }) =>
    apiClient
      .get<FlightApiResponse<FlightJsonRecord[]>>("/api/bookings/flight/history/", { params })
      .then((response) => response.data),
  status: (payload: FlightStatusPayload) =>
    post("/api/bookings/flight/status/", payload),
  cancel: (payload: {
    booking_id: number;
    pax_id?: string;
    pax_id_return?: string;
    cancel_mode?: number;
    cancel_remarks: string;
  }) => post("/api/bookings/flight/cancel/", payload),
  balance: () =>
    apiClient
      .get<FlightApiResponse<FlightProviderOperationData>>("/api/bookings/flight/balance/")
      .then((response) => response.data),
};
