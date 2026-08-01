"use client";

import { AlertCircle, Check, Mail, MessageSquareText, Phone, Send, ShieldCheck, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { baseService, type ContactLeadPayload } from "@/lib/api/base";
import { getErrorMessage } from "@/lib/api/client";

interface EnquiryTypeItem {
  id: number;
  name: string;
  slug: string;
}

const fieldClass = "w-full rounded-xl border border-[#087fbe]/15 bg-[#f8fbfd] px-4 py-3 text-sm text-[#122b42] outline-none transition focus:border-[#087fbe] focus:bg-white focus:ring-4 focus:ring-[#13a5d8]/10 placeholder:text-black/30";
const labelClass = "grid gap-2 text-xs font-bold uppercase tracking-[.08em] text-[#456276]";

export default function EnquiryWidget() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enquiryTypes, setEnquiryTypes] = useState<EnquiryTypeItem[]>([]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || enquiryTypes.length > 0) return;
    baseService.getEnquiryTypes().then((response) => {
      const items = response?.success && Array.isArray(response.data)
        ? response.data
        : Array.isArray(response) ? response : [];
      setEnquiryTypes(items);
    }).catch((fetchError) => console.warn("Failed to fetch enquiry types", fetchError));
  }, [open, enquiryTypes.length]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const mobile = String(data.get("mobile") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const enquiryType = String(data.get("enquiryType") || "").trim();

    if (!name || !mobile || !email || !message || !enquiryType) {
      setError("Please complete all required fields marked with *.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    const selectedType = enquiryTypes.find((type) => String(type.id) === enquiryType);
    const payload: ContactLeadPayload = {
      name,
      email,
      mobile_number: mobile,
      subject: "General Contact - " + (selectedType?.name || enquiryType),
      message,
    };
    if (selectedType) payload.enquiry_type = selectedType.id;

    setError("");
    setIsSubmitting(true);
    try {
      await baseService.createContactLead(payload);
      setSubmitted(true);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function close() {
    setOpen(false);
    window.setTimeout(() => {
      setSubmitted(false);
      setError("");
    }, 300);
  }

  return (
    <>
      <a href="https://wa.me/919945123211?text=Hello%20BHLI%2C%20I%20need%20help%20with%20a%20booking." target="_blank" rel="noopener noreferrer" aria-label="Chat with BHLI on WhatsApp" title="WhatsApp support" className="group fixed bottom-24 right-5 z-[70] grid size-14 place-items-center rounded-full border border-white/60 bg-gradient-to-br from-[#128C5B] to-[#25D366] text-white shadow-[0_12px_30px_rgba(16,120,65,.35)] transition duration-300 hover:-translate-y-1 sm:bottom-28 sm:right-7">
        <svg viewBox="0 0 32 32" aria-hidden="true" className="size-6 fill-current"><path d="M16.04 3.2A12.7 12.7 0 0 0 5.31 22.7L3.2 28.8l6.27-2.07A12.8 12.8 0 1 0 16.04 3.2Zm0 23.43c-2.1 0-4.15-.57-5.93-1.65l-.43-.25-3.72 1.23 1.25-3.62-.28-.45a10.63 10.63 0 1 1 9.11 4.74Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.3-.11-.51-.16-.73.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59a9.6 9.6 0 0 1-1.78-2.21c-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.99-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.25 3.44 5.46 4.82.76.33 1.36.53 1.82.68.76.24 1.46.21 2.01.13.61-.09 1.89-.77 2.15-1.52.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37Z" /></svg>
      </a>

      <button type="button" onClick={() => setOpen(true)} aria-label="Open contact form" title="Contact BHLI" className="group fixed bottom-5 right-5 z-[70] grid size-14 place-items-center rounded-full border border-white/40 bg-gradient-to-br from-[#03182e] via-[#062b50] to-[#074a78] text-white shadow-[0_12px_35px_rgba(2,20,40,.45)] transition duration-300 hover:-translate-y-1 sm:bottom-7 sm:right-7">
        <MessageSquareText className="size-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end bg-[#031629]/60 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-label="Contact form" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <div className="flex max-h-[96dvh] w-full animate-[enquiry-slide-up_.45s_cubic-bezier(.22,1,.36,1)] flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-2xl sm:max-w-2xl sm:rounded-[1.75rem]">
            <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#061f3b] to-[#087fbe] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-white/12"><MessageSquareText className="size-5" /></span>
                <div><h2 className="font-serif text-xl font-semibold">Contact Us</h2><p className="text-xs text-white/65">Tell us how we can help</p></div>
              </div>
              <button type="button" onClick={close} aria-label="Close contact form" className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"><X className="size-5" /></button>
            </header>

            {submitted ? (
              <div className="grid flex-1 place-items-center overflow-y-auto p-8 text-center">
                <div className="max-w-md">
                  <span className="mx-auto grid size-20 place-items-center rounded-full bg-[#e4f8ee] text-[#178653]"><Check className="size-10" /></span>
                  <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-[#178653]">Enquiry submitted</p>
                  <h3 className="mt-3 font-serif text-3xl">Thank you for contacting us</h3>
                  <p className="mt-4 leading-7 text-black/60">Our team has received your message and will get back to you shortly.</p>
                  <button onClick={close} className="mt-7 rounded-full bg-[#061f3b] px-7 py-3 font-bold text-white">Done</button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="min-h-0 flex-1 overflow-y-auto">
                <div className="mx-auto max-w-xl space-y-6 p-5 pb-10 sm:p-8">
                  <div className="flex gap-3 rounded-2xl border border-[#087fbe]/12 bg-[#edf8fd] p-4 text-sm leading-6 text-[#456276]"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#087fbe]" />Share your requirement and the right BHLI desk will contact you shortly.</div>
                  {error && <div role="alert" className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"><AlertCircle className="size-5 shrink-0" /><span>{error}</span></div>}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className={labelClass}>Full name *<input name="name" autoComplete="name" className={fieldClass} placeholder="Your full name" /></label>
                    <label className={labelClass}>Phone number *<div className="relative"><Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#087fbe]" /><input name="mobile" inputMode="numeric" autoComplete="tel" maxLength={10} className={fieldClass + " pl-11"} placeholder="10-digit mobile number" /></div></label>
                    <label className={labelClass}>Email address *<div className="relative"><Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#087fbe]" /><input name="email" type="email" autoComplete="email" className={fieldClass + " pl-11"} placeholder="you@example.com" /></div></label>
                    <label className={labelClass}>Enquiry type *<select name="enquiryType" className={fieldClass} defaultValue=""><option value="" disabled>Select enquiry type</option>{enquiryTypes.length > 0 ? enquiryTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>) : <><option value="Leisure travel">Leisure travel</option><option value="Defence travel">Defence travel</option><option value="Government / Corporate">Government / Corporate</option><option value="Event management">Event management</option><option value="Catering services">Catering services</option></>}</select></label>
                  </div>
                  <label className={labelClass}>Tell us about your requirement *<textarea name="message" rows={5} className={fieldClass + " resize-none"} placeholder="Destination, dates, travellers and anything we should know..." /></label>
                  <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0875b7] to-[#08a3d8] px-6 py-4 font-bold text-white shadow-lg shadow-[#087fbe]/20 transition hover:-translate-y-0.5 disabled:opacity-70">{isSubmitting ? "Sending..." : "Send enquiry"}<Send className="size-4" /></button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}