"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  CloudSun,
  Filter,
  LoaderCircle,
  Minus,
  Moon,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Plus,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sunrise,
  Sunset,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { airportOptions } from "@/lib/airports";
import {
  type FlightBookingPayload,
  type FlightCabin,
  type FlightPassengerPayload,
  type FlightSearchPayload,
  type PassengerType,
} from "@/lib/api/flights";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAirportsQuery, useServiceQuery } from "@/store/websiteApi";
import {
  clearFlightError,
  clearSearch,
  clearSelectedFare,
  loadFlightFare,
  resetFlightBooking,
  searchFlights as searchFlightsRequest,
  submitFlightBooking,
  type JsonRecord,
} from "@/store/flightBookingSlice";

type SearchForm = {
  trip_type: "0" | "1";
  service_type: "1" | "2";
  dep_city: string;
  arr_city: string;
  on_date: string;
  re_date: string;
  adults: string;
  children: string;
  infants: string;
  cabin: FlightCabin;
};

type PassengerForm = FlightPassengerPayload;

const cabinOptions: Array<[FlightCabin, string]> = [
  ["E", "Economy"],
  ["P", "Premium economy"],
  ["B", "Business"],
  ["F", "First class"],
];

const dateAfter = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

const asRecord = (value: unknown): JsonRecord | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;

const stringValue = (record: JsonRecord | null, keys: string[], fallback = "") => {
  if (!record) return fallback;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return fallback;
};

const firstArray = (record: JsonRecord | null, keys: string[]) => {
  if (!record) return [] as unknown[];
  for (const key of keys) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
  }
  return [] as unknown[];
};

function onwardDetails(flight: JsonRecord) {
  const flights = asRecord(flight.Flights) || asRecord(flight.flights);
  const onward = asRecord(flights?.Onward) || asRecord(flights?.onward) || asRecord(flight.onward);
  const keyedSegments = onward
    ? Object.entries(onward)
        .filter(([key, value]) => /^\d+$/.test(key) && Boolean(asRecord(value)))
        .sort(([left], [right]) => Number(left) - Number(right))
        .map(([, value]) => asRecord(value) as JsonRecord)
    : [];
  const arraySegments = firstArray(flight, ["segments", "segment", "legs", "itinerary"])
    .map(asRecord)
    .filter((item): item is JsonRecord => Boolean(item));
  return { onward, segments: keyedSegments.length ? keyedSegments : arraySegments };
}

function firstSegment(flight: JsonRecord) {
  return onwardDetails(flight).segments[0] || flight;
}

function flightIdentity(flight: JsonRecord, fallback: string) {
  const segment = firstSegment(flight);
  return stringValue(
    segment,
    ["flightID", "flightId", "flight_id", "id", "resultIndex", "key"],
    stringValue(flight, ["flightID", "flightId", "flight_id", "id"], fallback),
  );
}

function nestedLabel(value: unknown) {
  if (typeof value === "string") return value;
  const item = asRecord(value);
  return stringValue(item, ["name", "city", "code", "airportCode", "airport"], "");
}

function formatProviderDate(value: string) {
  if (!/^\d{12}$/.test(value)) return { time: value || "Time on selection", date: "" };
  const year = value.slice(0, 4);
  const monthIndex = Number(value.slice(4, 6)) - 1;
  const day = value.slice(6, 8);
  const hour = Number(value.slice(8, 10));
  const minute = value.slice(10, 12);
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][monthIndex] || "";
  const displayHour = hour % 12 || 12;
  return {
    time: `${displayHour}:${minute} ${hour >= 12 ? "PM" : "AM"}`,
    date: `${day} ${month} ${year}`,
  };
}

