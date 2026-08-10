import { apiClient } from "./client";

export type EventQuotationPayload = {
  service: number;
  name: string;
  email: string;
  phone: string;
  event_date: string;
  event_time?: string;
  city?: string;
  event_location?: string;
  budget_amount?: string;
  schedule_party_for: string[];
  event_theme?: "boy" | "girl" | "corporate" | "neutral" | "custom";
  message?: string;
  consent_to_contact: boolean;
};

export type EventQuotationResponse = {
  success?: boolean;
  message?: string;
  reference?: string;
  data?: {
    id?: number;
    booking?: { id?: number };
  };
};

export const eventManagementService = {
  submit: async (payload: EventQuotationPayload) => (
    await apiClient.post<EventQuotationResponse>("/api/bookings/event-management/", payload)
  ).data,
};
