"use client";

import { FormEvent, type InputHTMLAttributes, type ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, ChefHat, CircleAlert, LoaderCircle, MapPin, ReceiptText, Send, ShieldCheck, Upload, UserRound, UsersRound, Utensils } from "lucide-react";
import { getErrorMessage } from "@/lib/api/client";
import { useServiceQuery, useSubmitServiceBookingMutation } from "@/store/websiteApi";

const eventTypes = ["Corporate Event", "Wedding / Reception", "Birthday / Private Party", "Conference / Seminar", "Defence / Government Event", "Meeting", "Social Event", "Exhibition / MICE", "Institutional / School Event", "Festival / Celebration", "Other"];
const venueCities = ["Agra", "Ahmedabad", "Amritsar", "Bengaluru", "Bhopal", "Bhubaneswar", "Chandigarh", "Chennai", "Coimbatore", "Dehradun", "Delhi", "Faridabad", "Gandhinagar", "Ghaziabad", "Goa", "Gurugram", "Guwahati", "Hyderabad", "Indore", "Jaipur", "Jammu", "Jodhpur", "Kanpur", "Kochi", "Kolkata", "Lucknow", "Ludhiana", "Mumbai", "Mysuru", "Nagpur", "Noida", "Patna", "Pune", "Raipur", "Ranchi", "Srinagar", "Surat", "Thane", "Thiruvananthapuram", "Udaipur", "Vadodara", "Varanasi", "Vijayawada", "Visakhapatnam", "Other"];
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Hi-Tea", "Snacks", "Full Day Catering", "Buffet", "À La Carte"];
const cuisines = ["Indian", "North Indian", "South Indian", "Chinese", "Continental", "Mughlai", "Multi-Cuisine", "Other"];
const foodPreferences = ["Veg", "Non-Veg", "Both", "Jain"];
const serviceStyles = ["Buffet", "Plated", "Counter Service"];
const serviceRequirements = ["Buffet Setup", "Live Counters", "Waiter / Service Staff", "Crockery & Cutlery", "Tables & Chairs", "Decoration / Setup", "Kitchen / Cooking On-Site", "Transportation / Delivery", "Cleaning Service", "Beverage / Tea-Coffee Service"];
const inputClass = "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#fbfdff] px-4 text-sm font-semibold text-[#122b42] outline-none transition placeholder:font-normal placeholder:text-slate-300 focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10";
const localToday = () => { const value = new Date(); value.setMinutes(value.getMinutes() - value.getTimezoneOffset()); return value.toISOString().slice(0, 10); };

