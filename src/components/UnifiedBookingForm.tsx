"use client";

import { FormEvent, ReactNode, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeInfo, Building2, CalendarDays, Check, CheckCircle2, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock3, CirclePlus, Hash, IndianRupee, Landmark, Mail, MapPin, MessageSquareText, Phone, Search, Send, ShieldCheck, Sparkles, Trash2, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BookingSuccessModal from "@/components/BookingSuccessModal";
import CruiseSearchPanel from "@/components/CruiseSearchPanel";
import { documentedBookingConfigs } from "@/components/DocumentedBookingForm";
import { getErrorMessage } from "@/lib/api/client";
import { useSuccessChime } from "@/hooks/useSuccessChime";
import { useServiceQuery, useSubmitServiceBookingMutation } from "@/store/websiteApi";

type FieldKind = "text" | "number" | "decimal" | "date" | "time" | "select" | "textarea" | "checkbox";
type BookingField = { key: string; label: string; kind?: FieldKind; required?: boolean; placeholder?: string; options?: [string, string][]; min?: number; defaultValue?: string | boolean };
type BookingConfig = { title: string; description: string; fields: BookingField[] };
type Guest = { name: string; age: string; gender: "male" | "female" | "other" };

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
  const serviceApiSlug = serviceSlug === "corporate-travel" ? "corporate-travel-desk-b2b" : serviceSlug;
  const isCruiseBooking = serviceSlug === "cruise-booking";
  const isCorporateTravel = serviceSlug === "corporate-travel";
  const isEventManagement = serviceSlug === "event-management";
  const isHolidayPackage = serviceSlug === "holiday-packages";
  const isTaxiBooking = serviceSlug === "taxi-services";
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const selectedItemId = serviceSlug === "hotel-reservations" ? params.get("id") || "" : "";
  const selectedItemName = serviceSlug === "hotel-reservations"
    ? params.get("name") || "Selected hotel"
    : isHolidayPackage
      ? params.get("packageName") || "Selected holiday package"
      : "";
  const selectedImage = serviceSlug === "hotel-reservations" ? params.get("image") || "" : "";
  const initialServiceId = params.get("service") || "";
  const { data: serviceMeta, isLoading: loadingService } = useServiceQuery(serviceApiSlug);
  const serviceId = initialServiceId || String(serviceMeta?.id || "");
  const [values, setValues] = useState<Record<string, string | boolean>>(() => {
    const defaults = Object.fromEntries(config.fields.map((field) => [field.key, field.defaultValue ?? ""])) as Record<string, string | boolean>;
    if (isHolidayPackage) {
      defaults.package_category = params.get("type") || "";
      defaults.destination = params.get("destination") || "";
      defaults.duration_days = params.get("days") || defaults.duration_days || "";
      defaults.number_of_adults = params.get("adults") || defaults.number_of_adults || "1";
      defaults.number_of_children = params.get("children") || defaults.number_of_children || "0";
      defaults.ltc_tier = params.get("tier") || "";
      defaults.budget_category = params.get("tier") || "";
      defaults.hotel_preference = params.get("hotelName") || "";
    }
    return defaults;
  });
  const [guests, setGuests] = useState<Guest[]>([newGuest()]);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitServiceBooking, { isLoading: submitting }] = useSubmitServiceBookingMutation();
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [dateMinimum] = useState(today);
  const [cruiseMonth, setCruiseMonth] = useState("");
  const [cruiseNights, setCruiseNights] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const successChime = useSuccessChime();
  const formId = `booking-form-${serviceSlug}`;

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

  const corporateProfileKeys = ["company_name", "gst_number", "industry_type", "company_website", "city", "contact_person_name", "designation", "official_email", "mobile_number"];
  const corporatePlanningKeys = ["travel_type", "travel_purpose", "from_city", "to_city", "departure_date", "return_date", "number_of_travellers", "number_of_rooms", "preferred_hotel_category", "preferred_airline", "estimated_budget", "monthly_travel_volume", "annual_travel_budget", "credit_facility_required", "purchase_order_required", "gst_invoice_required", "preferred_billing_cycle", "dedicated_account_manager_required", "additional_requirements"];
  const visibleFields = isCruiseBooking
    ? config.fields.filter((field) => !["destination", "departure_port", "return_date", "number_of_passengers"].includes(field.key))
    : isCorporateTravel
    ? config.fields.filter((field) => corporateProfileKeys.includes(field.key))
    : config.fields;

  const validateStep = (step: number): boolean => {
    setError("");
    if (step === 1) {
      if (isCruiseBooking) {
        if (!values.destination) {
          setError("Please select a cruise destination in the search panel above.");
          return false;
        }
        if (!values.departure_port) {
          setError("Please select a departure port in the search panel above.");
          return false;
        }
        if (!cruiseMonth) {
          setError("Please select a travel month in the search panel above.");
          return false;
        }
      } else {
        const missingField = visibleFields.find(
          (field) => field.required && (values[field.key] === "" || values[field.key] === undefined)
        );
        if (missingField) {
          setError(`Please complete ${missingField.label.toLowerCase()} in Step 1.`);
          return false;
        }
      }
      const start = String(values.check_in_date || values.start_date || values.departure_date || values.travel_start_date || values.pickup_date || "");
      const end = String(values.check_out_date || values.end_date || values.return_date || values.travel_end_date || values.dropoff_date || "");
      if (start && end && end < start) {
        setError("The end or return date cannot be earlier than the start date.");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (isHolidayPackage || isTaxiBooking) return true;
      if (isCorporateTravel) {
        if (!config.fields.some((field) => field.kind === "checkbox" && Boolean(values[field.key]))) {
          setError("Select at least one service your organisation needs.");
          return false;
        }
        return true;
      }
      if (isEventManagement) return true;
      for (let i = 0; i < guests.length; i++) {
        const guest = guests[i];
        if (guest.name.trim().length < 2) {
          setError(`Please enter a valid name (at least 2 characters) for Traveller ${i + 1}.`);
          return false;
        }
        const ageVal = Number(guest.age);
        if (isNaN(ageVal) || ageVal < 1 || ageVal > 120) {
          setError(`Please enter a valid age (1-120) for Traveller ${i + 1}.`);
          return false;
        }
      }
      return true;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!localStorage.getItem("access_token")) {
      const query = params.toString();
      router.push(`/login?redirect=${encodeURIComponent(`${pathname}${query ? `?${query}` : ""}`)}`);
      return;
    }
    if (!serviceId || !Number.isInteger(Number(serviceId))) return setError("This service is not available for booking right now.");
    if (serviceSlug === "hotel-reservations" && (!selectedItemId || !Number.isInteger(Number(selectedItemId)))) return setError("Please select a valid hotel before booking.");

    if (!validateStep(1) || !validateStep(2)) return;

    if (!consent) return setError("Please consent to contact before submitting the booking request.");

    const payload: Record<string, unknown> = {
      service: Number(serviceId),
      message: message.trim(),
      consent_to_contact: consent,
    };
    if (!isEventManagement && !isHolidayPackage && !isTaxiBooking) payload.guests = guests.map((guest) => ({ name: guest.name.trim(), age: Number(guest.age), gender: guest.gender }));
    if (selectedItemId) payload.service_item = Number(selectedItemId);

    if (isCruiseBooking) {
      payload.destination = String(values.destination);
      payload.departure_port = String(values.departure_port);
      if (cruiseMonth && cruiseMonth.includes("-")) {
        const [year, month] = cruiseMonth.split("-");
        payload.departure_month = month;
        payload.departure_year = year;
      }
      payload.number_of_passengers = guests.length;
      if (cruiseNights) payload.nights = cruiseNights;
    } else if (serviceSlug === "corporate-travel") {
      const selectedServicesList = config.fields
        .filter((field) => field.kind === "checkbox" && Boolean(values[field.key]))
        .map((field) => field.label);

      payload.services_required = selectedServicesList.join(", ");
      payload.other_services_specified = String(values.other_services_specified || "");

      payload.company_name = String(values.company_name || "");
      payload.gst_number = String(values.gst_number || "");
      payload.pan_number = String(values.pan_number || "");
      payload.cin_number = String(values.cin_number || "");
      payload.industry_type = String(values.industry_type || "");
      payload.company_website = String(values.company_website || "");
      payload.company_address = String(values.company_address || "");
      payload.city = String(values.city || "");
      payload.state = String(values.state || "");
      payload.country = String(values.country || "");
      payload.pin_code = String(values.pin_code || "");

      payload.contact_person_name = String(values.contact_person_name || "");
      payload.designation = String(values.designation || "");
      payload.department = String(values.department || "");
      payload.official_email = String(values.official_email || "");
      payload.mobile_number = String(values.mobile_number || "");
      payload.alternate_contact_number = String(values.alternate_contact_number || "");

      if (values.travel_type) payload.travel_type = values.travel_type;
      payload.travel_purpose = String(values.travel_purpose || "");
      payload.from_city = String(values.from_city || "");
      payload.to_city = String(values.to_city || "");
      if (values.departure_date) payload.departure_date = String(values.departure_date);
      if (values.return_date) payload.return_date = String(values.return_date);

      if (values.number_of_adults !== "" && values.number_of_adults !== undefined) payload.number_of_adults = Number(values.number_of_adults);
      if (values.number_of_children !== "" && values.number_of_children !== undefined) payload.number_of_children = Number(values.number_of_children);
      if (values.number_of_infants !== "" && values.number_of_infants !== undefined) payload.number_of_infants = Number(values.number_of_infants);
      if (values.number_of_travellers !== "" && values.number_of_travellers !== undefined) payload.number_of_travellers = Number(values.number_of_travellers);
      if (values.number_of_rooms !== "" && values.number_of_rooms !== undefined) payload.number_of_rooms = Number(values.number_of_rooms);
      if (values.number_of_vehicles !== "" && values.number_of_vehicles !== undefined) payload.number_of_vehicles = Number(values.number_of_vehicles);

      payload.preferred_hotel_category = String(values.preferred_hotel_category || "");
      payload.preferred_airline = String(values.preferred_airline || "");
      payload.estimated_budget = String(values.estimated_budget || "");
      payload.monthly_travel_volume = String(values.monthly_travel_volume || "");
      payload.annual_travel_budget = String(values.annual_travel_budget || "");

      payload.credit_facility_required = values.credit_facility_required === "true" || values.credit_facility_required === true;
      payload.purchase_order_required = values.purchase_order_required === "true" || values.purchase_order_required === true;
      payload.gst_invoice_required = values.gst_invoice_required === "true" || values.gst_invoice_required === true;
      if (values.preferred_billing_cycle) payload.preferred_billing_cycle = values.preferred_billing_cycle;
      payload.dedicated_account_manager_required = values.dedicated_account_manager_required === "true" || values.dedicated_account_manager_required === true;

      payload.additional_requirements = message.trim() || String(values.additional_requirements || "");
      payload.declaration_accepted = consent;
    } else if (isEventManagement) {
      ["name", "email", "phone", "city", "event_date", "event_time", "event_location", "budget_amount", "event_theme"].forEach((key) => {
        const value = values[key];
        if (value !== "" && value !== undefined) payload[key] = value;
      });
      payload.schedule_party_for = config.fields
        .filter((field) => field.key.startsWith("party_") && Boolean(values[field.key]))
        .map((field) => field.label);
      payload.message = message.trim() || String(values.requirements || "");
    } else if (isHolidayPackage) {
      const packageId = Number(params.get("package"));
      const variantId = Number(params.get("variant"));
      const selectedHotelId = Number(params.get("selected_hotel"));
      if (Number.isInteger(packageId) && packageId > 0) payload.package = packageId;
      if (Number.isInteger(variantId) && variantId > 0) payload.variant = variantId;
      if (Number.isInteger(selectedHotelId) && selectedHotelId > 0) payload.selected_hotel = selectedHotelId;
      config.fields.forEach((field) => {
        const value = values[field.key];
        if (value === "" || value === undefined) return;
        if (["duration_days", "number_of_adults", "number_of_children", "number_of_infants"].includes(field.key)) payload[field.key] = Number(value);
        else payload[field.key] = value;
      });
      payload.services_required = String(values.services_required || "").split(",").map((item) => item.trim()).filter(Boolean);
    } else {
      config.fields.forEach((field) => {
        const value = values[field.key];
        if (value === "" || value === undefined) return;
        if (isTaxiBooking && field.key === "pickup_time" && /^\d{2}:\d{2}$/.test(String(value))) {
          payload[field.key] = `${value}:00`;
          return;
        }
        payload[field.key] = field.kind === "number" ? Number(value) : value;
      });
    }

    successChime.arm();
    try {
      const data = await submitServiceBooking({ serviceSlug, payload }).unwrap() as { data?: { booking?: { id?: number }; id?: number }; reference?: string };
      const bookingId = data?.data?.booking?.id ?? data?.data?.id;
      setReference(bookingId ? `BH${String(bookingId).padStart(6, "0")}` : data?.reference || "Submitted");
      successChime.play();
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
    }
  }

  const serviceTitle = serviceMeta?.name || config.title;
  const selectedTitle = selectedItemName || serviceTitle;
  const banner = selectedImage || serviceMeta?.banner_image || fallbackBanner;
  const cruiseDateMaximum = cruiseMonth ? lastDayOfMonth(cruiseMonth) : undefined;

  const stepsList = isCorporateTravel ? [
    { number: 1, title: "Company profile", desc: "Organisation & contact" },
    { number: 2, title: "Services & planning", desc: "Choose your support" },
    { number: 3, title: "Review & send", desc: "Confirm request" },
  ] : isEventManagement ? [
    { number: 1, title: "Event details", desc: "Contact, date & scope" },
    { number: 2, title: "Review request", desc: "Confirm event plan" },
    { number: 3, title: "Send request", desc: "Consent & submit" },
  ] : isHolidayPackage ? [
    { number: 1, title: "Travel details", desc: "Contact, dates & travellers" },
    { number: 2, title: "Package review", desc: "Confirm your selection" },
    { number: 3, title: "Send request", desc: "Preferences & consent" },
  ] : isTaxiBooking ? [
    { number: 1, title: "Ride details", desc: "Route, date & vehicle" },
    { number: 2, title: "Trip review", desc: "Confirm your ride" },
    { number: 3, title: "Send request", desc: "Preferences & consent" },
  ] : [
    { number: 1, title: isCruiseBooking ? "Cruise Search" : "Service Details", desc: "Requirements & specs" },
    { number: 2, title: "Traveller Details", desc: "Guest names & ages" },
    { number: 3, title: "Final Review", desc: "Preferences & submit" },
  ];

  if (reference) return (
    <BookingSuccessModal
      reference={reference}
      serviceName={selectedTitle}
      itemLabel={isHolidayPackage ? "Selected package" : selectedItemName ? "Selected hotel" : "Selected service"}
      heading="Your response is recorded"
      description="Our sales representative will get in touch with a personalised response."
      backHref="/services"
      backLabel="Back to services"
    />
  );

  return (
    <div className="min-h-screen overflow-x-clip bg-[#edf5f9] pb-10 text-[#122b42]">
      <section className="relative min-h-[350px] overflow-hidden bg-[#061f3b] px-4 pb-24 pt-8 text-white sm:min-h-[390px] sm:px-5 sm:pb-28 lg:px-8">
        <img src={banner} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061f3b]/95 via-[#061f3b]/76 to-[#061f3b]/25" />
        <div className="relative mx-auto max-w-[1360px]">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"><ArrowLeft className="size-4" /> All services</Link>
          <p className="mt-8 text-[11px] font-extrabold uppercase tracking-[.28em] text-[#13a5d8]">Booking Hospitality service</p>
          <h1 className="mt-3 max-w-4xl font-serif text-3xl leading-tight min-[380px]:text-4xl sm:text-5xl md:text-7xl">{config.title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65">{config.description}</p>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-16 max-w-[1360px] px-3 sm:-mt-20 sm:px-5 lg:px-8">
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
        <div id={isCruiseBooking ? "cruise-booking-details" : undefined} className={`grid overflow-hidden rounded-[1.5rem] bg-white shadow-[0_28px_90px_rgba(6,31,59,.22)] sm:rounded-[2rem] lg:grid-cols-[.72fr_1.28fr] ${isCruiseBooking ? "mt-6 scroll-mt-24" : ""}`}>
          <aside className="relative hidden overflow-hidden bg-[#061f3b] p-9 text-white lg:flex lg:flex-col">
            <div className="absolute -bottom-24 -left-24 size-64 rounded-full border border-white/5 shadow-[0_0_0_45px_rgba(255,255,255,.025),0_0_0_90px_rgba(255,255,255,.018)]" />
            <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-[#13a5d8]"><Send className="size-7" /></span>
            <h2 className="mt-8 font-serif text-3xl">{isCorporateTravel ? "Build your travel programme" : "Complete your booking request"}</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">{isCorporateTravel ? "Share the essentials first, then choose the services and preferences your organisation needs. Our team will prepare a tailored proposal." : "Share the journey and traveller details. Our team will verify availability, pricing and your special requirements."}</p>
            <div className="mt-8 space-y-4 text-sm text-white/75">
              {(isCorporateTravel ? ["One request for multiple services", "Tailored corporate proposal", "Dedicated travel support"] : ["Personal booking assistance", "Clear pricing review", "Verified service options"]).map((item) => <p key={item} className="flex items-center gap-3"><CheckCircle2 className="size-4 text-[#13a5d8]" />{item}</p>)}
            </div>

            {/* Side summary of filled details */}
            <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
              <p className="font-bold text-[#13a5d8] uppercase tracking-wider text-[10px]">Form Summary</p>
              <p className="flex justify-between"><span>Step:</span> <b className="text-white">Step {currentStep} of 3</b></p>
              <p className="flex justify-between"><span>{isCorporateTravel ? "Services:" : isTaxiBooking ? "Passengers:" : "Travellers:"}</span> <b className="text-white">{isCorporateTravel ? `${config.fields.filter((field) => field.kind === "checkbox" && Boolean(values[field.key])).length} selected` : isTaxiBooking ? String(values.number_of_passengers || "1") : `${guests.length} guest(s)`}</b></p>
            </div>

            <div className="relative mt-auto rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#13a5d8]">Selected service</p>
              <p className="mt-2 font-serif text-xl">{selectedTitle}</p>
              <p className="mt-2 flex items-center gap-2 text-xs text-white/50"><ShieldCheck className="size-3.5" />Secure request · No instant charge</p>
            </div>
          </aside>

          <section className="flex min-w-0 flex-col bg-white">
            <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-5 sm:px-6 md:px-9">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#087fbe]">Service enquiry</p><h2 className="mt-1 font-serif text-2xl text-[#061f3b] md:text-3xl">Booking details</h2></div>
              <div className="hidden rounded-xl border border-[#087fbe]/15 bg-[#f2f9fc] px-4 py-2 text-right sm:block"><p className="text-[9px] font-bold uppercase tracking-wider text-[#087fbe]">Selected</p><p className="max-w-52 truncate text-xs font-bold text-[#061f3b]">{selectedTitle}</p></div>
            </header>

            {/* Stepper Header Bar */}
            <div className="border-b border-slate-100 bg-[#f8fcff] px-3 py-4 sm:px-6 md:px-9">
              <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
                {stepsList.map((step) => {
                  const isActive = currentStep === step.number;
                  const isCompleted = currentStep > step.number;
                  return (
                    <button
                      key={step.number}
                      type="button"
                      onClick={() => {
                        if (isCompleted || step.number < currentStep) {
                          setCurrentStep(step.number);
                        } else if (step.number === currentStep + 1 && validateStep(currentStep)) {
                          setCurrentStep(step.number);
                        }
                      }}
                      className={`flex flex-1 items-center gap-3 rounded-2xl p-2.5 text-left transition ${
                        isActive
                          ? "border border-[#087fbe]/30 bg-white shadow-md shadow-[#087fbe]/10"
                          : isCompleted
                          ? "bg-white/80 hover:bg-white"
                          : "opacity-50"
                      }`}
                    >
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-xl text-xs font-extrabold transition ${
                          isCompleted
                            ? "bg-emerald-500 text-white"
                            : isActive
                            ? "bg-[#087fbe] text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {isCompleted ? <Check className="size-4" /> : step.number}
                      </span>
                      <div className="min-w-0">
                        <p className={`truncate text-xs font-bold ${isActive ? "text-[#061f3b]" : "text-slate-600"}`}>
                          {step.title}
                        </p>
                        <p className="hidden truncate text-[10px] font-medium text-slate-400 sm:block">
                          {step.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-gradient-to-r from-[#0875b7] to-[#13a5d8] transition-all duration-500"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>

            <form id={formId} onSubmit={submit} className="flex-1 px-6 py-7 md:px-9" noValidate>
              {/* STEP 1: Service details */}
              {currentStep === 1 && (
                <FormSection number="01" title={isCorporateTravel ? "Tell us about your organisation" : isCruiseBooking ? "Cruise Selection" : "Service details"} description={isCorporateTravel ? "Start with the essentials. You can add detailed travel and billing preferences in the next step." : isCruiseBooking ? "Confirm your cruise destination, departure port and travel month." : "Provide the information required for this booking."}>
                  {isCruiseBooking ? (
                    <div className="rounded-2xl border border-[#087fbe]/20 bg-[#f2f9fc] p-5 space-y-3">
                      <p className="text-xs font-bold text-[#087fbe] uppercase tracking-wider">Selected Cruise Criteria</p>
                      <div className="grid gap-3 sm:grid-cols-2 text-xs">
                        <p>Destination: <b className="text-[#061f3b]">{String(values.destination || "Not selected")}</b></p>
                        <p>Departure Port: <b className="text-[#061f3b]">{String(values.departure_port || "Not selected")}</b></p>
                        <p>Travel Month: <b className="text-[#061f3b]">{cruiseMonth || "Not selected"}</b></p>
                        <p>Duration: <b className="text-[#061f3b]">{cruiseNights ? `${cruiseNights} Nights` : "Flexible"}</b></p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {isCorporateTravel && <div className="sm:col-span-2 rounded-2xl border border-[#087fbe]/15 bg-[#f2f9fc] p-4 text-xs leading-5 text-[#456078]"><b className="text-[#087fbe]">Quick to complete:</b> only the key company and contact details are shown here. The rest is optional and comes next.</div>}
                      {(() => {
                        const checkboxFields = visibleFields.filter((f) => f.kind === "checkbox");
                        const standardFields = visibleFields.filter((f) => f.kind !== "checkbox");
                        const hasMultipleCheckboxes = checkboxFields.length >= 3;

                        if (hasMultipleCheckboxes) {
                          return (
                            <>
                              {standardFields.map((field) => (
                                <DynamicField key={field.key} field={field} value={values[field.key]} update={update} minDate={dateMinimum} maxDate={cruiseDateMaximum} />
                              ))}
                              <MultiSelectServicesDropdown fields={checkboxFields} values={values} update={update} />
                            </>
                          );
                        }

                        return visibleFields.map((field) => (
                          <DynamicField key={field.key} field={field} value={values[field.key]} update={update} minDate={dateMinimum} maxDate={cruiseDateMaximum} />
                        ));
                      })()}
                    </div>
                  )}
                </FormSection>
              )}

              {/* STEP 2: Traveller information */}
              {currentStep === 2 && (
                isHolidayPackage ? <FormSection number="02" title="Review package selection" description="Confirm the package choices carried forward from the holiday catalogue.">
                  <div className="grid gap-3 rounded-2xl border border-[#087fbe]/15 bg-[#f2f9fc] p-5 text-sm text-[#456078] sm:grid-cols-2">
                    <p>Package: <b className="text-[#061f3b]">{selectedItemName}</b></p>
                    <p>Destination: <b className="text-[#061f3b]">{String(values.destination || "Not selected")}</b></p>
                    <p>Tier: <b className="capitalize text-[#061f3b]">{String(values.budget_category || values.ltc_tier || "Not selected")}</b></p>
                    <p>Hotel: <b className="text-[#061f3b]">{String(values.hotel_preference || "No preference")}</b></p>
                    <p>Adults: <b className="text-[#061f3b]">{String(values.number_of_adults || "0")}</b></p>
                    <p>Children: <b className="text-[#061f3b]">{String(values.number_of_children || "0")}</b></p>
                  </div>
                </FormSection> : isTaxiBooking ? <FormSection number="02" title="Review taxi request" description="Confirm the route, schedule and vehicle preference entered in Step 1.">
                  <div className="grid gap-3 rounded-2xl border border-[#087fbe]/15 bg-[#f2f9fc] p-5 text-sm text-[#456078] sm:grid-cols-2">
                    <p>Pickup: <b className="text-[#061f3b]">{String(values.pickup_location || "Not provided")}</b></p>
                    <p>Drop: <b className="text-[#061f3b]">{String(values.drop_location || "Not provided")}</b></p>
                    <p>Date: <b className="text-[#061f3b]">{String(values.pickup_date || "Not selected")}</b></p>
                    <p>Time: <b className="text-[#061f3b]">{String(values.pickup_time || "Flexible")}</b></p>
                    <p>Trip: <b className="capitalize text-[#061f3b]">{String(values.trip_type || "No preference").replaceAll("_", " ")}</b></p>
                    <p>Vehicle: <b className="capitalize text-[#061f3b]">{String(values.vehicle_type || "No preference").replaceAll("_", " ")}</b></p>
                    <p>Passengers: <b className="text-[#061f3b]">{String(values.number_of_passengers || "1")}</b></p>
                  </div>
                </FormSection> : isCorporateTravel ? <FormSection number="02" title="Services and planning preferences" description="Choose the support you need. Planning and billing details are optional, but help us tailor your proposal.">
                  <div className="rounded-2xl border border-slate-200 bg-[#fbfdff] p-4 md:p-5">
                    <MultiSelectServicesDropdown fields={config.fields.filter((field) => field.kind === "checkbox")} values={values} update={update} />
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {config.fields.filter((field) => corporatePlanningKeys.includes(field.key)).map((field) => <DynamicField key={field.key} field={field} value={values[field.key]} update={update} minDate={dateMinimum} />)}
                  </div>
                </FormSection> : isEventManagement ? <FormSection number="02" title="Review event scope" description="Confirm the contact details, date and services entered in Step 1.">
                  <div className="grid gap-3 rounded-2xl border border-[#087fbe]/15 bg-[#f2f9fc] p-5 text-sm text-[#456078] sm:grid-cols-2">
                    <p>Contact: <b className="text-[#061f3b]">{String(values.name || "Not provided")}</b></p>
                    <p>Event date: <b className="text-[#061f3b]">{String(values.event_date || "Not selected")}</b></p>
                    <p>City: <b className="text-[#061f3b]">{String(values.city || "Not provided")}</b></p>
                    <p>Services: <b className="text-[#061f3b]">{config.fields.filter((field) => field.key.startsWith("party_") && Boolean(values[field.key])).length} selected</b></p>
                  </div>
                </FormSection> : <FormSection number="02" title="Traveller information" description="Add one row for every traveller included in the request.">
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
              )}

              {/* STEP 3: Final Review & Confirmation */}
              {currentStep === 3 && (
                <FormSection number="03" title="Final details & Confirmation" description="Share preferences, review details and confirm contact permission.">
                  <div className="mb-6 rounded-2xl border border-slate-100 bg-[#f9fcfe] p-5 space-y-3">
                    <p className="text-xs font-bold text-[#087fbe] uppercase tracking-wider">Request Review Summary</p>
                    <div className="grid gap-2 sm:grid-cols-2 text-xs text-slate-600">
                      <p>Service: <b className="text-[#061f3b]">{selectedTitle}</b></p>
                      {isCorporateTravel ? <><p>Company: <b className="text-[#061f3b]">{String(values.company_name || "Not provided")}</b></p><p>Services selected: <b className="text-[#061f3b]">{config.fields.filter((field) => field.kind === "checkbox" && Boolean(values[field.key])).length}</b></p><p>Contact: <b className="text-[#061f3b]">{String(values.contact_person_name || "Not provided")}</b></p></> : isEventManagement ? <><p>Contact: <b className="text-[#061f3b]">{String(values.name || "Not provided")}</b></p><p>Event date: <b className="text-[#061f3b]">{String(values.event_date || "Not selected")}</b></p></> : isTaxiBooking ? <><p>Route: <b className="text-[#061f3b]">{String(values.pickup_location)} to {String(values.drop_location)}</b></p><p>Passengers: <b className="text-[#061f3b]">{String(values.number_of_passengers || "1")}</b></p></> : <p>Total Travellers: <b className="text-[#061f3b]">{guests.length} guest(s) ({guests[0]?.name || "Primary guest"})</b></p>}
                    </div>
                  </div>

                  <label className="block"><span className="mb-2 block text-xs font-bold text-[#456078]">Additional message / Preferences</span><span className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10"><MessageSquareText className="mt-1 size-5 shrink-0 text-[#087fbe]" /><textarea maxLength={2000} rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Preferences, special travel, accommodation, or billing requirements..." className="min-w-0 flex-1 resize-none text-sm outline-none" /></span></label>
                  <label className="mt-4 flex items-start gap-3 rounded-xl bg-[#f2f9fc] p-4 text-xs leading-5 text-slate-600"><input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 size-4 accent-[#087fbe]" /><span>I consent to being contacted about this booking request.</span></label>
                </FormSection>
              )}

              {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
            </form>

            <footer className="flex items-center justify-between gap-4 border-t border-slate-100 bg-white px-6 py-4 shadow-[0_-12px_30px_rgba(6,31,59,.06)] md:px-9">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  <ChevronLeft className="size-4" /> Back to Step {currentStep - 1}
                </button>
              ) : (
                <p className="hidden text-xs text-slate-400 sm:flex sm:items-center sm:gap-2">
                  <Sparkles className="size-4 text-[#13a5d8]" /> Step 1 of 3 · Booking details
                </p>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-[#087fbe]/20 transition hover:-translate-y-0.5"
                >
                  Continue to Step {currentStep + 1} <ChevronRight className="size-4" />
                </button>
              ) : (
                <button
                  form={formId}
                  type="submit"
                  disabled={submitting || loadingService}
                  className="ml-auto inline-flex min-w-52 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#087fbe]/20 transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {loadingService ? "Loading..." : submitting ? "Submitting..." : "Submit request"}
                  <ArrowRight className="size-4" />
                </button>
              )}
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
  if (["company_name", "industry_type", "company_website", "company_address"].includes(field.key)) return <Building2 className="size-4" />;
  if (["gst_number", "pan_number", "cin_number"].includes(field.key)) return <Landmark className="size-4" />;
  if (["contact_person_name", "designation", "department"].includes(field.key)) return <UserRound className="size-4" />;
  if (field.key === "official_email") return <Mail className="size-4" />;
  if (["mobile_number", "alternate_contact_number"].includes(field.key)) return <Phone className="size-4" />;
  if (["credit_facility_required", "purchase_order_required", "gst_invoice_required", "preferred_billing_cycle", "dedicated_account_manager_required"].includes(field.key)) return <BadgeInfo className="size-4" />;
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

function MultiSelectServicesDropdown({
  fields,
  values,
  update,
}: {
  fields: BookingField[];
  values: Record<string, string | boolean>;
  update: (key: string, value: string | boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedFields = fields.filter((f) => Boolean(values[f.key]));
  const filteredFields = fields.filter((f) =>
    f.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAll = (select: boolean) => {
    fields.forEach((f) => update(f.key, select));
  };

  return (
    <div className="relative sm:col-span-2 my-2">
      <span className="mb-2 block text-xs font-bold text-[#456078]">
        Select Services Required ({fields.length} options available)
      </span>

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-left transition hover:border-[#087fbe] focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10"
      >
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <CheckSquare className="size-5 shrink-0 text-[#087fbe]" />
          <div className="min-w-0 flex-1">
            {selectedFields.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#e5f5fc] px-2 py-0.5 text-xs font-bold text-[#087fbe]">
                  {selectedFields.length} selected
                </span>
                <p className="truncate text-xs text-slate-600 font-semibold">
                  {selectedFields.map((f) => f.label).join(", ")}
                </p>
              </div>
            ) : (
              <span className="text-sm font-semibold text-slate-400">
                Click to open service selection list ({fields.length} services available)...
              </span>
            )}
          </div>
        </div>
        {isOpen ? <ChevronUp className="size-5 text-slate-400 shrink-0" /> : <ChevronDown className="size-5 text-slate-400 shrink-0" />}
      </button>

      {/* Selected Tags Chips Display */}
      {selectedFields.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {selectedFields.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#087fbe]/20 bg-[#f0f9fd] px-2.5 py-1 text-xs font-semibold text-[#0879b7]"
            >
              {f.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  update(f.key, false);
                }}
                className="rounded-full p-0.5 hover:bg-[#087fbe]/20 text-[#0879b7]"
                title="Remove"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-[#061f3b]/15">
          {/* Header Bar inside Dropdown */}
          <div className="border-b border-slate-100 bg-[#f8fcff] p-3 space-y-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <Search className="size-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search services..."
                className="w-full text-xs font-semibold text-[#122b42] outline-none"
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm("")} className="text-slate-400 hover:text-slate-600">
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleAll(true)}
                  className="text-[#087fbe] hover:underline"
                >
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => toggleAll(false)}
                  className="text-slate-500 hover:underline"
                >
                  Clear All
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-[#087fbe] px-3.5 py-1 text-white hover:bg-[#066497]"
              >
                Done
              </button>
            </div>
          </div>

          {/* Scrollable Checkbox Items List */}
          <div className="max-h-[260px] overflow-y-auto p-2 space-y-1">
            {filteredFields.length > 0 ? (
              filteredFields.map((field) => {
                const isChecked = Boolean(values[field.key]);
                return (
                  <label
                    key={field.key}
                    className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                      isChecked
                        ? "bg-[#edf8fd] text-[#0879b7]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => update(field.key, e.target.checked)}
                        className="size-4 accent-[#087fbe] rounded"
                      />
                      {field.label}
                    </span>
                    {isChecked && <Check className="size-4 text-[#087fbe]" />}
                  </label>
                );
              })
            ) : (
              <p className="p-4 text-center text-xs text-slate-400">No services match &quot;{searchTerm}&quot;</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
