"use client";

import { FormEvent, type InputHTMLAttributes, type ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, ChefHat, ChevronDown, CircleAlert, LoaderCircle, MapPin, ReceiptText, Send, ShieldCheck, Upload, UserRound, UsersRound, Utensils } from "lucide-react";
import { getErrorMessage } from "@/lib/api/client";
import type { CateringBookingPayload, CateringCity } from "@/lib/api/catering";
import { useCateringCitiesQuery, useCreateCateringBookingMutation, useServiceQuery } from "@/store/websiteApi";

const eventTypes: Array<[string, string]> = [["corporate_event", "Corporate Event"], ["wedding_reception", "Wedding / Reception"], ["birthday_private_party", "Birthday / Private Party"], ["conference_seminar", "Conference / Seminar"], ["defence_government_event", "Defence / Government Event"], ["meeting", "Meeting"], ["social_event", "Social Event"], ["exhibition_mice", "Exhibition / MICE"], ["institutional_school_event", "Institutional / School Event"], ["festival_celebration", "Festival / Celebration"], ["other", "Other"]];
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Hi-Tea", "Snacks", "Full Day Catering", "Buffet", "A La Carte"];
const cuisines = ["Indian", "North Indian", "South Indian", "Chinese", "Continental", "Mughlai", "Multi-Cuisine", "Other"];
const foodPreferences: Array<[string, string]> = [["veg", "Veg"], ["non_veg", "Non-Veg"], ["both", "Both"], ["jain", "Jain"]];
const serviceStyles: Array<[string, string]> = [["buffet", "Buffet"], ["plated", "Plated"], ["counter_service", "Counter Service"]];
const serviceRequirements = ["Buffet Setup", "Live Counters", "Waiter / Service Staff", "Crockery & Cutlery", "Tables & Chairs", "Decoration / Setup", "Kitchen / Cooking On-Site", "Transportation / Delivery", "Cleaning Service", "Beverage / Tea-Coffee Service"];
const inputClass = "mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-[#fbfdff] px-3 text-sm font-semibold text-[#122b42] outline-none transition placeholder:font-normal placeholder:text-slate-300 focus:border-[#13a5d8] focus:ring-3 focus:ring-[#13a5d8]/10";
const localToday = () => { const value = new Date(); value.setMinutes(value.getMinutes() - value.getTimezoneOffset()); return value.toISOString().slice(0, 10); };

