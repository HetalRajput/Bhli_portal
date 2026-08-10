import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function LegalTrustSection() {
  return (
    <section className="bg-white px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-[2rem] border border-[#087fbe]/15 bg-[#f2f9fc] p-7 md:grid-cols-[1fr_auto] md:p-10">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#dff2fa] text-[#087fbe]"><ShieldCheck className="size-6" /></span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#087fbe]">Trust and transparency</p>
            <h2 className="mt-2 font-serif text-3xl text-[#062b50]">Know how we serve and protect you.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-black/55">Review the terms that govern BHLI services and the choices available for your personal information.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link href="/terms-and-conditions" className="inline-flex items-center gap-2 rounded-full bg-[#061f3b] px-5 py-3 text-sm font-bold text-white">Terms <ArrowRight className="size-4" /></Link>
          <Link href="/privacy-policy" className="inline-flex items-center gap-2 rounded-full border border-[#087fbe]/25 bg-white px-5 py-3 text-sm font-bold text-[#087fbe]">Privacy <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </section>
  );
}