function formatDuration(value: string) {
  const minutes = Number(value);
  if (!Number.isFinite(minutes) || minutes <= 0) return value;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours ? `${hours}h ` : ""}${remaining ? `${remaining}m` : ""}`.trim();
}

function cleanBaggage(value: string) {
  return value.replace(/\|+/g, " ").replace(/\s+/g, " ").trim();
}

function getFlightSummary(flight: JsonRecord, index: number) {
  const { onward, segments } = onwardDetails(flight);
  const first = segments[0] || flight;
  const last = segments.at(-1) || first;
  const airlineValue = first.airline ?? flight.airline;
  const airline =
    stringValue(first, ["airName", "airNameOp"], "") ||
    nestedLabel(airlineValue) ||
    stringValue(first, ["airlineName", "carrierName", "carrier", "airline_name"], `Flight option ${index + 1}`);
  const airlineCode = stringValue(first, ["airCode", "airCodeOp"], "");
  const flightNo = stringValue(first, ["flightNo", "flightNumber", "flight_no", "number"], "");
  const flightNumber = `${airlineCode} ${flightNo}`.trim() || "Flight details";
  const fromCode = stringValue(first, ["depCode", "departure_code"], "");
  const fromCity = stringValue(first, ["depCName", "depCity", "departureAirport"], "Departure");
  const toCode = stringValue(last, ["arrCode", "arrival_code"], "");
  const toCity = stringValue(last, ["arrCName", "arrCity", "arrivalAirport"], "Arrival");
  const departureInfo = formatProviderDate(stringValue(first, ["depDate", "departureTime", "depTime", "departure"], ""));
  const arrivalInfo = formatProviderDate(stringValue(last, ["arrDate", "arrivalTime", "arrTime", "arrival"], ""));
  const stopCount = stringValue(onward, ["stops"], String(Math.max(segments.length - 1, 0)));
  const stopLabel = stopCount === "0" ? "Non-stop" : `${stopCount} stop${stopCount === "1" ? "" : "s"}`;
  const totalDuration = formatDuration(stringValue(onward, ["durTotal"], stringValue(first, ["duration"], "")));
  const fare = asRecord(flight.Fare) || asRecord(flight.fare) || asRecord(flight.price) || {};
  const fareTotal = asRecord(fare.total) || fare;
  const price = stringValue(fareTotal, ["total", "totalFare", "grandTotal", "amount", "price", "netFare"], "");
  const refundType = stringValue(fare, ["refundType"], "");
  const refundability = refundType === "N" ? "Non-refundable" : refundType === "P" ? "Partially refundable" : refundType ? "Refundable" : "";

  return {
    airline,
    flightNumber,
    from: `${fromCity}${fromCode ? ` (${fromCode})` : ""}`,
    to: `${toCity}${toCode ? ` (${toCode})` : ""}`,
    departure: departureInfo.time,
    departureDate: departureInfo.date,
    arrival: arrivalInfo.time,
    arrivalDate: arrivalInfo.date,
    duration: [totalDuration, stopLabel].filter(Boolean).join(" · "),
    stops: stopCount,
    price,
    fareType: stringValue(fare, ["fareTypeDesc"], ""),
    checkInBaggage: cleanBaggage(stringValue(fare, ["bagCkin"], "")),
    cabinBaggage: cleanBaggage(stringValue(fare, ["bagCbin"], "")),
    refundability,
    segmentCount: segments.length,
    airlineCode,
    fromCode,
    toCode,
  };
}

function minutesFromTime(value: string) {
  const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return -1;
  let hour = Number(match[1]);
  if (match[3]) {
    if (hour === 12) hour = 0;
    if (match[3].toUpperCase() === "PM") hour += 12;
  }
  return hour * 60 + Number(match[2]);
}

function dateLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(date);
}

function shiftDate(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}
function findPrice(value: unknown, depth = 0): number | null {
  if (depth > 4) return null;
  const record = asRecord(value);
  if (!record) return null;
  for (const key of ["total", "grandTotal", "totalFare", "netFare", "amount", "price"]) {
    const candidate = record[key];
    if (typeof candidate === "number" && candidate > 0) return candidate;
    if (typeof candidate === "string" && Number(candidate) > 0) return Number(candidate);
  }
  for (const nested of Object.values(record)) {
    const result = findPrice(nested, depth + 1);
    if (result) return result;
  }
  return null;
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const hasLoginSession = () =>
  Boolean(window.localStorage.getItem("access_token") && window.localStorage.getItem("bhli-auth"));

function makePassenger(type: PassengerType): PassengerForm {
  return {
    title: type === "A" ? "Mr" : "Master",
    first_name: "",
    last_name: "",
    passenger_type: type,
    gender: "M",
    date_of_birth: "",
    passport_number: "",
    passport_issue_date: null,
    passport_expiry_date: null,
    passport_nationality: "",
  };
}

function buildPassengers(form: SearchForm) {
  return [
    ...Array.from({ length: Number(form.adults) }, () => makePassenger("A")),
    ...Array.from({ length: Number(form.children) }, () => makePassenger("C")),
    ...Array.from({ length: Number(form.infants) }, () => makePassenger("I")),
  ];
}

export default function FlightBookingFlow() {
  const dispatch = useAppDispatch();
  const params = useSearchParams();
  const router = useRouter();
  const requestedDestination = params.get("destination")?.toUpperCase() || "";
  const [form, setForm] = useState<SearchForm>({
    trip_type: "0",
    service_type: "1",
    dep_city: "",
    arr_city: /^[A-Z]{3}$/.test(requestedDestination) ? requestedDestination : "",
    on_date: dateAfter(1),
    re_date: dateAfter(4),
    adults: "1",
    children: "0",
    infants: "0",
    cabin: "E",
  });
  const [passengers, setPassengers] = useState<PassengerForm[]>([]);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Please book this flight.");
  const [pan, setPan] = useState("");
  const [includeGst, setIncludeGst] = useState(false);
  const [gst, setGst] = useState({ gstNo: "", gstCompany: "", gstEmail: "", gstMobile: "", gstAddress: "" });
  const [validationError, setValidationError] = useState("");
  const [fareCategory, setFareCategory] = useState<"regular" | "student" | "senior">("regular");
  const [sortBy, setSortBy] = useState("price-asc");
  const [stopFilters, setStopFilters] = useState<string[]>([]);
  const [airlineFilters, setAirlineFilters] = useState<string[]>([]);
  const [departureBand, setDepartureBand] = useState("");
  const [arrivalBand, setArrivalBand] = useState("");
  const [flightQuery, setFlightQuery] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const { data: flightServiceRecord } = useServiceQuery("flight-booking");
  const flightServiceId = flightServiceRecord?.id ?? null;
  const {
    searchContext,
    selectedFare,
    bookingResult,
    searchStatus,
    bookingStatus,
    loadingFareId,
    error: requestError,
  } = useAppSelector((state) => state.flightBooking);
  const error = validationError || requestError;

  const updateForm = (key: keyof SearchForm, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  function validateSearch() {
    if (!/^[A-Z]{3}$/.test(form.dep_city)) return "Enter a valid 3-letter departure airport code.";
    if (!/^[A-Z]{3}$/.test(form.arr_city)) return "Enter a valid 3-letter arrival airport code.";
    if (form.dep_city === form.arr_city) return "Departure and arrival airports must be different.";
    if (!form.on_date) return "Choose a departure date.";
    if (form.trip_type === "1" && !form.re_date) return "Choose a return date for the round trip.";
    if (form.trip_type === "1" && form.re_date < form.on_date) return "Return date cannot be before departure date.";
    if (Number(form.adults) < 1) return "At least one adult is required.";
    if (Number(form.infants) > Number(form.adults)) return "Infants cannot exceed the number of adults.";
    if (Number(form.adults) + Number(form.children) + Number(form.infants) > 9) return "A maximum of 9 passengers can be searched together.";
    return "";
  }

  async function searchFlights(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateSearch();
    if (validation) return setValidationError(validation);

    const payload: FlightSearchPayload = {
      trip_type: Number(form.trip_type) as 0 | 1,
      service_type: Number(form.service_type) as 1 | 2,
      dep_city: form.dep_city,
      arr_city: form.arr_city,
      on_date: form.on_date,
      re_date: form.trip_type === "1" ? form.re_date : null,
      adults: Number(form.adults),
      children: Number(form.children),
      infants: Number(form.infants),
      cabin: form.cabin,
      fare_type: "A",
    };

    setValidationError("");
    dispatch(clearFlightError());
    try {
      await dispatch(searchFlightsRequest(payload)).unwrap();
      setPassengers(buildPassengers(form));
      window.setTimeout(() => document.getElementById("flight-results")?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch { /* The slice exposes a user-friendly request error. */ }
  }

  async function searchAnotherDate(date: string) {
    const nextForm = { ...form, on_date: date };
    setForm(nextForm);
    dispatch(clearSelectedFare());
    dispatch(clearFlightError());
    const payload: FlightSearchPayload = {
      trip_type: Number(nextForm.trip_type) as 0 | 1,
      service_type: Number(nextForm.service_type) as 1 | 2,
      dep_city: nextForm.dep_city,
      arr_city: nextForm.arr_city,
      on_date: date,
      re_date: nextForm.trip_type === "1" ? nextForm.re_date : null,
      adults: Number(nextForm.adults),
      children: Number(nextForm.children),
      infants: Number(nextForm.infants),
      cabin: nextForm.cabin,
      fare_type: "A",
    };
    try {
      await dispatch(searchFlightsRequest(payload)).unwrap();
    } catch { /* The slice exposes a user-friendly request error. */ }
  }

  async function selectFlight(flight: JsonRecord, index: number) {
    if (!searchContext) return;
    const searchFlightId = flightIdentity(flight, searchContext.fallbackFlightId);
    if (!searchFlightId) return setValidationError("This result does not contain a selectable flight ID.");

    setValidationError("");
    dispatch(clearFlightError());
    try {
      await dispatch(loadFlightFare({ refId: searchContext.refId, searchFlightId, flight })).unwrap();
      window.setTimeout(() => document.getElementById("traveller-details")?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch { /* The slice exposes a user-friendly request error. */ }
    void index;
  }

  const updatePassenger = (index: number, key: keyof PassengerForm, value: string | null) =>
    setPassengers((current) =>
      current.map((passenger, passengerIndex) =>
        passengerIndex === index ? { ...passenger, [key]: value } : passenger,
      ),
    );

  function validatePassengers() {
    for (let index = 0; index < passengers.length; index += 1) {
      const passenger = passengers[index];
      if (!passenger.first_name.trim() || !passenger.last_name.trim()) return `Enter the full name for passenger ${index + 1}.`;
      if (!passenger.date_of_birth) return `Enter the date of birth for passenger ${index + 1}.`;
      if (form.service_type === "2") {
        if (!passenger.passport_number.trim()) return `Enter the passport number for passenger ${index + 1}.`;
        if (!passenger.passport_issue_date || !passenger.passport_expiry_date || !passenger.passport_nationality.trim()) {
          return `Complete the passport details for passenger ${index + 1}.`;
        }
      }
    }
    if (mobile && !/^\d{10,15}$/.test(mobile)) return "Enter a valid contact mobile number.";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid contact email address.";
    if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return "Enter a valid PAN number.";
    if (includeGst && Object.values(gst).some((value) => !value.trim())) return "Complete every GST field or turn off GST details.";
    return "";
  }

  async function bookFlight(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!searchContext || !selectedFare) return;
    const validation = validatePassengers();
    if (validation) return setValidationError(validation);
    if (!hasLoginSession()) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    const payload: FlightBookingPayload = {
      service: flightServiceId || 0,
      search_session: searchContext.searchSession,
      ref_id: searchContext.refId,
      flight_id: selectedFare.bookingFlightId,
      message: message.trim() || "Please book this flight.",
      passengers,
    };
    if (!flightServiceId) return setValidationError("The Flight Booking service is unavailable. Please refresh and try again.");
    if (mobile) payload.mobile = mobile;
    if (email) payload.email = email;
    if (pan) payload.first_pax_pan_no = pan;
    if (includeGst) payload.gst = gst;

    setValidationError("");
    dispatch(clearFlightError());
    try {
      await dispatch(submitFlightBooking(payload)).unwrap();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch { /* The slice exposes a user-friendly request error. */ }
  }

  if (bookingResult) {
    const pnr = stringValue(bookingResult, ["pnr"], "Pending");
    const ticket = stringValue(bookingResult, ["ticket_number", "ticketNumber"], "Will be shared shortly");
    const status = stringValue(bookingResult, ["status", "booking_status"], "confirmed");
    return (
      <main className="grid min-h-screen place-items-center bg-[#edf5f9] px-4 py-10 sm:px-5 sm:py-16 text-[#122b42]">
        <section className="w-full max-w-2xl rounded-[1.5rem] bg-white p-6 text-center shadow-[0_28px_90px_rgba(6,31,59,.16)] sm:rounded-[2rem] sm:p-12">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-10" />
          </span>
          <p className="mt-7 text-[11px] font-extrabold uppercase tracking-[.24em] text-[#087fbe]">Booking successful</p>
          <h1 className="mt-3 font-serif text-3xl text-[#061f3b] sm:text-5xl">Your flight is booked</h1>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <ResultFact label="PNR" value={pnr} />
            <ResultFact label="Ticket" value={ticket} />
            <ResultFact label="Status" value={status} />
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/profile" className="rounded-xl bg-[#061f3b] px-6 py-3.5 text-sm font-bold text-white">View my bookings</Link>
            <button type="button" onClick={() => { dispatch(resetFlightBooking()); setValidationError(""); }} className="rounded-xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-[#087fbe]">Book another flight</button>
          </div>
        </section>
      </main>
    );
  }

  const verifiedPrice = selectedFare ? findPrice(selectedFare.priceDetails) : null;
  const allFlightRows = (searchContext?.flights || []).map((flight, index) => ({
    flight,
    index,
    summary: getFlightSummary(flight, index),
  }));
  const airlineOptions = Array.from(new Set(allFlightRows.map(({ summary }) => summary.airline))).sort();
  const filteredFlightRows = allFlightRows
    .filter(({ summary }) => !stopFilters.length || stopFilters.includes(summary.stops === "0" ? "0" : summary.stops === "1" ? "1" : "2"))
    .filter(({ summary }) => !airlineFilters.length || airlineFilters.includes(summary.airline))
    .filter(({ summary }) => !flightQuery || `${summary.airline} ${summary.flightNumber}`.toLowerCase().includes(flightQuery.toLowerCase()))
    .filter(({ summary }) => {
      const departureMinutes = minutesFromTime(summary.departure);
      if (!departureBand || departureMinutes < 0) return true;
      if (departureBand === "early") return departureMinutes < 360;
      if (departureBand === "morning") return departureMinutes >= 360 && departureMinutes < 720;
      if (departureBand === "afternoon") return departureMinutes >= 720 && departureMinutes < 1080;
      return departureMinutes >= 1080;
    })
    .filter(({ summary }) => {
      const arrivalMinutes = minutesFromTime(summary.arrival);
      if (!arrivalBand || arrivalMinutes < 0) return true;
      if (arrivalBand === "early") return arrivalMinutes < 360;
      if (arrivalBand === "morning") return arrivalMinutes >= 360 && arrivalMinutes < 720;
      if (arrivalBand === "afternoon") return arrivalMinutes >= 720 && arrivalMinutes < 1080;
      return arrivalMinutes >= 1080;
    })
    .sort((left, right) => {
      const leftPrice = Number(left.summary.price) || Number.MAX_SAFE_INTEGER;
      const rightPrice = Number(right.summary.price) || Number.MAX_SAFE_INTEGER;
      if (sortBy === "price-desc") return rightPrice - leftPrice;
      if (sortBy === "departure") return minutesFromTime(left.summary.departure) - minutesFromTime(right.summary.departure);
      if (sortBy === "duration") return Number(stringValue(firstSegment(left.flight), ["durTotal", "duration"], "99999")) - Number(stringValue(firstSegment(right.flight), ["durTotal", "duration"], "99999"));
      return leftPrice - rightPrice;
    });

  const resetFilters = () => {
    setStopFilters([]);
    setAirlineFilters([]);
    setDepartureBand("");
    setArrivalBand("");
    setFlightQuery("");
  };

  const toggleListValue = (value: string, values: string[], setter: (values: string[]) => void) =>
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);

  async function shareSearch() {
    const shareData = {
      title: "Flight options",
      text: `${form.dep_city} to ${form.arr_city} on ${dateLabel(form.on_date)}`,
      url: window.location.href,
    };
    if (navigator.share) await navigator.share(shareData).catch(() => undefined);
    else await navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
  }

  return (
    <main className="flight-booking-page min-h-screen w-full min-w-0 max-w-full overflow-x-hidden bg-[#eef1f3] pb-14 text-[#122b42] sm:pb-20">
      <section className="relative isolate z-20 w-full min-w-0 max-w-full overflow-visible bg-[#061f3b] bg-[url('/flights/flight-search-hero.png')] bg-cover bg-center px-3 pb-7 pt-5 text-white sm:px-5 sm:pb-9 sm:pt-7 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[#03101c]/72" />
        <div className="mx-auto w-full min-w-0 max-w-7xl">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 hover:text-white">
            <ArrowLeft className="size-4" /> All services
          </Link>
          <div className="hidden">
            <span className="hidden size-16 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 text-[#43c8f1] sm:grid">
              <Plane className="size-8" />
            </span>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.28em] text-[#13a5d8]">Live flight reservation</p>
              <h1 className="mt-3 font-serif text-4xl leading-[.98] sm:text-6xl lg:text-7xl">Find your next flight</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60">
                Search live fares, verify the latest price and submit passenger details through our secure booking flow.
              </p>
            </div>
          </div>
          <CompactFlightSearch
            form={form}
            fareCategory={fareCategory}
            searchStatus={searchStatus}
            onSubmit={searchFlights}
            onUpdate={updateForm}
            onFareCategory={setFareCategory}
            onSwap={() => setForm((current) => ({ ...current, dep_city: current.arr_city, arr_city: current.dep_city }))}
          />
        </div>
      </section>

      <section className="flight-booking-shell relative z-10 mx-auto w-full min-w-0 max-w-7xl px-3 pt-[22rem] sm:px-5 md:pt-56 lg:px-8 xl:pt-44">
        <div className="flight-search-card hidden overflow-hidden rounded-lg bg-white shadow-[0_28px_90px_rgba(6,31,59,.2)]">
          <div className="border-b border-slate-100 bg-[#fbfdff] px-4 py-4 sm:px-8 sm:py-5">
            <div className="grid grid-cols-4 gap-2">
              {["Search", "Select fare", "Travellers", "Confirmation"].map((step, index) => {
                const activeIndex = bookingResult ? 3 : selectedFare ? 2 : searchContext ? 1 : 0;
                return (
                  <div key={step} className="flex items-center gap-2">
                    <span className={`grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-extrabold ${index <= activeIndex ? "bg-[#087fbe] text-white" : "bg-slate-100 text-slate-400"}`}>
                      {index < activeIndex ? <Check className="size-3.5" /> : index + 1}
                    </span>
                    <span className={`hidden text-xs font-bold sm:block ${index <= activeIndex ? "text-[#061f3b]" : "text-slate-400"}`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={searchFlights} className="p-4 sm:p-8" noValidate>
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-full bg-[#e5f5fb] text-[10px] font-extrabold text-[#087fbe]">01</span>
                  <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#087fbe]">Build your journey</p>
                </div>
                <h2 className="mt-2 font-serif text-2xl text-[#061f3b] sm:text-4xl">Where would you like to fly?</h2>
                <p className="mt-2 text-sm text-slate-500">Compare live flight options and verified fares in one search.</p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
                <div className="grid w-full grid-cols-2 rounded-2xl border border-slate-200 bg-[#f3f8fb] p-1.5">
                  {(["0", "1"] as const).map((value) => (
                    <button key={value} type="button" onClick={() => updateForm("trip_type", value)} className={`min-w-0 rounded-xl px-2 py-2.5 sm:px-4 text-xs font-bold transition ${form.trip_type === value ? "bg-[#061f3b] text-white shadow-md" : "text-slate-500 hover:text-[#087fbe]"}`}>
                      {value === "0" ? "One way" : "Round trip"}
                    </button>
                  ))}
                </div>
                <div className="grid w-full grid-cols-2 rounded-2xl border border-slate-200 bg-[#f3f8fb] p-1.5">
                  {(["1", "2"] as const).map((value) => (
                    <button key={value} type="button" onClick={() => updateForm("service_type", value)} className={`min-w-0 rounded-xl px-2 py-2.5 sm:px-4 text-xs font-bold transition ${form.service_type === value ? "bg-white text-[#087fbe] shadow-md" : "text-slate-500 hover:text-[#087fbe]"}`}>
                      {value === "1" ? "Domestic" : "International"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <section className="relative mt-6 rounded-[1.5rem] border border-[#087fbe]/15 bg-gradient-to-br from-[#f4fbfe] via-white to-[#f8f6ff] p-3 shadow-[inset_0_1px_0_white,0_16px_40px_rgba(6,64,105,.07)] sm:mt-7 sm:rounded-[1.75rem] sm:p-6">
              <div className="mb-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#087fbe]">Flight route</p>
                <p className="mt-1 text-xs text-slate-400">Search by city, airport name or IATA code</p>
              </div>

              <div className="grid items-end gap-3 lg:grid-cols-[1fr_54px_1fr]">
                <AirportField label="Leaving from" value={form.dep_city} icon={<PlaneTakeoff className="size-5" />} onChange={(value) => updateForm("dep_city", value)} />
                <button type="button" aria-label="Swap airports" onClick={() => setForm((current) => ({ ...current, dep_city: current.arr_city, arr_city: current.dep_city }))} className="relative z-20 mx-auto grid size-12 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-[#0875b7] to-[#13a5d8] text-white shadow-[0_10px_24px_rgba(8,126,186,.3)] rotate-90 transition duration-300 hover:scale-105 lg:mb-2 lg:rotate-0 lg:hover:rotate-180">
                  <ArrowRightLeft className="size-4" />
                </button>
                <AirportField label="Going to" value={form.arr_city} icon={<PlaneLanding className="size-5" />} onChange={(value) => updateForm("arr_city", value)} />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#087fbe]/10 pt-4">
                <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Popular routes</span>
                {([['DEL', 'BOM'], ['DEL', 'BLR'], ['BOM', 'GOI'], ['CCU', 'MAA']] as const).map(([from, to]) => (
                  <button key={`${from}-${to}`} type="button" onClick={() => setForm((current) => ({ ...current, dep_city: from, arr_city: to }))} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-500 transition hover:border-[#13a5d8] hover:text-[#087fbe]">
                    {from}<ArrowRight className="size-3" />{to}
                  </button>
                ))}
              </div>
            </section>

            <div className="mt-5 grid gap-5 xl:grid-cols-[1.08fr_.92fr]">
              <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(6,31,59,.05)] sm:p-5">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#e5f5fb] text-[#087fbe]"><CalendarDays className="size-5" /></span>
                  <div><h3 className="text-sm font-extrabold text-[#061f3b]">Travel schedule</h3><p className="mt-0.5 text-[11px] text-slate-400">Choose your dates and preferred cabin</p></div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <InputField label="Departure" type="date" value={form.on_date} min={dateAfter(0)} onChange={(value) => updateForm("on_date", value)} />
                  {form.trip_type === "1" ? (
                    <InputField label="Return" type="date" value={form.re_date} min={form.on_date || dateAfter(0)} onChange={(value) => updateForm("re_date", value)} />
                  ) : (
                    <button type="button" onClick={() => updateForm("trip_type", "1")} className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl border border-dashed border-[#087fbe]/35 bg-[#f5fbfd] text-xs font-bold text-[#087fbe] transition hover:border-[#087fbe]">
                      <CalendarDays className="size-4" />Add return
                    </button>
                  )}
                  <SelectField label="Cabin class" value={form.cabin} onChange={(value) => updateForm("cabin", value)} options={cabinOptions} />
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(6,31,59,.05)] sm:p-5">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#eee9ff] text-[#6846c7]"><Users className="size-5" /></span>
                  <div><h3 className="text-sm font-extrabold text-[#061f3b]">Travellers</h3><p className="mt-0.5 text-[11px] text-slate-400">Up to 9 passengers in one booking</p></div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <CountField label="Adults" hint="12+" value={form.adults} min={1} onChange={(value) => updateForm("adults", value)} />
                  <CountField label="Children" hint="2–11" value={form.children} min={0} onChange={(value) => updateForm("children", value)} />
                  <CountField label="Infants" hint="< 2" value={form.infants} min={0} onChange={(value) => updateForm("infants", value)} />
                </div>
              </section>
            </div>

            <div className="mt-6 flex flex-col gap-5 rounded-[1.5rem] bg-[#061f3b] px-4 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold"><ShieldCheck className="size-4 text-[#13a5d8]" />Secure live flight search</p>
                <p className="mt-1 text-[11px] text-white/45">
                  {form.trip_type === "0" ? "One way" : "Round trip"} · {form.service_type === "1" ? "Domestic" : "International"} · {Number(form.adults) + Number(form.children) + Number(form.infants)} traveller{Number(form.adults) + Number(form.children) + Number(form.infants) === 1 ? "" : "s"}
                </p>
              </div>
              <button disabled={searchStatus === "pending"} className="group inline-flex w-full items-center justify-center sm:w-auto sm:min-w-56 gap-2 rounded-lg bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-7 py-4 text-sm font-bold text-white shadow-[0_12px_30px_rgba(8,126,186,.3)] transition hover:-translate-y-0.5 disabled:opacity-60">
                {searchStatus === "pending" ? <LoaderCircle className="size-4 animate-spin" /> : <Search className="size-4" />}
                {searchStatus === "pending" ? "Searching live fares..." : "Search available flights"}
                {searchStatus !== "pending" && <ArrowRight className="size-4 transition group-hover:translate-x-1" />}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-white px-5 py-4 text-sm font-semibold text-red-600 shadow-lg shadow-red-950/5">
            <CircleAlert className="mt-0.5 size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {searchContext && !selectedFare && (
          <FlightResultsWorkspace
            rows={filteredFlightRows}
            totalCount={searchContext.flights.length}
            reference={searchContext.refId}
            currentDate={form.on_date}
            searchStatus={searchStatus}
            loadingFareId={loadingFareId}
            fallbackFlightId={searchContext.fallbackFlightId}
            airlines={airlineOptions}
            stopFilters={stopFilters}
            airlineFilters={airlineFilters}
            departureBand={departureBand}
            arrivalBand={arrivalBand}
            flightQuery={flightQuery}
            sortBy={sortBy}
            drawerOpen={filterDrawerOpen}
            onSort={setSortBy}
            onOpenDrawer={() => setFilterDrawerOpen(true)}
            onCloseDrawer={() => setFilterDrawerOpen(false)}
            onToggleStop={(value) => toggleListValue(value, stopFilters, setStopFilters)}
            onToggleAirline={(value) => toggleListValue(value, airlineFilters, setAirlineFilters)}
            onDepartureBand={setDepartureBand}
            onArrivalBand={setArrivalBand}
            onFlightQuery={setFlightQuery}
            onReset={resetFilters}
            onShare={shareSearch}
            onDate={searchAnotherDate}
            onChangeSearch={() => { dispatch(clearSearch()); setValidationError(""); }}
            onSelect={selectFlight}
          />
        )}

        {searchContext && !selectedFare && Boolean(0) && (
          <section id="flight-results" className="scroll-mt-6 py-8 sm:py-10">
            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#087fbe]">Step 02</p>
                <h2 className="mt-1 font-serif text-2xl text-[#061f3b] sm:text-3xl">Select a flight</h2>
                <p className="mt-2 text-sm text-slate-500">Reference {searchContext.refId}</p>
              </div>
              <button type="button" onClick={() => { dispatch(clearSearch()); setValidationError(""); }} className="inline-flex items-center gap-2 text-sm font-bold text-[#087fbe]"><RotateCcw className="size-4" />Change search</button>
            </div>

            {searchContext.flights.length ? (
              <div className="mt-6 space-y-4">
                {searchContext.flights.map((flight, index) => {
                  const summary = getFlightSummary(flight, index);
                  const resultFlightId = flightIdentity(flight, searchContext.fallbackFlightId);
                  return (
                    <article key={`${resultFlightId}-${index}`} className="overflow-hidden rounded-[1.25rem] border border-white bg-white sm:rounded-[1.5rem] shadow-[0_16px_45px_rgba(6,31,59,.09)]">
                      <div className="grid gap-5 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
                        <div className="grid min-w-0 gap-5 md:grid-cols-[220px_1fr] md:items-center md:gap-6">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#e5f5fb] text-[#087fbe]"><Plane className="size-5" /></span>
                              <div className="min-w-0">
                                <p className="truncate font-bold text-[#061f3b]">{summary.airline}</p>
                                <p className="mt-1 text-xs font-semibold text-slate-400">
                                  {summary.flightNumber}{summary.segmentCount > 1 ? ` · ${summary.segmentCount} flights` : ""}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {summary.fareType && <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[9px] font-bold text-violet-700">{summary.fareType}</span>}
                              {summary.checkInBaggage && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-500">Check-in {summary.checkInBaggage}</span>}
                              {summary.cabinBaggage && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-500">Cabin {summary.cabinBaggage}</span>}
                            </div>
                          </div>

                          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
                            <div>
                              <p className="text-lg font-extrabold text-[#061f3b] sm:text-xl">{summary.departure}</p>
                              <p className="mt-1 text-xs font-bold text-slate-600">{summary.from}</p>
                              <p className="mt-1 text-[10px] text-slate-400">{summary.departureDate}</p>
                            </div>
                            <div className="min-w-0 text-center sm:min-w-28">
                              <p className="text-[10px] font-bold text-slate-400">{summary.duration || "Flight"}</p>
                              <div className="mt-2 flex items-center"><span className="size-1.5 rounded-full bg-[#087fbe]" /><span className="h-px flex-1 bg-slate-200" /><Plane className="size-3.5 rotate-90 text-[#087fbe]" /><span className="h-px flex-1 bg-slate-200" /><span className="size-1.5 rounded-full bg-[#087fbe]" /></div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-extrabold text-[#061f3b] sm:text-xl">{summary.arrival}</p>
                              <p className="mt-1 text-xs font-bold text-slate-600">{summary.to}</p>
                              <p className="mt-1 text-[10px] text-slate-400">{summary.arrivalDate}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-stretch gap-3 border-t border-slate-100 pt-4 sm:block sm:min-w-44 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:text-right">
                          <div>
                            {summary.price && <p className="text-2xl font-extrabold text-[#061f3b]">{formatMoney(Number(summary.price))}</p>}
                            <p className="mt-1 text-[10px] text-slate-400">Total fare</p>
                            {summary.refundability && <p className={`mt-2 text-[10px] font-bold ${summary.refundability === "Non-refundable" ? "text-amber-600" : "text-emerald-600"}`}>{summary.refundability}</p>}
                          </div>
                          <button type="button" disabled={Boolean(loadingFareId)} onClick={() => selectFlight(flight, index)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#061f3b] sm:mt-3 sm:w-auto px-5 py-3 text-xs font-bold text-white transition hover:bg-[#087fbe] disabled:opacity-60">
                            {loadingFareId === resultFlightId ? <LoaderCircle className="size-4 animate-spin" /> : null}
                            Select fare
                            <ArrowRight className="size-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-7 text-amber-800">
                The provider completed the search but returned no flight list for these criteria. Change the airports or dates and search again.
              </div>
            )}
          </section>
        )}

        {searchContext && selectedFare && (
          <form id="traveller-details" onSubmit={bookFlight} className="scroll-mt-6 py-8 sm:py-10" noValidate>
            <div className="mb-6 flex flex-col gap-4 rounded-[1.5rem] bg-[#061f3b] p-4 sm:p-6 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#13a5d8]">Fare verified</p>
                <h2 className="mt-2 break-words font-serif text-2xl sm:text-3xl">{getFlightSummary(selectedFare.flight, 0).airline}</h2>
                <p className="mt-2 break-all text-xs text-white/50">Booking flight ID: {selectedFare.bookingFlightId}</p>
              </div>
              <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:gap-5">
                <div className="text-right"><p className="text-[10px] uppercase tracking-wider text-white/45">Verified total</p><p className="mt-1 text-xl font-extrabold sm:text-2xl">{verifiedPrice ? formatMoney(verifiedPrice) : "Confirmed by provider"}</p></div>
                <button type="button" onClick={() => dispatch(clearSelectedFare())} className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/10" aria-label="Choose another flight"><RotateCcw className="size-4" /></button>
              </div>
            </div>

            <section className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_22px_70px_rgba(6,31,59,.12)] sm:rounded-[2rem]">
              <header className="border-b border-slate-100 px-4 py-5 sm:px-8 sm:py-6">
                <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#087fbe]">Step 03</p>
                <h2 className="mt-1 font-serif text-2xl text-[#061f3b] sm:text-3xl">Passenger details</h2>
                <p className="mt-2 text-sm text-slate-500">Enter details exactly as shown on the traveller ID or passport.</p>
              </header>

              <div className="space-y-5 p-4 sm:p-8">
                {passengers.map((passenger, index) => (
                  <PassengerCard key={`${passenger.passenger_type}-${index}`} passenger={passenger} index={index} international={form.service_type === "2"} update={updatePassenger} />
                ))}

                <section className="rounded-2xl border border-slate-200 bg-[#fbfdff] p-4 sm:p-5">
                  <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e5f5fb] text-[#087fbe]"><UserRound className="size-5" /></span><div><h3 className="font-bold text-[#061f3b]">Contact & billing</h3><p className="mt-0.5 text-xs text-slate-400">Optional if already available in your profile</p></div></div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <InputField label="Mobile" type="tel" value={mobile} placeholder="10–15 digit number" onChange={setMobile} />
                    <InputField label="Email" type="email" value={email} placeholder="traveller@example.com" onChange={setEmail} />
                    <InputField label="First passenger PAN" value={pan} placeholder="ABCDE1234F" onChange={(value) => setPan(value.toUpperCase())} />
                    <InputField label="Booking message" value={message} onChange={setMessage} />
                  </div>
                  <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl bg-white p-4 text-sm font-bold text-[#456078]"><input type="checkbox" checked={includeGst} onChange={(event) => setIncludeGst(event.target.checked)} className="size-4 accent-[#087fbe]" />Add GST billing details</label>
                  {includeGst && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {([['gstNo', 'GST number'], ['gstCompany', 'Company'], ['gstEmail', 'GST email'], ['gstMobile', 'GST mobile'], ['gstAddress', 'GST address']] as const).map(([key, label]) => (
                        <InputField key={key} label={label} value={gst[key]} onChange={(value) => setGst((current) => ({ ...current, [key]: value }))} />
                      ))}
                    </div>
                  )}
                </section>

                {selectedFare.fareRules && (
                  <details className="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-[#061f3b]">Fare rules and policy<ChevronDown className="size-4 transition group-open:rotate-180" /></summary>
                    <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-600">{JSON.stringify(selectedFare.fareRules, null, 2)}</pre>
                  </details>
                )}
              </div>

              <footer className="flex flex-col gap-4 border-t border-slate-100 bg-[#fbfdff] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <p className="flex items-center gap-2 text-xs text-slate-500"><ShieldCheck className="size-4 text-[#087fbe]" />The backend verifies the price again before final booking.</p>
                <button disabled={bookingStatus === "pending"} className="inline-flex w-full items-center justify-center sm:w-auto sm:min-w-52 gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 py-3.5 text-sm font-bold text-white shadow-lg disabled:opacity-60">
                  {bookingStatus === "pending" ? <LoaderCircle className="size-4 animate-spin" /> : <Plane className="size-4" />}
                  {bookingStatus === "pending" ? "Booking..." : "Confirm flight booking"}
                </button>
              </footer>
            </section>
          </form>
        )}
      </section>
    </main>
  );
}

type FlightResultRow = {
  flight: JsonRecord;
  index: number;
  summary: ReturnType<typeof getFlightSummary>;
};

type CompactFlightSearchProps = {
  form: SearchForm;
  fareCategory: "regular" | "student" | "senior";
  searchStatus: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdate: (key: keyof SearchForm, value: string) => void;
  onFareCategory: (value: "regular" | "student" | "senior") => void;
  onSwap: () => void;
};

function CompactFlightSearch({ form, fareCategory, searchStatus, onSubmit, onUpdate, onFareCategory, onSwap }: CompactFlightSearchProps) {
  const travellerCount = Number(form.adults) + Number(form.children) + Number(form.infants);
  return (
    <form onSubmit={onSubmit} className="compact-flight-search flight-search-midpoint relative z-30 mt-4 w-full min-w-0 rounded-lg border border-[#13a5d8]/25 bg-[#061f3b] p-4 shadow-[0_26px_75px_rgba(2,18,35,.38)] sm:mt-5 sm:p-5" noValidate>
      <div className="flex flex-wrap items-center gap-2">
        {(["0", "1"] as const).map((value) => (
          <button key={value} type="button" onClick={() => onUpdate("trip_type", value)} className={`h-10 rounded-full px-6 text-xs font-extrabold uppercase transition-all duration-300 ${form.trip_type === value ? "bg-white text-[#061f3b] shadow-md" : "bg-white/10 text-white/75 hover:bg-white/15 hover:text-white"}`}>
            {value === "0" ? "One way" : "Round trip"}
          </button>
        ))}
        <div className="ml-auto flex rounded-full border border-white/10 bg-black/15 p-1 max-sm:ml-0 max-sm:w-full">
          {([['1', 'Domestic'], ['2', 'International']] as const).map(([value, label]) => <button key={value} type="button" onClick={() => onUpdate("service_type", value)} className={`rounded-full px-3 py-1.5 text-[10px] font-bold transition-all duration-300 max-sm:flex-1 ${form.service_type === value ? "bg-[#13a5d8] text-[#061f3b] shadow" : "text-white/70 hover:text-white"}`}>{label}</button>)}
        </div>
      </div>

      <div className="mt-4 grid overflow-visible rounded-lg bg-white text-[#122b42] shadow-[0_16px_36px_rgba(1,15,30,.18)] md:grid-cols-2 xl:grid-cols-[1.2fr_1.2fr_.72fr_.72fr_1fr]">
        <CompactAirport label="From" value={form.dep_city} onChange={(value) => onUpdate("dep_city", value)} />
        <div className="relative border-t border-slate-200 md:border-l md:border-t-0">
          <button type="button" onClick={onSwap} aria-label="Swap airports" title="Swap airports" className="absolute -left-5 top-1/2 z-20 hidden size-10 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-[#0875b7] to-[#13a5d8] text-white shadow-lg transition duration-300 hover:rotate-180 hover:scale-105 md:grid"><ArrowRightLeft className="size-4" /></button>
          <CompactAirport label="To" value={form.arr_city} onChange={(value) => onUpdate("arr_city", value)} />
        </div>
        <CompactDate label="Departure" value={form.on_date} min={dateAfter(0)} onChange={(value) => onUpdate("on_date", value)} />
        {form.trip_type === "1" ? <CompactDate label="Return" value={form.re_date} min={form.on_date || dateAfter(0)} onChange={(value) => onUpdate("re_date", value)} /> : <button type="button" onClick={() => onUpdate("trip_type", "1")} className="min-h-20 border-t border-slate-200 px-5 text-left transition hover:bg-[#edf8fc] focus:bg-[#edf8fc] md:border-l xl:border-t-0"><span className="block text-[10px] font-bold uppercase text-slate-500">Return</span><span className="mt-1 block text-xs font-bold text-[#087fbe]">+ Add return</span></button>}
        <details className="group relative z-40 min-h-20 border-t border-slate-200 md:border-l xl:border-t-0">
          <summary className="flex h-full min-h-20 touch-manipulation cursor-pointer select-none list-none items-center justify-between px-5 transition hover:bg-[#edf8fc] active:bg-[#dff3fb]"><span><span className="block text-[10px] font-bold uppercase text-slate-500">Traveller & class</span><span className="mt-1 block text-base font-extrabold">{travellerCount} <span className="text-xs text-[#087fbe]">{cabinOptions.find(([code]) => code === form.cabin)?.[1]}</span></span><span className="block text-[10px] text-slate-500">Traveller{travellerCount === 1 ? "" : "s"}</span></span><ChevronDown className="size-4 transition-transform duration-300 group-open:rotate-180" /></summary>
          <div className="absolute right-0 top-[calc(100%+.5rem)] z-50 w-[min(340px,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(6,31,59,.2)]">
            <div className="grid grid-cols-3 gap-2"><CompactCount label="Adults" value={form.adults} min={1} onChange={(value) => onUpdate("adults", value)} /><CompactCount label="Children" value={form.children} min={0} onChange={(value) => onUpdate("children", value)} /><CompactCount label="Infants" value={form.infants} min={0} onChange={(value) => onUpdate("infants", value)} /></div>
            <label className="mt-4 block"><span className="mb-1 block text-[10px] font-bold uppercase text-slate-500">Cabin class</span><select value={form.cabin} onChange={(event) => onUpdate("cabin", event.target.value)} className="h-11 w-full touch-manipulation cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold opacity-100 outline-none focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10">{cabinOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          </div>
        </details>
      </div>

      <div className="mt-4 flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between sm:pb-0">
        <div className="flex flex-wrap items-center gap-2"><span className="mr-1 text-[10px] font-extrabold uppercase text-white">Select fare type</span>{([['regular','Regular'],['student','Student'],['senior','Senior citizen']] as const).map(([value, label]) => <button key={value} type="button" onClick={() => onFareCategory(value)} className={`relative h-9 rounded-full px-5 text-[11px] font-bold uppercase transition-all duration-300 ${fareCategory === value ? "bg-[#dff3fb] text-[#061f3b] shadow" : "bg-white/10 text-white/75 hover:bg-white/15 hover:text-white"}`}>{value !== "regular" && <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#13a5d8] px-2 py-0.5 text-[8px] font-extrabold text-[#061f3b]">New</span>}{label}</button>)}</div>
        <button disabled={searchStatus === "pending"} className="group relative z-50 inline-flex h-14 w-full touch-manipulation items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-12 text-sm font-extrabold text-white opacity-100 shadow-[0_12px_30px_rgba(8,126,186,.38)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:shadow-[0_17px_38px_rgba(8,126,186,.48)] active:scale-[.98] disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70 sm:absolute sm:-bottom-7 sm:left-1/2 sm:w-auto sm:-translate-x-1/2 sm:hover:-translate-x-1/2">{searchStatus === "pending" ? <LoaderCircle className="size-4 animate-spin" /> : <Search className="size-4 transition-transform group-hover:scale-110" />}{searchStatus === "pending" ? "Searching live fares..." : "Search flights"}</button>
      </div>
    </form>
  );
}

function CompactAirport({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [remoteSelection, setRemoteSelection] = useState<[string, string, string] | null>(null);
  const selected = remoteSelection?.[0] === value ? remoteSelection : airportOptions.find(([code]) => code === value);
  const normalizedQuery = query.trim().toLowerCase();
  const fallbackSuggestions = airportOptions.filter(([code, city, airport]) => !normalizedQuery || `${code} ${city} ${airport}`.toLowerCase().includes(normalizedQuery)).slice(0, 8);
  const { data: airportResponse, isFetching } = useAirportsQuery(
    { search: debouncedQuery, page: 1, page_size: 8 },
    { skip: !open || debouncedQuery.length < 2 },
  );
  const remoteSuggestions = airportResponse?.data.map((airport) => [airport.airport_code, airport.airport_city, airport.airport_name] as [string, string, string]) || [];
  const suggestions = remoteSuggestions.length ? remoteSuggestions : fallbackSuggestions;
  const listId = `compact-airport-${label.toLowerCase()}`;

  useEffect(() => {
    const nextQuery = open && query.trim().length >= 2 ? query.trim() : "";
    const timer = window.setTimeout(() => setDebouncedQuery(nextQuery), 250);
    return () => window.clearTimeout(timer);
  }, [open, query]);

  function chooseAirport(airport: readonly [string, string, string]) {
    onChange(airport[0]);
    setRemoteSelection([airport[0], airport[1], airport[2]]);
    setQuery("");
    setOpen(false);
    setActiveIndex(0);
  }

  const displayValue = open ? query : selected ? `${selected[1]} (${selected[0]})` : "";
  const FieldIcon = label === "From" ? PlaneTakeoff : PlaneLanding;

  return (
    <div className="relative min-h-20 transition-colors duration-300 hover:bg-[#f4fbfe] focus-within:bg-[#edf8fc] focus-within:shadow-[inset_0_-2px_0_#13a5d8]">
      <label className="flex min-h-20 cursor-text items-center gap-3 px-4 py-2.5">
        <span className={`grid size-9 shrink-0 place-items-center rounded-lg transition-colors ${open ? "bg-[#087fbe] text-white" : "bg-[#e5f5fb] text-[#087fbe]"}`}><FieldIcon className="size-4" /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-extrabold uppercase text-slate-500">{label}</span>
          <input
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
            value={displayValue}
            placeholder="Search city or airport"
            onFocus={() => { setQuery(""); setOpen(true); setActiveIndex(0); }}
            onBlur={() => window.setTimeout(() => setOpen(false), 160)}
            onChange={(event) => { setQuery(event.target.value); onChange(""); setOpen(true); setActiveIndex(0); }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex((current) => Math.min(current + 1, suggestions.length - 1)); }
              if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex((current) => Math.max(current - 1, 0)); }
              if (event.key === "Enter" && open && suggestions[activeIndex]) { event.preventDefault(); chooseAirport(suggestions[activeIndex]); }
              if (event.key === "Escape") setOpen(false);
            }}
            className="mt-0.5 w-full bg-transparent text-sm font-extrabold text-[#061f3b] outline-none placeholder:font-semibold placeholder:text-slate-300 sm:text-base"
          />
          <span className="block truncate text-[9px] font-semibold text-slate-400">{selected ? `${selected[2]} - IATA ${selected[0]}` : "City, airport name or IATA code"}</span>
        </span>
        {value && !open ? <button type="button" aria-label={`Clear ${label.toLowerCase()} airport`} onMouseDown={(event) => event.preventDefault()} onClick={() => onChange("")} className="grid size-7 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-[#087fbe]"><X className="size-3.5" /></button> : <ChevronDown className={`size-4 shrink-0 text-slate-400 transition-transform duration-300 ${open ? "rotate-180 text-[#087fbe]" : ""}`} />}
      </label>

      {open && (
        <div id={listId} role="listbox" className="absolute inset-x-0 top-[calc(100%+.5rem)] z-[70] max-h-80 overflow-y-auto rounded-xl border border-[#13a5d8]/20 bg-white p-2 shadow-[0_24px_60px_rgba(6,31,59,.22)]">
          <div className="flex items-center justify-between px-2 pb-2 pt-1"><span className="text-[9px] font-extrabold uppercase text-[#087fbe]">{query ? "Matching airports" : "Popular airports"}</span>{isFetching && <LoaderCircle className="size-3.5 animate-spin text-[#13a5d8]" />}</div>
          {suggestions.length ? suggestions.map(([code, city, airport], index) => (
            <button key={code} type="button" role="option" aria-selected={value === code} onMouseDown={(event) => { event.preventDefault(); chooseAirport([code, city, airport]); }} onMouseEnter={() => setActiveIndex(index)} className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition ${activeIndex === index ? "bg-[#edf8fc]" : "hover:bg-slate-50"}`}>
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#e5f5fb] text-xs font-extrabold text-[#087fbe]">{code}</span>
              <span className="min-w-0 flex-1"><span className="block text-xs font-extrabold text-[#061f3b]">{city}</span><span className="mt-0.5 block truncate text-[10px] text-slate-400">{airport}</span></span>
              {value === code && <Check className="size-4 shrink-0 text-emerald-600" />}
            </button>
          )) : <div className="px-4 py-7 text-center"><Search className="mx-auto size-5 text-slate-300" /><p className="mt-2 text-xs font-bold text-slate-500">No airports found</p><p className="mt-1 text-[10px] text-slate-400">Try another city or IATA code.</p></div>}
        </div>
      )}
    </div>
  );
}

