"use client";

import { FormEvent, useState } from "react";
import {
  BadgeCheck,
  BadgeIndianRupee,
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileBadge,
  FileCheck2,
  FileText,
  Globe2,
  Handshake,
  Hash,
  IndianRupee,
  Landmark,
  LoaderCircle,
  Mail,
  MapPinned,
  Phone,
  ReceiptText,
  ShieldCheck,
  Tags,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { Field, FormNotice, SelectField, TextArea } from "@/components/WorkflowField";
import { getErrorMessage } from "@/lib/api/client";
import { workflowService } from "@/lib/api/workflows";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const DOCUMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp";

const documents = [
  ["gst_certificate", "GST certificate", ReceiptText],
  ["pan_card", "PAN card", CreditCard],
  ["registration_certificate", "Registration certificate", FileBadge],
  ["cancelled_cheque", "Cancelled cheque", Banknote],
  ["address_proof", "Address proof", MapPinned],
  ["property_documents", "Property documents", Building2],
  ["rate_contract", "Rate contract / rate sheet", FileText],
] as const;

type OnboardingResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: unknown;
  data?: {
    id?: number | string;
    reference_number?: string;
    application_number?: string;
  };
};

type FieldError = { field: string; message: string };

const fieldLabels: Record<string, string> = {
  shop_name: "Company name",
  contact_person: "Contact person",
  retail_type: "Vendor type",
  address_line1: "Complete address",
  address_line2: "City / state / country",
  drug_license: "Business registration number",
  gstin: "GSTIN",
  existing_distributor: "Existing distributor",
  expected_monthly_purchase: "Expected monthly business",
  payment_terms: "Business model",
  credit_days: "Credit period",
  discount_percentage: "Discount percentage",
  invoices_due: "Invoices due",
  payment_collection_day: "Payment collection day",
};

function collectFieldErrors(value: unknown, field = ""): FieldError[] {
  if (typeof value === "string") return [{ field, message: value }];
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectFieldErrors(item, field));
  }
  if (!value || typeof value !== "object") return [];

  return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) => {
    if (["success", "status", "message", "detail"].includes(key)) return [];
    return collectFieldErrors(nested, key === "errors" ? field : key);
  });
}

