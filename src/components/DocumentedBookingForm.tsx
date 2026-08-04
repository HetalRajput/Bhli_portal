"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, CirclePlus, Hotel, MessageSquareText, Send, Trash2, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { getErrorMessage } from "@/lib/api/client";
import { cmsService } from "@/lib/api/cms";

type FieldKind = "text" | "number" | "decimal" | "date" | "time" | "select" | "textarea" | "checkbox";
type BookingField = { key: string; label: string; kind?: FieldKind; required?: boolean; placeholder?: string; options?: [string, string][]; min?: number; defaultValue?: string | boolean };
type BookingConfig = { title: string; description: string; fields: BookingField[] };
type Guest = { name: string; age: string; gender: "male" | "female" | "other" };

const select = (...values: string[]): [string, string][] => values.map((value) => [value, value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())]);
const count = (key: string, label: string): BookingField => ({ key, label, kind: "number", required: true, min: 1, defaultValue: "1" });
const date = (key: string, label: string, required = true): BookingField => ({ key, label, kind: "date", required });
const time = (key: string, label: string, required = true): BookingField => ({ key, label, kind: "time", required });
const text = (key: string, label: string, placeholder = "", required = true): BookingField => ({ key, label, placeholder, required });

export const documentedBookingConfigs: Record<string, BookingConfig> = {
  "airport-transfers": { title: "Airport Transfer", description: "Share your pickup, journey and vehicle details.", fields: [text("pickup_location", "Pickup location"), text("drop_location", "Drop location"), date("pickup_date", "Pickup date"), time("pickup_time", "Pickup time"), { key: "transfer_type", label: "Transfer type", kind: "select", required: true, options: select("airport_to_hotel", "hotel_to_airport", "railway_to_hotel", "hotel_to_railway") }, { key: "vehicle_type", label: "Vehicle type", kind: "select", required: true, options: select("sedan", "suv", "premium", "tempo_traveller") }, count("number_of_passengers", "Number of passengers"), text("flight_or_train_number", "Flight or train number", "Optional", false)] },
  "bus-ticket-booking": { title: "Bus Ticket Booking", description: "Enter your route and preferred bus details.", fields: [text("from_city", "From city"), text("to_city", "To city"), date("travel_date", "Travel date"), time("preferred_time", "Preferred time", false), text("bus_type", "Bus type", "For example: AC Sleeper", false), count("number_of_passengers", "Number of passengers")] },
  "catering-services": { title: "Catering Services", description: "Tell us about the event and catering requirement.", fields: [date("event_date", "Event date"), time("event_time", "Event time"), text("event_location", "Event location"), text("event_type", "Event type"), count("number_of_guests", "Expected guests"), text("cuisine_preference", "Cuisine preference", "For example: North Indian", false), text("meal_type", "Meal type", "Breakfast, lunch or dinner", false)] },
  "corporate-travel": { title: "Corporate Travel", description: "Provide the company, route and travel purpose.", fields: [text("company_name", "Company name"), text("travel_purpose", "Travel purpose"), text("from_city", "From city"), text("to_city", "To city"), date("departure_date", "Departure date"), date("return_date", "Return date", false), count("number_of_travellers", "Number of travellers")] },
  "cruise-booking": { title: "Cruise Booking", description: "Share your cruise dates and cabin preference.", fields: [text("destination", "Destination"), text("departure_port", "Departure port"), date("departure_date", "Preferred sailing date"), date("return_date", "Return date"), { key: "cabin_type", label: "Cabin type", kind: "select", required: false, options: select("interior", "ocean_view", "balcony", "suite") }, count("number_of_passengers", "Number of passengers")] },
  "currency-exchange": { title: "Currency Exchange", description: "Enter the currencies, amount and required date.", fields: [text("currency_from", "Currency from", "INR"), text("currency_to", "Currency to", "USD"), { key: "amount", label: "Amount", kind: "decimal", required: true, min: 0 }, text("exchange_city", "Exchange city"), date("required_date", "Required date")] },
  "event-management": { title: "Event Management", description: "Describe your event, audience and requirements.", fields: [text("event_type", "Event type"), date("event_date", "Event date"), text("event_location", "Event location"), count("number_of_guests", "Expected guests"), { key: "budget_amount", label: "Budget amount", kind: "decimal", min: 0, required: false }, { key: "requirements", label: "Event requirements", kind: "textarea", required: true, placeholder: "Stage, AV, catering and anything else you need" }] },
  "flight-booking": { title: "Flight Booking", description: "Enter the itinerary and preferred flight details.", fields: [text("from_city", "From city"), text("to_city", "To city"), date("departure_date", "Departure date"), date("return_date", "Return date", false), { key: "trip_type", label: "Trip type", kind: "select", required: true, options: select("one_way", "round_trip") }, { key: "travel_class", label: "Travel class", kind: "select", required: true, options: select("economy", "premium_economy", "business", "first") }, text("preferred_airline", "Preferred airline", "Optional", false), count("number_of_passengers", "Number of passengers")] },
  "group-tour": { title: "Group Tour", description: "Provide the destination, group size and budget.", fields: [text("destination", "Destination"), date("start_date", "Start date"), date("end_date", "End date"), count("number_of_people", "Number of people"), text("tour_type", "Tour type", "Family, official or leisure", false), { key: "budget_amount", label: "Budget amount", kind: "decimal", min: 0, required: false }] },
  "holiday-packages": { title: "Holiday Package", description: "Tell us where and when you want to travel.", fields: [text("destination", "Destination"), date("start_date", "Start date"), date("end_date", "End date"), count("number_of_people", "Number of people"), text("package_type", "Package type", "Family, luxury or adventure", false), { key: "budget_amount", label: "Budget amount", kind: "decimal", min: 0, required: false }] },
  "honeymoon-packages": { title: "Honeymoon Package", description: "Share your preferred destination, dates and package style.", fields: [text("destination", "Destination"), date("start_date", "Start date"), date("end_date", "End date"), count("number_of_people", "Number of people"), text("package_type", "Package type", "For example: Premium", false), { key: "budget_amount", label: "Budget amount", kind: "decimal", min: 0, required: false }] },
  "hotel-consultancy": { title: "Hotel Consultancy", description: "Describe the stay and preferred location.", fields: [text("city", "City"), text("preferred_location", "Preferred location", "Optional", false), date("check_in_date", "Check-in date"), date("check_out_date", "Check-out date"), count("number_of_rooms", "Number of rooms"), count("number_of_guests", "Number of guests"), { key: "budget_amount", label: "Budget amount", kind: "decimal", min: 0, required: false }, { key: "requirements", label: "Requirements", kind: "textarea", required: false, placeholder: "Room type, area and special requirements" }] },
  "hotel-reservations": { title: "Hotel Reservation", description: "Complete the stay, tariff and guest information for the selected hotel.", fields: [date("check_in_date", "Check-in date"), time("check_in_time", "Check-in time"), date("check_out_date", "Check-out date"), time("check_out_time", "Check-out time"), count("number_of_rooms", "Number of rooms"), count("number_of_guests", "Number of guests"), { key: "budget_amount", label: "Budget amount", kind: "decimal", min: 0, required: false }, { key: "td_tariff_amount", label: "TD tariff amount", kind: "decimal", min: 0, required: false }] },
  "international-tours": { title: "International Tour", description: "Enter the countries, travel dates and visa requirement.", fields: [text("countries", "Countries", "Separate multiple countries with commas"), date("start_date", "Start date"), date("end_date", "End date"), count("number_of_people", "Number of people"), { key: "budget_amount", label: "Budget amount", kind: "decimal", min: 0, required: false }, { key: "visa_required", label: "Visa assistance required", kind: "checkbox", defaultValue: false }] },
  "self-drive-car-rentals": { title: "Self-Drive Car Rental", description: "Provide pickup, drop-off and licence details.", fields: [text("pickup_city", "Pickup city"), text("pickup_location", "Pickup location"), date("pickup_date", "Pickup date"), time("pickup_time", "Pickup time"), date("dropoff_date", "Drop-off date"), time("dropoff_time", "Drop-off time"), text("vehicle_type", "Vehicle type", "For example: SUV"), text("driving_license_number", "Driving licence number")] },
  "taxi-services": { title: "Taxi Service", description: "Share your trip and preferred vehicle details.", fields: [text("pickup_location", "Pickup location"), text("drop_location", "Drop location"), date("pickup_date", "Pickup date"), time("pickup_time", "Pickup time"), { key: "trip_type", label: "Trip type", kind: "select", required: true, options: select("one_way", "round_trip", "local") }, text("vehicle_type", "Vehicle type", "For example: Sedan"), count("number_of_passengers", "Number of passengers")] },
  "train-ticket-booking": { title: "Train Ticket Booking", description: "Enter the stations and preferred train details.", fields: [text("from_station", "From station"), text("to_station", "To station"), date("travel_date", "Travel date"), text("preferred_train", "Preferred train", "Optional", false), text("travel_class", "Travel class", "For example: CC or 3A")] },
  "travel-insurance": { title: "Travel Insurance", description: "Share the destination, dates and coverage requirement.", fields: [text("destination_country", "Destination country"), date("travel_start_date", "Travel start date"), date("travel_end_date", "Travel end date"), count("number_of_travellers", "Number of travellers"), text("coverage_type", "Coverage type", "Individual or family")] },
  "visa-assistance": { title: "Visa Assistance", description: "Enter the destination and visa application details.", fields: [text("destination_country", "Destination country"), text("visa_type", "Visa type", "For example: Tourist"), date("travel_date", "Travel date"), text("appointment_city", "Appointment city"), count("number_of_applicants", "Number of applicants")] },
};