export default function CateringServiceRequestForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [dateMinimum] = useState(localToday);
  const { data: service, isLoading: loadingService } = useServiceQuery("catering-services");
  const [submitBooking, { isLoading: submitting }] = useSubmitServiceBookingMutation();

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
    if (!venueCities.some((city) => city.toLowerCase() === value("venue_city").toLowerCase())) return setError("Choose the venue city from the dropdown list.");

    const requirements = values("service_requirements");
    const attachment = form.get("event_brief");
    const attachmentName = attachment instanceof File && attachment.size ? attachment.name : "";
    const message = [
      `Customer: ${value("full_name")}${value("company_organization") ? `, ${value("company_organization")}` : ""}`,
      `Contact: ${value("mobile_number")}, ${value("email")}${value("preferred_contact_time") ? `; preferred time ${value("preferred_contact_time")}` : ""}`,
      `Venue: ${value("venue_name")}, ${value("venue_city")}${value("venue_address") ? `, ${value("venue_address")}` : ""}`,
      `Meal type: ${values("meal_type").join(", ")}`,
      `Cuisine: ${values("cuisine_preference").join(", ") || "Not specified"}; Food: ${value("food_preference") || "Not specified"}`,
      `Service style: ${value("service_style") || "Not specified"}; Requirements: ${requirements.join(", ") || "Not specified"}`,
      value("preferred_menu") && `Preferred menu: ${value("preferred_menu")}`,
      value("dietary_requirements") && `Dietary requirements: ${value("dietary_requirements")}`,
      value("special_instructions") && `Special instructions: ${value("special_instructions")}`,
      `Additional services: Event management ${value("event_management")}; Décor ${value("decor")}; Bar / beverage ${value("bar_service")}; Photography ${value("photography")}`,
      value("other_requirements") && `Other requirements: ${value("other_requirements")}`,
      attachmentName && `Attached event brief: ${attachmentName}`,
    ].filter(Boolean).join("\n");

    const payload: Record<string, unknown> = {
      service: service.id,
      full_name: value("full_name"),
      company_organization: value("company_organization"),
      mobile_number: value("mobile_number"),
      email: value("email"),
      gst_number: value("gst_number"),
      preferred_contact_time: value("preferred_contact_time") || undefined,
      event_type: value("event_type"),
      event_date: value("event_date"),
      event_time: `${value("start_time")}:00`,
      start_time: `${value("start_time")}:00`,
      end_time: value("end_time") ? `${value("end_time")}:00` : undefined,
      event_location: value("venue_name"),
      venue_name: value("venue_name"),
      venue_city: value("venue_city"),
      venue_address: value("venue_address"),
      number_of_guests: Number(value("number_of_guests")),
      meal_type: values("meal_type").join(", "),
      cuisine_preference: values("cuisine_preference").join(", "),
      food_preference: value("food_preference"),
      budget_per_person: value("budget_per_person") || undefined,
      service_style: value("service_style"),
      service_requirements: requirements,
      preferred_menu: value("preferred_menu"),
      dietary_requirements: value("dietary_requirements"),
      special_instructions: value("special_instructions"),
      event_management: value("event_management") === "yes",
      decor: value("decor") === "yes",
      bar_beverage_service: value("bar_service") === "yes",
      photography: value("photography") === "yes",
      other_requirements: value("other_requirements"),
      quotation_required: true,
      message: message.slice(0, 4000),
      consent_to_contact: true,
      declaration_accepted: true,
    };

    try {
      const response = await submitBooking({ serviceSlug: "catering-services", payload }).unwrap();
      const data = response as { data?: { booking?: { id?: number }; id?: number }; reference?: string };
      const bookingId = data.data?.booking?.id ?? data.data?.id;
      setReference(bookingId ? `BH${String(bookingId).padStart(6, "0")}` : data.reference || "Submitted");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
    }
  }

  if (reference) return <main className="grid min-h-[720px] place-items-center bg-[#edf5f9] px-5 py-20"><section className="w-full max-w-xl rounded-[2rem] bg-white p-9 text-center shadow-[0_24px_80px_rgba(6,31,59,.15)]"><CheckCircle2 className="mx-auto size-16 text-emerald-600" /><p className="mt-6 text-xs font-extrabold uppercase tracking-[.2em] text-emerald-600">Catering request submitted</p><h1 className="mt-3 font-serif text-4xl text-[#061f3b]">Thank you!</h1><p className="mt-4 text-sm leading-7 text-slate-500">Our catering team will review your requirements and contact you with suitable menu and quotation options.</p><p className="mt-5 rounded-xl bg-[#edf7fc] p-3 text-sm">Reference: <b className="text-[#087fbe]">{reference}</b></p><button type="button" onClick={() => setReference("")} className="mt-6 rounded-full bg-[#061f3b] px-6 py-3 text-sm font-bold text-white">New request</button></section></main>;

  return <main className="min-h-screen bg-[#edf5f9] pb-20 text-[#122b42]"><header className="bg-[#061f3b] px-5 py-9 text-white lg:px-8"><div className="mx-auto max-w-6xl"><Link href="/services" className="inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white"><ArrowLeft className="size-4" />All services</Link><div className="mt-5 flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#13a5d8] text-[#061f3b]"><ChefHat className="size-6" /></span><div><span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.2em] text-[#8ad9f4]">BHLI LLP</span><h1 className="mt-3 font-serif text-3xl sm:text-5xl">Catering Service Request Form</h1><p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-white/65">Booking Hospitality &amp; Leisure Infra LLP</p></div></div></div></header>

    <form onSubmit={submit} className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white px-5 shadow-[0_18px_55px_rgba(6,31,59,.09)] sm:px-7">
      <Section number="01" title="Customer Details" icon={<UserRound className="size-5" />}><div className="grid gap-4 md:grid-cols-2"><Field name="full_name" label="Full Name" autoComplete="name" required /><Field name="company_organization" label="Company / Organization" /><Field name="mobile_number" label="Mobile Number" type="tel" inputMode="numeric" maxLength={10} required /><Field name="email" label="Email ID" type="email" autoComplete="email" required /><Field name="gst_number" label="GST Number" /><Field name="preferred_contact_time" label="Preferred Contact Time" type="time" /></div></Section>

      <Section number="02" title="Event Details" icon={<CalendarDays className="size-5" />}><div className="grid gap-4 md:grid-cols-2"><Select name="event_type" label="Event Type" options={eventTypes} required /><Field name="event_date" label="Event Date" type="date" min={dateMinimum} required /><Field name="start_time" label="Start Time" type="time" required /><Field name="end_time" label="End Time" type="time" /><Field name="venue_name" label="Venue Name" required /><label className="block"><Label required>Venue City</Label><span className="relative block"><MapPin className="pointer-events-none absolute left-4 top-1/2 mt-1 size-4 -translate-y-1/2 text-[#087fbe]" /><input name="venue_city" list="catering-city-list" required autoComplete="off" placeholder="Search or select a city" className={`${inputClass} pl-11`} /><datalist id="catering-city-list">{venueCities.map((city) => <option key={city} value={city} />)}</datalist></span></label><label className="block md:col-span-2"><Label>Complete Venue Address</Label><textarea name="venue_address" rows={3} className="mt-2 w-full rounded-xl border border-slate-200 bg-[#fbfdff] p-4 text-sm outline-none focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10" /></label><Field name="number_of_guests" label="Expected Number of Guests" type="number" min="1" required /></div></Section>

      <Section number="03" title="Catering Requirements" icon={<Utensils className="size-5" />}><ChoiceSet name="meal_type" label="Meal Type" options={mealTypes} required /><ChoiceSet name="cuisine_preference" label="Cuisine Preference" options={cuisines} /><div className="mt-5 grid gap-4 md:grid-cols-3"><Select name="food_preference" label="Food Preference" options={foodPreferences} /><Field name="budget_per_person" label="Approx. Budget Per Person" type="number" min="0" step="0.01" /><Select name="service_style" label="Service Style" options={serviceStyles} /></div></Section>

      <Section number="04" title="Service Requirements" icon={<UsersRound className="size-5" />}><ChoiceSet name="service_requirements" label="Select all services required" options={serviceRequirements} /></Section>

      <Section number="05" title="Menu & Special Requirements" icon={<ReceiptText className="size-5" />}><div className="grid gap-4 md:grid-cols-2"><Area name="preferred_menu" label="Preferred Menu / Items" /><Area name="dietary_requirements" label="Dietary Requirements" /><div className="md:col-span-2"><Area name="special_instructions" label="Special Instructions" /></div><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#087fbe]/30 bg-[#f2f9fc] p-4 text-sm font-bold text-[#087fbe] md:col-span-2"><Upload className="size-5" />Upload Menu / Event Brief<input name="event_brief" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="ml-auto max-w-60 text-xs font-normal text-slate-500 file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-2 file:font-bold file:text-[#087fbe]" /></label></div></Section>

      <Section number="06" title="Additional Services" icon={<ChefHat className="size-5" />}><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><YesNo name="event_management" label="Event Management" /><YesNo name="decor" label="Décor" /><YesNo name="bar_service" label="Bar / Beverage Service" /><YesNo name="photography" label="Photography" /></div><div className="mt-5"><Area name="other_requirements" label="Other Requirements" /></div><label className="mt-4 flex items-center gap-3 rounded-xl bg-[#edf7fc] p-4 text-sm font-bold text-[#087fbe]"><input type="checkbox" checked readOnly className="size-4 accent-[#087fbe]" />Quotation Required</label></Section>

      <Section number="07" title="Declaration" icon={<ShieldCheck className="size-5" />}><label className="flex gap-3 rounded-xl border border-[#087fbe]/15 bg-[#edf7fc] p-4 text-sm leading-6 text-slate-600"><input name="declaration" type="checkbox" required className="mt-1 size-4 shrink-0 accent-[#087fbe]" /><span>I confirm that the information provided is correct and authorize BHLI LLP to contact me regarding my catering requirement, menu options and quotation.</span></label></Section>

      {error && <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700"><CircleAlert className="mt-0.5 size-4 shrink-0" />{error}</p>}
      <button disabled={submitting || loadingService} className="group my-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-7 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(8,126,186,.28)] transition hover:-translate-y-0.5 disabled:opacity-60">{submitting || loadingService ? <LoaderCircle className="size-5 animate-spin" /> : <Send className="size-5" />}{loadingService ? "Preparing form..." : submitting ? "Submitting request..." : "Submit Catering Request"}{!submitting && !loadingService && <ArrowRight className="size-4 transition group-hover:translate-x-1" />}</button>
    </form>
  </main>;
}

function Section({ number, title, icon, children }: { number: string; title: string; icon: ReactNode; children: ReactNode }) { return <section className="border-b border-slate-100 py-6"><header className="mb-4 flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-lg bg-[#061f3b] text-[10px] font-extrabold text-white">{number}</span><span className="text-[#087fbe]">{icon}</span><h2 className="font-serif text-xl sm:text-2xl">{title}</h2></header>{children}</section>; }
function Label({ children, required }: { children: ReactNode; required?: boolean }) { return <span className="block text-xs font-bold text-[#456078]">{children}{required && <span className="text-rose-500"> *</span>}</span>; }
function Field({ label, required, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) { return <label className="block"><Label required={required}>{label}</Label><input {...props} required={required} className={inputClass} /></label>; }
function Select({ name, label, options, required }: { name: string; label: string; options: string[]; required?: boolean }) { return <label className="block"><Label required={required}>{label}</Label><select name={name} required={required} className={inputClass}><option value="">Select {label.toLowerCase()}</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
function ChoiceSet({ name, label, options, required }: { name: string; label: string; options: string[]; required?: boolean }) { return <fieldset className="mt-5 first:mt-0"><legend><Label required={required}>{label}</Label></legend><div className="mt-2 flex flex-wrap gap-2">{options.map((option) => <label key={option} className="cursor-pointer"><input type="checkbox" name={name} value={option} className="peer sr-only" /><span className="block rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 transition peer-checked:border-[#087fbe] peer-checked:bg-[#061f3b] peer-checked:text-white">{option}</span></label>)}</div></fieldset>; }
function Area({ name, label }: { name: string; label: string }) { return <label className="block"><Label>{label}</Label><textarea name={name} rows={3} className="mt-2 w-full rounded-xl border border-slate-200 bg-[#fbfdff] p-4 text-sm outline-none focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10" /></label>; }
function YesNo({ name, label }: { name: string; label: string }) { return <fieldset><legend><Label>{label}</Label></legend><div className="mt-2 flex gap-2">{["yes", "no"].map((value) => <label key={value} className="flex-1 cursor-pointer"><input type="radio" name={name} value={value} defaultChecked={value === "no"} className="peer sr-only" /><span className="block rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-bold capitalize text-slate-500 peer-checked:border-[#087fbe] peer-checked:bg-[#061f3b] peer-checked:text-white">{value}</span></label>)}</div></fieldset>; }
