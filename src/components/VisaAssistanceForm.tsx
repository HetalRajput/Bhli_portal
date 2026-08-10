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
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileCheck2,
  FileText,
  Flag,
  Globe2,
  IdCard,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  PlaneTakeoff,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookingSuccessModal from "@/components/BookingSuccessModal";
import { useSuccessChime } from "@/hooks/useSuccessChime";
import { getErrorMessage } from "@/lib/api/client";
import { portalService } from "@/lib/api/portal";
import { visaService, type VisaOption } from "@/lib/api/visa";

type Gender = "" | "male" | "female" | "other";
type TravellerType = "" | "individual" | "couple" | "family" | "group" | "corporate";

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
  travellerType: TravellerType;
  previousVisaRefusal: boolean;
  currentVisaStatus: string;
  remarks: string;
  preferredContactTime: string;
  message: string;
  consentToContact: boolean;
  declarationAccepted: boolean;
};

type Guest = {
  key: string;
  name: string;
  age: string;
  gender: Gender;
};

const documentFields = [
  { key: "passport_copy", label: "Passport copy", note: "Clear bio-data page", icon: IdCard },
  { key: "recent_photograph", label: "Recent photograph", note: "Passport-size photograph", icon: Camera },
  { key: "previous_visa_copy", label: "Previous visa copy", note: "If you have travelled before", icon: FileCheck2 },
  { key: "invitation_letter", label: "Invitation letter", note: "For invited or sponsored travel", icon: Mail },
  { key: "flight_booking_document", label: "Flight booking", note: "Itinerary or reservation", icon: PlaneTakeoff },
  { key: "hotel_booking_document", label: "Hotel booking", note: "Accommodation confirmation", icon: MapPin },
  { key: "bank_statement", label: "Bank statement", note: "Financial supporting document", icon: FileText },
  { key: "other_supporting_documents", label: "Other documents", note: "Any additional supporting file", icon: UploadCloud },
] as const;

type DocumentKey = (typeof documentFields)[number]["key"];

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
  travellerType: "",
  previousVisaRefusal: false,
  currentVisaStatus: "",
  remarks: "",
  preferredContactTime: "",
  message: "",
  consentToContact: false,
  declarationAccepted: false,
};

const emptyDocuments = (): Record<DocumentKey, File | null> => ({
  passport_copy: null,
  recent_photograph: null,
  previous_visa_copy: null,
  invitation_letter: null,
  flight_booking_document: null,
  hotel_booking_document: null,
  bank_statement: null,
  other_supporting_documents: null,
});

const today = new Date().toISOString().slice(0, 10);

function calculateAge(dateOfBirth: string) {
  if (!dateOfBirth) return "";
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  const current = new Date();
  let age = current.getFullYear() - birthDate.getFullYear();
  const monthDifference = current.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && current.getDate() < birthDate.getDate())) age -= 1;
  return age >= 0 ? String(age) : "";
}

function dayAfter(date: string) {
  if (!date) return today;
  const next = new Date(`${date}T00:00:00`);
  next.setDate(next.getDate() + 1);
  return next.toISOString().slice(0, 10);
}

