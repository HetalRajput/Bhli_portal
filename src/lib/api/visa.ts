import { apiClient } from "./client";

export type VisaOption = {
  id: number;
  name: string;
  slug: string;
};

type VisaOptionResponse = {
  success: boolean;
  count: number;
  data: VisaOption[];
};

export type VisaAssistanceResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    booking?: {
      id: number;
      service_name?: string;
      service_slug?: string;
      status?: string;
    };
    [key: string]: unknown;
  };
};

export type VisaAssistanceSubmission = FormData | Record<string, unknown>;

function optionData(payload: VisaOptionResponse | VisaOption[]): VisaOption[] {
  return Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : [];
}

export const visaService = {
  countries: async (search?: string) => {
    const response = await apiClient.get<VisaOptionResponse | VisaOption[]>("/api/bookings/visa/countries/", {
      params: search ? { search } : undefined,
    });
    return optionData(response.data);
  },
  types: async (search?: string) => {
    const response = await apiClient.get<VisaOptionResponse | VisaOption[]>("/api/bookings/visa/types/", {
      params: search ? { search } : undefined,
    });
    return optionData(response.data);
  },
  purposes: async (search?: string) => {
    const response = await apiClient.get<VisaOptionResponse | VisaOption[]>("/api/bookings/visa/purposes/", {
      params: search ? { search } : undefined,
    });
    return optionData(response.data);
  },
  submit: async (payload: VisaAssistanceSubmission) => {
    const isMultipart = typeof FormData !== "undefined" && payload instanceof FormData;
    return (await apiClient.post<VisaAssistanceResponse>(
      "/api/bookings/visa-assistance/",
      payload,
      isMultipart ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    )).data;
  },
};