function CompactDate({ label, value, min, onChange }: { label: string; value: string; min: string; onChange: (value: string) => void }) {
  return <label className="block min-h-20 border-t border-slate-200 px-5 py-3 transition-colors duration-300 hover:bg-[#f4fbfe] focus-within:bg-[#edf8fc] focus-within:shadow-[inset_0_-2px_0_#13a5d8] md:border-l xl:border-t-0"><span className="block text-[10px] font-bold uppercase text-slate-500">{label}</span><input type="date" value={value} min={min} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full cursor-pointer bg-transparent text-sm font-extrabold outline-none" /></label>;
}

function CompactCount({ label, value, min, onChange }: { label: string; value: string; min: number; onChange: (value: string) => void }) {
  const count = Number(value);
  return <div><span className="mb-1 block text-[9px] font-bold text-slate-500">{label}</span><div className="grid h-10 grid-cols-[30px_1fr_30px] items-center rounded-lg border border-slate-200 bg-slate-50"><button type="button" aria-label={`Remove one ${label.toLowerCase()}`} disabled={count <= min} onClick={() => onChange(String(Math.max(min, count - 1)))} className="grid h-full place-items-center text-[#087fbe] transition hover:bg-[#dff3fb] disabled:text-slate-300"><Minus className="size-3" /></button><span className="text-center text-xs font-extrabold text-[#061f3b]">{value}</span><button type="button" aria-label={`Add one ${label.toLowerCase()}`} disabled={count >= 9} onClick={() => onChange(String(Math.min(9, count + 1)))} className="grid h-full place-items-center text-[#087fbe] transition hover:bg-[#dff3fb] disabled:text-slate-300"><Plus className="size-3" /></button></div></div>;
}

