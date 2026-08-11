import { apiClient } from "./client";

export type ApiEnvelope<T> = { success: boolean; message?: string; data: T };
export type PaginatedResponse<T> = ApiEnvelope<T[]> & {
  count: number;
  next?: string | null;
  previous?: string | null;
  page?: number;
  page_size?: number;
  total_pages?: number;
};
export type QueryValue = string | number | boolean | undefined | null;
export type QueryParams = Record<string, QueryValue>;

export type Airport = {
  id: number;
  airport_id: number;
  airport_code: string;
  airport_name: string;
  airport_city: string;
  airport_country: string;
  display_name: string;
};

export type VendorLink = {
  id: number;
  service: number | null;
  service_name?: string;
  service_slug?: string;
  vendor_name: string;
  title: string;
  subtitle?: string;
  description?: string;
  slug: string;
  image?: string | null;
  tracking_url: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  display_order: number;
};

export type ServiceItem = {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  city?: string;
  location?: string;
  rating?: string;
  image?: string | null;
  price?: string | null;
  metadata?: Record<string, unknown>;
  is_active?: boolean;
  display_order?: number;
};

export type PortalService = {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  icon?: string | null;
  banner_image?: string | null;
  booking_mode?: "form" | "items" | "third_party";
  requires_service_item?: boolean;
  provider_code?: string;
  provider_config?: Record<string, unknown>;
  vendor_links?: VendorLink[];
  items?: ServiceItem[];
  is_active?: boolean;
  is_featured?: boolean;
  display_order?: number;
};

export type ServiceFilters = {
  cities: string[];
  locations: string[];
  ratings: string[];
  price_range?: { min_price: string; max_price: string };
};

export type ServiceRating = {
  id: number;
  user: number | null;
  user_name: string;
  service: number;
  service_name: string;
  service_slug: string;
  booking: number | null;
  rating: number;
  title: string;
  review: string;
  is_anonymous: boolean;
  is_verified: boolean;
  is_approved: boolean;
  admin_reply: string;
  created: string;
  updated: string;
};

export type RatingInput = {
  service: number;
  rating: number;
  booking?: number;
  title?: string;
  review?: string;
  is_anonymous?: boolean;
};

export type HolidayCollection = { id: number; name: string; slug: string; title: string; short_description: string; description: string; banner_image: string | null; is_featured: boolean };
export type HolidayCategory = { id: number; name: string; slug: string; short_description: string; description: string; image: string | null };
export type HolidayDestination = { id: number; name: string; slug: string; collection: string; collection_slug: string; categories: HolidayCategory[]; country: string; state: string; city: string; short_description: string; description: string; image: string | null; starting_price: string | null; is_featured: boolean; highlights: unknown[] };
export type HolidayPackage = { id: number; name: string; slug: string; destination: string | HolidayDestination; destination_slug?: string; short_description: string; description?: string; nights: number; days: number; image: string | null; is_featured?: boolean; starting_price?: string | null; variants?: HolidayVariant[] };
export type HolidayVariant = { id: number; tier: string; tier_label: string; title: string; hotel_category: string; comfort_level: string; price: string; taxes_included: boolean; default_adults: number; default_children: number; inclusions: { id: number; name: string; icon: string | null; description: string }[] };

const data = <T>(payload: ApiEnvelope<T> | T): T =>
  payload && typeof payload === "object" && "data" in payload ? (payload as ApiEnvelope<T>).data : payload as T;

export const portalService = {
  airports: async (params?: QueryParams) => (await apiClient.get<PaginatedResponse<Airport>>("/api/base/airports/", { params })).data,
  services: async () => (await apiClient.get<PaginatedResponse<PortalService>>("/api/base/services/")).data,
  service: async (slug: string) => data<PortalService>((await apiClient.get(`/api/base/services/${encodeURIComponent(slug)}/`)).data),
  searchServiceItems: async (slug: string, params?: QueryParams) => (await apiClient.get<PaginatedResponse<ServiceItem>>(`/api/base/services/${encodeURIComponent(slug)}/search/`, { params })).data,
  serviceFilters: async (slug: string) => data<ServiceFilters>((await apiClient.get(`/api/base/services/${encodeURIComponent(slug)}/filters/`)).data),
  vendors: async (params?: { service?: number; service_slug?: string }) => (await apiClient.get<PaginatedResponse<VendorLink>>("/api/base/vendors/", { params })).data,
  vendorUrl: async (vendorSlug: string, params?: QueryParams) => data<{ url: string; vendor_name: string; slug: string; click_id: number }>((await apiClient.get(`/api/base/vendors/${encodeURIComponent(vendorSlug)}/url/`, { params })).data),
  ratings: async (params?: { service?: number; service_slug?: string; rating?: number; page?: number; page_size?: number }) => (await apiClient.get<PaginatedResponse<ServiceRating>>("/api/base/ratings/", { params })).data,
  submitRating: async (payload: RatingInput) => (await apiClient.post<ApiEnvelope<ServiceRating>>("/api/base/ratings/", payload)).data,
  holidayCollections: async () => data<HolidayCollection[]>((await apiClient.get("/api/bookings/holidays/collections/")).data),
  holidayCategories: async (collection?: string) => data<HolidayCategory[]>((await apiClient.get("/api/bookings/holidays/categories/", { params: { collection } })).data),
  holidayDestinations: async (params?: { collection?: string; category?: string; featured?: boolean; search?: string }) => data<HolidayDestination[]>((await apiClient.get("/api/bookings/holidays/destinations/", { params })).data),
  holidayDestination: async (slug: string) => data<HolidayDestination>((await apiClient.get(`/api/bookings/holidays/destinations/${encodeURIComponent(slug)}/`)).data),
  holidayPackages: async (params?: { destination?: string; collection?: string; category?: string; tier?: string; featured?: boolean }) => data<HolidayPackage[]>((await apiClient.get("/api/bookings/holidays/packages/", { params })).data),
  holidayPackage: async (slug: string) => data<HolidayPackage>((await apiClient.get(`/api/bookings/holidays/packages/${encodeURIComponent(slug)}/`)).data),
};
