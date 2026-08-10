"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Check, CheckCircle2, ChevronRight, IndianRupee, MapPin, UserRound } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { bookingService } from "@/lib/api/bookings";
import { getErrorMessage } from "@/lib/api/client";
import { cmsService } from "@/lib/api/cms";
import GlobalPageSkeleton from "@/components/GlobalPageSkeleton";

const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
const localToday = () => { const date = new Date(); date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); return date.toISOString().slice(0, 10); };

function BookingFlow() {
  const params = useSearchParams();
  const hotel = {
    serviceId: params.get("service") || "",
    id: params.get("id") || "",
    name: params.get("name") || "Selected Hotel",
    location: params.get("location") || "India",
    city: params.get("city") || params.get("location") || "",
    image: params.get("image") || "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1400",
    description: params.get("description") || "A thoughtfully selected stay with comfort, service and effortless booking.",
    price: Number(params.get("price")) || 0,
  };
  const [serviceId, setServiceId] = useState(hotel.serviceId);
  const [resolvingService, setResolvingService] = useState(!hotel.serviceId);
  const [stay, setStay] = useState({ checkIn: "", checkOut: "", rooms: 1 });
  const [tariffDetails, setTariffDetails] = useState({ tdTariffAmount: "", personalVisitBudget: "" });
  const [guestDetails, setGuestDetails] = useState({ name: "", age: 18, gender: "male" });
  const [preferences, setPreferences] = useState({ laundry: false, breakfast: false });
  const [specialRequest, setSpecialRequest] = useState("");
  const [consentToContact, setConsentToContact] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState("");
  const minDate = localToday();
  const nights = useMemo(() => stay.checkIn && stay.checkOut ? Math.max(0, Math.ceil((new Date(stay.checkOut).getTime() - new Date(stay.checkIn).getTime()) / 86400000)) : 0, [stay.checkIn, stay.checkOut]);
  const total = hotel.price * nights * stay.rooms;
  const setStayValue = (key: keyof typeof stay, value: string | number) => setStay((current) => ({ ...current, [key]: value }));
  useEffect(() => {
    if (serviceId) return;
    let active = true;
    async function resolveHotelService() {
      try {
        for (const slug of ["hotel-reservations", "hotel-booking"]) {
          const detail = await cmsService.getServiceDetail(slug);
          const candidate = detail?.success && detail?.data && !Array.isArray(detail.data) ? detail.data : null;
          if (candidate?.id && (candidate.booking_mode === "items" || candidate.requires_service_item)) {
            if (active) setServiceId(String(candidate.id));
            return;
          }
        }
        const response = await cmsService.getServices();
        const services = Array.isArray(response) ? response : response?.data;
        const candidate = Array.isArray(services) ? services.find((item: { name?: string; slug?: string; booking_mode?: string; requires_service_item?: boolean }) =>
          (item.booking_mode === "items" || item.requires_service_item) && /hotel/i.test(`${item.name || ""} ${item.slug || ""}`)
        ) : null;
        if (active && candidate?.id) setServiceId(String(candidate.id));
      } finally {
        if (active) setResolvingService(false);
      }
    }
    void resolveHotelService();
    return () => { active = false; };
  }, [serviceId]);

  async function book(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!stay.checkIn || !stay.checkOut || nights < 1) return setError("Select a valid check-in and check-out date.");
    if (!serviceId || !Number.isInteger(Number(serviceId))) return setError("This hotel is missing its service ID. Please select it again.");
    if (!hotel.id || !Number.isInteger(Number(hotel.id))) return setError("This hotel is missing a valid service item ID. Please select it again.");
    if (!hotel.city.trim()) return setError("The selected hotel is missing its destination city.");
    if (guestDetails.name.trim().length < 2) return setError("At least one guest name is required.");
    if (!consentToContact) return setError("Please consent to contact before submitting the request.");
    if (!localStorage.getItem("access_token")) return setError("Please sign in before submitting a booking request.");
    setLoading(true);
    const payload = {
      service: Number(serviceId),
      service_item: Number(hotel.id),
      check_in_date: stay.checkIn,
      check_out_date: stay.checkOut,
      number_of_rooms: stay.rooms,
      td_tariff_amount: tariffDetails.tdTariffAmount || undefined,
      budget_amount: tariffDetails.personalVisitBudget || undefined,
      details: {
        destination_city: hotel.city.trim(),
        Laundry: preferences.laundry ? "check" : "notcheck",
        breakfast: preferences.breakfast ? "check" : "notcheck",
      },
      guests: [{ name: guestDetails.name.trim(), age: guestDetails.age, gender: guestDetails.gender as "male" | "female" | "other" }],
      message: specialRequest.trim(),
      consent_to_contact: consentToContact,
    };
    try {
      const result = await bookingService.createGenericBooking(payload);
      const code = result?.data?.id ? `BH${String(result.data.id).padStart(6, "0")}` : result?.booking_reference || result?.reference || `BH${Date.now().toString().slice(-8)}`;
      localStorage.setItem("bhli-last-hotel-booking", JSON.stringify({ ...payload, bookingReference: code }));
      setReference(code);
    } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); }
  }

  if (reference) return <Success hotel={hotel.name} reference={reference} />;

  return (
    <div className="min-h-screen bg-[#f3f8fb] pb-16 pt-24 text-[#102a42]">
      <main className="mx-auto max-w-7xl px-5 lg:px-8">
        <Link href="/services/hotel-reservations" className="inline-flex items-center gap-2 text-sm font-semibold text-[#087fbe] transition hover:text-[#061f3b]"><ArrowLeft className="size-4" />Back to hotels</Link>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_470px]">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <img src={hotel.image} alt={hotel.name} className="h-[300px] w-full object-cover md:h-[380px]" />
            <div className="p-7 md:p-9">
              <p className="flex items-center gap-2 text-sm font-semibold text-[#087fbe]"><MapPin className="size-4" />{hotel.location}</p>
              <h1 className="mt-3 font-serif text-4xl leading-tight text-[#061f3b] md:text-5xl">{hotel.name}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">{hotel.description}</p>
            </div>
          </section>

          <form onSubmit={book} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(6,55,92,.12)] md:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[.22em] text-[#087fbe]">Hotel reservation</p>
            <h2 className="mt-2 font-serif text-3xl text-[#061f3b]">Booking details</h2>
            <p className="mt-3 text-sm text-black/45">Select your dates and number of rooms.</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Field label="Check-in" icon={<CalendarDays />}><input required type="date" min={minDate} value={stay.checkIn} onChange={(e) => { setStayValue("checkIn", e.target.value); if (stay.checkOut && e.target.value >= stay.checkOut) setStayValue("checkOut", ""); }} /></Field>
              <Field label="Check-out" icon={<CalendarDays />}><input required type="date" min={stay.checkIn || minDate} value={stay.checkOut} onChange={(e) => setStayValue("checkOut", e.target.value)} /></Field>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-bold text-[#456078]">Rooms</span>
              <select value={stay.rooms} onChange={(e) => setStayValue("rooms", Number(e.target.value))} className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-[#102a42] outline-none transition focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10">
                <option value={1}>1 room</option>
                <option value={2}>2 rooms</option>
                <option value={3}>3 rooms</option>
              </select>
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="TD tariff amount" icon={<IndianRupee />}><input type="number" min="0" step="1" inputMode="numeric" value={tariffDetails.tdTariffAmount} onChange={(e) => setTariffDetails((current) => ({ ...current, tdTariffAmount: e.target.value }))} placeholder="Amount as per TD tariff" /></Field>
              <Field label="Personal visit budget" icon={<IndianRupee />}><input type="number" min="0" step="1" inputMode="numeric" value={tariffDetails.personalVisitBudget} onChange={(e) => setTariffDetails((current) => ({ ...current, personalVisitBudget: e.target.value }))} placeholder="Enter personal budget" /></Field>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div><p className="text-sm font-bold text-[#061f3b]">Primary guest</p><p className="mt-1 text-xs text-slate-500">At least one guest is required for every booking request.</p></div>
              <div className="mt-5 space-y-4 border-t border-slate-200 pt-5">
                <Field label="Guest name" icon={<UserRound />}><input required minLength={2} value={guestDetails.name} onChange={(e) => setGuestDetails((current) => ({ ...current, name: e.target.value }))} placeholder="Full name" /></Field>
                <div className="grid grid-cols-2 gap-4">
                  <label><span className="mb-2 block text-xs font-bold text-[#456078]">Age</span><input required type="number" min={1} max={120} value={guestDetails.age} onChange={(e) => setGuestDetails((current) => ({ ...current, age: Number(e.target.value) }))} className="h-12 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold outline-none focus:border-[#13a5d8]" /></label>
                  <label><span className="mb-2 block text-xs font-bold text-[#456078]">Gender</span><select value={guestDetails.gender} onChange={(e) => setGuestDetails((current) => ({ ...current, gender: e.target.value }))} className="h-12 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold outline-none focus:border-[#13a5d8]"><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></label>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-semibold"><input type="checkbox" checked={preferences.laundry} onChange={(e) => setPreferences((current) => ({ ...current, laundry: e.target.checked }))} className="size-4 accent-[#087fbe]" />Laundry</label>
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-semibold"><input type="checkbox" checked={preferences.breakfast} onChange={(e) => setPreferences((current) => ({ ...current, breakfast: e.target.checked }))} className="size-4 accent-[#087fbe]" />Breakfast</label>
            </div>
            <label className="mt-4 block"><span className="mb-2 block text-xs font-bold text-[#456078]">Special request</span><textarea value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} rows={3} placeholder="For example: Near airport" className="w-full resize-none rounded-xl border border-black/10 p-3 text-sm outline-none focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10" /></label>
            <label className="mt-4 flex items-start gap-3 text-xs leading-5 text-slate-600"><input required type="checkbox" checked={consentToContact} onChange={(e) => setConsentToContact(e.target.checked)} className="mt-0.5 size-4 accent-[#087fbe]" /><span>I consent to being contacted about this booking request.</span></label>
            {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}
            <div className="mt-7 flex items-end justify-between gap-5 rounded-2xl bg-[#eaf6fb] p-5">
              <div><p className="text-xs text-black/40">{nights} night(s) · {stay.rooms} room(s)</p><p className="mt-1 text-2xl font-extrabold text-[#061f3b]">{hotel.price && total ? money(total) : "Price on confirmation"}</p></div>
              <Check className="size-6 text-[#13a5d8]" />
            </div>
            <button disabled={loading || resolvingService} className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 py-4 font-bold text-white shadow-[0_14px_30px_rgba(8,127,190,.25)] transition hover:-translate-y-0.5 disabled:opacity-60">{resolvingService ? "Loading service..." : loading ? "Confirming..." : "Book hotel"}<ChevronRight className="size-5" /></button>
            <p className="mt-4 text-center text-[11px] text-black/35">Your request is protected and reviewed by our travel desk.</p>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-[#456078]">{label}</span><span className="flex h-12 items-center gap-3 rounded-xl border border-black/10 bg-white px-4 text-black/30 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10 [&_input]:h-full [&_input]:min-w-0 [&_input]:flex-1 [&_input]:bg-transparent [&_input]:text-sm [&_input]:text-[#102a42] [&_input]:outline-none">{icon}{children}</span></label>;
}

function Success({ hotel, reference }: { hotel: string; reference: string }) {
  return <div className="grid min-h-screen place-items-center bg-[#071b2f] px-5 py-24"><section className="w-full max-w-lg rounded-[2.25rem] bg-white p-8 text-center shadow-2xl md:p-12"><span className="mx-auto grid size-24 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="size-12" /></span><p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-emerald-600">Booking submitted</p><h1 className="mt-3 font-serif text-4xl text-[#061f3b]">Your stay is requested</h1><p className="mt-4 text-sm leading-7 text-black/50">Your request for {hotel} is confirmed with reference <b className="text-[#087fbe]">{reference}</b>.</p><Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#061f3b] px-8 py-3.5 font-bold text-white">Return home<ChevronRight className="size-4" /></Link></section></div>;
}

export default function HotelBookingPage() { return <Suspense fallback={<GlobalPageSkeleton />}><BookingFlow /></Suspense>; }
