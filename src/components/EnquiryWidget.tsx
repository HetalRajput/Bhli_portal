"use client";

import {
  Building2,
  CalendarDays,
  Check,
  Hotel,
  Mail,
  MessageSquareText,
  Phone,
  Send,
  ShieldCheck,
  UserRound,
  X,
  AlertCircle
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { baseService } from "@/lib/api/base";
import { getErrorMessage } from "@/lib/api/client";

const fieldClass =
  "w-full rounded-xl border border-[#087fbe]/15 bg-[#f8fbfd] px-4 py-3 text-sm text-[#122b42] outline-none transition focus:border-[#087fbe] focus:bg-white focus:ring-4 focus:ring-[#13a5d8]/10 placeholder:text-black/30";
const labelClass =
  "grid gap-2 text-xs font-bold uppercase tracking-[.08em] text-[#456276]";

export default function EnquiryWidget() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = previous;
    };
  }, [open]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const guestName = String(data.get("guestName") || "").trim();
    const rank = String(data.get("rank") || "").trim();
    const checkIn = String(data.get("checkIn") || "").trim();
    const checkOut = String(data.get("checkOut") || "").trim();
    const location = String(data.get("location") || "").trim();
    const rooms = String(data.get("rooms") || "").trim();
    const mobile = String(data.get("mobile") || "").trim();
    const email = String(data.get("email") || "").trim();
    const department = String(data.get("department") || "").trim();

    if (!guestName || !rank || !checkIn || !checkOut || !location || !rooms || !mobile || !email || !department) {
      setError("Please complete all required fields marked with *.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number (starts with 6, 7, 8, or 9).");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address (e.g. user@domain.com).");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await baseService.createContactLead({
        name: guestName,
        email: email,
        mobile_number: mobile,
        subject: `Enquiry for ${location} (${department} - ${rank})`,
        message: `Check-in: ${checkIn}, Check-out: ${checkOut}, Rooms: ${rooms}, Landmark: ${data.get("landmark") || "N/A"}, Guest Info: ${data.get("guests") || "N/A"}, Tariff: ${data.get("tdTariff") || "N/A"}, Budget: ${data.get("budget") || "N/A"}`
      });

      setSubmitted(true);
    } catch (err) {
      setError(getErrorMessage(err));
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
      <a
        href="https://wa.me/919916356691?text=Hello%20BHLI%2C%20I%20need%20help%20with%20a%20booking."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with BHLI on WhatsApp"
        title="WhatsApp support"
        className="group fixed bottom-24 right-5 z-[70] flex items-center gap-3 rounded-full border border-white/60 bg-gradient-to-r from-[#128C5B] to-[#25D366] px-5 py-3.5 text-white shadow-[0_12px_30px_rgba(16,120,65,.35)] transition duration-300 hover:-translate-y-1 sm:bottom-28 sm:right-7"
      >
        <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-white/15">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/20" />
          <svg viewBox="0 0 32 32" aria-hidden="true" className="relative size-6 fill-current">
            <path d="M16.04 3.2A12.7 12.7 0 0 0 5.31 22.7L3.2 28.8l6.27-2.07A12.8 12.8 0 1 0 16.04 3.2Zm0 23.43c-2.1 0-4.15-.57-5.93-1.65l-.43-.25-3.72 1.23 1.25-3.62-.28-.45a10.63 10.63 0 1 1 9.11 4.74Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.3-.11-.51-.16-.73.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59a9.6 9.6 0 0 1-1.78-2.21c-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.99-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.25 3.44 5.46 4.82.76.33 1.36.53 1.82.68.76.24 1.46.21 2.01.13.61-.09 1.89-.77 2.15-1.52.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37Z" />
          </svg>
        </span>
        <span>
          <span className="block text-left text-sm font-bold leading-tight">WhatsApp</span>
          <span className="block text-[10px] font-medium text-white/80">Chat with our team</span>
        </span>
      </a>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open enquiry form"
        className="group fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-full border border-white/40 bg-gradient-to-r from-[#03182e] via-[#062b50] to-[#074a78] px-5 py-3.5 font-bold text-white shadow-[0_12px_35px_rgba(2,20,40,.45)] transition duration-300 hover:-translate-y-1 sm:bottom-7 sm:right-7"
      >
        <span className="relative grid size-9 place-items-center rounded-full bg-white/15">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/15" />
          <MessageSquareText className="relative size-5" />
        </span>
        <span>
          <span className="block text-left text-sm leading-tight">Enquiry</span>
          <span className="block text-[10px] font-medium text-white/70">
            We are here to help
          </span>
        </span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-end bg-[#031629]/60 backdrop-blur-sm sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Guest enquiry form"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="flex h-[96dvh] w-full animate-[enquiry-slide-up_.45s_cubic-bezier(.22,1,.36,1)] flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-2xl sm:h-[min(900px,94dvh)] sm:max-w-3xl sm:rounded-[1.75rem]">
            <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#061f3b] to-[#087fbe] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-white/12">
                  <MessageSquareText className="size-5" />
                </span>
                <div>
                  <h2 className="font-serif text-xl font-semibold">
                    Guest Information Form
                  </h2>
                  <p className="text-xs text-white/65">
                    Booking Hospitality & Leisure Infra LLP
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close enquiry form"
                className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <X className="size-5" />
              </button>
            </header>
            {submitted ? (
              <div className="grid flex-1 place-items-center overflow-y-auto p-7 text-center">
                <div className="max-w-lg">
                  <span className="mx-auto grid size-24 place-items-center rounded-full bg-[#e4f8ee] text-[#178653] shadow-[0_0_0_12px_rgba(23,134,83,.07)]">
                    <Check className="size-12" />
                  </span>
                  <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-[#178653]">
                    Enquiry Submitted
                  </p>
                  <h3 className="mt-3 font-serif text-4xl">
                    Thank you for contacting us
                  </h3>
                  <p className="mt-4 leading-7 text-black/60">
                    Your enquiry details have been submitted successfully. Our team will get back to you shortly.
                  </p>
                  <div className="mt-7 rounded-2xl bg-[#edf8fd] p-5 text-left text-sm leading-7 text-[#456276]">
                    <b className="text-[#122b42]">Expected response timing</b>
                    <ul className="mt-2 list-disc pl-5">
                      <li>Within 24 hours: subject to availability</li>
                      <li>2-5 days ahead: update within 24 hours</li>
                      <li>5+ days ahead: update within 3 working days</li>
                    </ul>
                  </div>
                  <button
                    onClick={close}
                    className="mt-7 rounded-full bg-[#061f3b] px-7 py-3 font-bold text-white shadow-lg"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="min-h-0 flex-1 overflow-y-auto">
                <div className="mx-auto max-w-2xl space-y-8 p-5 pb-10 sm:p-8">
                  <div className="flex gap-3 rounded-2xl border border-[#087fbe]/12 bg-[#edf8fd] p-4 text-sm leading-6 text-[#456276]">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#087fbe]" />
                    Fields marked with * are required. Your details are securely submitted to BHLI Helpdesk.
                  </div>
                  {error && (
                    <div
                      role="alert"
                      className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 flex items-center gap-2.5"
                    >
                      <AlertCircle className="size-5 shrink-0 text-red-500" />
                      <span>{error}</span>
                    </div>
                  )}
                  <section>
                    <div className="mb-5 flex items-center gap-3">
                      <UserRound className="size-5 text-[#087fbe]" />
                      <h3 className="font-serif text-2xl">Guest details</h3>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className={labelClass}>
                        Guest name *
                        <input
                          name="guestName"
                          className={fieldClass}
                          placeholder="Full name"
                        />
                      </label>
                      <label className={labelClass}>
                        Officer's rank *
                        <input
                          name="rank"
                          className={fieldClass}
                          placeholder="Rank / designation"
                        />
                      </label>
                      <label className={labelClass}>
                        Mobile number *
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#087fbe]" />
                          <input
                            name="mobile"
                            inputMode="numeric"
                            maxLength={10}
                            className={fieldClass + " pl-11"}
                            placeholder="10-digit number"
                          />
                        </div>
                      </label>
                      <label className={labelClass}>
                        Email ID *
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#087fbe]" />
                          <input
                            name="email"
                            type="email"
                            className={fieldClass + " pl-11"}
                            placeholder="name@example.com"
                          />
                        </div>
                      </label>
                      <label className={labelClass}>
                        Employee ID - last 4 digits
                        <input
                          name="employeeId"
                          inputMode="numeric"
                          maxLength={4}
                          className={fieldClass}
                          placeholder="Optional"
                        />
                      </label>
                      <label className={labelClass}>
                        Defence sector / department *
                        <select name="department" className={fieldClass}>
                          <option value="">Select department</option>
                          {[
                            "Air Force",
                            "Army",
                            "CISF",
                            "Coast Guard",
                            "DRDO",
                            "MOD",
                            "Navy",
                            "Paramilitary Forces",
                            "Other"
                          ].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </section>
                  <section>
                    <div className="mb-5 flex items-center gap-3">
                      <CalendarDays className="size-5 text-[#087fbe]" />
                      <h3 className="font-serif text-2xl">Stay details</h3>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className={labelClass}>
                        Check-in date *
                        <input
                          name="checkIn"
                          type="date"
                          className={fieldClass}
                        />
                      </label>
                      <label className={labelClass}>
                        Check-out date *
                        <input
                          name="checkOut"
                          type="date"
                          className={fieldClass}
                        />
                      </label>
                      <label className={labelClass + " sm:col-span-2"}>
                        Required hotel location *
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#087fbe]" />
                          <input
                            name="location"
                            className={fieldClass + " pl-11"}
                            placeholder="City / State"
                          />
                        </div>
                      </label>
                      <label className={labelClass + " sm:col-span-2"}>
                        Landmark / TD area / preferred hotel
                        <div className="relative">
                          <Hotel className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#087fbe]" />
                          <input
                            name="landmark"
                            className={fieldClass + " pl-11"}
                            placeholder="Landmark, area or hotel preference"
                          />
                        </div>
                      </label>
                      <label className={labelClass}>
                        Number of rooms *
                        <select name="rooms" className={fieldClass}>
                          <option value="">Select rooms</option>
                          {Array.from({ length: 10 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                          <option>Group movement</option>
                        </select>
                      </label>
                      <label className={labelClass}>
                        Guest details
                        <textarea
                          name="guests"
                          rows={3}
                          className={fieldClass + " resize-none"}
                          placeholder="Single / double / children with ages / colleagues"
                        />
                      </label>
                    </div>
                  </section>
                  <section>
                    <div className="mb-5 flex items-center gap-3">
                      <Send className="size-5 text-[#087fbe]" />
                      <h3 className="font-serif text-2xl">Tariff and budget</h3>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className={labelClass}>
                        TD tariff amount
                        <input
                          name="tdTariff"
                          inputMode="decimal"
                          className={fieldClass}
                          placeholder="Amount as per TD tariff"
                        />
                      </label>
                      <label className={labelClass}>
                        Personal visit budget
                        <input
                          name="budget"
                          inputMode="decimal"
                          className={fieldClass}
                          placeholder="Mention your budget"
                        />
                      </label>
                    </div>
                  </section>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0875b7] to-[#08a3d8] px-6 py-4 font-bold text-white shadow-lg shadow-[#087fbe]/20 hover:-translate-y-0.5 disabled:opacity-70"
                  >
                    {isSubmitting ? "Submitting enquiry..." : "Submit enquiry"}{" "}
                    <Send className="size-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
