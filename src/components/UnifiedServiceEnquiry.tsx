"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, MapPin, MessageSquareText, Send, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import BookingSuccessModal from "@/components/BookingSuccessModal";
import { bookingService } from "@/lib/api/bookings";
import { getErrorMessage } from "@/lib/api/client";
import { cmsService } from "@/lib/api/cms";
import { useSuccessChime } from "@/hooks/useSuccessChime";

type ServiceData = {
  id?: number;
  name?: string;
  title?: string;
  slug?: string;
  service_type?: string;
  short_description?: string;
  description?: string;
  banner_image?: string | null;
  booking_mode?: "items" | "third_party" | "form";
  requires_service_item?: boolean;
};

const fallbackBanner = "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1600";
const displaySlug = (slug: string) => slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

function UnifiedServiceEnquiryInner({ serviceSlug }: { serviceSlug?: string }) {
  const params = useParams<{ slug?: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = serviceSlug || params.slug || "";
  const destination = searchParams.get("destination") || "";
  const holidayPackageType = searchParams.get("type");
  const holidayPackageLabel = holidayPackageType === "domestic" ? "Domestic holiday package" : holidayPackageType === "international" ? "International holiday package" : "";
  const initialTitle = displaySlug(slug) || "Service Booking";
  const [service, setService] = useState<ServiceData | null>(null);
  const [loadingService, setLoadingService] = useState(true);
  const [form, setForm] = useState({ message: holidayPackageLabel ? `${holidayPackageLabel} enquiry. Please share availability, itinerary and pricing.` : destination ? `${initialTitle} requirement for: ${destination}` : "", fromCity: "", toCity: destination, travelDate: "" });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");
  const minimumDate = "";
  const successChime = useSuccessChime();
  const formId = `service-enquiry-${slug}`;

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const result = await cmsService.getServiceDetail(slug);
        if (result?.success && result.data) {
          if (active) setService(result.data);
          return;
        }
        throw new Error("Service detail was not returned");
      } catch {
        try {
          const result = await cmsService.getServices();
          const match = result?.data?.find((item: ServiceData) => item.slug === slug);
          if (active && match) setService(match);
        } catch {
          // The fallback title keeps the enquiry usable if service metadata is unavailable.
        }
      } finally {
        if (active) setLoadingService(false);
      }
    }
    load();
    return () => { active = false; };
  }, [slug]);

  const title = service?.name || service?.title || initialTitle;
  const description = service?.description || service?.short_description || `Tell us what you need for ${title}. Our team will contact you with the best available options.`;
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const serviceTypeMap: Record<string, string> = {
    "self-drive-car-rentals": "taxi", "taxi-services": "taxi", "flight-booking": "flight", "flight-bookings": "flight",
    "bus-ticket-booking": "bus", "train-ticket-booking": "train", "cruise-booking": "cruise", "cruise-holidays": "cruise",
    "holiday-packages": "holiday_package", "visa-assistance": "visa",
  };
  const bookingType = service?.service_type || serviceTypeMap[slug] || "service";
  const requiresJourney = ["flight", "bus", "train", "taxi"].includes(bookingType);
  const bookingMode = service?.booking_mode;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!service?.id) return setError("This service is not available for booking right now. Please refresh and try again.");
    if (bookingMode === "items" || service.requires_service_item) return setError("Please select an available service item before booking.");
    if (bookingMode === "third_party") return setError("This service uses a third-party booking flow. Please continue through its provider option.");
    if (bookingMode !== "form") return setError("The booking flow for this service is not configured yet.");
    if (!form.travelDate) return setError("Please select a preferred date.");
    if (requiresJourney && (!form.fromCity.trim() || !form.toCity.trim())) return setError("Please enter the pickup city and destination.");
    if (form.message.trim().length < 10) return setError("Please provide a few details about your requirement.");
    if (!consent) return setError("Please consent to contact before submitting your request.");
    if (!localStorage.getItem("access_token")) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    const journeyMessage = requiresJourney ? `${form.message.trim()}\nFrom: ${form.fromCity.trim()}\nTo: ${form.toCity.trim()}` : form.message.trim();
    successChime.arm();
    setSubmitting(true);
    try {
      const result = await bookingService.createSimpleBooking({ service: service.id, date: form.travelDate, message: journeyMessage, consent_to_contact: consent });
      const id = result?.data?.id;
      setReference(id ? `BH${String(id).padStart(6, "0")}` : result?.reference || result?.booking_reference || "Submitted");
      successChime.play();
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) return <BookingSuccessModal reference={reference} serviceName={title} heading="Your booking request is successfully saved" description="Our agent will contact you shortly, thank you!" />;

  return (
    <div className="min-h-screen bg-[#edf5f9] pb-10 text-[#122b42]">
      <section className="relative min-h-[390px] overflow-hidden bg-[#061f3b] px-5 pb-28 pt-8 text-white lg:px-8">
        <img src={service?.banner_image || fallbackBanner} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061f3b]/95 via-[#061f3b]/76 to-[#061f3b]/25" />
        <div className="relative mx-auto max-w-[1360px]">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"><ArrowLeft className="size-4" /> All services</Link>
          <p className="mt-8 text-[11px] font-extrabold uppercase tracking-[.28em] text-[#13a5d8]">Booking Hospitality service</p>
          <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-none md:text-7xl">{loadingService ? "Loading service..." : title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65">{description}</p>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-20 max-w-[1360px] px-5 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_90px_rgba(6,31,59,.22)] lg:grid-cols-[.72fr_1.28fr]">
          <aside className="relative hidden min-h-[760px] overflow-hidden bg-[#061f3b] p-9 text-white lg:flex lg:flex-col">
            <div className="absolute -bottom-24 -left-24 size-64 rounded-full border border-white/5 shadow-[0_0_0_45px_rgba(255,255,255,.025),0_0_0_90px_rgba(255,255,255,.018)]" />
            <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-[#13a5d8]"><Send className="size-7" /></span>
            <h2 className="mt-8 font-serif text-3xl">Tell us your requirement</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">Share a few details and our service team will contact you with availability, pricing and the next steps.</p>
            <div className="mt-8 space-y-4 text-sm text-white/75">
              {["Personal booking assistance", "Clear pricing review", "Verified service options"].map((item) => <p key={item} className="flex items-center gap-3"><CheckCircle2 className="size-4 text-[#13a5d8]" />{item}</p>)}
            </div>
            <div className="relative mt-auto rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#13a5d8]">Selected service</p>
              <p className="mt-2 font-serif text-xl">{title}</p>
              <p className="mt-2 flex items-center gap-2 text-xs text-white/50"><ShieldCheck className="size-3.5" />Secure request · Personal response</p>
            </div>
          </aside>

          <section className="flex min-w-0 flex-col bg-white">
            <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 md:px-9">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#087fbe]">Service enquiry</p><h2 className="mt-1 font-serif text-2xl text-[#061f3b] md:text-3xl">Booking details</h2></div>
              <div className="hidden rounded-xl border border-[#087fbe]/15 bg-[#f2f9fc] px-4 py-2 text-right sm:block"><p className="text-[9px] font-bold uppercase tracking-wider text-[#087fbe]">Selected</p><p className="max-w-52 truncate text-xs font-bold text-[#061f3b]">{title}</p></div>
            </header>

            <form id={formId} onSubmit={submit} className="flex-1 px-6 py-7 md:px-9" noValidate>
              <EnquirySection number="01" title="Journey details" description="Choose the date and locations for your request.">
                {requiresJourney && <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Pickup city" icon={<MapPin />}><input required value={form.fromCity} onChange={(event) => update("fromCity", event.target.value)} placeholder="From city" /></Field>
                  <Field label="Destination" icon={<MapPin />}><input required value={form.toCity} onChange={(event) => update("toCity", event.target.value)} placeholder="To city" /></Field>
                </div>}
                <div className={requiresJourney ? "mt-4" : ""}><Field label="Preferred date" icon={<CalendarDays />}><input required type="date" min={minimumDate} value={form.travelDate} onChange={(event) => update("travelDate", event.target.value)} /></Field></div>
              </EnquirySection>

              <EnquirySection number="02" title="Your requirement" description="Describe what our service team should arrange.">
                <label className="block"><span className="mb-2 block text-xs font-bold text-[#456078]">Requirement details</span><span className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10"><MessageSquareText className="mt-1 size-5 shrink-0 text-[#087fbe]" /><textarea required minLength={10} maxLength={2000} rows={5} value={form.message} onChange={(event) => update("message", event.target.value)} placeholder={`Briefly describe what you need for ${title}...`} className="min-w-0 flex-1 resize-none text-sm leading-6 outline-none" /></span></label>
              </EnquirySection>

              <EnquirySection number="03" title="Contact permission" description="Confirm that our team may contact you about the request.">
                <label className="flex items-start gap-3 rounded-xl bg-[#f2f9fc] p-4 text-xs leading-5 text-slate-600"><input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 size-4 accent-[#087fbe]" /><span>I consent to being contacted about this booking request.</span></label>
              </EnquirySection>
              {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
            </form>

            <footer className="flex items-center justify-between gap-4 border-t border-slate-100 bg-white px-6 py-4 shadow-[0_-12px_30px_rgba(6,31,59,.06)] md:px-9">
              <p className="hidden text-xs text-slate-400 sm:flex sm:items-center sm:gap-2"><Sparkles className="size-4 text-[#13a5d8]" />Reviewed by the BHLI service desk</p>
              <button form={formId} disabled={submitting || loadingService || bookingMode !== "form"} className="ml-auto inline-flex min-w-52 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#087fbe]/20 transition hover:-translate-y-0.5 disabled:opacity-60">{loadingService ? "Loading..." : bookingMode === "third_party" ? "Third-party booking" : bookingMode === "items" ? "Select an option" : submitting ? "Submitting..." : "Submit request"}<ArrowRight className="size-4" /></button>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}

function EnquirySection({ number, title, description, children }: { number: string; title: string; description: string; children: React.ReactNode }) {
  return <section className="mb-8"><div className="mb-4 flex items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e4f5fb] text-[10px] font-extrabold text-[#087fbe]">{number}</span><div><h3 className="text-sm font-bold text-[#061f3b]">{title}</h3><p className="mt-0.5 text-[11px] text-slate-400">{description}</p></div></div>{children}</section>;
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-[#456078]">{label}</span><span className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-400 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10 [&_svg]:size-4 [&_input]:h-full [&_input]:min-w-0 [&_input]:flex-1 [&_input]:bg-transparent [&_input]:text-sm [&_input]:font-semibold [&_input]:text-[#122b42] [&_input]:outline-none">{icon}{children}</span></label>;
}

export default function UnifiedServiceEnquiry({ serviceSlug }: { serviceSlug?: string }) {
  return <Suspense fallback={<div className="min-h-screen bg-[#edf5f9]" />}><UnifiedServiceEnquiryInner serviceSlug={serviceSlug} /></Suspense>;
}
