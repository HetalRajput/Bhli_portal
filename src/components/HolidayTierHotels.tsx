"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  CheckCircle2,
  Crown,
  Hotel,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { portalService, type HolidayPackage, type HolidayVariant } from "@/lib/api/portal";

export type DomesticPackageTier = "silver" | "gold" | "platinum";

const tierDetails = {
  silver: {
    label: "Silver Package",
    subtitle: "Budget Hotels & Resorts",
    price: "₹9,999",
    description: "Value-focused stays for comfortable family holidays across India.",
    accent: "from-[#779bc9] to-[#b8d4ef]",
    badge: "bg-[#e5f0fb] text-[#315b89]",
    icon: Hotel,
  },
  gold: {
    label: "Gold Package",
    subtitle: "3-Star Hotels & Resorts",
    price: "₹13,999",
    description: "Well-rated 3-star stays with dependable comfort and convenient facilities.",
    accent: "from-[#bd8b24] to-[#efd16f]",
    badge: "bg-[#fff3c8] text-[#7a5715]",
    icon: Sparkles,
  },
  platinum: {
    label: "Platinum Package",
    subtitle: "4/5-Star Luxury Hotels",
    price: "₹24,999",
    description: "Premium hotels and resorts selected for elevated service and luxury stays.",
    accent: "from-[#172a66] to-[#4a64aa]",
    badge: "bg-[#e9edff] text-[#263c7b]",
    icon: Crown,
  },
} satisfies Record<DomesticPackageTier, {
  label: string;
  subtitle: string;
  price: string;
  description: string;
  accent: string;
  badge: string;
  icon: typeof Hotel;
}>;

function packageDestination(item: HolidayPackage) {
  if (typeof item.destination === "string") return item.destination;
  return item.destination?.name || "Domestic destination";
}

function tierVariants(item: HolidayPackage, tier: DomesticPackageTier): HolidayVariant[] {
  const variants = item.variants || [];
  const matching = variants.filter((variant) => variant.tier.toLowerCase() === tier);
  return matching.length ? matching : variants;
}

