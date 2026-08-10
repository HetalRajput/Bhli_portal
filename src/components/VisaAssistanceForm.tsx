"use client";

import type {
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  CircleAlert,
  Flag,
  Globe2,
  IdCard,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Phone,
  PlaneTakeoff,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookingSuccessModal from "@/components/BookingSuccessModal";
import { useSuccessChime } from "@/hooks/useSuccessChime";
import { getErrorMessage, showApiError } from "@/lib/api/client";
import { portalService } from "@/lib/api/portal";
import { visaService, type VisaOption } from "@/lib/api/visa";

type Gender = "" | "male" | "female" | "other";

type VisaFormState = {
  fullName: string;
  dob: string;
  gender: Gender;
  mobile: string;
  email: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  destinationCountry: string;
  visaType: string;
  purposeOfTravel: string;
  expectedTravelDate: string;
  expectedReturnDate: string;
  numberOfTravellers: string;
};

const initialForm: VisaFormState = {
  fullName: "",
  dob: "",
  gender: "",
  mobile: "",
  email: "",
  nationality: "",
  passportNumber: "",
  passportExpiry: "",
  destinationCountry: "",
  visaType: "",
  purposeOfTravel: "",
  expectedTravelDate: "",
  expectedReturnDate: "",
  numberOfTravellers: "1",
};

function localDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function dayAfter(date: string, fallback: string) {
  if (!date) return fallback;
  const next = new Date(`${date}T00:00:00`);
  next.setDate(next.getDate() + 1);
  return next.toISOString().slice(0, 10);
}

function ageFromDob(dob: string) {
  const birthDate = new Date(`${dob}T00:00:00`);
  const current = new Date();
  let age = current.getFullYear() - birthDate.getFullYear();
  const monthDifference = current.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && current.getDate() < birthDate.getDate())) age -= 1;
  return Math.max(0, age);
}

