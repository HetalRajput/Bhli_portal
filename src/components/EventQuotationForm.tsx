"use client";

import type { FormEvent, InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  IndianRupee,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquareText,
  Palette,
  PartyPopper,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BookingSuccessModal from "@/components/BookingSuccessModal";
import { useSuccessChime } from "@/hooks/useSuccessChime";
import { getErrorMessage } from "@/lib/api/client";
import { eventManagementService, type EventQuotationPayload } from "@/lib/api/eventManagement";
import { portalService } from "@/lib/api/portal";

type EventQuotationFormProps = {
  selectedCategory: string;
  selectedTheme?: string;
  onClose: () => void;
};

type EventFormState = {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventTime: string;
  city: string;
  eventLocation: string;
  budgetAmount: string;
  eventTheme: "" | "boy" | "girl" | "corporate" | "neutral" | "custom";
  requirements: string;
  consent: boolean;
};

const categoryOptions = [
  { pageLabel: "Balloon Decoration", apiLabel: "Balloon decoration" },
  { pageLabel: "Flower Decoration", apiLabel: "Flower decoration" },
  { pageLabel: "Corporate Events", apiLabel: "Corporate events" },
  { pageLabel: "Artist Management", apiLabel: "Artist management" },
  { pageLabel: "Decor Yourself", apiLabel: "Decor yourself" },
] as const;

const initialForm: EventFormState = {
  name: "",
  email: "",
  phone: "",
  eventDate: "",
  eventTime: "",
  city: "",
  eventLocation: "",
  budgetAmount: "",
  eventTheme: "",
  requirements: "",
  consent: false,
};

function minimumDate() {
  const value = new Date();
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
  return value.toISOString().slice(0, 10);
}

function InputField({ label, icon: Icon, required, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; icon: LucideIcon }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[.14em] text-[#47647a]">
        {label}{required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      <span className="group flex min-h-11 items-center gap-3 rounded-xl border border-[#d8e5ec] bg-white px-3 shadow-sm transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10">
        <Icon className="size-4 shrink-0 text-[#087fbe]" aria-hidden="true" />
        <input {...props} required={required} className="min-w-0 flex-1 bg-transparent py-2.5 text-sm font-medium text-[#102d45] outline-none placeholder:font-normal placeholder:text-slate-400" />
      </span>
    </label>
  );
}

function SelectField({ label, icon: Icon, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; icon: LucideIcon }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[.14em] text-[#47647a]">{label}</span>
      <span className="group flex min-h-11 items-center gap-3 rounded-xl border border-[#d8e5ec] bg-white px-3 shadow-sm transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10">
        <Icon className="size-4 shrink-0 text-[#087fbe]" aria-hidden="true" />
        <select {...props} className="min-w-0 flex-1 bg-transparent py-2.5 text-sm font-medium text-[#102d45] outline-none">{children}</select>
      </span>
    </label>
  );
}

export default function EventQuotationForm({ selectedCategory, selectedTheme = "", onClose }: EventQuotationFormProps) {
  const router = useRouter();
  const successChime = useSuccessChime();
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const initialCategory = categoryOptions.find((option) => option.pageLabel === selectedCategory)?.apiLabel || categoryOptions[0].apiLabel;
  const [form, setForm] = useState<EventFormState>(initialForm);
  const [selectedServices, setSelectedServices] = useState<string[]>([initialCategory]);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [loadingService, setLoadingService] = useState(true);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const dateMinimum = useMemo(() => minimumDate(), []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  useEffect(() => {
    const sessionTimer = window.setTimeout(() => {
      setSignedIn(Boolean(window.localStorage.getItem("access_token")));
    }, 0);
    let active = true;
    portalService.service("event-management")
      .then((service) => {
        if (active && service?.id) setServiceId(service.id);
      })
      .catch(() => {
        if (active) setError("Event quotation is temporarily unavailable. Please close the form and try again.");
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
    if (error) errorRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [error]);

  function setValue<K extends keyof EventFormState>(key: K, value: EventFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (error) setError("");
  }

  function toggleService(label: string) {
    setSelectedServices((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label]);
    if (error) setError("");
  }

  function continueToServices() {
    setError("");
    if (formRef.current?.reportValidity()) setStep(2);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.eventDate) {
      setStep(1);
      setError("Complete your name, email, phone number and event date before continuing.");
      return;
    }

    if (!window.localStorage.getItem("access_token")) {
      router.push(`/login?redirect=${encodeURIComponent("/services/event-management")}`);
      return;
    }
    if (!serviceId) {
      setError("Event Management is not available for booking right now. Please try again shortly.");
      return;
    }
    if (!selectedServices.length) {
      setError("Select at least one event service for your quotation.");
      return;
    }
    if (!form.consent) {
      setError("Please allow our event team to contact you about this quotation.");
      return;
    }

    const messageParts = [
      selectedTheme ? `Selected package/theme: ${selectedTheme}` : "",
      form.requirements.trim(),
    ].filter(Boolean);
    const payload: EventQuotationPayload = {
      service: serviceId,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      event_date: form.eventDate,
      schedule_party_for: selectedServices,
      consent_to_contact: form.consent,
      event_time: form.eventTime || undefined,
      city: form.city.trim() || undefined,
      event_location: form.eventLocation.trim() || undefined,
      budget_amount: form.budgetAmount || undefined,
      event_theme: form.eventTheme || undefined,
      message: messageParts.join("\n\n") || undefined,
    };

    successChime.arm();
    setSubmitting(true);
    try {
      const response = await eventManagementService.submit(payload);
      const bookingId = response.data?.booking?.id ?? response.data?.id;
      setReference(bookingId ? `BH${String(bookingId).padStart(6, "0")}` : response.reference || "Submitted");
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
        serviceName={selectedTheme || selectedCategory}
        itemLabel="Event request"
        heading="Your event request is received"
        description="Our event specialists will review your date, selected services and requirements, then contact you with a personalised quotation."
        backHref="/services"
        backLabel="Explore services"
      />
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} className="grid h-[94dvh] max-h-[760px] grid-rows-[auto_minmax(0,1fr)] overflow-hidden lg:h-[720px] lg:grid-cols-[270px_minmax(0,1fr)] lg:grid-rows-1">
      <aside className="relative overflow-hidden bg-[#061f3b] p-5 text-white lg:p-7">
        <div className="absolute -left-20 -top-16 size-52 rounded-full bg-[#13a5d8]/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 size-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex h-full flex-col">
          <p className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[.25em] text-[#59d7ff]"><Sparkles className="size-3.5" />Service enquiry</p>
          <h2 id="event-quotation-title" className="mt-2 max-w-[220px] font-serif text-2xl leading-tight lg:mt-4 lg:text-3xl">Plan your event with us</h2>
          <p className="mt-3 hidden text-xs leading-5 text-white/55 lg:block">Share the essentials and receive a quotation tailored to your occasion.</p>

          <div className="mt-4 flex flex-wrap gap-2 lg:mt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#59d7ff]/20 bg-[#13a5d8]/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.1em] text-[#8be5ff]"><PartyPopper className="size-3" />{selectedCategory}</span>
            {selectedTheme && <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-bold text-white/70"><Palette className="size-3" />{selectedTheme}</span>}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 lg:mt-8 lg:grid-cols-1 lg:gap-3">
            {[
              { number: 1, title: "Event details", caption: "Contact, date and venue" },
              { number: 2, title: "Quotation brief", caption: "Services and requirements" },
            ].map((item) => {
              const active = step === item.number;
              const complete = step > item.number;
              return (
                <button key={item.number} type="button" onClick={() => complete && setStep(item.number as 1 | 2)} className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition lg:p-3 ${active ? "border-[#59d7ff]/35 bg-white/10" : "border-white/[.08] bg-white/[.03]"}`} aria-current={active ? "step" : undefined}>
                  <span className={`grid size-8 shrink-0 place-items-center rounded-lg text-xs font-extrabold ${active ? "bg-[#13a5d8] text-[#061f3b]" : complete ? "bg-emerald-400/15 text-emerald-300" : "bg-white/5 text-white/40"}`}>{complete ? <Check className="size-4" /> : item.number}</span>
                  <span className="min-w-0"><span className={`block truncate text-[11px] font-bold ${active ? "text-white" : "text-white/55"}`}>{item.title}</span><span className="mt-0.5 hidden truncate text-[9px] text-white/35 sm:block">{item.caption}</span></span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto hidden items-center gap-2 border-t border-white/10 pt-5 text-[10px] leading-4 text-white/40 lg:flex"><ShieldCheck className="size-4 shrink-0 text-emerald-300" />Secure enquiry sent directly to our event team.</div>
        </div>
      </aside>

      <section className="flex min-h-0 min-w-0 flex-col bg-white">
        <header className="shrink-0 border-b border-[#e2ebf0] px-5 py-4 pr-16 sm:px-7 sm:py-5 sm:pr-16">
          <p className="text-[9px] font-extrabold uppercase tracking-[.2em] text-[#087fbe]">Step {step} of 2</p>
          <h3 className="mt-1 font-serif text-xl font-semibold text-[#061f3b] sm:text-2xl">{step === 1 ? "Tell us about your event" : "Build your quotation brief"}</h3>
          <p className="mt-1 text-xs text-[#718797]">{step === 1 ? "Required fields are marked with an asterisk." : "Select everything you would like our team to include."}</p>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#f6f9fb] px-5 py-5 sm:px-7">
          <div className="mx-auto max-w-3xl space-y-4">
            {signedIn === false && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                <LockKeyhole className="mt-0.5 size-4 shrink-0" />
                <p><Link href={`/login?redirect=${encodeURIComponent("/services/event-management")}`} className="font-extrabold underline">Sign in</Link> before submitting your quotation request.</p>
              </div>
            )}

            {error && (
              <div ref={errorRef} role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold leading-5 text-rose-700">
                <CircleAlert className="mt-0.5 size-4 shrink-0" />{error}
              </div>
            )}

            {step === 1 ? (
              <div className="grid gap-4 xl:grid-cols-2">
                <fieldset className="rounded-2xl border border-[#dce7ed] bg-white p-4 shadow-sm sm:p-5">
                  <legend className="flex items-center gap-2 px-1 font-serif text-base font-semibold text-[#061f3b]"><span className="grid size-8 place-items-center rounded-lg bg-[#eaf8fd] text-[#087fbe]"><UserRound className="size-4" /></span>Contact details</legend>
                  <div className="mt-4 grid gap-3">
                    <InputField label="Full name" icon={UserRound} required value={form.name} onChange={(event) => setValue("name", event.target.value)} placeholder="Your full name" autoComplete="name" minLength={2} />
                    <InputField label="Email address" icon={Mail} required type="email" value={form.email} onChange={(event) => setValue("email", event.target.value)} placeholder="you@example.com" autoComplete="email" />
                    <InputField label="Phone number" icon={Phone} required type="tel" value={form.phone} onChange={(event) => setValue("phone", event.target.value)} placeholder="+91 98765 43210" autoComplete="tel" pattern="[0-9+ ()-]{7,20}" title="Enter a valid phone number" />
                    <InputField label="City" icon={MapPin} value={form.city} onChange={(event) => setValue("city", event.target.value)} placeholder="Event city" autoComplete="address-level2" />
                  </div>
                </fieldset>

                <fieldset className="rounded-2xl border border-[#dce7ed] bg-white p-4 shadow-sm sm:p-5">
                  <legend className="flex items-center gap-2 px-1 font-serif text-base font-semibold text-[#061f3b]"><span className="grid size-8 place-items-center rounded-lg bg-[#eaf8fd] text-[#087fbe]"><CalendarDays className="size-4" /></span>Event plan</legend>
                  <div className="mt-4 grid gap-3">
                    <InputField label="Event date" icon={CalendarDays} required type="date" min={dateMinimum} value={form.eventDate} onChange={(event) => setValue("eventDate", event.target.value)} />
                    <InputField label="Event time" icon={Clock3} type="time" value={form.eventTime} onChange={(event) => setValue("eventTime", event.target.value)} />
                    <InputField label="Event location" icon={MapPin} value={form.eventLocation} onChange={(event) => setValue("eventLocation", event.target.value)} placeholder="Venue or area" />
                    <InputField label="Estimated budget (INR)" icon={IndianRupee} type="number" min="0" step="0.01" value={form.budgetAmount} onChange={(event) => setValue("budgetAmount", event.target.value)} placeholder="For example 50000" />
                  </div>
                </fieldset>
              </div>
            ) : (
              <div className="space-y-4">
                <fieldset className="rounded-2xl border border-[#dce7ed] bg-white p-4 shadow-sm sm:p-5">
                  <legend className="flex items-center gap-2 px-1 font-serif text-base font-semibold text-[#061f3b]"><span className="grid size-8 place-items-center rounded-lg bg-[#eaf8fd] text-[#087fbe]"><PartyPopper className="size-4" /></span>Services required <span className="text-rose-500">*</span></legend>
                  <p className="mb-3 mt-2 text-[11px] text-[#718797]">Choose one or more services for this quotation.</p>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {categoryOptions.map((option) => {
                      const selected = selectedServices.includes(option.apiLabel);
                      return (
                        <button key={option.apiLabel} type="button" aria-pressed={selected} onClick={() => toggleService(option.apiLabel)} className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 text-left text-[11px] font-bold transition ${selected ? "border-[#13a5d8] bg-[#eaf9ff] text-[#075f91] shadow-sm" : "border-[#d8e5ec] bg-white text-[#50697b] hover:border-[#8dcde4]"}`}>
                          <span className={`grid size-5 shrink-0 place-items-center rounded-full ${selected ? "bg-[#13a5d8] text-white" : "border border-slate-300 text-transparent"}`}><Check className="size-3" /></span>{option.pageLabel}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-4 xl:grid-cols-[.72fr_1.28fr]">
                  <div className="rounded-2xl border border-[#dce7ed] bg-white p-4 shadow-sm sm:p-5">
                    <SelectField label="Event theme" icon={Palette} value={form.eventTheme} onChange={(event) => setValue("eventTheme", event.target.value as EventFormState["eventTheme"])}>
                      <option value="">Choose a theme</option>
                      <option value="boy">Boy celebration</option>
                      <option value="girl">Girl celebration</option>
                      <option value="corporate">Corporate</option>
                      <option value="neutral">Neutral</option>
                      <option value="custom">Custom</option>
                    </SelectField>
                    {selectedTheme && <p className="mt-3 flex items-center gap-2 rounded-lg bg-[#eff9fd] p-2.5 text-[10px] font-semibold text-[#087fbe]"><Sparkles className="size-3.5" />Selected package: {selectedTheme}</p>}
                  </div>

                  <label className="block min-w-0 rounded-2xl border border-[#dce7ed] bg-white p-4 shadow-sm sm:p-5">
                    <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[.14em] text-[#47647a]">Requirements</span>
                    <span className="flex items-start gap-3 rounded-xl border border-[#d8e5ec] bg-white px-3 shadow-sm transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10">
                      <MessageSquareText className="mt-3 size-4 shrink-0 text-[#087fbe]" aria-hidden="true" />
                      <textarea value={form.requirements} onChange={(event) => setValue("requirements", event.target.value)} rows={4} maxLength={1500} placeholder="Audience size, decoration, catering, AV setup or special requests" className="min-w-0 flex-1 resize-none bg-transparent py-2.5 text-sm font-medium text-[#102d45] outline-none placeholder:font-normal placeholder:text-slate-400" />
                    </span>
                    <span className="mt-1 block text-right text-[9px] text-slate-400">{form.requirements.length}/1500</span>
                  </label>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#cfe2ea] bg-white p-3.5 text-xs leading-5 text-[#50697b] shadow-sm">
                  <input type="checkbox" checked={form.consent} onChange={(event) => setValue("consent", event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[#087fbe]" />
                  <span>I agree to be contacted by BHLI regarding this event request and quotation. <span className="font-bold text-rose-500">*</span></span>
                </label>
              </div>
            )}
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[#e2ebf0] bg-white px-5 py-3.5 sm:px-7">
          {step === 1 ? (
            <>
              <button type="button" onClick={onClose} className="min-h-11 rounded-xl px-4 text-xs font-bold text-[#607789] transition hover:bg-slate-100">Cancel</button>
              <button type="button" onClick={continueToServices} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#061f3b] px-6 text-xs font-extrabold text-white shadow-lg shadow-[#061f3b]/15 transition hover:-translate-y-0.5">Continue <ArrowRight className="size-4" /></button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => { setError(""); setStep(1); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-xs font-bold text-[#607789] transition hover:bg-slate-100"><ArrowLeft className="size-4" />Back</button>
              <button type="submit" disabled={submitting || loadingService} className="inline-flex min-h-11 min-w-40 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 text-xs font-extrabold text-white shadow-lg shadow-[#087fbe]/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0">
                {submitting || loadingService ? <LoaderCircle className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                {loadingService ? "Preparing" : submitting ? "Submitting" : "Request quotation"}
              </button>
            </>
          )}
        </footer>
      </section>
    </form>
  );
}