export const documentedRouteAliases: Record<string, string> = {
  "flight-bookings": "flight-booking",
  "cruise-holidays": "cruise-booking",
};

const today = () => { const value = new Date(); value.setMinutes(value.getMinutes() - value.getTimezoneOffset()); return value.toISOString().slice(0, 10); };

export default function DocumentedBookingForm({ serviceSlug }: { serviceSlug: string }) {
  const config = documentedBookingConfigs[serviceSlug];
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const selectedItemId = serviceSlug === "hotel-reservations" ? params.get("id") || "" : "";
  const selectedItemName = serviceSlug === "hotel-reservations" ? params.get("name") || "Selected hotel" : "";
  const initialServiceId = params.get("service") || "";
  const [serviceId, setServiceId] = useState(initialServiceId);
  const [values, setValues] = useState<Record<string, string | boolean>>(() => Object.fromEntries(config.fields.map((field) => [field.key, field.defaultValue ?? ""])));
  const [guests, setGuests] = useState<Guest[]>([{ name: "", age: "18", gender: "male" }]);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [loadingService, setLoadingService] = useState(!initialServiceId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const dateMinimum = useMemo(() => today(), []);

  useEffect(() => {
    if (serviceId) return;
    let active = true;
    cmsService.getServiceDetail(serviceSlug)
      .then((response) => {
        const service = response?.success && response.data && !Array.isArray(response.data) ? response.data : response;
        if (active && service?.id) setServiceId(String(service.id));
      })
      .finally(() => { if (active) setLoadingService(false); });
    return () => { active = false; };
  }, [serviceId, serviceSlug]);

  const update = (key: string, value: string | boolean) => setValues((current) => ({ ...current, [key]: value }));
  const updateGuest = (index: number, key: keyof Guest, value: string) => setGuests((current) => current.map((guest, guestIndex) => guestIndex === index ? { ...guest, [key]: value } : guest));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!localStorage.getItem("access_token")) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!serviceId || !Number.isInteger(Number(serviceId))) return setError("This service is not available for booking right now.");
    if (serviceSlug === "hotel-reservations" && (!selectedItemId || !Number.isInteger(Number(selectedItemId)))) return setError("Please select a valid hotel before booking.");
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

    setSubmitting(true);
    try {
      const response = await apiClient.post(`/api/bookings/${serviceSlug}/`, payload);
      const data = response.data;
      const bookingId = data?.data?.booking?.id ?? data?.data?.id;
      setReference(bookingId ? `BH${String(bookingId).padStart(6, "0")}` : data?.reference || "Submitted");
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) return (
    <div className="grid min-h-[720px] place-items-center bg-[#061f3b] px-5 py-24">
      <section className="w-full max-w-lg rounded-[2rem] bg-white p-9 text-center shadow-2xl md:p-12">
        <CheckCircle2 className="mx-auto size-16 text-emerald-600" />
        <p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-emerald-600">Booking request submitted</p>
        <h1 className="mt-3 font-serif text-4xl text-[#061f3b]">We received your request</h1>
        <p className="mt-4 text-sm text-slate-500">Reference: <b className="text-[#087fbe]">{reference}</b></p>
        <Link href="/profile" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#061f3b] px-7 py-3.5 font-bold text-white">View bookings <ArrowRight className="size-4" /></Link>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f8fb] pb-20 pt-24 text-[#122b42]">
      <main className="mx-auto max-w-5xl px-5 lg:px-8">
        <Link href={serviceSlug === "hotel-reservations" ? "/services/hotel-reservations" : "/services"} className="inline-flex items-center gap-2 text-sm font-semibold text-[#087fbe]"><ArrowLeft className="size-4" /> Back</Link>
        <div className="mt-6 overflow-hidden rounded-[2rem] bg-white shadow-[0_22px_70px_rgba(6,31,59,.12)] lg:grid lg:grid-cols-[.72fr_1.28fr]">
          <aside className="bg-[#061f3b] p-8 text-white md:p-10">
            <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-[#13a5d8]">{serviceSlug === "hotel-reservations" ? <Hotel className="size-7" /> : <Send className="size-7" />}</span>
            <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-[#13a5d8]">Booking request</p>
            <h1 className="mt-3 font-serif text-4xl">{selectedItemName || config.title}</h1>
            <p className="mt-4 text-sm leading-7 text-white/55">{config.description}</p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/55">All fields marked with * are required. At least one guest must be included in every request.</div>
          </aside>

          <form onSubmit={submit} className="p-6 md:p-10" noValidate>
            <h2 className="font-serif text-3xl text-[#061f3b]">Booking details</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {config.fields.map((field) => <DynamicField key={field.key} field={field} value={values[field.key]} update={update} minDate={dateMinimum} />)}
            </div>

            <section className="mt-7 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div><h3 className="font-bold text-[#061f3b]">Guests *</h3><p className="mt-1 text-xs text-slate-500">Name, age and gender are required by the booking API.</p></div>
                <button type="button" onClick={() => setGuests((current) => [...current, { name: "", age: "18", gender: "male" }])} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#087fbe] shadow-sm"><CirclePlus className="size-4" /> Add</button>
              </div>
              <div className="mt-5 space-y-4">
                {guests.map((guest, index) => (
                  <div key={index} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_90px_120px_auto]">
                    <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3"><UserRound className="size-4 text-[#087fbe]" /><input required value={guest.name} onChange={(event) => updateGuest(index, "name", event.target.value)} placeholder="Guest full name" className="h-11 min-w-0 flex-1 text-sm outline-none" /></label>
                    <input required type="number" min="1" max="120" value={guest.age} onChange={(event) => updateGuest(index, "age", event.target.value)} aria-label={`Guest ${index + 1} age`} className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none" />
                    <select value={guest.gender} onChange={(event) => updateGuest(index, "gender", event.target.value)} aria-label={`Guest ${index + 1} gender`} className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>
                    <button type="button" disabled={guests.length === 1} onClick={() => setGuests((current) => current.filter((_, guestIndex) => guestIndex !== index))} aria-label={`Remove guest ${index + 1}`} className="grid size-11 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30"><Trash2 className="size-4" /></button>
                  </div>
                ))}
              </div>
            </section>

            <label className="mt-6 block"><span className="mb-2 block text-xs font-bold text-[#456078]">Additional message</span><span className="flex gap-3 rounded-xl border border-black/10 p-3"><MessageSquareText className="mt-1 size-5 shrink-0 text-[#087fbe]" /><textarea maxLength={2000} rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Preferences or information our team should know" className="min-w-0 flex-1 resize-none text-sm outline-none" /></span></label>
            <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-slate-600"><input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 size-4 accent-[#087fbe]" /><span>I consent to being contacted about this booking request.</span></label>
            {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
            <button disabled={submitting || loadingService} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 py-4 font-bold text-white shadow-lg disabled:opacity-60">{loadingService ? "Loading service..." : submitting ? "Submitting..." : "Submit booking request"}<ArrowRight className="size-4" /></button>
          </form>
        </div>
      </main>
    </div>
  );
}

function DynamicField({ field, value, update, minDate }: { field: BookingField; value: string | boolean; update: (key: string, value: string | boolean) => void; minDate: string }) {
  const base = "h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-[#122b42] outline-none focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10";
  if (field.kind === "checkbox") return <label className="flex items-center gap-3 rounded-xl border border-black/10 p-4 text-sm font-semibold sm:col-span-2"><input type="checkbox" checked={Boolean(value)} onChange={(event) => update(field.key, event.target.checked)} className="size-4 accent-[#087fbe]" />{field.label}</label>;
  return <label className={field.kind === "textarea" ? "sm:col-span-2" : ""}><span className="mb-2 block text-xs font-bold text-[#456078]">{field.label}{field.required ? " *" : ""}</span>{field.kind === "select" ? <select required={field.required} value={String(value)} onChange={(event) => update(field.key, event.target.value)} className={base}><option value="">Select {field.label.toLowerCase()}</option>{field.options?.map(([optionValue, label]) => <option key={optionValue} value={optionValue}>{label}</option>)}</select> : field.kind === "textarea" ? <textarea required={field.required} rows={4} value={String(value)} onChange={(event) => update(field.key, event.target.value)} placeholder={field.placeholder} className={`${base} h-auto resize-none py-3`} /> : <input required={field.required} type={field.kind === "decimal" || field.kind === "number" ? "number" : field.kind || "text"} min={field.kind === "date" ? minDate : field.min} step={field.kind === "decimal" ? "0.01" : undefined} value={String(value)} onChange={(event) => update(field.key, event.target.value)} placeholder={field.placeholder} className={base} />}</label>;
}
