import { apiClient } from "./client";

export type CateringCity = { id: number; name: string; slug: string };
export type CateringCitiesResponse = { success: boolean; count: number; data: CateringCity[] };

export type CateringBookingPayload = {
  service: number;
  full_name: string;
  company_organization?: string;
  mobile_number: string;
  email: string;
  gst_number?: string;
  preferred_contact_time?: string;
  event_type: string;
  event_date: string;
  start_time: string;
  end_time?: string;
  venue_name: string;
  venue_city: number;
  venue_address?: string;
  expected_number_of_guests: number;
  meal_type: string[];
  cuisine_preference?: string[];
  food_preference?: string;
  budget_per_person?: string;
  service_style?: string;
  service_requirements?: string[];
  preferred_menu_items?: string;
  dietary_requirements?: string;
  special_instructions?: string;
  event_management_required?: boolean;
  decor_required?: boolean;
  bar_beverage_service_required?: boolean;
  photography_required?: boolean;
  other_requirements?: string;
  quotation_required?: boolean;
  message?: string;
  consent_to_contact?: boolean;
  declaration_accepted: true;
};

export type CateringBookingResponse = {
  success: boolean;
  message?: string;
  data?: { id?: number; booking?: { id?: number } };
  errors?: Record<string, string[]>;
};

function toFormData(payload: CateringBookingPayload, file: File) {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    if (Array.isArray(value)) value.forEach((item) => form.append(key, item));
    else form.append(key, String(value));
  });
  form.append("menu_event_brief", file);
  return form;
}

export const cateringService = {
  cities: async (search = "") => (
    await apiClient.get<CateringCitiesResponse>("/api/bookings/catering/cities/", { params: search ? { search } : undefined })
  ).data,
  createBooking: async (payload: CateringBookingPayload, file?: File | null) => (
    await apiClient.post<CateringBookingResponse>(
      "/api/bookings/catering-services/",
      file ? toFormData(payload, file) : payload,
      file ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    )
  ).data,
};
