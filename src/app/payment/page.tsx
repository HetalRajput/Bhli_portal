"use client";

import { formatPrice, getSearchItem } from "@/lib/search-data";
import { ArrowLeft, ExternalLink, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import GlobalPageSkeleton from "@/components/GlobalPageSkeleton";

const razorpayLink = "https://pages.razorpay.com/pl_PqPHewqyh9VNft/view";

function PaymentContent() {
  const params = useSearchParams();
  const type = params.get("type") || "hotels";
  const id = params.get("id") || "1";
  const destination = params.get("destination") || "Selected destination";
  const item = getSearchItem(type, id);

  if (!item) {
    return <div className="grid min-h-screen place-items-center bg-[#f5f9fc]"><div className="text-center"><h1 className="font-serif text-3xl">Booking not found</h1><Link href="/search" className="mt-5 inline-block text-[#087fbe]">Return to search</Link></div></div>;
  }

  const total = item.basePrice + item.taxes + item.fees;
  return (
    <div className="min-h-screen bg-[#f5f9fc] text-[#122b42]">
      <section className="bg-gradient-to-r from-[#061f3b] to-[#087fbe] px-5 py-9 text-white lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link href={`/search/${type}/${id}?destination=${encodeURIComponent(destination)}`} className="inline-flex items-center gap-2 text-sm text-white/65 hover:text-white"><ArrowLeft className="size-4" />Back to booking details</Link>
          <div className="mt-6 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-full bg-white/12"><ShieldCheck className="size-6" /></span><div><h1 className="font-serif text-3xl md:text-4xl">Secure payment</h1><p className="mt-1 flex items-center gap-1.5 text-xs text-white/60"><LockKeyhole className="size-3" />Securely processed by Razorpay</p></div></div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl items-start gap-7 px-5 py-10 lg:grid-cols-[1fr_360px] lg:px-8">
        <section className="rounded-[2rem] bg-white p-7 text-center shadow-sm md:p-10">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#087fbe]">Secure online payment</p>
          <h2 className="mt-3 font-serif text-3xl">Pay {formatPrice(total)} with Razorpay</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/50">You will be redirected to Razorpay&apos;s secure payment page to complete your payment.</p>
          <span className="mx-auto mt-8 grid size-20 place-items-center rounded-3xl bg-[#edf8fd] text-[#087fbe]"><ShieldCheck className="size-10" /></span>
          <a href={razorpayLink} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#0875b7] to-[#08a3d8] px-8 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5">Pay securely with Razorpay <ExternalLink className="size-4" /></a>
          <p className="mt-4 text-xs text-black/40">Please keep your Razorpay payment reference for confirmation.</p>
        </section>

        <aside className="rounded-[2rem] border border-[#087fbe]/15 bg-white p-7 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#087fbe]">Booking summary</p>
          <img src={item.image} alt={item.name} className="mt-5 h-40 w-full rounded-2xl object-cover" />
          <h2 className="mt-5 font-serif text-2xl">{item.name}</h2><p className="mt-1 text-sm text-black/45">{destination}</p>
          <dl className="mt-6 space-y-4 border-t border-black/8 pt-5 text-sm"><div className="flex justify-between"><dt className="text-black/50">Base price</dt><dd>{formatPrice(item.basePrice)}</dd></div><div className="flex justify-between"><dt className="text-black/50">Taxes & GST</dt><dd>{formatPrice(item.taxes)}</dd></div><div className="flex justify-between"><dt className="text-black/50">Service fee</dt><dd>{formatPrice(item.fees)}</dd></div><div className="flex justify-between border-t border-black/8 pt-4 text-base font-bold"><dt>Total payable</dt><dd className="text-[#087fbe]">{formatPrice(total)}</dd></div></dl>
        </aside>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return <Suspense fallback={<GlobalPageSkeleton />}><PaymentContent /></Suspense>;
}
