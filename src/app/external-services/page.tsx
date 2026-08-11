import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ExternalServicesShowcase from "@/components/ExternalServicesShowcase";
import { portalService, type VendorLink } from "@/lib/api/portal";

export const dynamic = "force-dynamic";

export default async function ExternalServicesPage() {
  let vendors: VendorLink[] = [];
  try {
    const response = await portalService.vendors();
    if (response.success && Array.isArray(response.data)) vendors = response.data;
  } catch (error) {
    console.error("Failed to load external services:", error);
  }

  return <main className="min-h-screen bg-[#f4f8fb] text-[#122b42]"><header className="bg-[#061f3b] px-5 py-14 text-white lg:px-8"><div className="mx-auto max-w-7xl"><Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-white/60 transition hover:text-white"><ArrowLeft className="size-4" />Back to home</Link><p className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-[#13a5d8]"><ExternalLink className="size-4" />Partner network</p><h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold sm:text-5xl">External Services</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">Access useful services from BHLI&apos;s external provider network. Each visit is resolved through our tracking endpoint before you continue to the provider website.</p></div></header><section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">{vendors.length ? <ExternalServicesShowcase vendors={vendors} mode="grid" /> : <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm"><h2 className="font-serif text-2xl text-[#061f3b]">External services are unavailable</h2><p className="mt-3 text-sm text-slate-500">Please refresh the page or try again shortly.</p></div>}</section></main>;
}
