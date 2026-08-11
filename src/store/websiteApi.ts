import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiClient, getErrorMessage } from "@/lib/api/client";
import { baseService, type ContactLead, type ContactLeadPayload } from "@/lib/api/base";
import { cmsService } from "@/lib/api/cms";
import { authService, type UserProfile } from "@/lib/api/auth";
import { busService, type BusBookingPayload, type BusBookingResponse, type BusCity } from "@/lib/api/bus";
import { cateringService, type CateringBookingPayload, type CateringBookingResponse, type CateringCity } from "@/lib/api/catering";
import {
  portalService,
  type Airport,
  type HolidayCategory,
  type HolidayDestination,
  type HolidayPackage,
  type PaginatedResponse,
  type PortalService,
  type QueryParams,
  type RatingInput,
  type ServiceRating,
} from "@/lib/api/portal";

type ApiError = { message: string };
type EnquiryTypes = Awaited<ReturnType<typeof baseService.getEnquiryTypes>>;
type ReferenceResponse = Record<string, unknown> | unknown[];
type FaqResponse = Awaited<ReturnType<typeof cmsService.getFaqs>>;
export type CruiseDestinationResponse = { success?: boolean; data?: Array<{ region_name: string; destinations: Array<{ name: string }> }> };
export type CruisePortResponse = { success?: boolean; data?: Array<{ region_name: string; ports: Array<{ name: string }> }> };

const failure = (error: unknown) => ({ error: { message: getErrorMessage(error) } });

