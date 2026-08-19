import { apiClient } from "./client";

export type TravelInsuranceType = {
  id: number;
  name: string;
  slug: string;
};

export type CountryMaster = {
  id: number;
  name: string;
  slug: string;
  country_code: string;
};

export type VisaType = {
  id: number;
  name: string;
  slug: string;
};

type LookupResponse<T> = {
  success: boolean;
  message: string;
  count: number;
  data: T[];
};

export type TravelInsuranceBooking = {
  id: number;
  booking: number | { id?: number };
  full_name: string;
  dob: string;
  mobile: string;
  email: string;
  passport_number: string;
  nationality: string;
  traveller_type: "adult" | "child" | "senior_citizen";
  number_of_travellers: number;
  insurance_type: number;
  destination_country: number;
  trip_start_date: string;
  trip_end_date: string;
  purpose_of_travel: string;
  visa_type: number | null;
  coverage_requirements: string[];
  other_add_ons: string;
  coverage_amount_required: string;
  passport_copy: string | null;
  visa_copy: string | null;
  other_document: string | null;
  remarks: string;
  declaration_accepted: boolean;
  processed_by: string;
  insurer_provider: string;
  quote_premium: string;
};

export type TravelInsuranceBookingResponse = {
  success: boolean;
  message: string;
  data?: TravelInsuranceBooking;
  errors?: Record<string, string[]>;
  reference?: string;
};

export type TravellerType = "adult" | "child" | "senior_citizen";

export type TravelInsuranceBookingFields = {
  service: string;
  full_name: string;
  dob: string;
  mobile: string;
  email: string;
  passport_number: string;
  nationality: string;
  traveller_type: TravellerType;
  number_of_travellers: string;
  insurance_type: string;
  destination_country: string;
  trip_start_date: string;
  trip_end_date: string;
  purpose_of_travel: string;
  declaration_accepted: "true";
  visa_type?: string;
  other_add_ons?: string;
  coverage_amount_required?: string;
  remarks?: string;
};

function lookupData<T>(response: LookupResponse<T>): T[] {
  if (!response.success) throw new Error(response.message || "Options could not be loaded.");
  return Array.isArray(response.data) ? response.data : [];
}

const searchParams = (search?: string) => search?.trim() ? { search: search.trim() } : undefined;

export const travelInsuranceService = {
  types: async (search?: string) => {
    const response = await apiClient.get<LookupResponse<TravelInsuranceType>>(
      "/api/bookings/travel-insurance/types/",
      { params: searchParams(search) },
    );
    return lookupData(response.data);
  },

  countries: async (search?: string) => {
    const response = await apiClient.get<LookupResponse<CountryMaster>>(
      "/api/bookings/countries/",
      { params: searchParams(search) },
    );
    return lookupData(response.data);
  },

  visaTypes: async (search?: string) => {
    const response = await apiClient.get<LookupResponse<VisaType>>(
      "/api/bookings/visa/types/",
      { params: searchParams(search) },
    );
    return lookupData(response.data);
  },

  createBooking: async (payload: FormData) => {
    // The shared client defaults to JSON, so explicitly select multipart for
    // this endpoint. Axios supplies the browser-generated boundary.
    const response = await apiClient.post<TravelInsuranceBookingResponse>(
      "/api/bookings/travel-insurance/",
      payload,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },
};
