"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, CirclePlus, Hash, IndianRupee, MapPin, MessageSquareText, Send, ShieldCheck, Sparkles, Trash2, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BookingSuccessModal from "@/components/BookingSuccessModal";
import CruiseSearchPanel from "@/components/CruiseSearchPanel";
import { documentedBookingConfigs } from "@/components/DocumentedBookingForm";
import { apiClient, getErrorMessage } from "@/lib/api/client";
import { cmsService } from "@/lib/api/cms";
import { useSuccessChime } from "@/hooks/useSuccessChime";

type FieldKind = "text" | "number" | "decimal" | "date" | "time" | "select" | "textarea" | "checkbox";
type BookingField = { key: string; label: string; kind?: FieldKind; required?: boolean; placeholder?: string; options?: [string, string][]; min?: number; defaultValue?: string | boolean };
type BookingConfig = { title: string; description: string; fields: BookingField[] };
type Guest = { name: string; age: string; gender: "male" | "female" | "other" };
type ServiceMeta = { id?: number; name?: string; title?: string; banner_image?: string | null };

const fallbackBanner = "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1600";
const newGuest = (): Guest => ({ name: "", age: "18", gender: "male" });
const today = () => { const value = new Date(); value.setMinutes(value.getMinutes() - value.getTimezoneOffset()); return value.toISOString().slice(0, 10); };
const addDays = (value: string, days: number) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return "";
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};
const lastDayOfMonth = (value: string) => {
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return undefined;
  return `${value}-${String(new Date(year, month, 0).getDate()).padStart(2, "0")}`;
};