type FlightResultsWorkspaceProps = {
  rows: FlightResultRow[];
  totalCount: number;
  reference: string;
  currentDate: string;
  searchStatus: string;
  loadingFareId: string;
  fallbackFlightId: string;
  airlines: string[];
  stopFilters: string[];
  airlineFilters: string[];
  departureBand: string;
  arrivalBand: string;
  flightQuery: string;
  sortBy: string;
  drawerOpen: boolean;
  onSort: (value: string) => void;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
  onToggleStop: (value: string) => void;
  onToggleAirline: (value: string) => void;
  onDepartureBand: (value: string) => void;
  onArrivalBand: (value: string) => void;
  onFlightQuery: (value: string) => void;
  onReset: () => void;
  onShare: () => void;
  onDate: (value: string) => void;
  onChangeSearch: () => void;
  onSelect: (flight: JsonRecord, index: number) => void;
};

function FlightResultsWorkspace(props: FlightResultsWorkspaceProps) {
  return (
    <section id="flight-results" className="scroll-mt-6 py-8 sm:py-10">
      <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className={`${props.drawerOpen ? "fixed inset-0 z-[80] overflow-y-auto bg-black/45 p-3" : "hidden"} lg:static lg:block lg:bg-transparent lg:p-0`} onClick={(event) => { if (event.target === event.currentTarget) props.onCloseDrawer(); }}>
          <FlightFilters {...props} />
        </div>

        <div className="min-w-0">
          <div className="overflow-hidden rounded-lg border border-[#087fbe]/10 bg-white shadow-[0_10px_32px_rgba(6,31,59,.09)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 sm:px-5">
              <div>
                <h2 className="text-xl font-extrabold text-[#0c2238]">Showing {props.rows.length} flights</h2>
                <p className="mt-1 text-[10px] text-slate-400">{props.totalCount} live options - ref {props.reference}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={props.onOpenDrawer} className="grid size-10 place-items-center rounded-lg border border-slate-200 text-[#087fbe] transition hover:border-[#13a5d8] hover:bg-[#edf8fc] lg:hidden" aria-label="Open filters"><Filter className="size-4" /></button>
                <button type="button" onClick={props.onShare} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-bold transition hover:border-[#13a5d8] hover:bg-[#edf8fc] hover:text-[#087fbe]"><Share2 className="size-4" />Share</button>
                <label className="relative hidden sm:block"><span className="absolute -top-2 left-3 bg-white px-1 text-[9px] text-slate-400">Sort by</span><select value={props.sortBy} onChange={(event) => props.onSort(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-xs font-semibold outline-none"><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="departure">Departure time</option><option value="duration">Journey duration</option></select></label>
                <button type="button" onClick={props.onChangeSearch} className="grid size-10 place-items-center rounded-lg border border-slate-200 text-[#0b5588]" aria-label="Change search" title="Change search"><RotateCcw className="size-4" /></button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto p-3">
              <DateArrow direction="previous" disabled={props.searchStatus === "pending"} onClick={() => props.onDate(shiftDate(props.currentDate, -1))} />
              {[-3,-2,-1,0,1,2,3].map((offset) => { const date = shiftDate(props.currentDate, offset); return <button key={date} type="button" disabled={offset === 0 || props.searchStatus === "pending"} onClick={() => props.onDate(date)} className={`h-10 min-w-20 shrink-0 rounded-lg border px-3 text-xs font-extrabold transition-all duration-300 ${offset === 0 ? "border-[#13a5d8] bg-[#edf8fc] text-[#087fbe] shadow-sm" : "border-slate-200 hover:border-[#13a5d8] hover:text-[#087fbe]"}`}>{dateLabel(date)}</button>; })}
              <DateArrow direction="next" disabled={props.searchStatus === "pending"} onClick={() => props.onDate(shiftDate(props.currentDate, 1))} />
            </div>
          </div>

          <label className="mt-3 block sm:hidden"><select value={props.sortBy} onChange={(event) => props.onSort(event.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold"><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="departure">Departure time</option><option value="duration">Journey duration</option></select></label>

          <div className="mt-4 space-y-3">
            {props.rows.map(({ flight, index, summary }, visibleIndex) => {
              const resultFlightId = flightIdentity(flight, props.fallbackFlightId);
              return <article key={`${resultFlightId}-${index}`} className="relative rounded-lg border border-transparent bg-white shadow-[0_8px_22px_rgba(15,35,55,.09)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#13a5d8]/25 hover:shadow-[0_14px_34px_rgba(6,31,59,.13)]">
                {visibleIndex === 0 && <span className="absolute -top-3 left-4 rounded-full border border-emerald-500 bg-white px-2 py-1 text-[9px] font-bold text-emerald-600">Cheapest</span>}
                <span className="absolute -top-3 right-4 rounded-full bg-[#0d6095] px-3 py-1 text-[9px] font-bold text-white">Sale</span>
                <div className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
                  <div className="grid min-w-0 gap-4 md:grid-cols-[190px_1fr] md:items-center">
                    <div>
                      <div className="flex items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#0875b7] to-[#13a5d8] text-white shadow-sm"><Plane className="size-5" /></span><div className="min-w-0"><p className="truncate font-bold text-[#061f3b]">{summary.airline}</p><p className="mt-1 text-[10px] font-semibold text-slate-400">{summary.flightNumber}</p></div></div>
                      <details className="group mt-3"><summary className="flex cursor-pointer list-none items-center gap-1 text-[11px] font-bold text-[#07568b]">Flight details<ChevronDown className="size-3.5 transition-transform duration-300 group-open:rotate-180" /></summary><div className="mt-3 flex flex-wrap gap-1.5">{summary.fareType && <span className="rounded-full bg-[#edf8fc] px-2.5 py-1 text-[9px] font-bold text-[#087fbe]">{summary.fareType}</span>}{summary.checkInBaggage && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-500">Check-in {summary.checkInBaggage}</span>}{summary.refundability && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">{summary.refundability}</span>}</div></details>
                    </div>
                    <div className="grid min-w-0 grid-cols-[1fr_70px_1fr] items-center gap-2 sm:gap-4">
                      <FlightTime time={summary.departure} code={summary.fromCode} place={summary.from} date={summary.departureDate} />
                      <div className="min-w-0 text-center"><p className="text-[9px] font-bold text-slate-500">{summary.duration || "Flight"}</p><div className="mt-1 h-px bg-[#13a5d8]" /></div>
                      <FlightTime time={summary.arrival} code={summary.toCode} place={summary.to} date={summary.arrivalDate} right />
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-3 sm:min-w-36 sm:border-t-0 sm:pt-0 sm:text-right">{summary.price && <p className="text-xl font-extrabold">{formatMoney(Number(summary.price))}</p>}<p className="mt-1 text-[9px] text-slate-400">per traveller</p><button type="button" disabled={Boolean(props.loadingFareId)} onClick={() => props.onSelect(flight, index)} className="group mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-4 py-2.5 text-xs font-bold text-white shadow-[0_7px_18px_rgba(8,126,186,.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(8,126,186,.38)] disabled:translate-y-0 disabled:opacity-60 sm:w-auto">{props.loadingFareId === resultFlightId && <LoaderCircle className="size-4 animate-spin" />}View fare<ChevronDown className="size-4 transition-transform group-hover:translate-y-0.5" /></button></div>
                </div>
              </article>;
            })}
            {!props.rows.length && <div className="rounded-lg bg-white p-8 text-center"><SlidersHorizontal className="mx-auto size-7 text-slate-300" /><h3 className="mt-3 text-sm font-bold">No flights match these filters</h3><button type="button" onClick={props.onReset} className="mt-3 text-xs font-bold text-[#0b5d91]">Reset all filters</button></div>}
          </div>
        </div>
      </div>
    </section>
  );
}

function DateArrow({ direction, disabled, onClick }: { direction: "previous" | "next"; disabled: boolean; onClick: () => void }) {
  return <button type="button" disabled={disabled} onClick={onClick} aria-label={`${direction} date`} className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#0b5588] text-[#0b5588] disabled:opacity-50">{direction === "previous" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}</button>;
}

function FlightTime({ time, code, place, date, right = false }: { time: string; code: string; place: string; date: string; right?: boolean }) {
  return <div className={right ? "text-right" : ""}><p className="text-sm font-extrabold sm:text-base">{right ? `${time} ${code}` : `${code} ${time}`}</p><p className="mt-1 truncate text-[9px] font-bold text-slate-600">{place}</p><p className="mt-1 text-[9px] text-slate-400">{date}</p></div>;
}

function FlightFilters(props: FlightResultsWorkspaceProps) {
  const bands = [["early", "Before 6 AM", Sunrise], ["morning", "6 AM to 12 PM", CloudSun], ["afternoon", "12 PM to 6 PM", Sunset], ["night", "After 6 PM", Moon]] as const;
  return <aside className="mx-auto w-full max-w-sm rounded-lg border border-[#087fbe]/10 bg-white p-5 shadow-[0_10px_30px_rgba(6,31,59,.09)] lg:sticky lg:top-24">
    <div className="flex items-center justify-between border-b border-slate-100 pb-4"><h2 className="text-lg font-extrabold">Select filters</h2><div className="flex items-center gap-3"><button type="button" onClick={props.onReset} className="text-xs font-bold text-[#07568b]">Reset all</button><button type="button" onClick={props.onCloseDrawer} className="grid size-8 place-items-center lg:hidden" aria-label="Close filters"><X className="size-5" /></button></div></div>
    <FilterSection title="Stops"><CheckOption label="Non-stop" checked={props.stopFilters.includes("0")} onChange={() => props.onToggleStop("0")} /><CheckOption label="1 stop" checked={props.stopFilters.includes("1")} onChange={() => props.onToggleStop("1")} /><CheckOption label="2+ stops" checked={props.stopFilters.includes("2")} onChange={() => props.onToggleStop("2")} /></FilterSection>
    <TimeFilter title="Departure time" value={props.departureBand} onChange={props.onDepartureBand} bands={bands} />
    <TimeFilter title="Arrival time" value={props.arrivalBand} onChange={props.onArrivalBand} bands={bands} />
    <FilterSection title="Flight number"><label className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-400"><Search className="size-4" /><input value={props.flightQuery} onChange={(event) => props.onFlightQuery(event.target.value)} placeholder="Search flight" className="min-w-0 flex-1 bg-transparent text-xs outline-none" /></label></FilterSection>
    <FilterSection title={`Airlines - ${props.airlines.length}`}>{props.airlines.map((airline) => <CheckOption key={airline} label={airline} checked={props.airlineFilters.includes(airline)} onChange={() => props.onToggleAirline(airline)} />)}</FilterSection>
  </aside>;
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="border-b border-slate-100 py-5 last:border-0"><h3 className="mb-3 text-sm font-extrabold">{title}</h3><div className="space-y-2.5">{children}</div></section>;
}

function CheckOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-0.5 text-xs transition hover:bg-[#edf8fc]"><input type="checkbox" checked={checked} onChange={onChange} className="size-4 accent-[#087fbe]" />{label}</label>;
}

function TimeFilter({ title, value, onChange, bands }: { title: string; value: string; onChange: (value: string) => void; bands: ReadonlyArray<readonly [string, string, typeof Clock3]> }) {
  return <FilterSection title={title}><div className="grid grid-cols-2 gap-2">{bands.map(([key, label, Icon]) => <button key={key} type="button" onClick={() => onChange(value === key ? "" : key)} className={`flex min-h-20 flex-col items-center justify-center rounded-lg border p-2 text-[9px] font-bold transition-all duration-300 ${value === key ? "border-[#13a5d8] bg-[#edf8fc] text-[#087fbe] shadow-sm" : "border-slate-200 hover:border-[#13a5d8]/60 hover:bg-[#f7fcfe]"}`}><Icon className="mb-1 size-5" />{label}</button>)}</div></FilterSection>;
}

function AirportField({ label, value, icon, onChange }: { label: string; value: string; icon: ReactNode; onChange: (value: string) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [chosenAirport, setChosenAirport] = useState<[string, string, string] | null>(null);
  const selectedAirport = chosenAirport?.[0] === value ? chosenAirport : airportOptions.find(([code]) => code === value);
  const selectedLabel = selectedAirport ? `${selectedAirport[1]} (${selectedAirport[0]})` : value;
  const displayedQuery = open ? query : selectedLabel;
  const listId = `airport-results-${label.toLowerCase()}`;
  const normalizedQuery = query.trim().toLowerCase();
  const fallbackSuggestions = airportOptions
    .filter(([code, city, airport]) => {
      if (!normalizedQuery) return true;
      return code.toLowerCase().includes(normalizedQuery) ||
        city.toLowerCase().includes(normalizedQuery) ||
        airport.toLowerCase().includes(normalizedQuery);
    })
    .slice(0, 8);
  const { data: airportResponse } = useAirportsQuery(
    { search: debouncedQuery, page: 1, page_size: 8 },
    { skip: !open || debouncedQuery.length < 2 },
  );
  const remoteSuggestions = airportResponse?.data.map((airport) => [airport.airport_code, airport.airport_city, airport.airport_name] as [string, string, string]);
  const suggestions = open && normalizedQuery.length >= 2 && remoteSuggestions
    ? remoteSuggestions
    : fallbackSuggestions;

  useEffect(() => {
    const search = query.trim();
    if (!open || search.length < 2) return;
    const timer = window.setTimeout(() => {
      setDebouncedQuery(search);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [open, query]);

  function chooseAirport(code: string, city: string, airport: string) {
    onChange(code);
    setChosenAirport([code, city, airport]);
    setQuery(`${city} (${code})`);
    setOpen(false);
  }

  return (
    <label className="relative block">
      <span className="mb-2 block text-xs font-bold text-[#456078]">{label}</span>
      <span className="flex h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-[#fbfdff] px-4 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10">
        <span className="text-[#087fbe]">{icon}</span>
        <span className="min-w-0 flex-1">
          <input
            required
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            value={displayedQuery}
            onFocus={() => {
              setQuery(selectedLabel);
              setOpen(true);
            }}
            onBlur={() => window.setTimeout(() => setOpen(false), 150)}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              onChange("");
            }}
            placeholder="Search city or airport"
            autoComplete="off"
            className="w-full bg-transparent text-base font-bold text-[#061f3b] outline-none placeholder:font-semibold placeholder:text-slate-300 sm:text-lg"
          />
          <span className="mt-0.5 block truncate text-[10px] font-semibold text-slate-400">
            {selectedAirport ? `${selectedAirport[2]} | IATA ${selectedAirport[0]}` : "Select an airport from the suggestions"}
          </span>
        </span>
        <ChevronDown className={`size-4 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
      </span>

      {open && (
        <div id={listId} role="listbox" className="absolute inset-x-0 top-[calc(100%+.45rem)] z-50 max-h-64 overflow-y-auto sm:max-h-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_22px_55px_rgba(6,31,59,.18)]">
          {suggestions.length ? suggestions.map(([code, city, airport]) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={value === code}
              onMouseDown={(event) => {
                event.preventDefault();
                chooseAirport(code, city, airport);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[#edf8fc] ${value === code ? "bg-[#edf8fc]" : ""}`}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e5f5fb] text-sm font-extrabold text-[#087fbe]">{code}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-[#061f3b]">{city}</span>
                <span className="mt-0.5 block truncate text-xs text-slate-400">{airport}</span>
              </span>
              {value === code && <Check className="size-4 shrink-0 text-emerald-600" />}
            </button>
          )) : (
            <p className="px-4 py-5 text-center text-sm text-slate-500">No matching airport. Try a city or IATA code.</p>
          )}
        </div>
      )}
    </label>
  );
}
function InputField({ label, value, onChange, type = "text", min, placeholder, icon }: { label: string; value: string; onChange: (value: string) => void; type?: string; min?: string; placeholder?: string; icon?: ReactNode }) {
  return (
    <label className="min-w-0">
      <span className="mb-2 block text-xs font-bold text-[#456078]">{label}</span>
      <span className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-400 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10">
        {icon}
        <input type={type} min={min} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="min-w-0 w-full flex-1 bg-transparent text-sm font-semibold text-[#122b42] outline-none" />
      </span>
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: ReadonlyArray<readonly [string, string]> }) {
  return (
    <label className="min-w-0">
      <span className="mb-2 block text-xs font-bold text-[#456078]">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-12 min-w-0 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#122b42] outline-none transition focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10">
        {options.map(([optionValue, labelText]) => <option key={optionValue} value={optionValue}>{labelText}</option>)}
      </select>
    </label>
  );
}

function CountField({ label, hint, value, min, onChange }: { label: string; hint: string; value: string; min: number; onChange: (value: string) => void }) {
  return (
    <label className="min-w-0">
      <span className="mb-2 flex items-center justify-between text-xs font-bold text-[#456078]"><span>{label}</span><span className="font-normal text-slate-400">{hint}</span></span>
      <span className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-[#087fbe] focus-within:border-[#13a5d8]">
        <Users className="size-4" />
        <input type="number" min={min} max={9} value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 w-full flex-1 bg-transparent text-sm font-bold text-[#122b42] outline-none" />
      </span>
    </label>
  );
}

function PassengerCard({ passenger, index, international, update }: { passenger: PassengerForm; index: number; international: boolean; update: (index: number, key: keyof PassengerForm, value: string | null) => void }) {
  const typeLabel = passenger.passenger_type === "A" ? "Adult" : passenger.passenger_type === "C" ? "Child" : "Infant";
  return (
    <article className="rounded-2xl border border-slate-200 bg-[#fbfdff] p-4 sm:p-5">
      <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e5f5fb] text-sm font-extrabold text-[#087fbe]">{index + 1}</span><div><h3 className="font-bold text-[#061f3b]">Passenger {index + 1}</h3><p className="mt-0.5 text-xs text-slate-400">{typeLabel}</p></div></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SelectField label="Title" value={passenger.title} onChange={(value) => update(index, "title", value)} options={[["Mr", "Mr"], ["Ms", "Ms"], ["Mrs", "Mrs"], ["Master", "Master"]]} />
        <InputField label="First name" value={passenger.first_name} onChange={(value) => update(index, "first_name", value)} />
        <InputField label="Last name" value={passenger.last_name} onChange={(value) => update(index, "last_name", value)} />
        <SelectField label="Gender" value={passenger.gender} onChange={(value) => update(index, "gender", value)} options={[["M", "Male"], ["F", "Female"], ["O", "Other"]]} />
        <InputField label="Date of birth" type="date" value={passenger.date_of_birth} onChange={(value) => update(index, "date_of_birth", value)} />
        {international && (
          <>
            <InputField label="Passport number" value={passenger.passport_number} onChange={(value) => update(index, "passport_number", value.toUpperCase())} />
            <InputField label="Passport issue date" type="date" value={passenger.passport_issue_date || ""} onChange={(value) => update(index, "passport_issue_date", value || null)} />
            <InputField label="Passport expiry date" type="date" value={passenger.passport_expiry_date || ""} onChange={(value) => update(index, "passport_expiry_date", value || null)} />
            <InputField label="Passport nationality" value={passenger.passport_nationality} onChange={(value) => update(index, "passport_nationality", value)} />
          </>
        )}
      </div>
    </article>
  );
}

function ResultFact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 break-words text-sm font-extrabold text-[#061f3b]">{value}</p></div>;
}