function fileSize(file: File) {
  if (file.size < 1024 * 1024) return `${Math.max(1, Math.round(file.size / 1024))} KB`;
  return `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function VisaAssistanceForm() {
  const router = useRouter();
  const successChime = useSuccessChime();
  const guestSequence = useRef(2);
  const errorRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<VisaFormState>(initialForm);
  const [guests, setGuests] = useState<Guest[]>([{ key: "traveller-1", name: "", age: "", gender: "" }]);
  const [documents, setDocuments] = useState<Record<DocumentKey, File | null>>(emptyDocuments);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [countries, setCountries] = useState<VisaOption[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaOption[]>([]);
  const [purposes, setPurposes] = useState<VisaOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [optionError, setOptionError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = () => setSignedIn(Boolean(window.localStorage.getItem("access_token")));
    checkSession();
    window.addEventListener("storage", checkSession);
    return () => window.removeEventListener("storage", checkSession);
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

      if (missing.length) setOptionError(`Could not load ${missing.join(", ")}. Please retry before submitting.`);
      setLoadingOptions(false);
    });

    return () => { active = false; };
  }, [reloadKey]);

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  const destinationName = useMemo(
    () => countries.find((country) => String(country.id) === form.destinationCountry)?.name || "Your destination",
    [countries, form.destinationCountry],
  );
  const uploadedCount = Object.values(documents).filter(Boolean).length;

  const setValue = <K extends keyof VisaFormState>(key: K, value: VisaFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (error) setError("");
  };

  function updatePrimaryName(value: string) {
    setGuests((current) => current.map((guest, index) => (
      index === 0 && (!guest.name || guest.name === form.fullName) ? { ...guest, name: value } : guest
    )));
    setValue("fullName", value);
  }

  function updatePrimaryDob(value: string) {
    const previousAge = calculateAge(form.dob);
    const nextAge = calculateAge(value);
    setGuests((current) => current.map((guest, index) => (
      index === 0 && (!guest.age || guest.age === previousAge) ? { ...guest, age: nextAge } : guest
    )));
    setValue("dob", value);
  }

  function updatePrimaryGender(value: Gender) {
    setGuests((current) => current.map((guest, index) => (
      index === 0 && (!guest.gender || guest.gender === form.gender) ? { ...guest, gender: value } : guest
    )));
    setValue("gender", value);
  }

  function updateGuest(key: string, field: keyof Omit<Guest, "key">, value: string) {
    setGuests((current) => current.map((guest) => guest.key === key ? { ...guest, [field]: value } : guest));
    if (error) setError("");
  }

  function addGuest() {
    setGuests((current) => [
      ...current,
      { key: `traveller-${guestSequence.current++}`, name: "", age: "", gender: "" },
    ]);
  }

  function removeGuest(key: string) {
    setGuests((current) => current.length === 1 ? current : current.filter((guest) => guest.key !== key));
  }

  function fail(message: string) {
    setError(message);
    return false;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!serviceId) return void fail("Visa Assistance is not available for booking right now. Retry loading the form options.");
    if (!countries.length || !visaTypes.length || !purposes.length) return void fail("The visa dropdown options are incomplete. Please retry loading them.");
    if (form.expectedReturnDate && form.expectedReturnDate <= form.expectedTravelDate) return void fail("Expected return date must be after the expected travel date.");
    if (guests.some((guest) => !guest.name.trim() || !guest.gender || !Number.isInteger(Number(guest.age)) || Number(guest.age) < 0)) {
      return void fail("Complete the name, age and gender for every traveller.");
    }
    if (!form.declarationAccepted) return void fail("Please accept the declaration before submitting.");
    if (!window.localStorage.getItem("access_token")) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    const guestPayload = guests.map(({ name, age, gender }) => ({
      name: name.trim(),
      age: Number(age),
      gender,
    }));
    const jsonPayload: Record<string, unknown> = {
      service: serviceId,
      guests: guestPayload,
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
      number_of_travellers: guests.length,
      traveller_type: form.travellerType || undefined,
      gender: form.gender || undefined,
      previous_visa_refusal: form.previousVisaRefusal,
      current_visa_status: form.currentVisaStatus.trim() || undefined,
      remarks: form.remarks.trim() || undefined,
      preferred_contact_time: form.preferredContactTime || undefined,
      message: form.message.trim() || undefined,
      consent_to_contact: form.consentToContact,
      declaration_accepted: form.declarationAccepted,
    };

    let submissionPayload: Record<string, unknown> | FormData = jsonPayload;
    if (uploadedCount > 0) {
      const multipartPayload = new FormData();
      Object.entries(jsonPayload).forEach(([key, value]) => {
        if (key !== "guests" && value !== undefined && value !== null && value !== "") {
          multipartPayload.append(key, String(value));
        }
      });
      // DRF's multipart list parser reads indexed keys, while the JSON field
      // keeps compatibility with backends that explicitly decode nested data.
      multipartPayload.append("guests", JSON.stringify(guestPayload));
      guestPayload.forEach((guest, index) => {
        multipartPayload.append(`guests[${index}]name`, guest.name);
        multipartPayload.append(`guests[${index}]age`, String(guest.age));
        multipartPayload.append(`guests[${index}]gender`, guest.gender);
      });
      documentFields.forEach(({ key }) => {
        const file = documents[key];
        if (file) multipartPayload.append(key, file);
      });
      submissionPayload = multipartPayload;
    }

    successChime.arm();
    setSubmitting(true);
    try {
      const result = await visaService.submit(submissionPayload);
      const bookingId = result.data?.booking?.id ?? result.data?.id;
      setReference(bookingId ? `BH${String(bookingId).padStart(6, "0")}` : "Submitted");
      successChime.play();
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#eef5f8] pb-16 text-[#102d45]">
      <section className="relative overflow-hidden bg-[#061f3b] px-5 pb-36 pt-10 text-white lg:px-8 lg:pb-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(18,164,216,.24),transparent_28%),radial-gradient(circle_at_15%_85%,rgba(19,165,216,.14),transparent_26%)]" />
        <div className="absolute -right-20 top-10 size-80 rounded-full border border-white/5 shadow-[0_0_0_55px_rgba(255,255,255,.025),0_0_0_110px_rgba(255,255,255,.018)]" />
        <div className="relative mx-auto grid min-w-0 max-w-[1320px] grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[1.2fr_.8fr]">
          <div className="min-w-0">
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white">
              <ArrowLeft className="size-4" /> All services
            </Link>
            <p className="mt-10 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.28em] text-[#4dd0ff]">
              <Sparkles className="size-4" /> Guided visa support
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[.98] sm:text-6xl lg:text-7xl">Visa assistance, made clearer.</h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">Share your travel plan, applicant details and available documents. Our specialists will review your request and guide you through the next steps.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Secure submission", "Application review", "Document guidance"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/75 backdrop-blur-sm">
                  <CheckCircle2 className="size-3.5 text-[#4dd0ff]" />{item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[420px] lg:block">
            <div className="absolute -inset-8 rounded-full bg-[#13a5d8]/10 blur-3xl" />
            <div className="relative rotate-2 rounded-[2rem] border border-white/15 bg-white/[.09] p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-[#13a5d8] text-white"><Globe2 /></span><div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-white/40">Application route</p><p className="mt-1 font-serif text-xl">Visa assistance</p></div></div>
                <BadgeCheck className="size-7 text-emerald-300" />
              </div>
              <div className="mt-7 flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10"><Flag className="size-5 text-[#4dd0ff]" /></span>
                <span className="h-px flex-1 bg-gradient-to-r from-[#4dd0ff] to-emerald-300" />
                <PlaneTakeoff className="size-6 text-white" />
                <span className="h-px flex-1 bg-gradient-to-r from-emerald-300 to-[#4dd0ff]" />
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-[#4dd0ff]/30 bg-[#13a5d8]/15"><MapPin className="size-5 text-[#4dd0ff]" /></span>
              </div>
              <div className="mt-5 flex items-end justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[.18em] text-white/35">From</p><p className="mt-1 text-sm font-bold">Your nationality</p></div><div className="max-w-40 text-right"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-white/35">Destination</p><p className="mt-1 truncate text-sm font-bold text-[#8be2ff]">{destinationName}</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-24 w-full max-w-[1320px] px-5 lg:-mt-32 lg:px-8">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="hidden overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-[0_20px_60px_rgba(6,31,59,.12)] lg:sticky lg:top-28 lg:block">
            <div className="bg-gradient-to-br from-[#0875b7] to-[#13a5d8] p-6 text-white">
              <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-white/65">Application checklist</p>
              <p className="mt-2 font-serif text-2xl">Six simple sections</p>
              <p className="mt-2 text-xs leading-5 text-white/70">Fields marked with * are required by the visa booking API.</p>
            </div>
            <nav aria-label="Visa form sections" className="p-4">
              {[
                ["01", "Applicant details", "#applicant"],
                ["02", "Passport details", "#passport"],
                ["03", "Travel plan", "#travel-plan"],
                ["04", "Travellers", "#travellers"],
                ["05", "Documents", "#documents"],
                ["06", "Review & declare", "#declaration"],
              ].map(([number, label, href]) => (
                <a key={href} href={href} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-500 transition hover:bg-[#eff9fd] hover:text-[#087fbe]">
                  <span className="grid size-8 place-items-center rounded-lg bg-slate-50 text-[10px] text-[#087fbe] group-hover:bg-white">{number}</span>{label}<ChevronRight className="ml-auto size-3.5 opacity-30" />
                </a>
              ))}
            </nav>
            <div className="mx-4 mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="flex items-center gap-2 text-xs font-bold text-emerald-800"><LockKeyhole className="size-4" />Private & secure</p>
              <p className="mt-2 text-[11px] leading-5 text-emerald-700/70">Your information is submitted directly to the authenticated booking API.</p>
            </div>
          </aside>

          <form onSubmit={submit} encType="multipart/form-data" className="min-w-0 w-full overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-[0_24px_80px_rgba(6,31,59,.14)]">
            <header className="border-b border-slate-100 px-6 py-7 sm:px-9">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#087fbe]">Visa assistance request</p><h2 className="mt-2 font-serif text-3xl text-[#061f3b] sm:text-4xl">Tell us about your journey</h2></div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#edf8fc] px-4 py-2 text-xs font-bold text-[#087fbe]"><UsersRound className="size-4" />{guests.length} traveller{guests.length === 1 ? "" : "s"}</span>
              </div>
              {signedIn === false && (
                <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:flex-row sm:items-center">
                  <LockKeyhole className="size-5 shrink-0" /><p className="flex-1">This API requires authentication. Sign in before submitting so your request is saved to your account.</p><Link href={`/login?redirect=${encodeURIComponent("/services/visa-assistance")}`} className="font-extrabold text-[#087fbe]">Sign in</Link>
                </div>
              )}
              {optionError && (
                <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:flex-row sm:items-center">
                  <CircleAlert className="size-5 shrink-0" /><p className="flex-1">{optionError}</p><button type="button" onClick={() => { setLoadingOptions(true); setOptionError(""); setReloadKey((value) => value + 1); }} className="inline-flex items-center gap-2 font-extrabold text-[#087fbe]"><RefreshCw className="size-4" />Retry</button>
                </div>
              )}
            </header>

            <div className="space-y-5 bg-[#fbfdfe] p-4 sm:p-6 lg:p-8">
              <FormSection id="applicant" number="01" icon={UserRound} title="Applicant details" description="Personal and contact information for the primary applicant.">
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField label="Full name" icon={UserRound} name="full_name" value={form.fullName} onChange={(event) => updatePrimaryName(event.target.value)} autoComplete="name" required placeholder="As shown on passport" />
                  <InputField label="Date of birth" icon={CalendarDays} name="dob" type="date" max={today} value={form.dob} onChange={(event) => updatePrimaryDob(event.target.value)} required />
                  <SelectInput label="Gender" icon={UsersRound} name="gender" value={form.gender} onChange={(event) => updatePrimaryGender(event.target.value as Gender)}>
                    <option value="">Prefer not to specify</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </SelectInput>
                  <InputField label="Mobile number" icon={Phone} name="mobile" type="tel" inputMode="tel" value={form.mobile} onChange={(event) => setValue("mobile", event.target.value)} autoComplete="tel" required placeholder="e.g. 9999999999" />
                  <InputField label="Email address" icon={Mail} name="email" type="email" value={form.email} onChange={(event) => setValue("email", event.target.value)} autoComplete="email" required placeholder="you@example.com" />
                  <InputField label="Nationality" icon={Flag} name="nationality" value={form.nationality} onChange={(event) => setValue("nationality", event.target.value)} autoComplete="country-name" required placeholder="e.g. Indian" />
                </div>
              </FormSection>

              <FormSection id="passport" number="02" icon={IdCard} title="Passport details" description="Enter the identity details exactly as they appear on the passport.">
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField label="Passport number" icon={IdCard} name="passport_number" value={form.passportNumber} onChange={(event) => setValue("passportNumber", event.target.value.toUpperCase())} required placeholder="e.g. Z1234567" />
                  <InputField label="Passport expiry date" icon={CalendarDays} name="passport_exp_date" type="date" min={today} value={form.passportExpiry} onChange={(event) => setValue("passportExpiry", event.target.value)} required />
                  <SelectInput label="Current visa status" icon={BadgeCheck} name="current_visa_status" value={form.currentVisaStatus} onChange={(event) => setValue("currentVisaStatus", event.target.value)}>
                    <option value="">Select if applicable</option><option value="No active visa">No active visa</option><option value="Active visa">Active visa</option><option value="Visa expired">Visa expired</option><option value="Application in progress">Application in progress</option>
                  </SelectInput>
                  <SelectInput label="Previous visa refusal" icon={CircleAlert} name="previous_visa_refusal" value={String(form.previousVisaRefusal)} onChange={(event) => setValue("previousVisaRefusal", event.target.value === "true")}>
                    <option value="false">No</option><option value="true">Yes</option>
                  </SelectInput>
                </div>
              </FormSection>

              <FormSection id="travel-plan" number="03" icon={PlaneTakeoff} title="Travel plan" description="Choose API-provided country, visa type and purpose options.">
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectInput label="Destination country" icon={Globe2} name="destination_country" value={form.destinationCountry} onChange={(event) => setValue("destinationCountry", event.target.value)} required disabled={loadingOptions || !countries.length}>
                    <option value="">{loadingOptions ? "Loading countries..." : "Select destination"}</option>{countries.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                  </SelectInput>
                  <SelectInput label="Visa type" icon={IdCard} name="visa_type" value={form.visaType} onChange={(event) => setValue("visaType", event.target.value)} required disabled={loadingOptions || !visaTypes.length}>
                    <option value="">{loadingOptions ? "Loading visa types..." : "Select visa type"}</option>{visaTypes.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                  </SelectInput>
                  <SelectInput label="Purpose of travel" icon={BriefcaseBusiness} name="purpose_of_travel" value={form.purposeOfTravel} onChange={(event) => setValue("purposeOfTravel", event.target.value)} required disabled={loadingOptions || !purposes.length}>
                    <option value="">{loadingOptions ? "Loading purposes..." : "Select travel purpose"}</option>{purposes.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                  </SelectInput>
                  <SelectInput label="Traveller type" icon={UsersRound} name="traveller_type" value={form.travellerType} onChange={(event) => setValue("travellerType", event.target.value as TravellerType)}>
                    <option value="">Select if applicable</option><option value="individual">Individual</option><option value="couple">Couple</option><option value="family">Family</option><option value="group">Group</option><option value="corporate">Corporate</option>
                  </SelectInput>
                  <InputField label="Expected travel date" icon={CalendarDays} name="expected_travel_date" type="date" min={today} value={form.expectedTravelDate} onChange={(event) => setValue("expectedTravelDate", event.target.value)} required />
                  <InputField label="Expected return date" icon={CalendarDays} name="expected_return_date" type="date" min={dayAfter(form.expectedTravelDate)} value={form.expectedReturnDate} onChange={(event) => setValue("expectedReturnDate", event.target.value)} />
                  <SelectInput label="Preferred contact time" icon={Clock3} name="preferred_contact_time" value={form.preferredContactTime} onChange={(event) => setValue("preferredContactTime", event.target.value)}>
                    <option value="">Any time</option><option value="Morning">Morning</option><option value="Afternoon">Afternoon</option><option value="Evening">Evening</option>
                  </SelectInput>
                </div>
                <TextAreaField className="mt-4" label="Application message" icon={MessageSquareText} name="message" value={form.message} onChange={(event) => setValue("message", event.target.value)} rows={4} placeholder="Tell us what kind of help you need, such as a document checklist, appointment guidance or fee estimate." />
              </FormSection>

              <FormSection id="travellers" number="04" icon={UsersRound} title="Traveller details" description="The traveller count is calculated from the entries below and sent with the guests array.">
                <div className="space-y-4">
                  {guests.map((guest, index) => (
                    <div key={guest.key} className="rounded-2xl border border-slate-200 bg-[#f9fcfd] p-4 sm:p-5">
                      <div className="mb-4 flex items-center justify-between"><p className="flex items-center gap-2 text-sm font-extrabold text-[#061f3b]"><span className="grid size-7 place-items-center rounded-lg bg-[#e5f6fc] text-[10px] text-[#087fbe]">{String(index + 1).padStart(2, "0")}</span>{index === 0 ? "Primary traveller" : `Traveller ${index + 1}`}</p>{guests.length > 1 && <button type="button" onClick={() => removeGuest(guest.key)} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold text-rose-500 transition hover:bg-rose-50"><Trash2 className="size-3.5" />Remove</button>}</div>
                      <div className="grid gap-4 md:grid-cols-[1.5fr_.6fr_1fr]">
                        <InputField compact label="Traveller name" icon={UserRound} value={guest.name} onChange={(event) => updateGuest(guest.key, "name", event.target.value)} required placeholder="Full name" />
                        <InputField compact label="Age" icon={CalendarDays} type="number" min="0" max="120" step="1" value={guest.age} onChange={(event) => updateGuest(guest.key, "age", event.target.value)} required placeholder="Age" />
                        <SelectInput compact label="Gender" icon={UsersRound} value={guest.gender} onChange={(event) => updateGuest(guest.key, "gender", event.target.value)} required><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></SelectInput>
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addGuest} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-[#13a5d8]/50 bg-[#f1fbfe] px-4 py-3 text-sm font-extrabold text-[#087fbe] transition hover:border-[#087fbe] hover:bg-[#e6f7fc]"><Plus className="size-4" />Add another traveller</button>
              </FormSection>

              <FormSection id="documents" number="05" icon={UploadCloud} title="Supporting documents" description="All uploads are optional. Add only the files relevant to your application.">
                <div className="mb-4 flex items-center justify-between rounded-xl bg-[#eff9fd] px-4 py-3 text-xs"><span className="font-semibold text-slate-500">PDF or clear image files are recommended.</span><span className="font-extrabold text-[#087fbe]">{uploadedCount}/8 uploaded</span></div>
                <div className="grid gap-3 md:grid-cols-2">
                  {documentFields.map((document) => (
                    <DocumentUpload key={document.key} label={document.label} note={document.note} icon={document.icon} file={documents[document.key]} onSelect={(file) => setDocuments((current) => ({ ...current, [document.key]: file }))} />
                  ))}
                </div>
              </FormSection>

              <FormSection id="declaration" number="06" icon={ShieldCheck} title="Review & declaration" description="Share any final context, then confirm the information before submission.">
                <TextAreaField label="Remarks" icon={MessageSquareText} name="remarks" value={form.remarks} onChange={(event) => setValue("remarks", event.target.value)} rows={4} placeholder="Add previous travel history, refusal context, urgency or any other information our visa team should know." />
                <div className="mt-5 space-y-3">
                  <CheckField checked={form.consentToContact} onChange={(checked) => setValue("consentToContact", checked)} icon={Phone} title="Contact permission" text="I consent to being contacted about this visa assistance request." />
                  <CheckField required checked={form.declarationAccepted} onChange={(checked) => setValue("declarationAccepted", checked)} icon={ShieldCheck} title="Applicant declaration" text="I confirm that the information and documents supplied are accurate and may be used to process this request." />
                </div>
              </FormSection>

              <div ref={errorRef}>{error && <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700"><CircleAlert className="mt-0.5 size-5 shrink-0" /><span>{error}</span></div>}</div>
            </div>

            <footer className="flex flex-col gap-4 border-t border-slate-100 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-9">
              <p className="flex items-center gap-2 text-xs text-slate-400"><LockKeyhole className="size-4 text-emerald-600" />Authenticated, secure API submission</p>
              <button disabled={submitting || loadingOptions || !serviceId} className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-7 text-sm font-extrabold text-white shadow-lg shadow-[#087fbe]/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55">
                {submitting ? <><LoaderCircle className="size-4 animate-spin" />Submitting request...</> : loadingOptions ? <><LoaderCircle className="size-4 animate-spin" />Loading visa options...</> : signedIn === false ? <>Sign in & submit<ArrowRight className="size-4" /></> : <>Submit visa request<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></>}
              </button>
            </footer>
          </form>
        </div>
      </main>
    </div>
  );
}

function FormSection({ id, number, icon: Icon, title, description, children }: { id: string; number: string; icon: LucideIcon; title: string; description: string; children: ReactNode }) {
  return (
    <section id={id} className="min-w-0 scroll-mt-28 rounded-[1.4rem] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(6,31,59,.035)] sm:p-7">
      <div className="mb-6 flex items-start gap-4"><span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#e4f6fc] to-[#f2fbfe] text-[#087fbe]"><Icon className="size-5" /><span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-[#087fbe] text-[8px] font-black text-white ring-2 ring-white">{number}</span></span><div><h3 className="text-lg font-extrabold text-[#061f3b]">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-400">{description}</p></div></div>
      {children}
    </section>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return <span className="mb-2 block text-xs font-extrabold text-[#3d5b70]">{label}{required && <span className="text-rose-500"> *</span>}</span>;
}

function InputField({ label, icon: Icon, compact = false, className = "", ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; icon: LucideIcon; compact?: boolean }) {
  return <label className={`block min-w-0 ${className}`}><FieldLabel label={label} required={props.required} /><span className={`flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-400 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10 ${compact ? "h-11" : "h-12"}`}><Icon className="size-4 shrink-0 text-[#087fbe]" /><input {...props} className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#122b42] outline-none placeholder:font-normal placeholder:text-slate-300 disabled:cursor-not-allowed disabled:bg-slate-50" /></span></label>;
}

function SelectInput({ label, icon: Icon, compact = false, className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; icon: LucideIcon; compact?: boolean }) {
  return <label className={`block min-w-0 ${className}`}><FieldLabel label={label} required={props.required} /><span className={`flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-400 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10 ${compact ? "h-11" : "h-12"}`}><Icon className="size-4 shrink-0 text-[#087fbe]" /><select {...props} className="h-full min-w-0 flex-1 appearance-auto bg-transparent text-sm font-semibold text-[#122b42] outline-none disabled:cursor-not-allowed disabled:text-slate-400">{children}</select></span></label>;
}

function TextAreaField({ label, icon: Icon, className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; icon: LucideIcon }) {
  return <label className={`block ${className}`}><FieldLabel label={label} required={props.required} /><span className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-400 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10"><Icon className="mt-1 size-4 shrink-0 text-[#087fbe]" /><textarea {...props} className="min-h-24 min-w-0 flex-1 resize-y bg-transparent text-sm font-medium leading-6 text-[#122b42] outline-none placeholder:font-normal placeholder:text-slate-300" /></span></label>;
}

function DocumentUpload({ label, note, icon: Icon, file, onSelect }: { label: string; note: string; icon: LucideIcon; file: File | null; onSelect: (file: File | null) => void }) {
  if (file) {
    return <div className="flex min-h-24 items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm"><FileCheck2 className="size-5" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold text-emerald-900">{file.name}</p><p className="mt-1 text-[11px] font-semibold text-emerald-700/60">{label} · {fileSize(file)}</p></div><button type="button" onClick={() => onSelect(null)} aria-label={`Remove ${label}`} className="grid size-9 shrink-0 place-items-center rounded-lg text-emerald-700 transition hover:bg-white"><X className="size-4" /></button></div>;
  }

  return <label className="group flex min-h-24 cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-[#fbfdfe] p-4 transition hover:border-[#13a5d8]/60 hover:bg-[#f2fbfe]"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eaf7fc] text-[#087fbe] transition group-hover:bg-white group-hover:shadow-sm"><Icon className="size-5" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-extrabold text-[#173852]">{label}</span><span className="mt-1 block text-[11px] leading-4 text-slate-400">{note}</span></span><UploadCloud className="size-4 shrink-0 text-slate-300 group-hover:text-[#087fbe]" /><input type="file" className="sr-only" onChange={(event) => onSelect(event.target.files?.[0] || null)} /></label>;
}

function CheckField({ checked, onChange, icon: Icon, title, text, required = false }: { checked: boolean; onChange: (checked: boolean) => void; icon: LucideIcon; title: string; text: string; required?: boolean }) {
  return <label className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${checked ? "border-[#13a5d8]/35 bg-[#eff9fd]" : "border-slate-200 bg-white hover:border-[#13a5d8]/30"}`}><input type="checkbox" className="sr-only" checked={checked} required={required} onChange={(event) => onChange(event.target.checked)} /><span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl transition ${checked ? "bg-[#087fbe] text-white" : "bg-slate-50 text-slate-400"}`}>{checked ? <CheckCircle2 className="size-5" /> : <Icon className="size-4" />}</span><span><span className="block text-sm font-extrabold text-[#173852]">{title}{required && <span className="text-rose-500"> *</span>}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{text}</span></span></label>;
}