export default function UnifiedBookingForm({ serviceSlug }: { serviceSlug: string }) {
  const config = documentedBookingConfigs[serviceSlug] as BookingConfig;
  const isCruiseBooking = serviceSlug === "cruise-booking";
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const selectedItemId = serviceSlug === "hotel-reservations" ? params.get("id") || "" : "";
  const selectedItemName = serviceSlug === "hotel-reservations" ? params.get("name") || "Selected hotel" : "";
  const selectedImage = serviceSlug === "hotel-reservations" ? params.get("image") || "" : "";
  const initialServiceId = params.get("service") || "";
  const [serviceId, setServiceId] = useState(initialServiceId);
  const [serviceMeta, setServiceMeta] = useState<ServiceMeta | null>(null);
  const [values, setValues] = useState<Record<string, string | boolean>>(() => Object.fromEntries(config.fields.map((field) => [field.key, field.defaultValue ?? ""])));
  const [guests, setGuests] = useState<Guest[]>([newGuest()]);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [loadingService, setLoadingService] = useState(!initialServiceId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [dateMinimum] = useState(today);
  const [cruiseMonth, setCruiseMonth] = useState("");
  const [cruiseNights, setCruiseNights] = useState<number | null>(null);
  const successChime = useSuccessChime();
  const formId = `booking-form-${serviceSlug}`;

  useEffect(() => {
    let active = true;
    cmsService.getServiceDetail(serviceSlug)
      .then((response) => {
        const service = response?.success && response.data && !Array.isArray(response.data) ? response.data : response;
        if (!active || !service) return;
        setServiceMeta(service);
        if (!initialServiceId && service.id) setServiceId(String(service.id));
      })
      .finally(() => { if (active) setLoadingService(false); });
    return () => { active = false; };
  }, [initialServiceId, serviceSlug]);

  const update = (key: string, value: string | boolean) => setValues((current) => {
    const next = { ...current, [key]: value };
    if (isCruiseBooking && key === "departure_date") {
      next.return_date = value && cruiseNights ? addDays(String(value), cruiseNights) : "";
    }
    return next;
  });
  const updateCruiseMonth = (value: string) => {
    setCruiseMonth(value);
    setValues((current) => value && String(current.departure_date || "").startsWith(value)
      ? current
      : { ...current, departure_date: "", return_date: "" });
  };
  const updateCruiseNights = (value: number | null) => {
    setCruiseNights(value);
    setValues((current) => ({
      ...current,
      return_date: value && current.departure_date ? addDays(String(current.departure_date), value) : "",
    }));
  };
  const updateGuest = (index: number, key: keyof Guest, value: string) => setGuests((current) => current.map((guest, guestIndex) => guestIndex === index ? { ...guest, [key]: value } : guest));
  const addGuest = () => setGuests((current) => current.length >= 8 ? current : [...current, newGuest()]);
  const removeGuest = (index: number) => setGuests((current) => current.length === 1 ? current : current.filter((_, guestIndex) => guestIndex !== index));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!localStorage.getItem("access_token")) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!serviceId || !Number.isInteger(Number(serviceId))) return setError("This service is not available for booking right now.");
    if (serviceSlug === "hotel-reservations" && (!selectedItemId || !Number.isInteger(Number(selectedItemId)))) return setError("Please select a valid hotel before booking.");
    if (isCruiseBooking && (!cruiseMonth || !cruiseNights)) return setError("Please select the travel month and number of nights in the cruise search above.");
    if (isCruiseBooking && values.departure_date && !String(values.departure_date).startsWith(cruiseMonth)) return setError("The sailing date must be inside your selected travel month.");
    const missingField = config.fields.find((field) => field.required && (values[field.key] === "" || values[field.key] === undefined));
    if (missingField) return setError(`Please complete ${missingField.label.toLowerCase()}.`);
    if (guests.some((guest) => guest.name.trim().length < 2 || Number(guest.age) < 1 || Number(guest.age) > 120)) return setError("Enter a valid name and age for every guest.");
    if (!consent) return setError("Please consent to contact before submitting the booking request.");

    const start = String(values.check_in_date || values.start_date || values.departure_date || values.travel_start_date || values.pickup_date || "");
    const end = String(values.check_out_date || values.end_date || values.return_date || values.travel_end_date || values.dropoff_date || "");
    if (start && end && end < start) return setError("The end or return date cannot be earlier than the start date.");

    const payload: Record<string, unknown> = {
      service: Number(serviceId),
      guests: guests.map((guest) => ({ name: guest.name.trim(), age: Number(guest.age), gender: guest.gender })),
      message: message.trim(),
      consent_to_contact: consent,
    };
    if (selectedItemId) payload.service_item = Number(selectedItemId);
    config.fields.forEach((field) => {
      const value = values[field.key];
      if (value === "" || value === undefined) return;
      payload[field.key] = field.kind === "number" ? Number(value) : value;
    });
    if (isCruiseBooking) payload.number_of_passengers = guests.length;

    successChime.arm();
    setSubmitting(true);
    try {
      const response = await apiClient.post(`/api/bookings/${serviceSlug}/`, payload);
      const data = response.data;
      const bookingId = data?.data?.booking?.id ?? data?.data?.id;
      setReference(bookingId ? `BH${String(bookingId).padStart(6, "0")}` : data?.reference || "Submitted");
      successChime.play();
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
    } finally {
      setSubmitting(false);
    }
  }

  const serviceTitle = serviceMeta?.name || serviceMeta?.title || config.title;
  const selectedTitle = selectedItemName || serviceTitle;
  const banner = selectedImage || serviceMeta?.banner_image || fallbackBanner;
  const visibleFields = isCruiseBooking
    ? config.fields.filter((field) => !["destination", "departure_port", "return_date", "number_of_passengers"].includes(field.key))
    : config.fields;
  const cruiseDateMinimum = cruiseMonth && cruiseMonth > dateMinimum.slice(0, 7) ? `${cruiseMonth}-01` : dateMinimum;
  const cruiseDateMaximum = cruiseMonth ? lastDayOfMonth(cruiseMonth) : undefined;

  if (reference) return (
    <BookingSuccessModal
      reference={reference}
      serviceName={selectedTitle}
      itemLabel={selectedItemName ? "Selected hotel" : "Selected service"}
      heading="Your booking request is on its way"
      backHref="/services"
      backLabel="Back to services"
    />
  );

  return (
    <div className="min-h-screen bg-[#edf5f9] pb-10 text-[#122b42]">
      <section className="relative min-h-[390px] overflow-hidden bg-[#061f3b] px-5 pb-28 pt-8 text-white lg:px-8">
        <img src={banner} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061f3b]/95 via-[#061f3b]/76 to-[#061f3b]/25" />
        <div className="relative mx-auto max-w-[1360px]">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"><ArrowLeft className="size-4" /> All services</Link>
          <p className="mt-8 text-[11px] font-extrabold uppercase tracking-[.28em] text-[#13a5d8]">Booking Hospitality service</p>
          <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-none md:text-7xl">{config.title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65">{config.description}</p>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-20 max-w-[1360px] px-5 lg:px-8">
        {isCruiseBooking && <CruiseSearchPanel
          destination={String(values.destination || "")}
          departurePort={String(values.departure_port || "")}
          travelMonth={cruiseMonth}
          nights={cruiseNights}
          onDestinationChange={(value) => update("destination", value)}
          onDeparturePortChange={(value) => update("departure_port", value)}
          onTravelMonthChange={updateCruiseMonth}
          onNightsChange={updateCruiseNights}
          onSearch={() => document.getElementById("cruise-booking-details")?.scrollIntoView({ behavior: "smooth", block: "start" })}
        />}
        <div id={isCruiseBooking ? "cruise-booking-details" : undefined} className={`grid overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_90px_rgba(6,31,59,.22)] lg:grid-cols-[.72fr_1.28fr] ${isCruiseBooking ? "mt-6 scroll-mt-24" : ""}`}>
          <aside className="relative hidden overflow-hidden bg-[#061f3b] p-9 text-white lg:flex lg:min-h-[850px] lg:flex-col">
            <div className="absolute -bottom-24 -left-24 size-64 rounded-full border border-white/5 shadow-[0_0_0_45px_rgba(255,255,255,.025),0_0_0_90px_rgba(255,255,255,.018)]" />
            <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-[#13a5d8]"><Send className="size-7" /></span>
            <h2 className="mt-8 font-serif text-3xl">Complete your booking request</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">Share the journey and traveller details. Our team will verify availability, pricing and your special requirements.</p>
            <div className="mt-8 space-y-4 text-sm text-white/75">
              {["Personal booking assistance", "Clear pricing review", "Verified service options"].map((item) => <p key={item} className="flex items-center gap-3"><CheckCircle2 className="size-4 text-[#13a5d8]" />{item}</p>)}
            </div>
            <div className="relative mt-auto rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#13a5d8]">Selected service</p>
              <p className="mt-2 font-serif text-xl">{selectedTitle}</p>
              <p className="mt-2 flex items-center gap-2 text-xs text-white/50"><ShieldCheck className="size-3.5" />Secure request · No instant charge</p>
            </div>
          </aside>

          <section className="flex min-w-0 flex-col bg-white">
            <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 md:px-9">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#087fbe]">Service enquiry</p><h2 className="mt-1 font-serif text-2xl text-[#061f3b] md:text-3xl">Booking details</h2></div>
              <div className="hidden rounded-xl border border-[#087fbe]/15 bg-[#f2f9fc] px-4 py-2 text-right sm:block"><p className="text-[9px] font-bold uppercase tracking-wider text-[#087fbe]">Selected</p><p className="max-w-52 truncate text-xs font-bold text-[#061f3b]">{selectedTitle}</p></div>
            </header>

            <form id={formId} onSubmit={submit} className="flex-1 px-6 py-7 md:px-9" noValidate>
              <FormSection number="01" title="Service details" description="Provide the information required for this booking.">
                <div className="grid gap-4 sm:grid-cols-2">
                  {visibleFields.map((field) => <DynamicField key={field.key} field={field} value={values[field.key]} update={update} minDate={isCruiseBooking && field.key === "departure_date" ? cruiseDateMinimum : dateMinimum} maxDate={isCruiseBooking && field.key === "departure_date" ? cruiseDateMaximum : undefined} />)}
                </div>
              </FormSection>

              <FormSection number="02" title="Traveller information" description="Add one row for every traveller included in the request.">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-500">{guests.length} traveller{guests.length === 1 ? "" : "s"} added</p>
                  <button type="button" onClick={addGuest} disabled={guests.length >= 8} className="inline-flex items-center gap-2 rounded-xl border border-[#087fbe]/20 bg-[#edf9fd] px-4 py-2 text-xs font-bold text-[#087fbe] transition hover:border-[#13a5d8] hover:bg-[#e3f5fb] disabled:cursor-not-allowed disabled:opacity-45"><CirclePlus className="size-4" />Add traveller</button>
                </div>
                <div className="space-y-3">
                  {guests.map((guest, index) => (
                    <div key={index} className="grid gap-3 rounded-2xl border border-slate-200 bg-[#fbfdff] p-3 sm:grid-cols-[1fr_88px_120px_44px]">
                      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10"><UserRound className="size-4 text-[#087fbe]" /><input required minLength={2} value={guest.name} onChange={(event) => updateGuest(index, "name", event.target.value)} placeholder={`Traveller ${index + 1} full name`} className="h-11 min-w-0 flex-1 text-sm outline-none" /></label>
                      <input required aria-label={`Traveller ${index + 1} age`} placeholder="Age" type="number" min="1" max="120" value={guest.age} onChange={(event) => updateGuest(index, "age", event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#13a5d8]" />
                      <select aria-label={`Traveller ${index + 1} gender`} value={guest.gender} onChange={(event) => updateGuest(index, "gender", event.target.value as Guest["gender"])} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#13a5d8]"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>
                      <button type="button" onClick={() => removeGuest(index)} disabled={guests.length === 1} aria-label={`Remove traveller ${index + 1}`} className="grid size-11 place-items-center rounded-xl border border-red-100 bg-white text-red-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"><Trash2 className="size-4" /></button>
                    </div>
                  ))}
                </div>
              </FormSection>

              <FormSection number="03" title="Final details" description="Share preferences and confirm contact permission.">
                <label className="block"><span className="mb-2 block text-xs font-bold text-[#456078]">Additional message</span><span className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10"><MessageSquareText className="mt-1 size-5 shrink-0 text-[#087fbe]" /><textarea maxLength={2000} rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Preferences or information our team should know" className="min-w-0 flex-1 resize-none text-sm outline-none" /></span></label>
                <label className="mt-4 flex items-start gap-3 rounded-xl bg-[#f2f9fc] p-4 text-xs leading-5 text-slate-600"><input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 size-4 accent-[#087fbe]" /><span>I consent to being contacted about this booking request.</span></label>
              </FormSection>

              {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
            </form>

            <footer className="flex items-center justify-between gap-4 border-t border-slate-100 bg-white px-6 py-4 shadow-[0_-12px_30px_rgba(6,31,59,.06)] md:px-9">
              <p className="hidden text-xs text-slate-400 sm:flex sm:items-center sm:gap-2"><Sparkles className="size-4 text-[#13a5d8]" />Reviewed by the BHLI reservation desk</p>
              <button form={formId} disabled={submitting || loadingService} className="ml-auto inline-flex min-w-52 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#087fbe]/20 transition hover:-translate-y-0.5 disabled:opacity-60">{loadingService ? "Loading..." : submitting ? "Submitting..." : "Submit request"}<ArrowRight className="size-4" /></button>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}

function FormSection({ number, title, description, children }: { number: string; title: string; description: string; children: ReactNode }) {
  return <section className="mb-8"><div className="mb-4 flex items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e4f5fb] text-[10px] font-extrabold text-[#087fbe]">{number}</span><div><h3 className="text-sm font-bold text-[#061f3b]">{title}</h3><p className="mt-0.5 text-[11px] text-slate-400">{description}</p></div></div>{children}</section>;
}

function fieldIcon(field: BookingField) {
  if (field.kind === "date") return <CalendarDays className="size-4" />;
  if (field.kind === "time") return <Clock3 className="size-4" />;
  if (field.kind === "number") return <Hash className="size-4" />;
  if (field.kind === "decimal") return <IndianRupee className="size-4" />;
  return <MapPin className="size-4" />;
}

function DynamicField({ field, value, update, minDate, maxDate }: { field: BookingField; value: string | boolean; update: (key: string, value: string | boolean) => void; minDate: string; maxDate?: string }) {
  const control = "h-12 min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#122b42] outline-none";
  if (field.kind === "checkbox") return <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-[#456078] transition hover:border-[#74bddb] sm:col-span-2"><input type="checkbox" checked={Boolean(value)} onChange={(event) => update(field.key, event.target.checked)} className="size-4 accent-[#087fbe]" />{field.label}</label>;
  if (field.kind === "textarea") return <label className="sm:col-span-2"><span className="mb-2 block text-xs font-bold text-[#456078]">{field.label}{field.required ? " *" : ""}</span><textarea required={field.required} rows={4} value={String(value)} onChange={(event) => update(field.key, event.target.value)} placeholder={field.placeholder} className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10" /></label>;
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-[#456078]">{field.label}{field.required ? " *" : ""}</span>
      <span className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-400 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10">
        {fieldIcon(field)}
        {field.kind === "select" ? <select required={field.required} value={String(value)} onChange={(event) => update(field.key, event.target.value)} className={control}><option value="">Select {field.label.toLowerCase()}</option>{field.options?.map(([optionValue, label]) => <option key={optionValue} value={optionValue}>{label}</option>)}</select> : <input required={field.required} type={field.kind === "decimal" || field.kind === "number" ? "number" : field.kind || "text"} min={field.kind === "date" ? minDate : field.min} max={field.kind === "date" ? maxDate : undefined} step={field.kind === "decimal" ? "0.01" : undefined} value={String(value)} onChange={(event) => update(field.key, event.target.value)} placeholder={field.placeholder} className={control} />}
      </span>
    </label>
  );
}