export const websiteApi = createApi({
  reducerPath: "websiteApi",
  baseQuery: fakeBaseQuery<ApiError>(),
  tagTypes: ["Services", "Ratings", "Holidays", "Profile"],
  keepUnusedDataFor: 300,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    services: builder.query<PaginatedResponse<PortalService>, void>({
      queryFn: async () => { try { return { data: await portalService.services() }; } catch (error) { return failure(error); } },
      providesTags: ["Services"],
    }),
    service: builder.query<PortalService, string>({
      queryFn: async (slug) => { try { return { data: await portalService.service(slug) }; } catch (error) { return failure(error); } },
      providesTags: (_result, _error, slug) => [{ type: "Services", id: slug }],
    }),
    airports: builder.query<PaginatedResponse<Airport>, QueryParams | void>({
      queryFn: async (params) => { try { return { data: await portalService.airports(params || undefined) }; } catch (error) { return failure(error); } },
      keepUnusedDataFor: 600,
    }),
    ratings: builder.query<PaginatedResponse<ServiceRating>, { service_slug: string; page_size?: number }>({
      queryFn: async (params) => { try { return { data: await portalService.ratings(params) }; } catch (error) { return failure(error); } },
      providesTags: (_result, _error, args) => [{ type: "Ratings", id: args.service_slug }],
    }),
    submitRating: builder.mutation<unknown, { serviceSlug: string; payload: RatingInput }>({
      queryFn: async ({ payload }) => { try { return { data: await portalService.submitRating(payload) }; } catch (error) { return failure(error); } },
      invalidatesTags: (_result, _error, args) => [{ type: "Ratings", id: args.serviceSlug }],
    }),
    enquiryTypes: builder.query<EnquiryTypes, void>({
      queryFn: async () => { try { return { data: await baseService.getEnquiryTypes() }; } catch (error) { return failure(error); } },
      providesTags: ["Services"],
    }),
    officerRanks: builder.query<ReferenceResponse, void>({
      queryFn: async () => { try { return { data: await baseService.getOfficerRanks() }; } catch (error) { return failure(error); } },
      keepUnusedDataFor: 1800,
    }),
    departments: builder.query<ReferenceResponse, void>({
      queryFn: async () => { try { return { data: await baseService.getDepartments() }; } catch (error) { return failure(error); } },
      keepUnusedDataFor: 1800,
    }),
    faqs: builder.query<FaqResponse, void>({
      queryFn: async () => { try { return { data: await cmsService.getFaqs() }; } catch (error) { return failure(error); } },
      keepUnusedDataFor: 900,
    }),
    profile: builder.query<UserProfile, void>({
      queryFn: async () => { try { return { data: await authService.getProfile() }; } catch (error) { return failure(error); } },
      providesTags: ["Profile"],
    }),
    createContactLead: builder.mutation<ContactLead, ContactLeadPayload>({
      queryFn: async (payload) => { try { return { data: await baseService.createContactLead(payload) }; } catch (error) { return failure(error); } },
    }),
    submitServiceBooking: builder.mutation<Record<string, unknown>, { serviceSlug: string; payload: Record<string, unknown> | FormData }>({
      queryFn: async ({ serviceSlug, payload }) => {
        try {
          const isMultipart = typeof FormData !== "undefined" && payload instanceof FormData;
          return { data: (await apiClient.post(
            `/api/bookings/${encodeURIComponent(serviceSlug)}/`,
            payload,
            isMultipart ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
          )).data };
        }
        catch (error) { return failure(error); }
      },
    }),
    holidayCategories: builder.query<HolidayCategory[], string>({
      queryFn: async (collection) => { try { return { data: await portalService.holidayCategories(collection) }; } catch (error) { return failure(error); } },
      providesTags: ["Holidays"],
    }),
    holidayDestinations: builder.query<HolidayDestination[], { collection: string; category?: string }>({
      queryFn: async (params) => { try { return { data: await portalService.holidayDestinations(params) }; } catch (error) { return failure(error); } },
      providesTags: ["Holidays"],
    }),
    holidayPackages: builder.query<HolidayPackage[], { collection: string; category?: string }>({
      queryFn: async (params) => { try { return { data: await portalService.holidayPackages(params) }; } catch (error) { return failure(error); } },
      providesTags: ["Holidays"],
    }),
    holidayDestination: builder.query<HolidayDestination, string>({
      queryFn: async (slug) => { try { return { data: await portalService.holidayDestination(slug) }; } catch (error) { return failure(error); } },
    }),
    holidayPackage: builder.query<HolidayPackage, string>({
      queryFn: async (slug) => { try { return { data: await portalService.holidayPackage(slug) }; } catch (error) { return failure(error); } },
    }),
    cruiseDestinations: builder.query<CruiseDestinationResponse, void>({
      queryFn: async () => { try { return { data: (await apiClient.get<CruiseDestinationResponse>("/api/bookings/cruise/destinations/")).data }; } catch (error) { return failure(error); } },
      keepUnusedDataFor: 1800,
    }),
    cruisePorts: builder.query<CruisePortResponse, void>({
      queryFn: async () => { try { return { data: (await apiClient.get<CruisePortResponse>("/api/bookings/cruise/ports/")).data }; } catch (error) { return failure(error); } },
      keepUnusedDataFor: 1800,
    }),
    busCities: builder.query<BusCity[], string | void>({
      queryFn: async (search) => {
        try {
          const response = await busService.cities(search || "");
          if (!response.success) return { error: { message: "Bus cities could not be loaded." } };
          return { data: response.data };
        } catch (error) { return failure(error); }
      },
      keepUnusedDataFor: 1800,
    }),
    createBusBooking: builder.mutation<BusBookingResponse, BusBookingPayload>({
      queryFn: async (payload) => {
        try {
          const response = await busService.createBooking(payload);
          if (!response.success) return { error: { message: response.message || "Bus ticket request could not be submitted." } };
          return { data: response };
        } catch (error) { return failure(error); }
      },
    }),
    cateringCities: builder.query<CateringCity[], string | void>({
      queryFn: async (search) => {
        try {
          const response = await cateringService.cities(search || "");
          if (!response.success) return { error: { message: "Catering cities could not be loaded." } };
          return { data: response.data };
        } catch (error) { return failure(error); }
      },
      keepUnusedDataFor: 1800,
    }),
    createCateringBooking: builder.mutation<CateringBookingResponse, { payload: CateringBookingPayload; file?: File | null }>({
      queryFn: async ({ payload, file }) => {
        try {
          const response = await cateringService.createBooking(payload, file);
          if (!response.success) return { error: { message: response.message || "Catering request could not be submitted." } };
          return { data: response };
        } catch (error) { return failure(error); }
      },
    }),
  }),
});

export const {
  useAirportsQuery,
  useBusCitiesQuery,
  useCateringCitiesQuery,
  useCreateCateringBookingMutation,
  useCreateBusBookingMutation,
  useCreateContactLeadMutation,
  useCruiseDestinationsQuery,
  useCruisePortsQuery,
  useDepartmentsQuery,
  useEnquiryTypesQuery,
  useFaqsQuery,
  useHolidayCategoriesQuery,
  useHolidayDestinationQuery,
  useHolidayDestinationsQuery,
  useHolidayPackageQuery,
  useHolidayPackagesQuery,
  useOfficerRanksQuery,
  useProfileQuery,
  useRatingsQuery,
  useServiceQuery,
  useServicesQuery,
  useSubmitRatingMutation,
  useSubmitServiceBookingMutation,
} = websiteApi;