export default function HolidayTierHotels({ tier }: { tier: DomesticPackageTier }) {
  const details = tierDetails[tier];
  const TierIcon = details.icon;
  const [packages, setPackages] = useState<HolidayPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    portalService.holidayPackages({ collection: "domestic", tier })
      .then((rows) => {
        if (active) setPackages(rows);
      })
      .catch(() => {
        if (active) setError("Current package hotels could not be loaded. You can still send an enquiry for this tier.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [tier]);

  return (
    <main className="min-h-screen bg-[#eef4f8] text-[#122b42]">
      <section className="relative isolate overflow-hidden bg-[#061f3b] px-5 pb-16 pt-8 text-white lg:px-8 lg:pb-20">
        <div className={`absolute inset-x-0 top-0 -z-10 h-1.5 bg-gradient-to-r ${details.accent}`} />
        <div className="absolute -left-24 top-10 -z-10 size-72 rounded-full bg-[#13a5d8]/15 blur-3xl" />
        <div className="absolute -right-20 bottom-0 -z-10 size-80 rounded-full bg-white/5 blur-3xl" />

        <div className="mx-auto max-w-7xl">
          <Link href="/services/holiday-packages/domestic" className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition hover:text-white">
            <ArrowLeft className="size-4" />All domestic packages
          </Link>

          <div className="mt-12 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <span className={`grid size-16 place-items-center rounded-2xl bg-gradient-to-br ${details.accent} text-white shadow-xl`}><TierIcon className="size-8" /></span>
              <p className="mt-7 text-[10px] font-extrabold uppercase tracking-[.28em] text-[#59d7ff]">Domestic package hotels</p>
              <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-6xl">{details.label} Hotels</h1>
              <p className="mt-4 text-lg font-semibold text-white/85">{details.subtitle}</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">{details.description}</p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/[.08] p-5 backdrop-blur-sm lg:min-w-64">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/45">Packages starting from</p>
              <p className="mt-1 font-serif text-4xl font-bold text-white">{details.price}</p>
              <p className="mt-1 text-[10px] text-white/45">Final price depends on destination and inclusions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#087fbe]">Available in this tier</p>
            <h2 className="mt-2 font-serif text-3xl text-[#061f3b] sm:text-4xl">Choose your package and hotel</h2>
          </div>
          <span className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${details.badge}`}>{details.subtitle}</span>
        </div>

        {loading ? (
          <div className="mt-10 grid min-h-64 place-items-center rounded-3xl border border-slate-200 bg-white">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-500"><LoaderCircle className="size-5 animate-spin text-[#087fbe]" />Loading {details.label.toLowerCase()} hotels...</p>
          </div>
        ) : packages.length > 0 ? (
          <div className="mt-9 grid gap-5 lg:grid-cols-2">
            {packages.map((item) => {
              const variants = tierVariants(item, tier);
              return (
                <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_16px_45px_rgba(6,31,59,.08)]">
                  <header className="flex gap-4 border-b border-slate-100 p-5 sm:p-6">
                    <span className={`grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${details.accent} text-white`}><Hotel className="size-6" /></span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#087fbe]">{packageDestination(item)} · {item.nights}N/{item.days}D</p>
                      <h3 className="mt-1 font-serif text-2xl text-[#061f3b]">{item.name}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{item.short_description}</p>
                    </div>
                  </header>

                  <div className="space-y-3 p-5 sm:p-6">
                    {variants.length > 0 ? variants.map((variant) => (
                      <section key={variant.id} className="rounded-2xl border border-[#dbe7ed] bg-[#f7fafc] p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#087fbe]"><BedDouble className="size-3.5" />{variant.hotel_category}</p>
                            <h4 className="mt-1 text-sm font-extrabold text-[#061f3b]">{variant.title}</h4>
                            <p className="mt-1 text-[11px] text-slate-500">{variant.comfort_level}</p>
                          </div>
                          <p className="shrink-0 text-right"><span className="block text-[9px] font-bold uppercase text-slate-400">From</span><strong className="text-lg text-[#087fbe]">₹{Number(variant.price).toLocaleString("en-IN")}</strong></p>
                        </div>
                        {variant.inclusions.length > 0 && <p className="mt-3 border-t border-slate-200 pt-3 text-[10px] leading-5 text-slate-500">{variant.inclusions.map((inclusion) => inclusion.name).join(" · ")}</p>}
                      </section>
                    )) : (
                      <p className="rounded-2xl bg-[#f7fafc] p-4 text-xs leading-5 text-slate-500">Hotel details will be confirmed based on your selected destination and travel dates.</p>
                    )}
                  </div>

                  <footer className="flex flex-col gap-3 border-t border-slate-100 bg-[#fbfdfe] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="flex items-center gap-2 text-[10px] font-semibold text-slate-500"><ShieldCheck className="size-4 text-emerald-600" />Availability confirmed after enquiry</p>
                    <Link href={`/services/holiday-packages?type=domestic&step=enquire&tier=${tier}&package=${encodeURIComponent(item.slug)}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#061f3b] px-5 text-xs font-bold text-white transition hover:-translate-y-0.5">Select package <ArrowRight className="size-4" /></Link>
                  </footer>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-9 rounded-3xl border border-[#cfe1ea] bg-white p-8 text-center shadow-sm sm:p-12">
            <CheckCircle2 className="mx-auto size-12 text-[#13a5d8]" />
            <h3 className="mt-5 font-serif text-3xl text-[#061f3b]">We’ll match the right hotel for you</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">{error || `Live ${details.label.toLowerCase()} hotel inventory is being updated. Send your destination and dates, and our holiday desk will share the available options.`}</p>
            <Link href={`/services/holiday-packages?type=domestic&step=enquire&tier=${tier}`} className={`mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${details.accent} px-7 text-sm font-bold text-white shadow-lg`}>Request {details.label} <ArrowRight className="size-4" /></Link>
          </div>
        )}
      </section>
    </main>
  );
}
