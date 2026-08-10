import { apiClient } from "./client";

export type HotelConsultancyPayload = FormData | Record<string, unknown>;

export type HotelConsultancyResponse = {
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

export const hotelConsultancyService = {
  submit: async (payload: HotelConsultancyPayload) => {
    const isMultipart = typeof FormData !== "undefined" && payload instanceof FormData;
    return (await apiClient.post<HotelConsultancyResponse>(
      "/api/bookings/hotel-consultancy/",
      payload,
      isMultipart ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    )).data;
  },
};
