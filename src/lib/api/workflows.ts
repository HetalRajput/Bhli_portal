import { apiClient } from "./client";

export type Career = { id: number; title: string; slug: string; department_name: string; location: string; employment_type: string; work_mode: string; experience: string; salary_range: string; short_description: string; vacancy_count: number; closing_date?: string; description?: string; responsibilities?: string; requirements?: string; benefits?: string };
export type ServiceOption = { id: number; name: string; slug: string };
const unwrap = <T>(payload: { data?: T } | T): T => payload && typeof payload === "object" && "data" in payload ? (payload as { data: T }).data : payload as T;

export const workflowService = {
  careers: async () => unwrap<Career[]>((await apiClient.get("/api/base/careers/")).data),
  career: async (slug: string) => unwrap<Career>((await apiClient.get(`/api/base/careers/${encodeURIComponent(slug)}/`)).data),
  apply: async (slug: string, form: FormData) => (await apiClient.post(`/api/base/careers/${encodeURIComponent(slug)}/apply/`, form, { headers: { "Content-Type": "multipart/form-data" } })).data,
  onboard: async (form: FormData) => (await apiClient.post("/api/base/onboarding/", form, { headers: { "Content-Type": "multipart/form-data" } })).data,
  complain: async (form: FormData) => (await apiClient.post("/api/base/complaints/", form, { headers: { "Content-Type": "multipart/form-data" } })).data,
  services: async () => unwrap<ServiceOption[]>((await apiClient.get("/api/base/services/")).data),
};
