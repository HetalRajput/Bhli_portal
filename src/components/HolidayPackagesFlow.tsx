"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe2, MapPinned } from "lucide-react";
import { useSearchParams } from "next/navigation";
import HolidayPackageDetail, { type HolidayPackageType } from "@/components/HolidayPackageDetail";
import UnifiedBookingForm from "@/components/UnifiedBookingForm";

const packageTypes = {
  domestic: {
    title: "Domestic holiday packages",
    eyebrow: "Explore India",
    description:
      "Discover hill stations, heritage cities, beaches, wildlife, pilgrimage destinations and complete LTC package details.",
    meta: "India travel collection",
    tags: ["India-wide tours", "LTC options", "Family trips"],
    highlights: ["Nature and hill retreats", "Heritage and pilgrimage", "Silver, Gold and Platinum options"],
    icon: MapPinned,
    image: "https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  international: {
    title: "International holiday packages",
    eyebrow: "Explore the world",
    description:
      "Browse popular, budget-friendly, honeymoon, luxury, European and emerging international destinations.",
    meta: "Global travel collection",
    tags: ["Worldwide tours", "Honeymoon", "Luxury escapes"],
    highlights: ["Popular and value destinations", "Beach and honeymoon escapes", "Luxury and European tours"],
    icon: Globe2,
    image: "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
} as const;

type PackageType = keyof typeof packageTypes;

export default function HolidayPackagesFlow() {
  const searchParams = useSearchParams();
  const requestedType = searchParams.get("type");
  const selectedType: HolidayPackageType | null =
    requestedType === "domestic" || requestedType === "international" ? requestedType : null;

  if (selectedType && searchParams.get("step") === "enquire") {
    return <UnifiedBookingForm serviceSlug="holiday-packages" />;
  }

  if (selectedType) {
    return <HolidayPackageDetail packageType={selectedType} />;
  }

  return (
    <main className="min-h-screen bg-[#edf5f9] text-[#122b42]">
      <section className="relative overflow-hidden bg-[#061f3b] px-5 py-20 text-center text-white lg:px-8">
        <div className="absolute -left-28 top-10 size-72 rounded-full bg-[#087fbe]/15 blur-3xl" />
        <div className="absolute -right-20 bottom-0 size-64 rounded-full bg-[#13a5d8]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[.05] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[.28em] text-[#13a5d8]">Plan your next escape</p>
          <h1 className="mx-auto mt-4 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">Choose your holiday package</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60">Explore curated Domestic and International holiday ideas, then let our travel desk personalise your journey.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-7 px-5 py-12 md:grid-cols-2 lg:px-8 lg:py-16">
        {(Object.entries(packageTypes) as [PackageType, (typeof packageTypes)[PackageType]][]).map(([key, item]) => {
          const Icon = item.icon;
          return (
            <Link key={key} href={`/services/holiday-packages/${key}`} className="group overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_18px_55px_rgba(6,31,59,.10)] ring-1 ring-slate-900/[.03] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_75px_rgba(6,31,59,.18)]">
              
              {/* Image Header */}
              <div className="relative h-[240px] w-full overflow-hidden">
                <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061f3b]/70 via-black/10 to-transparent" />
                
                <div className="absolute left-6 right-6 top-6 flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-xl bg-white/20 text-white shadow-sm ring-1 ring-white/30 backdrop-blur-md">
                    <Icon className="size-6" />
                  </span>
                  <span className="rounded-full border border-white/30 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
                    {item.meta}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="flex min-h-[340px] flex-col p-6 sm:p-8">
                <div className="mb-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-[#087fbe]">{item.eyebrow}</p>
                  <h2 className="mt-2 font-serif text-3xl text-[#061f3b] sm:text-4xl">{item.title}</h2>
                </div>
                
                <p className="text-sm leading-7 text-slate-500">{item.description}</p>
                
                <div className="mt-5 space-y-2.5">
                  {item.highlights.map((highlight) => (
                    <p key={highlight} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
                      <CheckCircle2 className="size-4 shrink-0 text-[#13a5d8]" />
                      {highlight}
                    </p>
                  ))}
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6">
                  <span className="text-sm font-extrabold text-[#087fbe]">Explore holiday packages</span>
                  <span className="grid size-11 place-items-center rounded-full bg-gradient-to-r from-[#0875b7] to-[#13a5d8] text-white shadow-lg transition duration-300 group-hover:translate-x-1">
                    <ArrowRight className="size-5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
