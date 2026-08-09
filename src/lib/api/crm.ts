import { apiClient } from "./client";
import type { ApiEnvelope, PaginatedResponse, QueryParams, ServiceRating } from "./portal";

export const CRM_ACCESS_TOKEN_KEY = "crm_access_token";
export const CRM_REFRESH_TOKEN_KEY = "crm_refresh_token";

export type CrmLoginResponse = { access: string; refresh: string; user: { id: number; username: string; email: string }; roles: unknown[]; permissions: unknown[] };
export type CrmTeamMember = { id: number; name: string; slug: string; designation: string; email: string; phone_number: string; department: number | null; department_name: string; crm_role: number | null; crm_role_name: string; crm_access_active: boolean; has_password: boolean; requires_password_setup: boolean; is_active?: boolean };
export type CrmComplaint = { id: string; ticket_number: string; full_name: string; email: string; mobile_number?: string; feedback_type?: string; service?: number | null; service_name?: string; service_slug?: string; subject?: string; description?: string; priority: string; status: string; admin_notes?: string; is_open?: boolean; is_closed?: boolean; is_sla_breached?: boolean; attachments?: unknown[]; history?: unknown[]; created_at?: string; updated_at?: string };
export type CrmOnboarding = { id: number; onboarding_type: string; shop_name: string; contact_person: string; city: string; state: string; mobile: string; email: string; status: string; admin_notes: string; created_at: string; [key: string]: unknown };
export type CrmTypedBooking = { id: number; booking: { id: number; service_name: string; status: string; admin_notes?: string; user_info?: Record<string, unknown>; [key: string]: unknown }; [key: string]: unknown };
export type CrmFlightBooking = { id: number; booking: number; booking_status: string; user: number; user_info: Record<string, unknown>; service_name: string; ref_id: string; flight_id: string; pnr?: string; status: string; passengers: unknown[]; [key: string]: unknown };
export type CrmFlightLog = { id: number; action: string; endpoint: string; request_payload: Record<string, unknown>; response_payload: Record<string, unknown>; status_code: number; success: boolean; error_message: string; log_file: string; created_at: string };

function crmHeaders() {
  const token = typeof window !== "undefined" ? window.localStorage.getItem(CRM_ACCESS_TOKEN_KEY) : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const get = <T>(url: string, params?: QueryParams) => apiClient.get<T>(url, { params, headers: crmHeaders() }).then((response) => response.data);
const post = <T>(url: string, payload?: unknown) => apiClient.post<T>(url, payload, { headers: crmHeaders() }).then((response) => response.data);
const patch = <T>(url: string, payload: unknown) => apiClient.patch<T>(url, payload, { headers: crmHeaders() }).then((response) => response.data);
const remove = <T>(url: string) => apiClient.delete<T>(url, { headers: crmHeaders() }).then((response) => response.data);

export const crmService = {
  login: async (username: string, password: string) => {
    const response = await apiClient.post<ApiEnvelope<CrmLoginResponse>>("/api/crm/auth/login/", { username, password });
    return response.data;
  },
  logout: (refresh: string) => post<ApiEnvelope<never>>("/api/crm/auth/logout/", { refresh }),
  teamMembers: (params?: QueryParams) => get<PaginatedResponse<CrmTeamMember>>("/api/crm/team-members/", params),
  createTeamMember: (payload: Record<string, unknown> | FormData) => post<ApiEnvelope<CrmTeamMember>>("/api/crm/team-members/", payload),
  updateTeamMember: (id: number, payload: Record<string, unknown> | FormData) => patch<ApiEnvelope<CrmTeamMember>>(`/api/crm/team-members/${id}/`, payload),
  setTeamMemberPassword: (id: number, password: string) => post<ApiEnvelope<unknown>>(`/api/crm/team-members/${id}/set-password/`, { password }),
  deleteTeamMember: (id: number) => remove<ApiEnvelope<never>>(`/api/crm/team-members/${id}/`),
  complaints: (params?: QueryParams) => get<PaginatedResponse<CrmComplaint>>("/api/crm/complaints/", params),
  complaint: (id: string) => get<ApiEnvelope<CrmComplaint>>(`/api/crm/complaints/${encodeURIComponent(id)}/`),
  updateComplaint: (id: string, payload: Record<string, unknown>) => patch<ApiEnvelope<CrmComplaint>>(`/api/crm/complaints/${encodeURIComponent(id)}/`, payload),
  deleteComplaint: (id: string) => remove<ApiEnvelope<never>>(`/api/crm/complaints/${encodeURIComponent(id)}/`),
  onboarding: (params?: QueryParams) => get<PaginatedResponse<CrmOnboarding>>("/api/crm/onboarding/", params),
  onboardingDetail: (id: number) => get<ApiEnvelope<CrmOnboarding>>(`/api/crm/onboarding/${id}/`),
  updateOnboarding: (id: number, payload: Record<string, unknown>) => patch<ApiEnvelope<CrmOnboarding>>(`/api/crm/onboarding/${id}/`, payload),
  deleteOnboarding: (id: number) => remove<ApiEnvelope<never>>(`/api/crm/onboarding/${id}/`),
  ratings: (params?: QueryParams) => get<PaginatedResponse<ServiceRating>>("/api/crm/ratings/", params),
  rating: (id: number) => get<ApiEnvelope<ServiceRating>>(`/api/crm/ratings/${id}/`),
  updateRating: (id: number, payload: { is_approved?: boolean; admin_reply?: string }) => patch<ApiEnvelope<ServiceRating>>(`/api/crm/ratings/${id}/`, payload),
  deleteRating: (id: number) => remove<ApiEnvelope<never>>(`/api/crm/ratings/${id}/`),
  typedBookings: (slug: string, params?: QueryParams) => get<PaginatedResponse<CrmTypedBooking>>(`/api/crm/bookings/${encodeURIComponent(slug)}/`, params),
  typedBooking: (slug: string, id: number) => get<ApiEnvelope<CrmTypedBooking>>(`/api/crm/bookings/${encodeURIComponent(slug)}/${id}/`),
  updateTypedBooking: (slug: string, id: number, payload: Record<string, unknown>) => patch<ApiEnvelope<CrmTypedBooking>>(`/api/crm/bookings/${encodeURIComponent(slug)}/${id}/`, payload),
  deleteTypedBooking: (slug: string, id: number) => remove<ApiEnvelope<never>>(`/api/crm/bookings/${encodeURIComponent(slug)}/${id}/`),
  flightBookings: (params?: QueryParams) => get<PaginatedResponse<CrmFlightBooking>>("/api/crm/flights/bookings/", params),
  flightBooking: (id: number) => get<ApiEnvelope<CrmFlightBooking>>(`/api/crm/flights/bookings/${id}/`),
  updateFlightBooking: (id: number, payload: Record<string, unknown>) => patch<ApiEnvelope<CrmFlightBooking>>(`/api/crm/flights/bookings/${id}/`, payload),
  flightLogs: (id: number) => get<ApiEnvelope<CrmFlightLog[]>>(`/api/crm/flights/bookings/${id}/logs/`),
  refreshFlightStatus: (id: number) => post<ApiEnvelope<unknown>>(`/api/crm/flights/bookings/${id}/refresh-status/`),
  cancelFlight: (id: number) => post<ApiEnvelope<unknown>>(`/api/crm/flights/bookings/${id}/cancel/`),
  deleteFlight: (id: number) => remove<ApiEnvelope<never>>(`/api/crm/flights/bookings/${id}/`),
};
