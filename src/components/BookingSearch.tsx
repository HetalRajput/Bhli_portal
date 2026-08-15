"use client";

import {
  AlertCircle,
  ArrowRight,
  Building2,
  Bus,
  CalendarDays,
  Car,
  Coins,
  Compass,
  Map,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  Ship,
  Ticket,
  Train,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

const options = [
  { value: "hotels", label: "Hotel reservations", Icon: Building2, href: "/services/hotel-reservations" },
  { value: "flights", label: "Flight bookings", Icon: Plane, href: "/services/flight-booking" },
  { value: "trains", label: "Train tickets", Icon: Train, href: "/services/train-ticket-booking" },
  { value: "buses", label: "Bus tickets", Icon: Bus, href: "/services/bus-ticket-booking" },
  { value: "taxis", label: "Taxi services", Icon: Car, href: "/services/taxi-services" },
  { value: "self-drive", label: "Self-drive rentals", Icon: Car, href: "/services/self-drive-car-rentals" },
  { value: "holidays", label: "Holiday packages", Icon: Map, href: "/services/holiday-packages" },
  { value: "cruises", label: "Cruise holidays", Icon: Ship, href: "/services/cruise-holidays" },
  { value: "visa", label: "Visa assistance", Icon: Ticket, href: "/services/visa-assistance" },
  { value: "insurance", label: "Travel insurance", Icon: ShieldCheck, href: "/services/travel-insurance" },
  { value: "currency", label: "Currency exchange", Icon: Coins, href: "/services/currency-exchange" },
  { value: "events", label: "Event management", Icon: CalendarDays, href: "/services/event-management" },
  { value: "catering", label: "Catering services", Icon: UtensilsCrossed, href: "/services/catering-services" },
  { value: "consultancy", label: "Travel consultancy", Icon: Compass, href: "/services/travel-consultancy" },
] as const;

type SearchType = (typeof options)[number]["value"];

const searchCopy: Partial<Record<SearchType, { prompt: string; placeholder: string }>> = {
  hotels: { prompt: "Where do you want to stay?", placeholder: "Try Bengaluru, Goa or a hotel name" },
  flights: { prompt: "Where do you want to fly?", placeholder: "Enter a city or airport" },
  trains: { prompt: "Where do you want to travel?", placeholder: "Enter a city or railway station" },
  buses: { prompt: "Where do you want to travel?", placeholder: "Enter a city or bus station" },
  taxis: { prompt: "Where should we pick you up?", placeholder: "Enter a pickup city or location" },
  "self-drive": { prompt: "Where do you need a car?", placeholder: "Enter a pickup city or location" },
  holidays: { prompt: "Where would you like to holiday?", placeholder: "Enter a destination" },
  cruises: { prompt: "Where would you like to cruise?", placeholder: "Enter a destination or departure port" },
  visa: { prompt: "Which country are you visiting?", placeholder: "Enter a destination country" },
  insurance: { prompt: "Where are you travelling?", placeholder: "Enter a destination country" },
  currency: { prompt: "Where do you need currency?", placeholder: "Enter a city or currency" },
  events: { prompt: "Where is your event?", placeholder: "Enter an event city or venue" },
  catering: { prompt: "Where do you need catering?", placeholder: "Enter an event city or venue" },
  consultancy: { prompt: "Where do you need assistance?", placeholder: "Enter a city or destination" },
};

export default function BookingSearch({
  initialType = "hotels",
  initialDestination = "",
  compact = false,
}: {
  initialType?: SearchType;
  initialDestination?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [type, setType] = useState<SearchType>(initialType);
  const [destination, setDestination] = useState(initialDestination);
  const [error, setError] = useState("");
  const serviceTabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => setError(""), 3000);
    return () => window.clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    const tabs = serviceTabsRef.current;
    if (!tabs || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let returnTimer: number | undefined;
    const peekTimer = window.setTimeout(() => {
      const availableScroll = tabs.scrollWidth - tabs.clientWidth;
      if (availableScroll <= 0) return;
      tabs.scrollTo({ left: Math.min(160, availableScroll), behavior: "smooth" });
      returnTimer = window.setTimeout(() => tabs.scrollTo({ left: 0, behavior: "smooth" }), 900);
    }, 650);

    const cancelPeek = () => {
      window.clearTimeout(peekTimer);
      if (returnTimer !== undefined) window.clearTimeout(returnTimer);
    };
    tabs.addEventListener("pointerdown", cancelPeek, { once: true });
    tabs.addEventListener("wheel", cancelPeek, { once: true });

    return () => {
      cancelPeek();
      tabs.removeEventListener("pointerdown", cancelPeek);
      tabs.removeEventListener("wheel", cancelPeek);
    };
  }, []);

  const selectedService = options.find((option) => option.value === type) ?? options[0];
  const copy = searchCopy[type] ?? { prompt: "Where do you need this service?", placeholder: "Enter a city or destination" };

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!destination.trim()) {
      setError("Please enter a destination to continue.");
      return;
    }

    setError("");
    const targetUrl = `${selectedService.href}?destination=${encodeURIComponent(destination.trim())}`;
    if (type === "flights" && (!window.localStorage.getItem("access_token") || !window.localStorage.getItem("bhli-auth"))) {
      router.push(`/login?redirect=${encodeURIComponent(targetUrl)}`);
      return;
    }
    router.push(targetUrl);
  }

  return (
    <div className="search-glow relative rounded-[1.7rem] p-[2px]">
      <form onSubmit={submit} noValidate className={`relative z-10 rounded-[1.6rem] bg-white ${compact ? "p-4" : "p-5 sm:p-7"} shadow-2xl shadow-[#061f3b]/15`}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#087fbe]">Book your journey</p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-[#122b42] sm:text-2xl">What are you looking for?</h2>
          </div>
          <span className="hidden rounded-full bg-[#edf4ff] px-3 py-1.5 text-xs font-semibold text-[#145ea8] sm:block">All travel, One search</span>
        </div>

        <div ref={serviceTabsRef} role="tablist" aria-label="Booking service" className="flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain px-1 py-2 pb-3 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {options.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={type === value}
              onClick={() => {
                setType(value);
                if (error) setError("");
              }}
              className={`group flex min-w-fit items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${type === value ? "border-[#11a3d7] bg-[#061f3b] text-white shadow-[0_8px_24px_rgba(7,21,45,.22)]" : "border-black/8 bg-[#f3f8fc] text-[#344a5c] hover:border-[#11a3d7]/60 hover:bg-white hover:shadow-md"}`}
            >
              <Icon aria-hidden="true" className={`size-4 shrink-0 transition-transform duration-300 ${type === value ? "text-[#11a3d7]" : "text-[#087fbe] group-hover:scale-110"}`} />
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-[1.35rem] border border-[#087fbe]/15 bg-gradient-to-r from-[#f5fbff] to-white p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_12px_35px_rgba(6,64,105,.08)] transition duration-300 focus-within:border-[#11a3d7]/70 focus-within:shadow-[0_0_0_5px_rgba(17,163,215,.11),0_16px_40px_rgba(6,64,105,.13)]">
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <label className="group flex min-w-0 items-center gap-4 rounded-2xl px-3 py-3 sm:px-4">
              <span className={`relative grid size-12 shrink-0 place-items-center rounded-xl shadow-sm transition-all duration-500 group-focus-within:scale-105 ${destination.trim() ? "bg-gradient-to-br from-[#dff3fb] to-[#bfe8f7] text-[#061f3b] shadow-[0_8px_20px_rgba(6,31,59,.14)]" : "bg-gradient-to-br from-[#0875b7] to-[#08a3d8] text-white"}`}>
                <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-[#087fbe]/10" />
                <MapPin className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-[.16em] text-[#087fbe]/75">{copy.prompt}</span>
                <input
                  autoFocus={compact}
                  autoComplete="off"
                  value={destination}
                  onChange={(event) => {
                    setDestination(event.target.value);
                    if (error) setError("");
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "destination-error" : undefined}
                  aria-label={`${selectedService.label} destination`}
                  placeholder={copy.placeholder}
                  className="mt-1 w-full bg-transparent text-base font-semibold text-[#122b42] outline-none placeholder:font-normal placeholder:text-[#6f8494]/65 sm:text-lg"
                />
              </span>
              {destination && (
                <button type="button" onClick={() => setDestination("")} aria-label="Clear destination" className="grid size-8 shrink-0 place-items-center rounded-full text-[#607789] transition hover:bg-[#e5f5fc] hover:text-[#087fbe]">
                  <X className="size-4" />
                </button>
              )}
            </label>
            <button type="submit" className="group relative flex min-h-16 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0875b7] via-[#0997cc] to-[#08a9da] px-7 font-bold text-white shadow-[0_10px_28px_rgba(8,126,186,.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_36px_rgba(8,126,186,.42)] focus:outline-none focus:ring-4 focus:ring-[#11a3d7]/25 sm:min-w-40">
              <span className="absolute -left-16 top-0 h-full w-12 -skew-x-12 bg-white/30 blur-sm transition-transform duration-700 group-hover:translate-x-[250px]" />
              <Search className="relative size-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
              <span className="relative">Search</span>
              <ArrowRight className="relative size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {error && (
          <div id="destination-error" role="alert" className="mt-3 inline-flex animate-[validation-chip_.35s_cubic-bezier(.22,1,.36,1)] items-center gap-2 rounded-full border border-[#dc4a4a]/20 bg-white px-3.5 py-2 text-xs font-semibold text-[#a72e2e] shadow-[0_8px_22px_rgba(130,35,35,.12)]">
            <span className="grid size-5 place-items-center rounded-full bg-[#dc4a4a]/10"><AlertCircle className="size-3.5" /></span>
            Enter a destination
            <span className="ml-1 h-1 w-8 overflow-hidden rounded-full bg-[#dc4a4a]/10"><span className="block h-full origin-left animate-[chip-timer_3s_linear_forwards] rounded-full bg-[#dc4a4a]/50" /></span>
          </div>
        )}

        <p className="mt-3 flex items-center gap-2 text-xs text-black/40"><span className="inline-block size-1.5 rounded-full bg-[#11a3d7]" />Select a service, enter a destination, then press Enter or click Search.</p>
      </form>
    </div>
  );
}