function addLegacyOnboardingFields(formData: FormData) {
  const value = (name: string, fallback = "Not provided") =>
    String(formData.get(name) || "").trim() || fallback;
  const location = [value("city", ""), value("state", ""), value("country", "")]
    .filter(Boolean)
    .join(", ");

  // The deployed endpoint still uses its original onboarding serializer.
  // Submit both schemas so this form also remains compatible with the new API contract.
  formData.set("onboarding_type", "vendor");
  formData.set("shop_name", value("company_name"));
  formData.set("contact_person", value("contact_person_name"));
  formData.set("retail_type", value("vendor_type"));
  formData.set("address_line1", value("complete_address"));
  formData.set("address_line2", location || "Not provided");
  formData.set("drug_license", value("reg_number"));
  formData.set("gstin", value("gst"));
  formData.set("existing_distributor", "Not specified");
  formData.set("expected_monthly_purchase", value("monthly_business", "0"));
  formData.set("payment_terms", value("business_model"));
  formData.set("credit_days", value("CrLimit", "0"));
  formData.set("discount_percentage", "0");
  formData.set("invoices_due", "0");
  formData.set("payment_collection_day", "Not specified");
  formData.set("created_by_name", value("contact_person_name"));
}

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Building2;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sky-50 text-[#087fbe]">
        <Icon className="size-5" />
      </span>
      <div>
        <h2 className="text-xl font-bold text-[#092943]">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export default function BecomeAPartnerPage() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInvalid = (event: FormEvent<HTMLFormElement>) => {
    const control = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (!control.name || !control.validationMessage) return;

    const label = control.labels?.[0]?.textContent?.replace("*", "").trim() || control.name;
    const message = `${label}: ${control.validationMessage}`;
    console.warn("[Partner onboarding] Browser validation blocked submission", {
      field: control.name,
      message: control.validationMessage,
      valueProvided: Boolean(control.value),
    });
    setError(message);
    setSuccess("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData(form);

      for (const [key, value] of Array.from(formData.entries())) {
        if (value instanceof File) {
          if (!value.name || value.size === 0) {
            formData.delete(key);
            continue;
          }
          if (value.size > MAX_FILE_SIZE) {
            throw new Error(`${value.name} must be 5 MB or smaller.`);
          }
        } else {
          const trimmedValue = value.trim();
          if (trimmedValue) formData.set(key, trimmedValue);
          else formData.delete(key);
        }
      }

      const website = String(formData.get("website") || "");
      if (website && !/^https?:\/\//i.test(website)) {
        formData.set("website", `https://${website}`);
      }

      // Unchecked checkboxes are omitted by browsers; send an explicit API value.
      if (!formData.has("defence_rates")) formData.set("defence_rates", "false");
      addLegacyOnboardingFields(formData);

      console.info("[Partner onboarding] Submitting multipart form", {
        endpoint: "/api/base/onboarding/",
        fields: Array.from(new Set(Array.from(formData.keys()))),
        files: Array.from(formData.entries())
          .filter((entry): entry is [string, File] => entry[1] instanceof File)
          .map(([field, file]) => ({ field, name: file.name, size: file.size, type: file.type })),
      });

      const response = (await workflowService.onboard(formData)) as OnboardingResponse;
      if (response?.success === false) {
        const apiFailure = new Error(response.message || response.error || "The onboarding API rejected the application.");
        Object.assign(apiFailure, { errors: response.errors });
        throw apiFailure;
      }
      const reference =
        response?.data?.reference_number ||
        response?.data?.application_number ||
        response?.data?.id;

      setSuccess(
        `Partner application submitted successfully${reference ? `. Reference: ${reference}` : ""}. Our onboarding team will contact you after review.`,
      );
      form.reset();
    } catch (reason) {
      const apiError = reason as {
        code?: string;
        message?: string;
        config?: { method?: string; url?: string };
        response?: { status?: number; statusText?: string; data?: unknown };
      };
      const responseBody = apiError.response?.data;
      const fieldErrors = collectFieldErrors(responseBody);
      const message = fieldErrors.length
        ? fieldErrors
            .map(({ field, message: fieldMessage }) => `${fieldLabels[field] || field.replaceAll("_", " ")}: ${fieldMessage}`)
            .join(" | ")
        : getErrorMessage(reason);

      console.groupCollapsed("[Partner onboarding] Submission failed");
      console.warn({
        endpoint: apiError.config?.url || "/api/base/onboarding/",
        method: apiError.config?.method?.toUpperCase() || "POST",
        status: apiError.response?.status || 0,
        statusText: apiError.response?.statusText || "",
        code: apiError.code || "",
        message: apiError.message || message,
      });
      console.warn("Backend response:", responseBody ?? "No response body received");
      console.groupEnd();

      const firstRejectedField = fieldErrors[0]?.field;
      const rejectedControl = firstRejectedField
        ? form.elements.namedItem(firstRejectedField)
        : null;
      if (rejectedControl instanceof HTMLElement) rejectedControl.focus();

      setError(apiError.response?.status ? `Submission failed (${apiError.response.status}): ${message}` : message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f9fc] text-[#102f47]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#061f3b] via-[#075a91] to-[#12a6d6] px-5 py-20 text-white md:py-24">
        <div className="absolute -right-24 -top-24 size-80 rounded-full border border-white/10 bg-white/5" />
        <div className="absolute -bottom-36 left-[8%] size-72 rounded-full bg-cyan-300/10 blur-2xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-sky-200">
              <Handshake className="size-4" /> Partner with BHLI
            </p>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl font-bold leading-tight md:text-7xl">
              Grow your business with trusted travel partnerships.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-sky-50/80 md:text-lg">
              Share your company, banking, service, and compliance details. Our team will review your application and guide you through activation.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-md">
            <ShieldCheck className="size-10 text-sky-200" />
            <h2 className="mt-5 text-2xl font-bold">Secure onboarding</h2>
            <ul className="mt-5 space-y-4 text-sm text-sky-50/85">
              {["Structured vendor verification", "Defence-rate partnership support", "Dedicated onboarding assistance"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-cyan-300" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <form onSubmit={submit} onInvalidCapture={handleInvalid} encType="multipart/form-data" className="space-y-6">
          <div className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm md:p-9">
            <SectionHeading icon={Building2} title="Company information" description="Tell us about the business applying to join our partner network." />
            <div className="grid gap-5 md:grid-cols-2">
              <Field name="company_name" label="Company name" icon={<Building2 />} autoComplete="organization" required />
              <SelectField name="vendor_type" label="Vendor type" icon={<BriefcaseBusiness />} defaultValue="hotels" required>
                <option value="hotels">Hotels</option>
                <option value="airlines">Taxi</option>
                <option value="travel_agency">Flight</option>
                <option value="travel_agency">Bus</option>
                <option value="travel_agency">Train</option>
                <option value="tour_operator">Visa</option>
                <option value="transport">Holiday Package</option>
                <option value="event_management">Catering</option>
                <option value="other">Event Management</option>
                <option value="other">Other</option>
              </SelectField>
              <Field name="contact_person_name" label="Contact person name" icon={<UserRound />} autoComplete="name" required />
              <Field name="mobile" label="Mobile number" icon={<Phone />} type="tel" inputMode="numeric" autoComplete="tel" pattern="[6-9][0-9]{9}" maxLength={10} title="Enter a valid 10-digit Indian mobile number" required />
              <Field name="email" label="Business email" icon={<Mail />} type="email" autoComplete="email" required />
              <Field name="website" label="Website" icon={<Globe2 />} type="text" inputMode="url" placeholder="example.com" autoComplete="url" />
              <TextArea name="complete_address" label="Complete address" icon={<MapPinned />} autoComplete="street-address" className="md:col-span-2" />
              <Field name="city" label="City" icon={<MapPinned />} autoComplete="address-level2" />
              <Field name="state" label="State" icon={<MapPinned />} autoComplete="address-level1" />
              <Field name="country" label="Country" icon={<Globe2 />} defaultValue="India" autoComplete="country-name" />
              <Field name="pincode" label="Pincode" icon={<Hash />} inputMode="numeric" autoComplete="postal-code" pattern="[1-9][0-9]{5}" maxLength={6} title="Enter a valid 6-digit pincode" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm md:p-9">
            <SectionHeading icon={FileCheck2} title="Registration & compliance" description="Provide statutory registration details used during vendor verification." />
            <div className="grid gap-5 md:grid-cols-2">
              <Field name="gst" label="GSTIN" icon={<ReceiptText />} maxLength={15} placeholder="22ABCDE1234F1Z5" />
              <Field name="pan" label="PAN" icon={<CreditCard />} maxLength={10} pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]" placeholder="ABCDE1234F" title="Enter a valid PAN" />
              <Field name="reg_number" label="Registration number" icon={<FileBadge />} />
              <Field name="years_in_business" label="Years in business" icon={<CalendarDays />} type="number" min="0" max="100" step="1" />
              <TextArea name="service_locations" label="Service locations" icon={<MapPinned />} placeholder="Delhi, Mumbai, Bengaluru" className="md:col-span-2" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm md:p-9">
            <SectionHeading icon={Landmark} title="Bank details" description="Add the settlement account that will be reviewed for partner payments." />
            <div className="grid gap-5 md:grid-cols-2">
              <Field name="bank_name" label="Bank name" icon={<Landmark />} autoComplete="off" />
              <Field name="bank_account" label="Bank account number" icon={<CreditCard />} inputMode="numeric" autoComplete="off" pattern="[0-9]{6,20}" title="Enter 6 to 20 digits" />
              <Field name="ifsc" label="IFSC code" icon={<BadgeCheck />} maxLength={11} pattern="[A-Za-z]{4}0[A-Za-z0-9]{6}" placeholder="SBIN0000001" title="Enter a valid 11-character IFSC code" />
              <Field name="bank_branch" label="Bank branch" icon={<MapPinned />} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm md:p-9">
            <SectionHeading icon={BadgeIndianRupee} title="Commercial profile" description="Describe your offering, expected volume, credit terms, and partnership model." />
            <div className="grid gap-5 md:grid-cols-2">
              <TextArea name="services_offered" label="Services offered" icon={<Tags />} placeholder="Hotel rooms, banquet halls, corporate stay packages" required className="md:col-span-2" />
              <SelectField name="business_model" label="Business model" icon={<Handshake />} defaultValue="commission" required>
                <option value="commission">Commission</option>
                <option value="net_rate">Net rate</option>
                <option value="markup">Markup</option>
                <option value="hybrid">Hybrid</option>
              </SelectField>
              <Field name="CrLimit" label="Credit limit / days" icon={<CalendarDays />} type="number" min="0" step="1" placeholder="30" />
              <Field name="monthly_business" label="Expected monthly business (₹)" icon={<IndianRupee />} type="number" min="0" step="0.01" placeholder="100000.00" />
              <SelectField name="rate_sheet_status" label="Rate sheet status" icon={<FileText />} defaultValue="">
                <option value="">Select rate sheet status</option>
                <option value="attached">Attached</option>
                <option value="not_available">Not available</option>
              </SelectField>
            </div>
            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/60 p-4 text-sm text-slate-600">
              <input name="defence_rates" value="true" type="checkbox" className="mt-0.5 size-4 accent-[#087fbe]" />
              <span><strong className="block text-[#173852]">Defence rates available</strong>We can offer special or contracted rates for defence and government travellers.</span>
            </label>
          </div>

          <div className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm md:p-9">
            <SectionHeading icon={UploadCloud} title="Supporting documents" description="Upload PDF, JPG, PNG, or WEBP files. Each file must be 5 MB or smaller." />
            <div className="grid gap-5 md:grid-cols-2">
              {documents.map(([name, label, Icon]) => (
                <Field key={name} name={name} type="file" accept={DOCUMENT_ACCEPT} icon={<Icon />} label={`${label} (max 5 MB)`} />
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm md:p-9">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-600">
              <input name="declaration_accepted" value="true" type="checkbox" required className="mt-1 size-4 shrink-0 accent-[#087fbe]" />
              <span>
                I confirm that the information and documents provided are accurate, current, and may be verified by Booking Hospitality Learning India.
                <span className="text-rose-500"> *</span>
              </span>
            </label>

            <div className="mt-6" aria-live="polite">
              <FormNotice error={error} success={success} />
            </div>

            <button type="submit" disabled={saving} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#087fbe] px-8 py-3.5 font-bold text-white shadow-lg shadow-sky-900/10 transition hover:bg-[#076fa8] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
              {saving ? <><LoaderCircle className="size-5 animate-spin" /> Submitting application...</> : <><UserRound className="size-5" /> Submit partner application</>}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