export default function VisaAssistanceForm() {
  const router = useRouter();
  const successChime = useSuccessChime();
  const errorRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<VisaFormState>(initialForm);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [countries, setCountries] = useState<VisaOption[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaOption[]>([]);
  const [purposes, setPurposes] = useState<VisaOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionError, setOptionError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const today = useMemo(() => localDate(), []);

  useEffect(() => {
    const sessionTimer = window.setTimeout(() => {
      setSignedIn(Boolean(window.localStorage.getItem("access_token")));
    }, 0);
    return () => window.clearTimeout(sessionTimer);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      portalService.service("visa-assistance"),
      visaService.countries(),
      visaService.types(),
      visaService.purposes(),
    ]).then(([serviceResult, countryResult, typeResult, purposeResult]) => {
      if (!active) return;
      const missing: string[] = [];

      if (serviceResult.status === "fulfilled" && serviceResult.value?.id) setServiceId(serviceResult.value.id);
      else missing.push("service");
      if (countryResult.status === "fulfilled") setCountries(countryResult.value);
      else missing.push("countries");
      if (typeResult.status === "fulfilled") setVisaTypes(typeResult.value);
      else missing.push("visa types");
      if (purposeResult.status === "fulfilled") setPurposes(purposeResult.value);
      else missing.push("travel purposes");

      if (missing.length) setOptionError(`Could not load ${missing.join(", ")}. Please retry.`);
      setLoadingOptions(false);
    });
    return () => { active = false; };
  }, [reloadKey]);

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  function setValue<K extends keyof VisaFormState>(key: K, value: VisaFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (error) setError("");
  }

  function showSubmissionError(message: string) {
    setError(message);
    showApiError({ response: { status: 400, data: { message } } });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!serviceId) {
      showSubmissionError("Visa Assistance is not available for booking right now. Please retry loading the form.");
      return;
    }
    if (!countries.length || !visaTypes.length || !purposes.length) {
      showSubmissionError("The visa dropdown options are incomplete. Please retry before submitting.");
      return;
    }
    if (form.expectedReturnDate && form.expectedReturnDate <= form.expectedTravelDate) {
      showSubmissionError("Expected return date must be after the expected travel date.");
      return;
    }
    if (!/^[0-9+ ()-]{7,20}$/.test(form.mobile.trim())) {
      showSubmissionError("Mobile Number: Enter a valid value using 7 to 20 digits or phone symbols.");
      return;
    }
    if (!form.gender) {
      showSubmissionError("Gender: This field is required.");
      return;
    }
    const travellerCount = Number(form.numberOfTravellers);
    if (!Number.isInteger(travellerCount) || travellerCount < 1) {
      showSubmissionError("Number of Travellers: This field must be at least 1.");
      return;
    }
    if (!window.localStorage.getItem("access_token")) {
      router.push(`/login?redirect=${encodeURIComponent("/services/visa-assistance")}`);
      return;
    }

    const primaryGuest: Record<string, unknown> = {
      name: form.fullName.trim(),
      age: ageFromDob(form.dob),
      gender: form.gender,
    };

    const payload: Record<string, unknown> = {
      service: serviceId,
      guests: [primaryGuest],
      full_name: form.fullName.trim(),
      dob: form.dob,
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      nationality: form.nationality.trim(),
      passport_number: form.passportNumber.trim(),
      passport_exp_date: form.passportExpiry,
      destination_country: Number(form.destinationCountry),
      visa_type: Number(form.visaType),
      purpose_of_travel: Number(form.purposeOfTravel),
      expected_travel_date: form.expectedTravelDate,
      expected_return_date: form.expectedReturnDate || undefined,
      number_of_travellers: travellerCount,
      gender: form.gender,
      consent_to_contact: false,
      declaration_accepted: true,
    };

    successChime.arm();
    setSubmitting(true);
    try {
      const result = await visaService.submit(payload);
      const bookingId = result.data?.booking?.id ?? result.data?.id;
      setReference(bookingId ? `BH${String(bookingId).padStart(6, "0")}` : "Submitted");
      successChime.play();
    } catch (submissionError) {
      const message = getErrorMessage(submissionError);
      const apiError = submissionError as { response?: { status?: number; data?: unknown } };
      setError(`Submission failed${apiError.response?.status ? ` (${apiError.response.status})` : ""}: ${message}`);
      console.warn(
        `[Visa Assistance] Submission failed\n${JSON.stringify({
          status: apiError.response?.status ?? 0,
          message,
          response: apiError.response?.data ?? null,
        }, null, 2)}`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <BookingSuccessModal
        reference={reference}
        serviceName="Visa Assistance"
        heading="Your visa request is with our specialists"
        description="Our visa assistance team will review the supplied details and contact you with the document checklist and next steps."
        backHref="/services/visa-assistance"
        backLabel="Back to visa assistance"
      />
    );
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-[#eef5f8] pb-16 text-[#102d45]">
      <section className="relative overflow-hidden bg-[#061f3b] px-5 pb-32 pt-9 text-white lg:px-8 lg:pb-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(19,165,216,.22),transparent_28%),radial-gradient(circle_at_15%_90%,rgba(19,165,216,.12),transparent_26%)]" />
        <div className="relative mx-auto max-w-[1260px]">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white"><ArrowLeft className="size-4" />All services</Link>
          <div className="mt-10 max-w-3xl">
            <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.28em] text-[#59d7ff]"><Sparkles className="size-4" />Visa assistance</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-6xl">Simple visa assistance request</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">Enter your applicant, passport and travel details. Our specialists will contact you with the relevant document checklist and next steps.</p>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-24 max-w-[1260px] px-5 lg:-mt-32 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="hidden self-start overflow-hidden rounded-[1.6rem] border border-white/70 bg-white shadow-[0_20px_60px_rgba(6,31,59,.12)] lg:sticky lg:top-24 lg:block">
            <div className="bg-gradient-to-br from-[#0875b7] to-[#13a5d8] p-6 text-white">
              <p className="text-[9px] font-extrabold uppercase tracking-[.2em] text-white/65">Application form</p>
              <h2 className="mt-2 font-serif text-2xl">Only required details</h2>
              <p className="mt-2 text-xs leading-5 text-white/70">Fields marked with * must be completed before submission.</p>
            </div>
            <nav aria-label="Visa form sections" className="p-4">
              <a href="#applicant-details" className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-500 transition hover:bg-[#eff9fd] hover:text-[#087fbe]"><span className="grid size-8 place-items-center rounded-lg bg-slate-50 text-[10px] text-[#087fbe]">01</span>Applicant details<ChevronRight className="ml-auto size-3.5 opacity-30" /></a>
              <a href="#visa-details" className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-500 transition hover:bg-[#eff9fd] hover:text-[#087fbe]"><span className="grid size-8 place-items-center rounded-lg bg-slate-50 text-[10px] text-[#087fbe]">02</span>Visa details<ChevronRight className="ml-auto size-3.5 opacity-30" /></a>
            </nav>
            <div className="mx-4 mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="flex items-center gap-2 text-xs font-bold text-emerald-800"><LockKeyhole className="size-4" />Private and secure</p>
              <p className="mt-2 text-[10px] leading-5 text-emerald-700/70">The panel follows as you scroll so both form sections remain easy to reach.</p>
            </div>
          </aside>

          <form onSubmit={submit} className="min-w-0 overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-[0_24px_80px_rgba(6,31,59,.14)]">
            <header className="border-b border-slate-100 px-5 py-6 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="text-[9px] font-extrabold uppercase tracking-[.22em] text-[#087fbe]">Booking Hospitality &amp; Leisure Infra LLP</p><h2 className="mt-2 font-serif text-3xl text-[#061f3b]">Visa Assistance Form</h2></div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#edf8fc] px-4 py-2 text-xs font-bold text-[#087fbe]"><BadgeCheck className="size-4" />Visa Assistance</span>
              </div>

              {signedIn === false && (
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800"><LockKeyhole className="size-4 shrink-0" /><p className="flex-1">Sign in before submitting so the request is saved to your account.</p><Link href={`/login?redirect=${encodeURIComponent("/services/visa-assistance")}`} className="font-extrabold text-[#087fbe]">Sign in</Link></div>
              )}
              {optionError && (
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"><CircleAlert className="size-4 shrink-0" /><p className="flex-1">{optionError}</p><button type="button" onClick={() => { setLoadingOptions(true); setOptionError(""); setReloadKey((value) => value + 1); }} className="inline-flex items-center gap-1.5 font-extrabold text-[#087fbe]"><RefreshCw className="size-3.5" />Retry</button></div>
              )}
            </header>

            <div className="space-y-5 bg-[#fbfdfe] p-4 sm:p-6 lg:p-8">
              <FormSection id="applicant-details" number="01" icon={UserRound} title="Applicant Details">
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField label="Full Name" icon={UserRound} required value={form.fullName} onChange={(event) => setValue("fullName", event.target.value)} autoComplete="name" placeholder="As shown on passport" />
                  <InputField label="Date of Birth" icon={CalendarDays} required type="date" max={today} value={form.dob} onChange={(event) => setValue("dob", event.target.value)} />
                  <GenderField value={form.gender} onChange={(gender) => setValue("gender", gender)} />
                  <InputField label="Mobile Number" icon={Phone} required type="tel" inputMode="tel" minLength={7} maxLength={20} title="Enter a valid mobile number" value={form.mobile} onChange={(event) => setValue("mobile", event.target.value)} autoComplete="tel" placeholder="e.g. 9999999999" />
                  <InputField label="Email ID" icon={Mail} required type="email" value={form.email} onChange={(event) => setValue("email", event.target.value)} autoComplete="email" placeholder="you@example.com" />
                  <InputField label="Nationality" icon={Flag} required value={form.nationality} onChange={(event) => setValue("nationality", event.target.value)} autoComplete="country-name" placeholder="e.g. Indian" />
                  <InputField label="Passport Number" icon={IdCard} required value={form.passportNumber} onChange={(event) => setValue("passportNumber", event.target.value.toUpperCase())} placeholder="e.g. Z1234567" />
                  <InputField label="Passport Expiry Date" icon={CalendarDays} required type="date" min={today} value={form.passportExpiry} onChange={(event) => setValue("passportExpiry", event.target.value)} />
                </div>
              </FormSection>

              <FormSection id="visa-details" number="02" icon={PlaneTakeoff} title="Visa Details">
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField label="Destination Country" icon={Globe2} required value={form.destinationCountry} onChange={(event) => setValue("destinationCountry", event.target.value)} disabled={loadingOptions || !countries.length}>
                    <option value="">{loadingOptions ? "Loading countries..." : "Select destination country"}</option>
                    {countries.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                  </SelectField>
                  <SelectField label="Visa Type" icon={IdCard} required value={form.visaType} onChange={(event) => setValue("visaType", event.target.value)} disabled={loadingOptions || !visaTypes.length}>
                    <option value="">{loadingOptions ? "Loading visa types..." : "Select visa type"}</option>
                    {visaTypes.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                  </SelectField>
                  <SelectField label="Purpose of Travel" icon={BriefcaseBusiness} required value={form.purposeOfTravel} onChange={(event) => setValue("purposeOfTravel", event.target.value)} disabled={loadingOptions || !purposes.length}>
                    <option value="">{loadingOptions ? "Loading purposes..." : "Select purpose of travel"}</option>
                    {purposes.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                  </SelectField>
                  <InputField label="Expected Travel Date" icon={CalendarDays} required type="date" min={today} value={form.expectedTravelDate} onChange={(event) => setValue("expectedTravelDate", event.target.value)} />
                  <InputField label="Expected Return Date" icon={CalendarDays} type="date" min={dayAfter(form.expectedTravelDate, today)} value={form.expectedReturnDate} onChange={(event) => setValue("expectedReturnDate", event.target.value)} />
                  <InputField label="Number of Travellers" icon={UsersRound} required type="number" min="1" max="50" step="1" value={form.numberOfTravellers} onChange={(event) => setValue("numberOfTravellers", event.target.value)} />
                </div>
              </FormSection>

              <div ref={errorRef}>{error && <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700"><CircleAlert className="mt-0.5 size-5 shrink-0" />{error}</div>}</div>
            </div>

            <footer className="flex flex-col gap-4 border-t border-slate-100 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="flex max-w-xl items-start gap-2 text-[10px] leading-5 text-slate-400"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />By submitting, you confirm that the supplied information is accurate and may be used to process this visa assistance request.</p>
              <button disabled={submitting || loadingOptions || !serviceId} className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-7 text-sm font-extrabold text-white shadow-lg shadow-[#087fbe]/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55">
                {submitting ? <><LoaderCircle className="size-4 animate-spin" />Submitting...</> : loadingOptions ? <><LoaderCircle className="size-4 animate-spin" />Loading options...</> : <>Submit visa request<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></>}
              </button>
            </footer>
          </form>
        </div>
      </main>
    </div>
  );
}

function FormSection({ id, number, icon: Icon, title, children }: { id: string; number: string; icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 rounded-[1.4rem] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(6,31,59,.035)] sm:p-7">
      <div className="mb-6 flex items-center gap-4"><span className="relative grid size-11 shrink-0 place-items-center rounded-2xl bg-[#e8f7fc] text-[#087fbe]"><Icon className="size-5" /><span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-[#087fbe] text-[8px] font-black text-white ring-2 ring-white">{number}</span></span><h3 className="font-serif text-2xl font-semibold text-[#061f3b]">{title}</h3></div>
      {children}
    </section>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[.12em] text-[#3d5b70]">{label}{required && <span className="text-rose-500"> *</span>}</span>;
}

function InputField({ label, icon: Icon, required, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; icon: LucideIcon }) {
  return (
    <label className="block min-w-0"><FieldLabel label={label} required={required} /><span className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10"><Icon className="size-4 shrink-0 text-[#087fbe]" /><input {...props} required={required} className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#122b42] outline-none placeholder:font-normal placeholder:text-slate-300 disabled:cursor-not-allowed disabled:bg-slate-50" /></span></label>
  );
}

function SelectField({ label, icon: Icon, required, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; icon: LucideIcon }) {
  return (
    <label className="block min-w-0"><FieldLabel label={label} required={required} /><span className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10"><Icon className="size-4 shrink-0 text-[#087fbe]" /><select {...props} required={required} className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#122b42] outline-none disabled:cursor-not-allowed disabled:text-slate-400">{children}</select></span></label>
  );
}

function GenderField({ value, onChange }: { value: Gender; onChange: (gender: Gender) => void }) {
  return (
    <fieldset className="min-w-0" aria-required="true">
      <legend><FieldLabel label="Gender" required /></legend>
      <div className="grid h-12 grid-cols-3 gap-2">
        {(["male", "female", "other"] as const).map((gender) => (
          <label key={gender} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border text-xs font-bold capitalize transition ${value === gender ? "border-[#13a5d8] bg-[#eaf8fd] text-[#087fbe]" : "border-slate-200 bg-white text-slate-500 hover:border-[#13a5d8]/40"}`}>
            <input type="radio" name="gender" value={gender} checked={value === gender} onChange={() => onChange(gender)} className="size-3.5 accent-[#087fbe]" />{gender}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
