"use client";

import { Suspense, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Check, CheckCircle2, ChevronRight, MapPin, UserRound } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { bookingService } from "@/lib/api/bookings";
import { getErrorMessage } from "@/lib/api/client";

const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
const localToday = () => { const date = new Date(); date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); return date.toISOString().slice(0, 10); };

function BookingFlow() {
  const params = useSearchParams();
  const hotel = {
    id: params.get("id") || "",
    name: params.get("name") || "Selected Hotel",
    location: params.get("location") || "India",
    image: params.get("image") || "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1400",
    description: params.get("description") || "A thoughtfully selected stay with comfort, service and effortless booking.",
    price: Number(params.get("price")) || 0,
  };
  const [stay, setStay] = useState({ checkIn: "", checkOut: "", rooms: 1 });
  const [includeGuestDetails, setIncludeGuestDetails] = useState(false);
  const [guestDetails, setGuestDetails] = useState({ name: "", adults: 1, children: 0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState("");
  const minDate = localToday();
  const nights = useMemo(() => stay.checkIn && stay.checkOut ? Math.max(0, Math.ceil((new Date(stay.checkOut).getTime() - new Date(stay.checkIn).getTime()) / 86400000)) : 0, [stay.checkIn, stay.checkOut]);
  const total = hotel.price * nights * stay.rooms;
  const setStayValue = (key: keyof typeof stay, value: string | number) => setStay((current) => ({ ...current, [key]: value }));

  async function book(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!stay.checkIn || !stay.checkOut || nights < 1) return setError("Select a valid check-in and check-out date.");
    setLoading(true);
    const payload = { hotel_id: hotel.id || undefined, hotel_name: hotel.name, location: hotel.location, check_in_date: stay.checkIn, check_out_date: stay.checkOut, number_of_rooms: stay.rooms, guest_details: includeGuestDetails ? { name: guestDetails.name.trim(), adults: guestDetails.adults, children: guestDetails.children } : undefined, estimated_total: total || undefined };
    try {
      const result = await bookingService.createHotelBooking(payload);
      const code = result?.booking_reference || result?.reference || `BH${Date.now().toString().slice(-8)}`;
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

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              <Field label="Check-in" icon={<CalendarDays />}><input required type="date" min={minDate} value={stay.checkIn} onChange={(e) => { setStayValue("checkIn", e.target.value); if (stay.checkOut && e.target.value >= stay.checkOut) setStayValue("checkOut", ""); }} /></Field>
              <Field label="Check-out" icon={<CalendarDays />}><input required type="date" min={stay.checkIn || minDate} value={stay.checkOut} onChange={(e) => setStayValue("checkOut", e.target.value)} /></Field>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-bold text-[#456078]">Rooms</span>
              <select value={stay.rooms} onChange={(e) => setStayValue("rooms", Number(e.target.value))} className="h-14 w-full rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-[#102a42] outline-none transition focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10">
                <option value={1}>1 room</option>
                <option value={2}>2 rooms</option>
                <option value={3}>3 rooms</option>
              </select>
            </label>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between gap-4">
                <div><p className="text-sm font-bold text-[#061f3b]">Guest details</p><p className="mt-1 text-xs text-slate-500">Add guest information only if required.</p></div>
                <button type="button" role="switch" aria-checked={includeGuestDetails} onClick={() => { setIncludeGuestDetails((value) => !value); setError(""); }} className={`relative h-7 w-12 shrink-0 rounded-full transition ${includeGuestDetails ? "bg-[#087fbe]" : "bg-slate-300"}`}><span className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-all ${includeGuestDetails ? "left-6" : "left-1"}`} /></button>
              </div>
              {includeGuestDetails && <div className="mt-5 space-y-4 border-t border-slate-200 pt-5">
                <Field label="Guest name" icon={<UserRound />}><input required minLength={2} value={guestDetails.name} onChange={(e) => setGuestDetails((current) => ({ ...current, name: e.target.value }))} placeholder="Full name" /></Field>
                <div className="grid grid-cols-2 gap-4">
                  <label><span className="mb-2 block text-xs font-bold text-[#456078]">Adults</span><select value={guestDetails.adults} onChange={(e) => setGuestDetails((current) => ({ ...current, adults: Number(e.target.value) }))} className="h-12 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold outline-none focus:border-[#13a5d8]">{[1,2,3,4,5,6].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
                  <label><span className="mb-2 block text-xs font-bold text-[#456078]">Children</span><select value={guestDetails.children} onChange={(e) => setGuestDetails((current) => ({ ...current, children: Number(e.target.value) }))} className="h-12 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold outline-none focus:border-[#13a5d8]">{[0,1,2,3,4].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
                </div>
              </div>}
            </div>            {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>}
            <div className="mt-7 flex items-end justify-between gap-5 rounded-2xl bg-[#eaf6fb] p-5">
              <div><p className="text-xs text-black/40">{nights} night(s) · {stay.rooms} room(s)</p><p className="mt-1 text-2xl font-extrabold text-[#061f3b]">{hotel.price && total ? money(total) : "Price on confirmation"}</p></div>
              <Check className="size-6 text-[#13a5d8]" />
            </div>
            <button disabled={loading} className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 py-4 font-bold text-white shadow-[0_14px_30px_rgba(8,127,190,.25)] transition hover:-translate-y-0.5 disabled:opacity-60">{loading ? "Confirming..." : "Book hotel"}<ChevronRight className="size-5" /></button>
            <p className="mt-4 text-center text-[11px] text-black/35">Your request is protected and reviewed by our travel desk.</p>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-[#456078]">{label}</span><span className="flex h-14 items-center gap-3 rounded-xl border border-black/10 bg-white px-4 text-black/30 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10 [&_input]:h-full [&_input]:min-w-0 [&_input]:flex-1 [&_input]:bg-transparent [&_input]:text-sm [&_input]:text-[#102a42] [&_input]:outline-none">{icon}{children}</span></label>;
}

function Success({ hotel, reference }: { hotel: string; reference: string }) {
  return <div className="grid min-h-screen place-items-center bg-[#071b2f] px-5 py-24"><section className="w-full max-w-lg rounded-[2.25rem] bg-white p-8 text-center shadow-2xl md:p-12"><span className="mx-auto grid size-24 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="size-12" /></span><p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-emerald-600">Booking submitted</p><h1 className="mt-3 font-serif text-4xl text-[#061f3b]">Your stay is requested</h1><p className="mt-4 text-sm leading-7 text-black/50">Your request for {hotel} is confirmed with reference <b className="text-[#087fbe]">{reference}</b>.</p><Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#061f3b] px-8 py-3.5 font-bold text-white">Return home<ChevronRight className="size-4" /></Link></section></div>;
}

export default function HotelBookingPage() { return <Suspense fallback={<div className="min-h-screen bg-[#071b2f]" />}><BookingFlow /></Suspense>; }
