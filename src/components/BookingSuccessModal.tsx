"use client";

import { ArrowRight, Building2, CalendarCheck2, ShieldCheck, Volume2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type BookingSuccessModalProps = {
  reference: string;
  hotelName?: string;
  serviceName?: string;
  itemLabel?: string;
  heading?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
};

export default function BookingSuccessModal({
  reference,
  hotelName,
  serviceName,
  itemLabel,
  heading = hotelName ? "Your stay is being arranged" : "Your response is recorded",
  description = "Our sales representative will get in touch with a personalised response.",
  backHref = hotelName ? "/services/hotel-reservations" : "/services",
  backLabel = hotelName ? "Back to hotels" : "Back to services",
}: BookingSuccessModalProps) {
  const displayName = hotelName || serviceName || "Booking service";
  const displayLabel = itemLabel || (hotelName ? "Selected hotel" : "Selected service");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  return (
    <div className="booking-success-backdrop fixed inset-0 z-[100] grid items-start justify-items-center overflow-y-auto bg-[#03172d]/80 p-3 backdrop-blur-md sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="booking-success-title">
      <style>{`
        @keyframes booking-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes booking-card-in { 0% { opacity: 0; transform: translateY(28px) scale(.94); } 65% { transform: translateY(-4px) scale(1.01); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes booking-halo { 0% { opacity: .55; transform: scale(.65); } 100% { opacity: 0; transform: scale(1.65); } }
        @keyframes booking-check-draw { to { stroke-dashoffset: 0; } }
        @keyframes booking-confetti { 0% { opacity: 0; transform: translate(0, 0) rotate(0); } 20% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--confetti-x), var(--confetti-y)) rotate(180deg); } }
        .booking-success-backdrop { animation: booking-backdrop-in .3s ease-out both; }
        .booking-success-card { animation: booking-card-in .65s cubic-bezier(.22, 1, .36, 1) both; }
        .booking-success-halo { animation: booking-halo 1.6s .25s ease-out infinite; }
        .booking-success-check { stroke-dasharray: 34; stroke-dashoffset: 34; animation: booking-check-draw .55s .42s cubic-bezier(.65, 0, .35, 1) forwards; }
        .booking-confetti { animation: booking-confetti 1.1s .48s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .booking-success-backdrop, .booking-success-card, .booking-success-halo, .booking-success-check, .booking-confetti { animation: none !important; }
          .booking-success-check { stroke-dashoffset: 0; }
        }
      `}</style>

      <section className="booking-success-card relative my-2 w-full max-w-[760px] overflow-hidden rounded-[1.6rem] border border-white/60 bg-white shadow-[0_30px_90px_rgba(0,16,38,.4)] sm:my-0">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#0875b7] via-[#13a5d8] to-[#00a575]" />
        <div className="absolute -right-24 -top-24 size-64 rounded-full bg-[#13a5d8]/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 size-64 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative px-5 pb-5 pt-6 text-center sm:px-7 sm:pb-6 sm:pt-7">
          <div className="relative mx-auto grid size-16 place-items-center">
            <span className="booking-success-halo absolute inset-2 rounded-full border-2 border-emerald-400/50" />
            <span className="absolute inset-0 rounded-full bg-emerald-50 shadow-[0_12px_35px_rgba(5,150,105,.18)]" />
            <svg className="relative size-10" viewBox="0 0 56 56" fill="none" aria-hidden="true">
              <circle cx="28" cy="28" r="25" stroke="#059669" strokeWidth="3" />
              <path className="booking-success-check" d="M17 28.5 24.5 36 40 20.5" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="booking-confetti absolute left-0 top-2 size-2 rounded-sm bg-[#13a5d8] [--confetti-x:-28px] [--confetti-y:-28px]" />
            <span className="booking-confetti absolute right-0 top-3 size-2 rounded-full bg-amber-400 [--confetti-x:30px] [--confetti-y:-24px]" />
            <span className="booking-confetti absolute bottom-1 left-2 h-2 w-3 rounded-full bg-rose-400 [--confetti-x:-30px] [--confetti-y:28px]" />
            <span className="booking-confetti absolute bottom-2 right-1 size-2 rotate-45 bg-emerald-400 [--confetti-x:28px] [--confetti-y:26px]" />
          </div>

          <p className="mt-3 text-[9px] font-extrabold uppercase tracking-[.24em] text-emerald-600">Request submitted successfully</p>
          <h1 id="booking-success-title" className="mt-1.5 font-serif text-2xl leading-tight text-[#061f3b] sm:text-3xl">{heading}</h1>
          <p className="mx-auto mt-1.5 max-w-2xl text-xs leading-5 text-slate-500">{description}</p>

          <div className="mt-5 grid gap-3 text-left md:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-xl border border-[#087fbe]/15 bg-gradient-to-br from-[#f3faff] to-[#edf8f6] p-4 text-left">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-[#087fbe] shadow-sm"><Building2 className="size-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">{displayLabel}</p>
                <p className="mt-1 truncate text-sm font-bold text-[#061f3b]">{displayName}</p>
              </div>
            </div>
            <div className="mt-3 grid gap-2 border-t border-[#087fbe]/10 pt-3 sm:grid-cols-2">
              <p className="flex items-center gap-2 text-xs text-slate-500"><CalendarCheck2 className="size-4 text-emerald-600" />Reference <strong className="text-[#087fbe]">{reference}</strong></p>
              <p className="flex items-center gap-2 text-xs text-slate-500 sm:justify-end"><ShieldCheck className="size-4 text-emerald-600" />Secure request received</p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200/70 bg-amber-50/70 p-4 text-left text-[11px] leading-4 text-[#72551d]">
            <p className="font-bold uppercase tracking-[.14em] text-[10px] text-amber-700">Response guidance</p>
            <ul className="mt-1.5 space-y-1">
              <li>Requests within 24 hours are subject to availability.</li>
              <li>For travel after 2–5 days, we aim to respond within 24 hours of submission.</li>
              <li>For requests more than 5 days away, an associate will connect with you.</li>
            </ul>
            <p className="mt-2 font-semibold text-[#4b3b1a]">Booking Hospitality &amp; Leisure Infra</p>
            <p className="mt-1 text-[#72551d]">+91 7204 518 641 · +91 9916 356 691 · +91 9945 123 211</p>
          </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2.5 border-t border-slate-100 pt-4 sm:flex-row sm:justify-center">
            <Link href={backHref} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-xs font-bold text-[#456078] transition hover:border-[#74bddb] hover:bg-[#f7fbfd]">{backLabel}</Link>
            <Link href="/profile?section=bookings" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 text-xs font-bold text-white shadow-lg shadow-[#087fbe]/20 transition hover:-translate-y-0.5">View bookings <ArrowRight className="size-4" /></Link>
          </div>
          <p className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400"><Volume2 className="size-3" />Confirmation chime</p>
        </div>
      </section>
    </div>
  );
}
