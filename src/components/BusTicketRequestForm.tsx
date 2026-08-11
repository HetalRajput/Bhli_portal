"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, type InputHTMLAttributes, type ReactNode, useState } from "react";
import { ArrowLeft, ArrowRight, BusFront, Check, CheckCircle2, ChevronDown, CircleAlert, LoaderCircle, MapPin, ReceiptText, Route, Send, ShieldCheck, UserRound } from "lucide-react";
import { getErrorMessage } from "@/lib/api/client";
import type { BusBookingPayload, BusCity } from "@/lib/api/bus";
import { useBusCitiesQuery, useCreateBusBookingMutation, useServiceQuery } from "@/store/websiteApi";

const inputClass = "mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#fbfdff] px-4 text-sm font-semibold text-[#122b42] outline-none transition placeholder:font-normal placeholder:text-slate-300 focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10";
const today = () => { const date = new Date(); date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); return date.toISOString().slice(0, 10); };
const yesNo = (name: string, defaultValue = "no") => <ChoiceGroup name={name} options={[["yes", "Yes"], ["no", "No"]]} defaultValue={defaultValue} />;

export default function BusTicketRequestForm() {
  const router = useRouter();
  const [returnJourney, setReturnJourney] = useState(false);
  const [gstRequired, setGstRequired] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [dateMinimum] = useState(today);
  const { data: service, isLoading: loadingService } = useServiceQuery("bus-ticket-booking");
  const { data: cities = [], isLoading: loadingCities, isError: cityLoadFailed } = useBusCitiesQuery();
  const [submitBooking, { isLoading: submitting }] = useCreateBusBookingMutation();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!window.localStorage.getItem("access_token")) {
      router.push(`/login?redirect=${encodeURIComponent("/services/bus-ticket-booking")}`);
      return;
    }
    if (!service?.id) return setError("Bus ticket booking is unavailable right now. Please refresh and try again.");

    const form = new FormData(event.currentTarget);
    const value = (key: string) => String(form.get(key) || "").trim();
    const fromCity = cities.find((city) => city.id === Number(value("from_city")));
    const toCity = cities.find((city) => city.id === Number(value("to_city")));
    if (!fromCity || !toCity) return setError("Please choose both cities from the dropdown suggestions.");
    if (fromCity.id === toCity.id) return setError("From City and To City must be different.");
    if (returnJourney && value("return_date") < value("journey_date")) return setError("Return date cannot be earlier than the journey date.");
    if (!/^[6-9]\d{9}$/.test(value("mobile_number"))) return setError("Enter a valid 10-digit Indian mobile number.");

    const departureTime = value("preferred_departure_time");
    const remarks = value("special_assistance_remarks");
    const payload: BusBookingPayload = {
      service: service.id,
      from_city: fromCity.id,
      to_city: toCity.id,
      journey_date: value("journey_date"),
      preferred_departure_time: departureTime ? `${departureTime}:00` : undefined,
      return_journey: returnJourney,
      return_date: returnJourney ? value("return_date") : null,
      number_of_passengers: Number(value("number_of_passengers")),
      passenger_type: value("passenger_type") as BusBookingPayload["passenger_type"],
      bus_type: value("bus_type") as BusBookingPayload["bus_type"],
      seat_preference: value("seat_preference") as BusBookingPayload["seat_preference"],
      preferred_bus_operator: value("preferred_bus_operator"),
      pickup_point_preference: value("pickup_point_preference"),
      drop_point_preference: value("drop_point_preference"),
      full_name: value("full_name"),
      mobile_number: value("mobile_number"),
      email: value("email"),
      id_proof_type: value("id_proof_type"),
      id_proof_number: value("id_proof_number"),
      hotel_required: value("hotel_required") === "yes",
      transfer_required: value("transfer_required") === "yes",
      gst_invoice_required: gstRequired,
      gst_number: gstRequired ? value("gst_number") : "",
      special_assistance_remarks: remarks,
      message: remarks || `Bus request from ${fromCity.name} to ${toCity.name}`,
      consent_to_contact: true,
      declaration_accepted: true,
    };

    try {
      const response = await submitBooking(payload).unwrap();
      const bookingId = response.data?.booking?.id ?? response.data?.id;
      setReference(bookingId ? `BH${String(bookingId).padStart(6, "0")}` : "Submitted");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
    }
  }

  if (reference) return <main className="grid min-h-[720px] place-items-center bg-[#edf5f9] px-5 py-20"><section className="w-full max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-[0_24px_80px_rgba(6,31,59,.15)] sm:p-11"><span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="size-10" /></span><p className="mt-6 text-xs font-extrabold uppercase tracking-[.22em] text-emerald-600">Request submitted</p><h1 className="mt-3 font-serif text-4xl">Thank you!</h1><p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-500">Our team will check availability and contact you with suitable bus options, timings and fares.</p><p className="mt-5 rounded-xl bg-[#edf7fc] p-3 text-sm">Reference: <b className="text-[#087fbe]">{reference}</b></p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/profile" className="rounded-full bg-[#061f3b] px-6 py-3 text-sm font-bold text-white">View requests</Link><button type="button" onClick={() => setReference("")} className="rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-[#087fbe]">New request</button></div></section></main>;

  return <main className="min-h-screen bg-[#edf5f9] pb-20 text-[#122b42]">
    <header className="relative overflow-hidden bg-[#061f3b] px-5 py-10 text-white lg:px-8">
      <div className="absolute -right-20 top-0 size-72 rounded-full bg-[#13a5d8]/15 blur-3xl" />
      <div className="relative mx-auto max-w-6xl"><Link href="/services" className="inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white"><ArrowLeft className="size-4" />All services</Link><div className="mt-6 flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#13a5d8] text-[#061f3b]"><BusFront className="size-6" /></span><div><span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.22em] text-[#8ad9f4]">BHLI LLP</span><h1 className="mt-3 font-serif text-3xl sm:text-5xl">Bus Ticket Request Form</h1><p className="mt-1 text-xs font-bold uppercase tracking-[.14em] text-white/70">Booking Hospitality &amp; Leisure Infra LLP</p><p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">Share your journey and preferences. Our reservation team will check live options and contact you with timings and fares.</p></div></div></div>
    </header>

    <form onSubmit={submit} className="mx-auto mt-8 max-w-6xl overflow-visible rounded-[1.75rem] border border-slate-200 bg-white px-4 shadow-[0_18px_55px_rgba(6,31,59,.09)] sm:px-7">
      <FormSection number="01" title="Journey Details" icon={<Route className="size-5" />}>
        <div className="grid gap-4 md:grid-cols-2"><CityField name="from_city" label="From City / Boarding City" cities={cities} loading={loadingCities} /><CityField name="to_city" label="To City / Destination City" cities={cities} loading={loadingCities} /><Field name="journey_date" label="Journey Date" type="date" min={dateMinimum} required /><Field name="preferred_departure_time" label="Preferred Departure Time" type="time" /><div><Label>Return Journey</Label><ChoiceGroup name="return_journey" options={[["yes", "Yes"], ["no", "No"]]} defaultValue="no" onChange={(value) => setReturnJourney(value === "yes")} /></div>{returnJourney && <Field name="return_date" label="Return Date" type="date" min={dateMinimum} required />}<Field name="number_of_passengers" label="Number of Passengers" type="number" min="1" max="50" defaultValue="1" required /><div><Label>Passenger Type</Label><ChoiceGroup name="passenger_type" options={[["adult", "Adult"], ["child", "Child"], ["senior_citizen", "Senior Citizen"]]} defaultValue="adult" /></div></div>
        {cityLoadFailed && <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">The city dropdown could not be loaded. Please refresh and try again.</p>}
      </FormSection>

      <FormSection number="02" title="Bus Preference" icon={<BusFront className="size-5" />}>
        <div><Label required>Bus Type</Label><ChoiceGroup name="bus_type" options={[["ac_sleeper", "AC Sleeper"], ["ac_seater", "AC Seater"], ["ac_semi_sleeper", "AC Semi-Sleeper"], ["non_ac_sleeper", "Non-AC Sleeper"], ["non_ac_seater", "Non-AC Seater"], ["volvo_premium", "Volvo / Premium"], ["electric", "Electric"]]} defaultValue="ac_sleeper" /></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2"><div><Label>Seat Preference</Label><ChoiceGroup name="seat_preference" options={[["window", "Window"], ["aisle", "Aisle"], ["any", "Any"]]} defaultValue="any" /></div><Field name="preferred_bus_operator" label="Preferred Bus Operator" placeholder="Optional operator name" /><Field name="pickup_point_preference" label="Pickup Point Preference" placeholder="Preferred boarding point" /><Field name="drop_point_preference" label="Drop Point Preference" placeholder="Preferred drop point" /></div>
      </FormSection>

      <FormSection number="03" title="Lead Passenger Details" icon={<UserRound className="size-5" />}>
        <div className="grid gap-4 md:grid-cols-2"><Field name="full_name" label="Full Name" autoComplete="name" required /><Field name="mobile_number" label="Mobile Number" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel" required /><Field name="email" label="Email ID" type="email" autoComplete="email" /><Field name="id_proof_type" label="ID Proof Type" placeholder="Aadhaar, Passport, Driving Licence..." /><Field name="id_proof_number" label="ID Proof Number" /></div>
      </FormSection>

      <FormSection number="04" title="Additional Services" icon={<ReceiptText className="size-5" />}>
        <div className="grid gap-5 md:grid-cols-3"><div><Label>Hotel Required</Label>{yesNo("hotel_required")}</div><div><Label>Transfer Required</Label>{yesNo("transfer_required")}</div><div><Label>GST Invoice Required</Label><ChoiceGroup name="gst_invoice_required" options={[["yes", "Yes"], ["no", "No"]]} defaultValue="no" onChange={(value) => setGstRequired(value === "yes")} /></div></div>{gstRequired && <div className="mt-5 max-w-md"><Field name="gst_number" label="GST Number" placeholder="22AAAAA0000A1Z5" required /></div>}<label className="mt-5 block text-xs font-bold text-[#456078]">Special Assistance / Remarks<textarea name="special_assistance_remarks" rows={4} className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-[#fbfdff] p-4 text-sm outline-none focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10" placeholder="Accessibility, luggage, boarding or other requirements" /></label>
      </FormSection>

      <FormSection number="05" title="Declaration" icon={<ShieldCheck className="size-5" />}>
        <label className="flex gap-3 rounded-xl border border-[#087fbe]/15 bg-[#edf7fc] p-4 text-sm leading-6 text-slate-600"><input name="declaration" type="checkbox" required className="mt-1 size-4 shrink-0 accent-[#087fbe]" /><span>I confirm that the information provided is correct and authorize BHLI LLP to process my bus ticket request and contact me regarding available buses, timings, fares and booking details.</span></label>
      </FormSection>

      {error && <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700"><CircleAlert className="mt-0.5 size-4 shrink-0" />{error}</p>}
      <button disabled={submitting || loadingService || loadingCities || cityLoadFailed} className="group my-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-7 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(8,126,186,.28)] transition hover:-translate-y-0.5 disabled:opacity-60">{submitting ? <LoaderCircle className="size-5 animate-spin" /> : <Send className="size-5" />}{loadingService || loadingCities ? "Preparing form..." : submitting ? "Submitting request..." : "Submit Bus Ticket Request"}{!submitting && !loadingService && !loadingCities && <ArrowRight className="size-4 transition group-hover:translate-x-1" />}</button>
    </form>
  </main>;
}

function FormSection({ number, title, icon, children }: { number: string; title: string; icon: ReactNode; children: ReactNode }) {
  return <section className="border-b border-slate-100 py-5 sm:py-6"><header className="mb-4 flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-lg bg-[#061f3b] text-[10px] font-extrabold text-white">{number}</span><span className="text-[#087fbe]">{icon}</span><h2 className="font-serif text-xl sm:text-2xl">{title}</h2></header><div>{children}</div></section>;
}

function Label({ children, required }: { children: ReactNode; required?: boolean }) { return <span className="block text-xs font-bold text-[#456078]">{children}{required && <span className="text-rose-500"> *</span>}</span>; }
function Field({ label, required, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) { return <label className="block"><Label required={required}>{label}</Label><input {...props} required={required} className={inputClass} /></label>; }
function CityField({ name, label, cities, loading }: { name: string; label: string; cities: BusCity[]; loading: boolean }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const listId = `${name}-options`;
  const matches = cities.filter((city) => city.name.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
  const selected = selectedId !== null;

  return <div className="relative"><Label required>{label}</Label><input type="hidden" name={name} value={selectedId ?? ""} /><span className="relative block"><MapPin className="pointer-events-none absolute left-4 top-1/2 mt-1 size-4 -translate-y-1/2 text-[#087fbe]" /><input value={query} onChange={(event) => { const nextQuery = event.target.value; const exactMatch = cities.find((city) => city.name.toLowerCase() === nextQuery.trim().toLowerCase()); setQuery(nextQuery); setSelectedId(exactMatch?.id ?? null); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => window.setTimeout(() => setOpen(false), 150)} required disabled={loading} autoComplete="off" placeholder={loading ? "Loading cities..." : "Type to search cities"} aria-label={label} role="combobox" aria-autocomplete="list" aria-controls={listId} aria-expanded={open} className={`${inputClass} pl-11 pr-11 disabled:cursor-wait disabled:opacity-60`} /><ChevronDown className={`pointer-events-none absolute right-4 top-1/2 mt-1 size-4 -translate-y-1/2 text-slate-400 transition ${open ? "rotate-180" : ""}`} /></span>{open && !loading && <span id={listId} role="listbox" className="absolute z-40 mt-2 block max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_45px_rgba(6,31,59,.16)]">{matches.length ? matches.map((city) => <button key={city.id} type="button" role="option" aria-selected={selectedId === city.id} onMouseDown={(event) => event.preventDefault()} onClick={() => { setQuery(city.name); setSelectedId(city.id); setOpen(false); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#344a5c] transition hover:bg-[#edf7fc] hover:text-[#087fbe]"><span className="flex items-center gap-2"><MapPin className="size-3.5 text-[#13a5d8]" />{city.name}</span>{selectedId === city.id && <Check className="size-4 text-emerald-600" />}</button>) : <span className="block px-3 py-4 text-center text-xs font-semibold text-slate-400">No matching city found</span>}</span>}{query && !selected && !open && <span className="mt-1.5 block text-[10px] font-semibold text-amber-600">Choose a city from the dropdown list.</span>}</div>;
}
function ChoiceGroup({ name, options, defaultValue, onChange }: { name: string; options: Array<[string, string]>; defaultValue: string; onChange?: (value: string) => void }) { return <div className="mt-2 flex flex-wrap gap-2">{options.map(([value, label]) => <label key={value} className="cursor-pointer"><input className="peer sr-only" type="radio" name={name} value={value} defaultChecked={value === defaultValue} onChange={() => onChange?.(value)} /><span className="block rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 transition peer-checked:border-[#087fbe] peer-checked:bg-[#061f3b] peer-checked:text-white">{label}</span></label>)}</div>; }
