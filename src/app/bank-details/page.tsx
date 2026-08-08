import type { Metadata } from "next";
import { Building2, CheckCircle2, Landmark, Mail, ShieldCheck, TriangleAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Verification | Booking Hospitality",
  description: "Request verified payment instructions from Booking Hospitality & Leisure Infra LLP.",
};

const publicDetails = [
  ["Beneficiary", "BHLI (Booking Hospitality & Leisure Infra) LLP"],
  ["GSTIN", "29ABAFB9239M1ZX"],
  ["Bank", "IDFC FIRST Bank"],
  ["Account type", "Current Account"],
  ["Branch city", "Bengaluru"],
] as const;

export default function BankDetailsPage() {
  return (
    <div className="min-h-screen bg-[#f4f8fb] text-[#102f48]">
      <section className="relative overflow-hidden bg-[#062d4c] px-5 py-20 text-white lg:px-8">
        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-[#11a3d7]/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#66d2f3]"><ShieldCheck className="size-4" />Secure payment verification</p>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Request verified payment details</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/65">For your protection, confidential bank, tax and QR information is not published on this website.</p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(6,45,76,0.07)]">
            <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-6 sm:px-8">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e5f5fb] text-[#087dbd]"><Landmark className="size-5" /></span>
              <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#087dbd]">Public verification</p><h2 className="mt-1 font-serif text-2xl font-semibold">Company legal information</h2></div>
            </div>
            <dl className="divide-y divide-slate-100">
              {publicDetails.map(([label, value]) => (
                <div key={label} className="grid gap-1 px-6 py-4 sm:grid-cols-[150px_1fr] sm:gap-5 sm:px-8">
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</dt>
                  <dd className="text-sm font-bold text-[#102f48] sm:text-base">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <aside className="rounded-[1.75rem] bg-[#082f4e] p-6 text-white sm:p-8">
            <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-[#67d4f3]"><Building2 className="size-5" /></span>
            <h2 className="mt-5 font-serif text-2xl font-semibold">Contact the accounts team</h2>
            <p className="mt-3 text-sm leading-7 text-white/65">Request the current account or QR details using the official email below. Include your booking reference, if available.</p>
            <a href="https://pages.razorpay.com/pl_PqPHewqyh9VNft/view" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-[#062d4c] transition hover:bg-slate-100"><ShieldCheck className="size-4" />Pay securely with Razorpay</a>
            <a href="mailto:accounts@bookinghospitality.com?subject=Request%20for%20verified%20payment%20details" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#11a3d7] px-5 py-3.5 text-sm font-bold text-[#062d4c] transition hover:bg-[#67d4f3]"><Mail className="size-4" />Email accounts team</a>
            <p className="mt-4 break-all text-center text-xs text-white/55">accounts@bookinghospitality.com</p>
          </aside>
        </div>

        <section className="mt-8 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 sm:p-8">
          <div className="flex gap-4">
            <TriangleAlert className="mt-0.5 size-6 shrink-0 text-amber-700" />
            <div>
              <h2 className="font-serif text-2xl font-semibold text-amber-950">Payment safety</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-amber-950/70">
                {["Verify the beneficiary name before authorising a transfer.", "Confirm any changed payment instructions with the accounts team.", "Never share an OTP, UPI PIN, password or card credentials.", "Keep your transaction reference for payment confirmation."].map((item) => (
                  <li key={item} className="flex gap-2"><CheckCircle2 className="mt-1 size-4 shrink-0 text-amber-700" />{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
