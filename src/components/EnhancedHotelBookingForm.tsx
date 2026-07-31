"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, Hotel, IndianRupee, MapPin, Plus, ShieldCheck, Sparkles, Trash2, UserRound, Utensils } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BookingSuccessModal from "@/components/BookingSuccessModal";
import { apiClient, getErrorMessage } from "@/lib/api/client";
import { cmsService } from "@/lib/api/cms";
import { useSuccessChime } from "@/hooks/useSuccessChime";

type Guest = { name: string; age: string; gender: "male" | "female" | "other" };
type Meal = "Breakfast" | "Lunch" | "Dinner";

const mealOptions: Meal[] = ["Breakfast", "Lunch", "Dinner"];
const newGuest = (): Guest => ({ name: "", age: "18", gender: "male" });
const defaultHero = "https://bhli-project-images.s3.eu-north-1.amazonaws.com/bhli-main-folder/services/banners/hotels-c7460ed9000f4ebaa01bfc5a7e890757.webp";
const localToday = () => { const value = new Date(); value.setMinutes(value.getMinutes() - value.getTimezoneOffset()); return value.toISOString().slice(0, 10); };

export default function EnhancedHotelBookingForm() {
  const params = useSearchParams();
  const router = useRouter();
  const hotel = {
    id: params.get("id") || "",
    name: params.get("name") || "Selected Hotel",
    location: params.get("location") || params.get("city") || "India",
    image: params.get("image") || defaultHero,
  };
  const [serviceId, setServiceId] = useState(params.get("service") || "");
  const [loadingService, setLoadingService] = useState(!params.get("service"));
  const [stay, setStay] = useState({ checkInDate: "", checkInTime: "14:00", checkOutDate: "", checkOutTime: "11:00", rooms: "1", budget: "", tdTariff: "" });
  const [guests, setGuests] = useState<Guest[]>([newGuest()]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [laundry, setLaundry] = useState(false);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [minDate] = useState(localToday);
  const successChime = useSuccessChime();

  useEffect(() => {
    if (serviceId) return;
    let active = true;
    cmsService.getServiceDetail("hotel-reservations")
      .then((response) => {
        const service = response?.success && response.data && !Array.isArray(response.data) ? response.data : response;
        if (active && service?.id) setServiceId(String(service.id));
      })
      .finally(() => { if (active) setLoadingService(false); });
    return () => { active = false; };
  }, [serviceId]);

  const updateStay = (key: keyof typeof stay, value: string) => setStay((current) => ({ ...current, [key]: value }));
  const updateGuest = (index: number, key: keyof Guest, value: string) => setGuests((current) => current.map((guest, guestIndex) => guestIndex === index ? { ...guest, [key]: value } : guest));
  const addGuest = () => setGuests((current) => current.length >= 8 ? current : [...current, newGuest()]);
  const removeGuest = (index: number) => setGuests((current) => current.length === 1 ? current : current.filter((_, guestIndex) => guestIndex !== index));
  const toggleMeal = (meal: Meal) => setMeals((current) => current.includes(meal) ? current.filter((item) => item !== meal) : [...current, meal]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!localStorage.getItem("access_token")) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    if (!serviceId || !Number.isInteger(Number(serviceId))) return setError("The hotel reservation service is unavailable. Please try again.");
    if (!hotel.id || !Number.isInteger(Number(hotel.id))) return setError("Please return to the hotel list and select a valid hotel.");
    if (!stay.checkInDate || !stay.checkOutDate || stay.checkOutDate <= stay.checkInDate) return setError("Select a check-out date after the check-in date.");
    if (guests.some((guest) => guest.name.trim().length < 2 || Number(guest.age) < 1 || Number(guest.age) > 120)) return setError("Enter a valid name and age for every guest.");
    if (!consent) return setError("Please consent to contact before submitting your request.");

    successChime.arm();
    const mealPreference = meals.length ? `Meal preferences: ${meals.join(", ")}.` : "";
    const servicePreference = laundry ? "Additional service requested: Laundry." : "";
    const submittedMessage = [mealPreference, servicePreference, message.trim()].filter(Boolean).join("\n").slice(0, 2000);
    const payload = {
      service: Number(serviceId),
      service_item: Number(hotel.id),
      check_in_date: stay.checkInDate,
      check_in_time: stay.checkInTime,
      check_out_date: stay.checkOutDate,
      check_out_time: stay.checkOutTime,
      number_of_rooms: Number(stay.rooms),
      number_of_guests: guests.length,
      budget_amount: stay.budget || undefined,
      td_tariff_amount: stay.tdTariff || undefined,
      message: submittedMessage,
      guests: guests.map((guest) => ({ name: guest.name.trim(), age: Number(guest.age), gender: guest.gender })),
      consent_to_contact: consent,
    };

    setSubmitting(true);
    try {
      const response = await apiClient.post("/api/bookings/hotel-reservations/", payload);
      const bookingId = response.data?.data?.booking?.id ?? response.data?.data?.id;
      setReference(bookingId ? `BH${String(bookingId).padStart(6, "0")}` : "Submitted");
      successChime.play();
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) return <BookingSuccessModal reference={reference} hotelName={hotel.name} />;

  return (
    <div className="relative h-full overflow-hidden bg-[#edf5f9] text-[#122b42]">
      <section className="absolute inset-x-0 top-0 h-[46%] min-h-[280px] overflow-hidden bg-[#061f3b] text-white">
        <img src={hotel.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061f3b]/95 via-[#061f3b]/70 to-[#061f3b]/20" />
        <div className="relative mx-auto max-w-[1360px] px-5 pt-7 lg:px-8">
          <Link href="/services/hotel-reservations" className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"><ArrowLeft className="size-4" /> All hotels</Link>
          <p className="mt-7 text-[11px] font-extrabold uppercase tracking-[.28em] text-[#13a5d8]">Booking Hospitality service</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-none md:text-6xl">Hotel Reservation</h1>
          <p className="mt-4 flex items-center gap-2 text-sm text-white/65"><MapPin className="size-4 text-[#13a5d8]" />{hotel.location}</p>
        </div>
      </section>

      <main className="absolute inset-x-0 bottom-4 top-[31%] z-10 mx-auto max-w-[1360px] px-5 lg:bottom-6 lg:px-8">
        <div className="grid h-full min-h-0 overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_90px_rgba(6,31,59,.24)] lg:grid-cols-[.72fr_1.28fr]">
          <aside className="relative hidden overflow-hidden bg-[#061f3b] p-9 text-white lg:flex lg:flex-col">
            <div className="absolute -bottom-24 -left-24 size-64 rounded-full border border-white/5 shadow-[0_0_0_45px_rgba(255,255,255,.025),0_0_0_90px_rgba(255,255,255,.018)]" />
            <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-[#13a5d8]"><Hotel className="size-7" /></span>
            <h2 className="mt-8 font-serif text-3xl">Complete your stay request</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">Share the stay and guest details. Our reservation team will verify availability, eligible rates and your special requests.</p>
            <div className="mt-8 space-y-4 text-sm text-white/75">
              {["Verified hotel selection", "Policy-aware tariff review", "Personal reservation assistance"].map((item) => <p key={item} className="flex items-center gap-3"><CheckCircle2 className="size-4 text-[#13a5d8]" />{item}</p>)}
            </div>
            <div className="relative mt-auto rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#13a5d8]">Selected hotel</p>
              <p className="mt-2 font-serif text-xl">{hotel.name}</p>
              <p className="mt-2 flex items-center gap-2 text-xs text-white/50"><ShieldCheck className="size-3.5" />Secure request · No instant charge</p>
            </div>
          </aside>

          <section className="flex min-h-0 flex-col bg-white">
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 px-6 py-4 md:px-9">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#087fbe]">Hotel enquiry</p><h2 className="mt-1 font-serif text-2xl text-[#061f3b] md:text-3xl">Booking details</h2></div>
              <div className="hidden rounded-xl border border-[#087fbe]/15 bg-[#f2f9fc] px-4 py-2 text-right sm:block"><p className="text-[9px] font-bold uppercase tracking-wider text-[#087fbe]">Selected</p><p className="max-w-52 truncate text-xs font-bold text-[#061f3b]">{hotel.name}</p></div>
            </header>

            <form id="enhanced-hotel-booking-form" onSubmit={submit} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 [scrollbar-color:#74bddb_#edf6fa] [scrollbar-width:thin] md:px-9">
              <FormSection number="01" title="Stay schedule" description="Choose arrival and departure details.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Check-in date" icon={<CalendarDays />}><input required type="date" min={minDate} value={stay.checkInDate} onChange={(event) => updateStay("checkInDate", event.target.value)} /></Field>
                  <Field label="Check-in time" icon={<Clock3 />}><input required type="time" value={stay.checkInTime} onChange={(event) => updateStay("checkInTime", event.target.value)} /></Field>
                  <Field label="Check-out date" icon={<CalendarDays />}><input required type="date" min={stay.checkInDate || minDate} value={stay.checkOutDate} onChange={(event) => updateStay("checkOutDate", event.target.value)} /></Field>
                  <Field label="Check-out time" icon={<Clock3 />}><input required type="time" value={stay.checkOutTime} onChange={(event) => updateStay("checkOutTime", event.target.value)} /></Field>
                </div>
              </FormSection>

              <FormSection number="02" title="Rooms, tariff and preferences" description="Choose rooms, budget, meals and optional hotel services.">
                <div className="grid gap-4 sm:grid-cols-3">
                  <SelectField label="Number of rooms" value={stay.rooms} change={(value) => updateStay("rooms", value)} suffix="room" />
                  <Field label="Budget amount" icon={<IndianRupee />}><input type="number" min="0" step="0.01" value={stay.budget} onChange={(event) => updateStay("budget", event.target.value)} placeholder="Optional" /></Field>
                  <Field label="TD tariff amount" icon={<IndianRupee />}><input type="number" min="0" step="0.01" value={stay.tdTariff} onChange={(event) => updateStay("tdTariff", event.target.value)} placeholder="Optional" /></Field>
                </div>
                <fieldset className="mt-5">
                  <legend className="mb-2 flex items-center gap-2 text-xs font-bold text-[#456078]"><Utensils className="size-4 text-[#087fbe]" />Meal and service preferences</legend>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {mealOptions.map((meal) => (
                      <label key={meal} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${meals.includes(meal) ? "border-[#13a5d8] bg-[#edf9fd] text-[#087fbe] ring-2 ring-[#13a5d8]/10" : "border-slate-200 bg-white text-[#456078] hover:border-[#74bddb]"}`}>
                        <input type="checkbox" checked={meals.includes(meal)} onChange={() => toggleMeal(meal)} className="size-4 accent-[#087fbe]" />{meal}
                      </label>
                    ))}
                    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${laundry ? "border-[#13a5d8] bg-[#edf9fd] text-[#087fbe] ring-2 ring-[#13a5d8]/10" : "border-slate-200 bg-white text-[#456078] hover:border-[#74bddb]"}`}>
                      <input type="checkbox" checked={laundry} onChange={(event) => setLaundry(event.target.checked)} className="size-4 accent-[#087fbe]" />Laundry
                    </label>
                  </div>
                </fieldset>
              </FormSection>

              <FormSection number="03" title="Guest information" description="Add one row for each traveller.">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-500">{guests.length} guest{guests.length === 1 ? "" : "s"} added</p>
                  <button type="button" onClick={addGuest} disabled={guests.length >= 8} className="inline-flex items-center gap-2 rounded-xl border border-[#087fbe]/20 bg-[#edf9fd] px-4 py-2 text-xs font-bold text-[#087fbe] transition hover:border-[#13a5d8] hover:bg-[#e3f5fb] disabled:cursor-not-allowed disabled:opacity-45"><Plus className="size-4" />Add guest</button>
                </div>
                <div className="space-y-3">
                  {guests.map((guest, index) => (
                    <div key={index} className="grid gap-3 rounded-2xl border border-slate-200 bg-[#fbfdff] p-3 sm:grid-cols-[1fr_88px_120px_44px]">
                      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10"><UserRound className="size-4 text-[#087fbe]" /><input required minLength={2} value={guest.name} onChange={(event) => updateGuest(index, "name", event.target.value)} placeholder={`Guest ${index + 1} full name`} className="h-11 min-w-0 flex-1 text-sm outline-none" /></label>
                      <input required aria-label={`Guest ${index + 1} age`} placeholder="Age" type="number" min="1" max="120" value={guest.age} onChange={(event) => updateGuest(index, "age", event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#13a5d8]" />
                      <select aria-label={`Guest ${index + 1} gender`} value={guest.gender} onChange={(event) => updateGuest(index, "gender", event.target.value as Guest["gender"])} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#13a5d8]"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>
                      <button type="button" onClick={() => removeGuest(index)} disabled={guests.length === 1} aria-label={`Remove guest ${index + 1}`} title="Remove guest" className="grid size-11 place-items-center rounded-xl border border-red-100 bg-white text-red-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"><Trash2 className="size-4" /></button>
                    </div>
                  ))}
                </div>
              </FormSection>

              <FormSection number="04" title="Final details" description="Share preferences and confirm contact permission.">
                <label className="block"><span className="mb-2 block text-xs font-bold text-[#456078]">Special request</span><textarea maxLength={1900} rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Early check-in, room preference or anything we should know" className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10" /></label>
                <label className="mt-4 flex items-start gap-3 rounded-xl bg-[#f2f9fc] p-4 text-xs leading-5 text-slate-600"><input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 size-4 accent-[#087fbe]" /><span>I consent to being contacted about this booking request.</span></label>
              </FormSection>

              {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
              <div className="h-16" />
            </form>

            <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-slate-100 bg-white px-6 py-4 shadow-[0_-12px_30px_rgba(6,31,59,.06)] md:px-9">
              <p className="hidden text-xs text-slate-400 sm:flex sm:items-center sm:gap-2"><Sparkles className="size-4 text-[#13a5d8]" />Reviewed by the BHLI reservation desk</p>
              <button form="enhanced-hotel-booking-form" disabled={submitting || loadingService} className="ml-auto inline-flex min-w-52 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#087fbe]/20 transition hover:-translate-y-0.5 disabled:opacity-60">{loadingService ? "Loading..." : submitting ? "Submitting..." : "Submit request"}<ArrowRight className="size-4" /></button>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}

function FormSection({ number, title, description, children }: { number: string; title: string; description: string; children: React.ReactNode }) {
  return <section className="mb-7"><div className="mb-4 flex items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e4f5fb] text-[10px] font-extrabold text-[#087fbe]">{number}</span><div><h3 className="text-sm font-bold text-[#061f3b]">{title}</h3><p className="mt-0.5 text-[11px] text-slate-400">{description}</p></div></div>{children}</section>;
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-[#456078]">{label}</span><span className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-400 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10 [&_input]:h-full [&_input]:min-w-0 [&_input]:flex-1 [&_input]:bg-transparent [&_input]:text-sm [&_input]:font-semibold [&_input]:text-[#122b42] [&_input]:outline-none">{icon}{children}</span></label>;
}

function SelectField({ label, value, change, suffix, max = 5 }: { label: string; value: string; change: (value: string) => void; suffix: string; max?: number }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-[#456078]">{label}</span><select value={value} onChange={(event) => change(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10">{Array.from({ length: max }, (_, index) => index + 1).map((amount) => <option key={amount} value={amount}>{amount} {suffix}{amount > 1 ? "s" : ""}</option>)}</select></label>;
}
