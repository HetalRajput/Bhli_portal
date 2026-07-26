"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Mail, MessageSquareText, Phone, Send, UserRound, UsersRound } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { cmsService } from "@/lib/api/cms";
import { bookingService } from "@/lib/api/bookings";
import { getErrorMessage } from "@/lib/api/client";

type ServiceData = {
  id?: number;
  name?: string;
  title?: string;
  slug?: string;
  short_description?: string;
  description?: string;
  banner_image?: string | null;
};

const fallbackBanner = "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1600";

export default function GenericServiceEnquiry({ serviceSlug }: { serviceSlug?: string }) {
  const params = useParams<{ slug?: string }>();
  const searchParams = useSearchParams();
  const destinationParam = searchParams ? searchParams.get("destination") : null;
  const slug = serviceSlug || params.slug || "";
  const [service, setService] = useState<ServiceData | null>(null);
  const [loadingService, setLoadingService] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", travelDate: "", travellers: "1", message: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (destinationParam) {
      const serviceName = slug ? slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Booking";
      setForm((prev) => (prev.message ? prev : { ...prev, message: `${serviceName} requirement for: ${destinationParam}` }));
    }
  }, [destinationParam, slug]);

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
          // The fallback title still keeps the request form usable.
        }
      } finally {
        if (active) setLoadingService(false);
      }
    }
    load();
    return () => { active = false; };
  }, [slug]);

  const title = service?.name || service?.title || slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  const description = service?.description || service?.short_description || `Tell us what you need for ${title}. Our team will contact you with the best available options.`;
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Please enter a valid email address.");
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return setError("Please enter a valid 10-digit Indian mobile number.");
    if (form.message.trim().length < 10) return setError("Please provide a few details about your requirement.");
    setSubmitting(true);
    const payload = {
      service_type: slug,
      service_name: title,
      customer_name: form.name.trim(),
      customer_email: form.email.trim(),
      customer_mobile: form.mobile,
      travel_date: form.travelDate || undefined,
      number_of_travellers: Number(form.travellers),
      message: form.message.trim(),
    };
    try {
      const result = await bookingService.createGenericBooking(payload);
      setReference(result?.reference || result?.booking_reference || `BH${Date.now().toString().slice(-8)}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#061f3b] px-5 py-24">
        <section className="w-full max-w-lg rounded-[2rem] bg-white p-9 text-center shadow-2xl md:p-12">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 className="size-10" /></span>
          <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-emerald-600">Request submitted</p>
          <h1 className="mt-3 font-serif text-4xl text-[#061f3b]">We’ll contact you soon</h1>
          <p className="mt-4 text-sm leading-7 text-black/50">Your {title} request has been received. Reference: <b className="text-[#087fbe]">{reference}</b></p>
          <Link href="/services" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#061f3b] px-7 py-3.5 font-bold text-white">Explore services<ArrowRight className="size-4" /></Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f8fb] pb-20 text-[#122b42]">
      <section className="relative flex min-h-[390px] items-end overflow-hidden px-5 pb-24 pt-28 text-white lg:px-8">
        <img src={service?.banner_image || fallbackBanner} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061f3b]/95 via-[#061f3b]/75 to-[#087fbe]/35" />
        <div className="relative mx-auto w-full max-w-7xl">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"><ArrowLeft className="size-4" />All services</Link>
          <p className="mt-9 text-xs font-bold uppercase tracking-[.24em] text-[#13a5d8]">Booking Hospitality service</p>
          <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">{loadingService ? "Loading service..." : title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65">{description}</p>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-14 max-w-6xl px-5 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_25px_80px_rgba(6,31,59,.16)] lg:grid-cols-[.75fr_1.25fr]">
          <aside className="bg-[#061f3b] p-8 text-white md:p-10">
            <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-[#13a5d8]"><Send className="size-6" /></span>
            <h2 className="mt-7 font-serif text-3xl">Tell us your requirement</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">Share a few details and our service team will contact you with availability, pricing and the next steps.</p>
            <div className="mt-9 space-y-4 text-sm text-white/70">
              {["Personal assistance", "Clear pricing", "Verified service options"].map((item) => <p key={item} className="flex items-center gap-3"><CheckCircle2 className="size-4 text-[#13a5d8]" />{item}</p>)}
            </div>
          </aside>

          <form onSubmit={submit} className="p-7 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#087fbe]">Service enquiry</p>
            <h2 className="mt-2 font-serif text-3xl text-[#061f3b]">Contact details</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <FormField label="Full name" icon={<UserRound />}><input required minLength={2} value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Your full name" /></FormField>
              <FormField label="Mobile number" icon={<Phone />}><input required type="tel" inputMode="numeric" maxLength={10} pattern="[6-9][0-9]{9}" value={form.mobile} onChange={(event) => update("mobile", event.target.value.replace(/\D/g, ""))} placeholder="9876543210" /></FormField>
              <FormField label="Email address" icon={<Mail />}><input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="name@email.com" /></FormField>
              <FormField label="Preferred date" icon={<CalendarDays />}><input type="date" min={new Date().toISOString().slice(0, 10)} value={form.travelDate} onChange={(event) => update("travelDate", event.target.value)} /></FormField>
              <FormField label="Number of travellers" icon={<UsersRound />}><select value={form.travellers} onChange={(event) => update("travellers", event.target.value)}>{Array.from({ length: 20 }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value} traveller{value > 1 ? "s" : ""}</option>)}</select></FormField>
              <div className="sm:col-span-2"><label className="block"><span className="mb-2 block text-xs font-bold text-[#456078]">Your requirement</span><span className="flex gap-3 rounded-xl border border-black/10 px-4 py-3 text-black/30 focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10"><MessageSquareText className="mt-0.5 size-5 shrink-0" /><textarea required minLength={10} rows={4} value={form.message} onChange={(event) => update("message", event.target.value)} placeholder={`Tell us what you need for ${title}...`} className="min-w-0 flex-1 resize-none bg-transparent text-sm text-[#122b42] outline-none" /></span></label></div>
            </div>
            {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
            <button disabled={submitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60">{submitting ? "Submitting..." : "Submit request"}<ArrowRight className="size-4" /></button>
          </form>
        </div>
      </main>
    </div>
  );
}

function FormField({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-[#456078]">{label}</span><span className="flex h-14 items-center gap-3 rounded-xl border border-black/10 px-4 text-black/30 transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10 [&_input]:h-full [&_input]:min-w-0 [&_input]:flex-1 [&_input]:bg-transparent [&_input]:text-sm [&_input]:text-[#122b42] [&_input]:outline-none [&_select]:h-full [&_select]:min-w-0 [&_select]:flex-1 [&_select]:bg-transparent [&_select]:text-sm [&_select]:text-[#122b42] [&_select]:outline-none">{icon}{children}</span></label>;
}