export default function CateringServiceRequestForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [dateMinimum] = useState(localToday);
  const { data: service, isLoading: loadingService } = useServiceQuery("catering-services");
  const { data: cities = [], isLoading: loadingCities, isError: cityLoadFailed } = useCateringCitiesQuery();
  const [submitBooking, { isLoading: submitting }] = useCreateCateringBookingMutation();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!window.localStorage.getItem("access_token")) {
      router.push(`/login?redirect=${encodeURIComponent("/services/catering-services")}`);
      return;
    }
    if (!service?.id) return setError("Catering requests are unavailable right now. Please refresh and try again.");

    const form = new FormData(event.currentTarget);
    const value = (key: string) => String(form.get(key) || "").trim();
    const values = (key: string) => form.getAll(key).map(String);
    if (!/^[6-9]\d{9}$/.test(value("mobile_number"))) return setError("Enter a valid 10-digit Indian mobile number.");
    if (value("end_time") && value("end_time") <= value("start_time")) return setError("End time must be later than the start time.");
    if (!mealTypes.some((item) => values("meal_type").includes(item))) return setError("Select at least one meal type.");
    const venueCity = cities.find((city) => city.id === Number(value("venue_city")));
    if (!venueCity) return setError("Choose the venue city from the API dropdown list.");

    const requirements = values("service_requirements");
    const attachment = form.get("event_brief");
    const attachmentName = attachment instanceof File && attachment.size ? attachment.name : "";
    const message = [
      `Customer: ${value("full_name")}${value("company_organization") ? `, ${value("company_organization")}` : ""}`,
      `Contact: ${value("mobile_number")}, ${value("email")}${value("preferred_contact_time") ? `; preferred time ${value("preferred_contact_time")}` : ""}`,
      `Venue: ${value("venue_name")}, ${venueCity.name}${value("venue_address") ? `, ${value("venue_address")}` : ""}`,
      `Meal type: ${values("meal_type").join(", ")}`,
      `Cuisine: ${values("cuisine_preference").join(", ") || "Not specified"}; Food: ${value("food_preference") || "Not specified"}`,
      `Service style: ${value("service_style") || "Not specified"}; Requirements: ${requirements.join(", ") || "Not specified"}`,
      value("preferred_menu_items") && `Preferred menu: ${value("preferred_menu_items")}`,
      value("dietary_requirements") && `Dietary requirements: ${value("dietary_requirements")}`,
      value("special_instructions") && `Special instructions: ${value("special_instructions")}`,
      `Additional services: Event management ${value("event_management_required")}; Décor ${value("decor_required")}; Bar / beverage ${value("bar_beverage_service_required")}; Photography ${value("photography_required")}`,
      value("other_requirements") && `Other requirements: ${value("other_requirements")}`,
      attachmentName && `Attached event brief: ${attachmentName}`,
    ].filter(Boolean).join("\n");

    const payload: CateringBookingPayload = {
      service: service.id,
      full_name: value("full_name"),
      company_organization: value("company_organization"),
      mobile_number: value("mobile_number"),
      email: value("email"),
      gst_number: value("gst_number"),
      preferred_contact_time: value("preferred_contact_time") || undefined,
      event_type: value("event_type"),
      event_date: value("event_date"),
      start_time: `${value("start_time")}:00`,
      end_time: value("end_time") ? `${value("end_time")}:00` : undefined,
      venue_name: value("venue_name"),
      venue_city: venueCity.id,
      venue_address: value("venue_address"),
      expected_number_of_guests: Number(value("expected_number_of_guests")),
      meal_type: values("meal_type"),
      cuisine_preference: values("cuisine_preference"),
      food_preference: value("food_preference"),
      budget_per_person: value("budget_per_person") || undefined,
      service_style: value("service_style"),
      service_requirements: requirements,
      preferred_menu_items: value("preferred_menu_items"),
      dietary_requirements: value("dietary_requirements"),
      special_instructions: value("special_instructions"),
      event_management_required: value("event_management_required") === "yes",
      decor_required: value("decor_required") === "yes",
      bar_beverage_service_required: value("bar_beverage_service_required") === "yes",
      photography_required: value("photography_required") === "yes",
      other_requirements: value("other_requirements"),
      quotation_required: true,
      message: message.slice(0, 4000),
      consent_to_contact: true,
      declaration_accepted: true,
    };

    try {
      const response = await submitBooking({ payload, file: attachment instanceof File && attachment.size ? attachment : null }).unwrap();
      const bookingId = response.data?.booking?.id ?? response.data?.id;
      setReference(bookingId ? `BH${String(bookingId).padStart(6, "0")}` : "Submitted");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
    }
  }

  if (reference) return <main className="grid min-h-[720px] place-items-center bg-[#edf5f9] px-5 py-20"><section className="w-full max-w-xl rounded-[2rem] bg-white p-9 text-center shadow-[0_24px_80px_rgba(6,31,59,.15)]"><CheckCircle2 className="mx-auto size-16 text-emerald-600" /><p className="mt-6 text-xs font-extrabold uppercase tracking-[.2em] text-emerald-600">Catering request submitted</p><h1 className="mt-3 font-serif text-4xl text-[#061f3b]">Thank you!</h1><p className="mt-4 text-sm leading-7 text-slate-500">Our catering team will review your requirements and contact you with suitable menu and quotation options.</p><p className="mt-5 rounded-xl bg-[#edf7fc] p-3 text-sm">Reference: <b className="text-[#087fbe]">{reference}</b></p><button type="button" onClick={() => setReference("")} className="mt-6 rounded-full bg-[#061f3b] px-6 py-3 text-sm font-bold text-white">New request</button></section></main>;

  return <main className="min-h-screen bg-[#edf5f9] pb-14 text-[#122b42]"><header className="bg-[#061f3b] px-5 py-7 text-white lg:px-8"><div className="mx-auto max-w-7xl"><Link href="/services" className="inline-flex items-center gap-2 text-[11px] font-bold text-white/60 hover:text-white"><ArrowLeft className="size-3.5" />All services</Link><div className="mt-4 flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#13a5d8] text-[#061f3b]"><ChefHat className="size-5" /></span><div><div className="flex flex-wrap items-center gap-2"><span className="inline-flex rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.18em] text-[#8ad9f4]">BHLI LLP</span><p className="text-[10px] font-bold uppercase tracking-[.1em] text-white/55">Booking Hospitality &amp; Leisure Infra LLP</p></div><h1 className="mt-1.5 font-serif text-3xl sm:text-4xl">Catering Service Request Form</h1></div></div></div></header>

    <form onSubmit={submit} className="mx-auto mt-6 max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_14px_45px_rgba(6,31,59,.08)] sm:px-6">
      <Section number="01" title="Customer Details" icon={<UserRound className="size-4" />}><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"><Field name="full_name" label="Full Name" autoComplete="name" required /><Field name="company_organization" label="Company / Organization" /><Field name="mobile_number" label="Mobile Number" type="tel" inputMode="numeric" maxLength={10} required /><Field name="email" label="Email ID" type="email" autoComplete="email" required /><Field name="gst_number" label="GST Number" /><Field name="preferred_contact_time" label="Preferred Contact Time" type="time" /></div></Section>

      <Section number="02" title="Event Details" icon={<CalendarDays className="size-4" />}><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4"><Select name="event_type" label="Event Type" options={eventTypes} required /><Field name="event_date" label="Event Date" type="date" min={dateMinimum} required /><Field name="start_time" label="Start Time" type="time" required /><Field name="end_time" label="End Time" type="time" /><Field name="venue_name" label="Venue Name" required /><CateringCityField cities={cities} loading={loadingCities} /><Field name="expected_number_of_guests" label="Expected Number of Guests" type="number" min="1" required /><label className="block md:col-span-2 lg:col-span-1"><Label>Complete Venue Address</Label><textarea name="venue_address" rows={1} className="mt-1.5 h-10 w-full resize-none rounded-lg border border-slate-200 bg-[#fbfdff] px-3 py-2.5 text-sm outline-none focus:border-[#13a5d8] focus:ring-3 focus:ring-[#13a5d8]/10" /></label></div>{cityLoadFailed && <p className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs font-semibold text-red-700">The catering city dropdown could not be loaded. Please refresh and try again.</p>}</Section>

      <Section number="03" title="Catering Requirements" icon={<Utensils className="size-4" />}><div className="grid gap-4 lg:grid-cols-2"><ChoiceSet name="meal_type" label="Meal Type" options={mealTypes} required /><ChoiceSet name="cuisine_preference" label="Cuisine Preference" options={cuisines} /></div><div className="mt-4 grid gap-3 md:grid-cols-3"><Select name="food_preference" label="Food Preference" options={foodPreferences} /><Field name="budget_per_person" label="Approx. Budget Per Person" type="number" min="0" step="0.01" /><Select name="service_style" label="Service Style" options={serviceStyles} /></div></Section>

      <Section number="04" title="Service Requirements" icon={<UsersRound className="size-4" />}><ChoiceSet name="service_requirements" label="Select all services required" options={serviceRequirements} wide /></Section>

      <Section number="05" title="Menu & Special Requirements" icon={<ReceiptText className="size-4" />}><div className="grid gap-3 lg:grid-cols-3"><Area name="preferred_menu_items" label="Preferred Menu / Items" /><Area name="dietary_requirements" label="Dietary Requirements" /><Area name="special_instructions" label="Special Instructions" /><label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[#087fbe]/30 bg-[#f2f9fc] px-3 py-2.5 text-xs font-bold text-[#087fbe] lg:col-span-3"><Upload className="size-4" /><span className="shrink-0">Menu / Event Brief</span><input name="event_brief" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="ml-auto min-w-0 max-w-72 text-[11px] font-normal text-slate-500 file:mr-2 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-1.5 file:font-bold file:text-[#087fbe]" /></label></div></Section>

      <Section number="06" title="Additional Services" icon={<ChefHat className="size-4" />}><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><YesNo name="event_management_required" label="Event Management" /><YesNo name="decor_required" label="Décor" /><YesNo name="bar_beverage_service_required" label="Bar / Beverage Service" /><YesNo name="photography_required" label="Photography" /></div><div className="mt-4 grid items-end gap-3 lg:grid-cols-[1fr_auto]"><Area name="other_requirements" label="Other Requirements" /><label className="flex h-10 items-center gap-2 rounded-lg bg-[#edf7fc] px-4 text-xs font-bold text-[#087fbe]"><input type="checkbox" checked readOnly className="size-4 accent-[#087fbe]" />Quotation Required</label></div></Section>

      <Section number="07" title="Declaration" icon={<ShieldCheck className="size-4" />}><label className="flex gap-3 rounded-lg border border-[#087fbe]/15 bg-[#edf7fc] p-3 text-xs leading-5 text-slate-600"><input name="declaration" type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-[#087fbe]" /><span>I confirm that the information provided is correct and authorize BHLI LLP to contact me regarding my catering requirement, menu options and quotation.</span></label></Section>

      {error && <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700"><CircleAlert className="mt-0.5 size-4 shrink-0" />{error}</p>}
      <button disabled={submitting || loadingService || loadingCities || cityLoadFailed} className="group my-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-7 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(8,126,186,.24)] transition hover:-translate-y-0.5 disabled:opacity-60">{submitting || loadingService || loadingCities ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}{loadingService || loadingCities ? "Preparing form..." : submitting ? "Submitting request..." : "Submit Catering Request"}{!submitting && !loadingService && !loadingCities && <ArrowRight className="size-4 transition group-hover:translate-x-1" />}</button>
    </form>
  </main>;
}

function Section({ number, title, icon, children }: { number: string; title: string; icon: ReactNode; children: ReactNode }) { return <section className="border-b border-slate-100 py-4"><header className="mb-3 flex items-center gap-2"><span className="grid size-7 place-items-center rounded-lg bg-[#061f3b] text-[9px] font-extrabold text-white">{number}</span><span className="text-[#087fbe]">{icon}</span><h2 className="font-serif text-lg sm:text-xl">{title}</h2></header>{children}</section>; }
function Label({ children, required }: { children: ReactNode; required?: boolean }) { return <span className="block text-[11px] font-bold text-[#456078]">{children}{required && <span className="text-rose-500"> *</span>}</span>; }
function Field({ label, required, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) { return <label className="block"><Label required={required}>{label}</Label><input {...props} required={required} className={inputClass} /></label>; }
function Select({ name, label, options, required }: { name: string; label: string; options: Array<string | [string, string]>; required?: boolean }) { return <label className="block"><Label required={required}>{label}</Label><select name={name} required={required} className={inputClass}><option value="">Select {label.toLowerCase()}</option>{options.map((option) => { const value = Array.isArray(option) ? option[0] : option; const optionLabel = Array.isArray(option) ? option[1] : option; return <option key={value} value={value}>{optionLabel}</option>; })}</select></label>; }
function ChoiceSet({ name, label, options, required, wide }: { name: string; label: string; options: string[]; required?: boolean; wide?: boolean }) { return <fieldset><legend><Label required={required}>{label}</Label></legend><div className={wide ? "mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5" : "mt-1.5 flex flex-wrap gap-1.5"}>{options.map((option) => <label key={option} className="cursor-pointer"><input type="checkbox" name={name} value={option} className="peer sr-only" /><span className="block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-center text-[11px] font-bold text-slate-500 transition peer-checked:border-[#087fbe] peer-checked:bg-[#061f3b] peer-checked:text-white">{option}</span></label>)}</div></fieldset>; }
function Area({ name, label }: { name: string; label: string }) { return <label className="block"><Label>{label}</Label><textarea name={name} rows={2} className="mt-1.5 min-h-16 w-full resize-y rounded-lg border border-slate-200 bg-[#fbfdff] px-3 py-2.5 text-sm outline-none focus:border-[#13a5d8] focus:ring-3 focus:ring-[#13a5d8]/10" /></label>; }
function YesNo({ name, label }: { name: string; label: string }) { return <fieldset><legend><Label>{label}</Label></legend><div className="mt-1.5 flex gap-1.5">{["yes", "no"].map((value) => <label key={value} className="flex-1 cursor-pointer"><input type="radio" name={name} value={value} defaultChecked={value === "no"} className="peer sr-only" /><span className="block rounded-lg border border-slate-200 px-3 py-1.5 text-center text-[11px] font-bold capitalize text-slate-500 peer-checked:border-[#087fbe] peer-checked:bg-[#061f3b] peer-checked:text-white">{value}</span></label>)}</div></fieldset>; }

function CateringCityField({ cities, loading }: { cities: CateringCity[]; loading: boolean }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const matches = cities.filter((city) => city.name.toLowerCase().includes(query.toLowerCase())).slice(0, 10);

  return <div className="relative"><Label required>Venue City</Label><input type="hidden" name="venue_city" value={selectedId ?? ""} /><span className="relative block"><MapPin className="pointer-events-none absolute left-4 top-1/2 mt-1 size-4 -translate-y-1/2 text-[#087fbe]" /><input value={query} onChange={(event) => { const next = event.target.value; const exact = cities.find((city) => city.name.toLowerCase() === next.trim().toLowerCase()); setQuery(next); setSelectedId(exact?.id ?? null); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => window.setTimeout(() => setOpen(false), 150)} required disabled={loading} autoComplete="off" placeholder={loading ? "Loading API cities..." : "Type to search cities"} aria-label="Venue City" role="combobox" aria-autocomplete="list" aria-controls="catering-city-options" aria-expanded={open} className={`${inputClass} pl-11 pr-11 disabled:cursor-wait disabled:opacity-60`} /><ChevronDown className={`pointer-events-none absolute right-4 top-1/2 mt-1 size-4 -translate-y-1/2 text-slate-400 transition ${open ? "rotate-180" : ""}`} /></span>{open && !loading && <span id="catering-city-options" role="listbox" className="absolute z-40 mt-2 block max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_45px_rgba(6,31,59,.16)]">{matches.length ? matches.map((city) => <button key={city.id} type="button" role="option" aria-selected={selectedId === city.id} onMouseDown={(event) => event.preventDefault()} onClick={() => { setQuery(city.name); setSelectedId(city.id); setOpen(false); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#344a5c] transition hover:bg-[#edf7fc] hover:text-[#087fbe]"><span className="flex items-center gap-2"><MapPin className="size-3.5 text-[#13a5d8]" />{city.name}</span>{selectedId === city.id && <Check className="size-4 text-emerald-600" />}</button>) : <span className="block px-3 py-4 text-center text-xs font-semibold text-slate-400">No matching city found</span>}</span>}{query && selectedId === null && !open && <span className="mt-1.5 block text-[10px] font-semibold text-amber-600">Choose a city from the API dropdown.</span>}</div>;
}
