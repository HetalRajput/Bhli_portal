"use client";

import type {
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  DoorOpen,
  FileText,
  Hotel,
  Layers3,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircleMore,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  UploadCloud,
  UserRound,
  Video,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import BookingSuccessModal from "@/components/BookingSuccessModal";
import { useSuccessChime } from "@/hooks/useSuccessChime";
import { getErrorMessage } from "@/lib/api/client";
import { hotelConsultancyService } from "@/lib/api/hotelConsultancy";
import { portalService } from "@/lib/api/portal";

type HotelConsultancyFormProps = {
  selectedServiceSlug: string;
  selectedServiceTitle: string;
};

type ConsultancyFormState = {
  fullName: string;
  companyName: string;
  phoneNumber: string;
  whatsappNumber: string;
  emailAddress: string;
  propertyName: string;
  propertyLocation: string;
  propertyType: string;
  propertyStatus: string;
  numberOfRooms: string;
  starCategory: string;
  consultancyRequired: string;
  currentChallenge: string;
  consultationMode: string;
  consultationDate: string;
  consultationTime: string;
  consentAccepted: boolean;
};

const propertyTypes = [
  ["hotel", "Hotel"],
  ["resort", "Resort"],
  ["boutique_hotel", "Boutique Hotel"],
  ["guest_house", "Guest House"],
  ["serviced_apartment", "Serviced Apartment"],
  ["homestay", "Homestay"],
  ["other", "Other"],
] as const;

const propertyStatuses = [
  ["existing_property", "Existing Property"],
  ["new_project", "New Project"],
  ["under_construction", "Under Construction"],
  ["renovation_repositioning", "Renovation / Repositioning"],
] as const;

const starCategories = [
  ["not_classified", "Not Classified"],
  ["2_star", "2 Star"],
  ["3_star", "3 Star"],
  ["4_star", "4 Star"],
  ["5_star", "5 Star"],
  ["luxury", "Luxury"],
] as const;

const consultancyOptions = [
  ["hotel_pre_opening_consultancy", "Hotel Pre-Opening Consultancy"],
  ["hotel_operations_consultancy", "Hotel Operations Consultancy"],
  ["hotel_sales_marketing_consultancy", "Hotel Sales & Marketing Consultancy"],
  ["revenue_management_consultancy", "Revenue Management Consultancy"],
  ["hotel_manpower_consultancy", "Hotel Manpower Consultancy"],
  ["sop_process_development", "SOP & Process Development"],
  ["ota_online_distribution_consultancy", "OTA & Online Distribution Consultancy"],
  ["branding_positioning_consultancy", "Branding & Positioning Consultancy"],
  ["food_beverage_consultancy", "Food & Beverage Consultancy"],
  ["hotel_technology_pms_consultancy", "Hotel Technology & PMS Consultancy"],
  ["corporate_sales_consultancy", "Corporate Sales Consultancy"],
  ["mice_event_consultancy", "MICE & Event Consultancy"],
  ["hotel_renovation_repositioning", "Hotel Renovation & Repositioning"],
  ["hotel_feasibility_project_planning", "Hotel Feasibility & Project Planning"],
  ["complete_hotel_consultancy", "Complete Hotel Consultancy"],
  ["other", "Other"],
] as const;

const consultationModes = [
  ["online_meeting", "Online Meeting"],
  ["phone_call", "Phone Call"],
  ["whatsapp", "WhatsApp"],
  ["site_visit", "Site Visit"],
  ["office_meeting", "Office Meeting"],
] as const;

const consultancyByService: Record<string, string> = {
  "concept-development": "hotel_feasibility_project_planning",
  "pre-opening-projects": "hotel_pre_opening_consultancy",
  "marketing-support": "hotel_sales_marketing_consultancy",
  "people-and-training": "hotel_manpower_consultancy",
  "food-beverage-controls": "food_beverage_consultancy",
  "business-analysis": "hotel_operations_consultancy",
};

function localToday() {
  const value = new Date();
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
  return value.toISOString().slice(0, 10);
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[.14em] text-[#47647a]">
      {label}{required && <span className="ml-1 text-rose-500">*</span>}
    </span>
  );
}

function InputField({ label, icon: Icon, required, wrapperClassName = "", ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; icon: LucideIcon; wrapperClassName?: string }) {
  return (
    <label className={`block min-w-0 ${wrapperClassName}`}>
      <FieldLabel label={label} required={required} />
      <span className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10">
        <Icon className="size-4 shrink-0 text-[#087fbe]" aria-hidden="true" />
        <input {...props} required={required} className="min-w-0 flex-1 bg-transparent py-3 text-sm font-semibold text-[#102d45] outline-none placeholder:font-normal placeholder:text-slate-400" />
      </span>
    </label>
  );
}

function SelectField({ label, icon: Icon, required, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; icon: LucideIcon }) {
  return (
    <label className="block min-w-0">
      <FieldLabel label={label} required={required} />
      <span className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10">
        <Icon className="size-4 shrink-0 text-[#087fbe]" aria-hidden="true" />
        <select {...props} required={required} className="min-w-0 flex-1 bg-transparent py-3 text-sm font-semibold text-[#102d45] outline-none disabled:cursor-not-allowed disabled:text-slate-400">{children}</select>
      </span>
    </label>
  );
}

function TextAreaField({ label, icon: Icon, required, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; icon: LucideIcon }) {
  return (
    <label className="block">
      <FieldLabel label={label} required={required} />
      <span className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10">
        <Icon className="mt-1 size-4 shrink-0 text-[#087fbe]" aria-hidden="true" />
        <textarea {...props} required={required} className="min-h-32 min-w-0 flex-1 resize-y bg-transparent text-sm font-medium leading-6 text-[#102d45] outline-none placeholder:font-normal placeholder:text-slate-400" />
      </span>
    </label>
  );
}

function FormSection({ number, title, icon: Icon, children }: { number: string; title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <section className="rounded-[1.4rem] border border-slate-200/80 bg-[#fbfdfe] p-5 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="relative grid size-11 shrink-0 place-items-center rounded-2xl bg-[#e7f7fd] text-[#087fbe]"><Icon className="size-5" /><span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-[#087fbe] text-[8px] font-black text-white ring-2 ring-white">{number}</span></span>
        <h3 className="font-serif text-2xl font-semibold text-[#061f3b]">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export default function HotelConsultancyForm({ selectedServiceSlug, selectedServiceTitle }: HotelConsultancyFormProps) {
  const router = useRouter();
  const successChime = useSuccessChime();
  const errorRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<ConsultancyFormState>({
    fullName: "",
    companyName: "",
    phoneNumber: "",
    whatsappNumber: "",
    emailAddress: "",
    propertyName: "",
    propertyLocation: "",
    propertyType: "",
    propertyStatus: "",
    numberOfRooms: "",
    starCategory: "",
    consultancyRequired: consultancyByService[selectedServiceSlug] || "",
    currentChallenge: "",
    consultationMode: "",
    consultationDate: "",
    consultationTime: "",
    consentAccepted: false,
  });
  const [document, setDocument] = useState<File | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [loadingService, setLoadingService] = useState(true);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const today = useMemo(() => localToday(), []);

  useEffect(() => {
    const sessionTimer = window.setTimeout(() => setSignedIn(Boolean(window.localStorage.getItem("access_token"))), 0);
    let active = true;
    portalService.service("hotel-consultancy")
      .then((service) => {
        if (active && service?.id) setServiceId(service.id);
      })
      .catch(() => {
        if (active) setError("Hotel Consultancy is temporarily unavailable. Please refresh and try again.");
      })
      .finally(() => {
        if (active) setLoadingService(false);
      });
    return () => {
      active = false;
      window.clearTimeout(sessionTimer);
    };
  }, []);

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  function setValue<K extends keyof ConsultancyFormState>(key: K, value: ConsultancyFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (error) setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const phoneExpression = /^[0-9+ ()-]{7,20}$/;
    if (!phoneExpression.test(form.phoneNumber.trim())) {
      setError("Phone Number: Enter a valid phone number using 7 to 20 digits or phone symbols.");
      return;
    }
    if (form.whatsappNumber.trim() && !phoneExpression.test(form.whatsappNumber.trim())) {
      setError("WhatsApp Number: Enter a valid phone number using 7 to 20 digits or phone symbols.");
      return;
    }
    if (form.numberOfRooms && (!Number.isInteger(Number(form.numberOfRooms)) || Number(form.numberOfRooms) < 1)) {
      setError("Number of Rooms / Keys must be a whole number greater than zero.");
      return;
    }
    if (!form.consentAccepted) {
      setError("Consent: Please agree to be contacted about your Hotel Consultancy enquiry.");
      return;
    }
    if (!window.localStorage.getItem("access_token")) {
      const path = `/services/hotel-consultancy/${selectedServiceSlug}#consultancy-request`;
      router.push(`/login?redirect=${encodeURIComponent(path)}`);
      return;
    }
    if (!serviceId) {
      setError("Hotel Consultancy is not available for booking right now. Please refresh and try again.");
      return;
    }

    const time = form.consultationTime
      ? form.consultationTime.length === 5 ? `${form.consultationTime}:00` : form.consultationTime
      : undefined;
    const payload: Record<string, unknown> = {
      service: serviceId,
      full_name: form.fullName.trim(),
      company_name: form.companyName.trim() || undefined,
      phone_number: form.phoneNumber.trim(),
      whatsapp_number: form.whatsappNumber.trim() || undefined,
      email_address: form.emailAddress.trim(),
      property_name: form.propertyName.trim(),
      property_location: form.propertyLocation.trim(),
      property_type: form.propertyType,
      property_status: form.propertyStatus,
      number_of_rooms: form.numberOfRooms ? Number(form.numberOfRooms) : undefined,
      star_category: form.starCategory || undefined,
      consultancy_required: form.consultancyRequired,
      current_challenge: form.currentChallenge.trim(),
      preferred_consultation_mode: form.consultationMode || undefined,
      preferred_consultation_date: form.consultationDate || undefined,
      preferred_consultation_time: time,
      message: `Consultancy focus: ${selectedServiceTitle}`,
      consent_to_contact: true,
      consent_accepted: true,
    };

    let submissionPayload: Record<string, unknown> | FormData = payload;
    if (document) {
      const multipart = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") multipart.append(key, String(value));
      });
      multipart.append("upload_documents", document);
      submissionPayload = multipart;
    }

    successChime.arm();
    setSubmitting(true);
    try {
      const response = await hotelConsultancyService.submit(submissionPayload);
      const bookingId = response.data?.booking?.id ?? response.data?.id;
      setReference(bookingId ? `BH${String(bookingId).padStart(6, "0")}` : "Submitted");
      successChime.play();
    } catch (submissionError) {
      const message = getErrorMessage(submissionError);
      const apiError = submissionError as { response?: { status?: number; data?: unknown } };
      setError(`Submission failed${apiError.response?.status ? ` (${apiError.response.status})` : ""}: ${message}`);
      console.warn(`[Hotel Consultancy] Submission failed\n${JSON.stringify({ status: apiError.response?.status ?? 0, message, response: apiError.response?.data ?? null }, null, 2)}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <BookingSuccessModal
        reference={reference}
        serviceName={selectedServiceTitle}
        itemLabel="Consultancy focus"
        heading="Thank you! Your Hotel Consultancy enquiry has been submitted successfully."
        description="Our consultancy team will review your requirements and contact you shortly."
        backHref={`/services/hotel-consultancy/${selectedServiceSlug}`}
        backLabel="Back to consultancy"
      />
    );
  }

  return (
    <section id="consultancy-request" className="scroll-mt-24 bg-[#061f3b] px-5 py-16 text-[#102d45] lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 grid gap-6 text-white lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.25em] text-[#59d7ff]"><Sparkles className="size-4" />Consultancy request</p>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">Tell us about your property and the outcome you need.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">Share your current stage, challenge and preferred consultation details. Our specialists will review the request before contacting you.</p>
          </div>
          <div className="rounded-2xl border border-[#59d7ff]/20 bg-white/[.06] px-5 py-4 backdrop-blur-sm">
            <p className="text-[9px] font-extrabold uppercase tracking-[.18em] text-white/40">Selected service</p>
            <p className="mt-1 font-serif text-2xl text-[#8be5ff]">{selectedServiceTitle}</p>
          </div>
        </div>

        <form onSubmit={submit} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_30px_90px_rgba(0,10,30,.3)]">
          <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2 lg:p-9">
            <FormSection number="01" title="Contact Details" icon={UserRound}>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Full Name" icon={UserRound} required value={form.fullName} onChange={(event) => setValue("fullName", event.target.value)} autoComplete="name" placeholder="Enter your full name" />
                <InputField label="Company / Organization Name" icon={Building2} value={form.companyName} onChange={(event) => setValue("companyName", event.target.value)} autoComplete="organization" placeholder="Enter company / organization name" />
                <InputField label="Phone Number" icon={Phone} required type="tel" inputMode="tel" minLength={7} maxLength={20} value={form.phoneNumber} onChange={(event) => setValue("phoneNumber", event.target.value)} autoComplete="tel" placeholder="Enter your mobile number" />
                <InputField label="WhatsApp Number" icon={MessageCircleMore} type="tel" inputMode="tel" minLength={7} maxLength={20} value={form.whatsappNumber} onChange={(event) => setValue("whatsappNumber", event.target.value)} placeholder="Enter WhatsApp number" />
                <InputField label="Email Address" icon={Mail} required type="email" value={form.emailAddress} onChange={(event) => setValue("emailAddress", event.target.value)} autoComplete="email" placeholder="Enter your email address" wrapperClassName="sm:col-span-2" />
              </div>
            </FormSection>

            <FormSection number="02" title="Property Details" icon={Hotel}>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Hotel / Property Name" icon={Hotel} required value={form.propertyName} onChange={(event) => setValue("propertyName", event.target.value)} placeholder="Enter hotel / property name" />
                <InputField label="Property Location" icon={MapPin} required value={form.propertyLocation} onChange={(event) => setValue("propertyLocation", event.target.value)} placeholder="City, State / Country" />
                <SelectField label="Property Type" icon={Layers3} required value={form.propertyType} onChange={(event) => setValue("propertyType", event.target.value)}><option value="">Select Property Type</option>{propertyTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</SelectField>
                <SelectField label="Property Status" icon={Building2} required value={form.propertyStatus} onChange={(event) => setValue("propertyStatus", event.target.value)}><option value="">Select Property Status</option>{propertyStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</SelectField>
                <InputField label="Number of Rooms / Keys" icon={DoorOpen} type="number" min="1" step="1" value={form.numberOfRooms} onChange={(event) => setValue("numberOfRooms", event.target.value)} placeholder="Enter number of rooms" />
                <SelectField label="Star Category" icon={Star} value={form.starCategory} onChange={(event) => setValue("starCategory", event.target.value)}><option value="">Select Star Category</option>{starCategories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</SelectField>
              </div>
            </FormSection>

            <FormSection number="03" title="Consultancy Requirement" icon={BriefcaseBusiness}>
              <SelectField label="Consultancy Required" icon={BriefcaseBusiness} required value={form.consultancyRequired} onChange={(event) => setValue("consultancyRequired", event.target.value)}><option value="">Select Consultancy Required</option>{consultancyOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</SelectField>
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-[#edf8fc] px-4 py-3 text-xs leading-5 text-[#3c687f]"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#087fbe]" />Preselected from the service you opened. You can choose another consultancy requirement if needed.</p>
            </FormSection>

            <FormSection number="04" title="Consultation Details" icon={Video}>
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField label="Preferred Consultation Mode" icon={Video} value={form.consultationMode} onChange={(event) => setValue("consultationMode", event.target.value)}><option value="">Select Consultation Mode</option>{consultationModes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</SelectField>
                <InputField label="Preferred Consultation Date" icon={CalendarDays} type="date" min={today} value={form.consultationDate} onChange={(event) => setValue("consultationDate", event.target.value)} />
                <InputField label="Preferred Consultation Time" icon={Clock3} type="time" value={form.consultationTime} onChange={(event) => setValue("consultationTime", event.target.value)} wrapperClassName="sm:col-span-2" />
                <div className="sm:col-span-2"><TextAreaField label="Current Challenge / Requirement" icon={MessageSquareText} required value={form.currentChallenge} onChange={(event) => setValue("currentChallenge", event.target.value)} placeholder="Tell us about your hotel, current challenges and the support you require." /></div>
              </div>
            </FormSection>

            <FormSection number="05" title="Documents" icon={UploadCloud}>
              {document ? (
                <div className="flex min-h-24 items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm"><FileText className="size-5" /></span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold text-emerald-900">{document.name}</p><p className="mt-1 text-[11px] text-emerald-700">{Math.max(1, Math.round(document.size / 1024))} KB · Ready to upload</p></div>
                  <button type="button" onClick={() => setDocument(null)} aria-label="Remove uploaded document" className="grid size-9 place-items-center rounded-full text-emerald-700 hover:bg-white"><X className="size-4" /></button>
                </div>
              ) : (
                <label className="flex min-h-28 cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[#75bddb] bg-[#edf8fc] p-5 transition hover:border-[#087fbe] hover:bg-[#e4f5fb]">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-[#087fbe] shadow-sm"><UploadCloud className="size-5" /></span>
                  <span className="min-w-0"><span className="block text-sm font-extrabold text-[#173c58]">Upload optional documents</span><span className="mt-1 block text-xs leading-5 text-slate-500">Hotel profile, property photos or project details. One PDF, document or image file.</span></span>
                  <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" className="sr-only" onChange={(event) => setDocument(event.target.files?.[0] || null)} />
                </label>
              )}
            </FormSection>

            <FormSection number="06" title="Consent" icon={ShieldCheck}>
              <label className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${form.consentAccepted ? "border-[#13a5d8]/40 bg-[#edf8fc]" : "border-slate-200 bg-white hover:border-[#13a5d8]/40"}`}>
                <input type="checkbox" required checked={form.consentAccepted} onChange={(event) => setValue("consentAccepted", event.target.checked)} className="mt-1 size-4 shrink-0 accent-[#087fbe]" />
                <span><span className="text-sm font-extrabold text-[#173c58]">Contact consent <span className="text-rose-500">*</span></span><span className="mt-1 block text-xs leading-5 text-slate-500">I agree to be contacted by Booking Hospitality regarding my Hotel Consultancy enquiry.</span></span>
              </label>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-slate-400"><ShieldCheck className="size-4 text-emerald-600" />Your information is submitted securely to our consultancy team.</div>
            </FormSection>

            <div ref={errorRef} className="lg:col-span-2">
              {error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700"><CircleAlert className="mt-0.5 size-5 shrink-0" /><span>{error}</span></div>}
            </div>
          </div>

          <footer className="flex flex-col gap-4 border-t border-slate-100 bg-[#f8fbfd] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-9">
            <p className="text-xs font-semibold text-slate-400">{signedIn === false ? "Sign in is required before the request can be submitted." : "Your request will be linked securely to your BHLI account."}</p>
            <button disabled={submitting || loadingService || !serviceId} className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-7 text-xs font-extrabold uppercase tracking-[.08em] text-white shadow-lg shadow-[#087fbe]/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55">
              {submitting ? <><LoaderCircle className="size-4 animate-spin" />Submitting request...</> : loadingService ? <><LoaderCircle className="size-4 animate-spin" />Loading service...</> : <>Submit Consultancy Request<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></>}
            </button>
          </footer>
        </form>
      </div>
    </section>
  );
}
