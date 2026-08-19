"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, LoaderCircle, ShieldCheck } from "lucide-react";
import { apiClient, getErrorMessage } from "@/lib/api/client";
import type { VendorLink } from "@/lib/api/portal";
import { safeExternalUrl } from "@/lib/safe-url";

type RedirectPayload = {
  success?: boolean;
  data?: { url?: string; redirect_url?: string };
  url?: string;
  redirect_url?: string;
};

const vendorImages: Record<string, string> = {
  catering: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=900",
  "fauji-club": "https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=900",
  "iaf-garud-commando-reveals-kashmirs-untold-truth": "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=900",
  "veterans-india": "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=900",
};

const defaultVendorImage = "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900";

export default function ExternalServicesShowcase({ vendors, mode = "carousel" }: { vendors: VendorLink[]; mode?: "carousel" | "grid" }) {
  const track = useRef<HTMLDivElement>(null);
  const [openingId, setOpeningId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const scroll = (direction: number) => track.current?.scrollBy({ left: direction * Math.min(track.current.clientWidth * 0.82, 900), behavior: "smooth" });

  async function openVendor(vendor: VendorLink) {
    if (!vendor.tracking_url || openingId !== null) return;
    const externalTab = window.open("about:blank", "_blank");
    if (externalTab) externalTab.opener = null;
    setOpeningId(vendor.id);
    setError("");

    try {
      const response = await apiClient.get<RedirectPayload>(vendor.tracking_url);
      const payload = response.data;
      const target = payload?.data?.url || payload?.data?.redirect_url || payload?.url || payload?.redirect_url;
      if (!target) throw new Error("The provider did not return a redirect URL.");
      const safeTarget = safeExternalUrl(target);
      if (!safeTarget) throw new Error("The provider returned an insecure redirect URL.");
      if (externalTab && !externalTab.closed) externalTab.location.href = safeTarget;
      else window.location.assign(safeTarget);
    } catch (redirectError) {
      externalTab?.close();
      setError(getErrorMessage(redirectError));
    } finally {
      setOpeningId(null);
    }
  }

  if (!vendors.length) return null;

  const cards = vendors.map((vendor) => (
    <button key={vendor.id} type="button" onClick={() => openVendor(vendor)} disabled={openingId !== null} aria-label={`Visit ${vendor.title}`} className={`${mode === "carousel" ? "w-[285px] shrink-0 sm:w-[320px] lg:w-[calc((100%_-_3.75rem)/4)]" : ""} group flex min-h-[390px] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white text-left shadow-[0_12px_36px_rgba(6,31,59,.07)] transition duration-300 hover:-translate-y-1 hover:border-[#13a5d8]/45 hover:shadow-[0_20px_50px_rgba(6,31,59,.14)] focus:outline-none focus:ring-4 focus:ring-[#13a5d8]/20 disabled:cursor-wait disabled:opacity-65`}>
      <span className="relative block h-44 w-full overflow-hidden bg-[#07345d] bg-cover bg-center transition-transform duration-700" style={{ backgroundImage: `url(${vendor.image || vendorImages[vendor.slug] || defaultVendorImage})` }}><span className="absolute inset-0 bg-gradient-to-t from-[#061f3b]/75 via-[#061f3b]/20 to-transparent" /><span className="absolute right-4 top-4 rounded-full border border-white/25 bg-[#061f3b]/70 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[.15em] text-white backdrop-blur">External service</span><span className="absolute bottom-4 left-4 grid size-11 place-items-center rounded-xl bg-white/95 font-serif text-xl font-bold text-[#087fbe] shadow-lg">{vendor.title.trim().charAt(0).toUpperCase()}</span></span>
      <span className="flex flex-1 flex-col p-6"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-[#087fbe]">{vendor.vendor_name}</span><span className="mt-2 line-clamp-3 font-serif text-2xl font-semibold leading-tight text-[#061f3b] transition-colors group-hover:text-[#087fbe]">{vendor.title}</span>{(vendor.subtitle || vendor.description) && <span className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">{vendor.subtitle || vendor.description}</span>}{vendor.service_name && <span className="mt-3 text-xs font-semibold text-slate-500">Category: {vendor.service_name}</span>}<span className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5 text-sm font-extrabold text-[#087fbe]"><span>{openingId === vendor.id ? "Opening provider..." : "Visit provider"}</span>{openingId === vendor.id ? <LoaderCircle className="size-4 animate-spin" /> : <span className="grid size-9 place-items-center rounded-full bg-[#e7f6fc] transition group-hover:bg-[#087fbe] group-hover:text-white"><ExternalLink className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>}</span></span>
    </button>
  ));

  if (mode === "grid") return <><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{cards}</div>{error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}</>;

  return <section className="overflow-hidden border-y border-slate-200 bg-gradient-to-b from-white to-[#edf5f9] pb-16 pt-10 sm:pb-20 sm:pt-12"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#087fbe]">Trusted external providers</p><h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold text-[#061f3b] md:text-5xl">More services, one trusted starting point</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">Continue securely to selected partner services through BHLI tracked links.</p></div><div className="flex flex-wrap items-center gap-2"><Link href="/external-services" className="mr-2 inline-flex items-center gap-2 font-bold text-[#061f3b] transition hover:text-[#087fbe]">View all external services <ArrowRight className="size-4" /></Link><button type="button" onClick={() => scroll(-1)} aria-label="Previous external services" className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-[#087fbe] shadow-sm transition hover:bg-[#061f3b] hover:text-white"><ArrowLeft className="size-4" /></button><button type="button" onClick={() => scroll(1)} aria-label="Next external services" className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-[#087fbe] shadow-sm transition hover:bg-[#061f3b] hover:text-white"><ArrowRight className="size-4" /></button></div></div><div ref={track} className="mt-7 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 [scrollbar-width:none] [&>*]:snap-start [&::-webkit-scrollbar]:hidden">{cards}</div>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}<p className="mt-3 flex items-center gap-2 text-xs text-slate-400"><ShieldCheck className="size-4 text-[#087fbe]" />External websites are operated under their respective provider terms and privacy policies.</p></div></section>;
}
