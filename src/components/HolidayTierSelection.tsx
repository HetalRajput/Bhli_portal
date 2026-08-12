"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CircleAlert,
  Crown,
  Gem,
  LoaderCircle,
  MapPin,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { getErrorMessage } from "@/lib/api/client";
import { portalService, type HolidayDestination, type HolidayPackage, type HolidayTier } from "@/lib/api/portal";

type Collection = "domestic" | "international";

const collectionContent = {
  domestic: {
    title: "Domestic holiday packages",
    description: "Compare Silver, Gold and Premium packages across India.",
  },
  international: {
    title: "International holiday packages",
    description: "Compare Budget, Mid-range and Premium packages around the world.",
  },
} as const;

const tierIcons = [Gem, Sparkles, Crown];
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function fallbackImage(collection: Collection, index: number) {
  const imageCount = collection === "domestic" ? 2 : 8;
  return `/holiday-packages/${collection}/${collection}-${String((index % imageCount) + 1).padStart(2, "0")}.jpg`;
}

export default function HolidayTierSelection({ collection }: { collection: Collection }) {
  const searchParams = useSearchParams();
  const requestedTier = searchParams.get("tier") || "";
  const requestedDestination = searchParams.get("destination") || "";
  const [tiers, setTiers] = useState<HolidayTier[]>([]);
  const [destinations, setDestinations] = useState<HolidayDestination[]>([]);
  const [packages, setPackages] = useState<HolidayPackage[]>([]);
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(requestedDestination);
  const [search, setSearch] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [packageLoading, setPackageLoading] = useState(false);
  const [initialError, setInitialError] = useState("");
  const [packageError, setPackageError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);
  const [packageRequestVersion, setPackageRequestVersion] = useState(0);
  const page = collectionContent[collection];

  useEffect(() => {
    let active = true;
    Promise.all([
      portalService.holidayTiers(collection),
      portalService.holidayDestinations({ collection }),
    ])
      .then(([tierRows, destinationRows]) => {
        if (!active) return;
        const orderedTiers = [...tierRows].sort((a, b) => a.display_order - b.display_order);
        setTiers(orderedTiers);
        setDestinations(destinationRows);
        setPackageLoading(orderedTiers.length > 0);
        setSelectedTier((current) => current || (orderedTiers.some((tier) => tier.slug === requestedTier) ? requestedTier : orderedTiers[0]?.slug || ""));
      })
      .catch((error) => {
        if (active) setInitialError(getErrorMessage(error));
      })
      .finally(() => {
        if (active) setInitialLoading(false);
      });
    return () => { active = false; };
  }, [collection, requestVersion, requestedTier]);

  useEffect(() => {
    if (!selectedTier) return;
    let active = true;
    portalService.holidayPackages({
      collection,
      tier: selectedTier,
      destination: selectedDestination || undefined,
    })
      .then((rows) => {
        if (active) setPackages(rows);
      })
      .catch((error) => {
        if (!active) return;
        setPackages([]);
        setPackageError(getErrorMessage(error));
      })
      .finally(() => {
        if (active) setPackageLoading(false);
      });
    return () => { active = false; };
  }, [collection, packageRequestVersion, selectedDestination, selectedTier]);

  const visiblePackages = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return packages;
    return packages.filter((item) => {
      const destination = typeof item.destination === "string" ? item.destination : item.destination.name;
      return [item.name, destination, item.short_description].some((value) => value?.toLowerCase().includes(query));
    });
  }, [packages, search]);

  const selectedTierName = tiers.find((tier) => tier.slug === selectedTier)?.name || "Packages";
  const selectedDestinationName = destinations.find((destination) => destination.slug === selectedDestination)?.name;

  function chooseTier(slug: string) {
    if (slug === selectedTier) return;
    setSelectedTier(slug);
    setSelectedDestination("");
    setSearch("");
    setPackages([]);
    setPackageError("");
    setPackageLoading(true);
  }

  function chooseDestination(slug: string) {
    if (slug === selectedDestination) return;
    setSelectedDestination(slug);
    setPackages([]);
    setPackageError("");
    setPackageLoading(true);
  }

  function retryInitial() {
    setInitialLoading(true);
    setInitialError("");
    setRequestVersion((current) => current + 1);
  }

  function retryPackages() {
    setPackageLoading(true);
    setPackageError("");
    setPackageRequestVersion((current) => current + 1);
  }

  if (initialLoading) {
    return <main className="grid min-h-[70vh] place-items-center bg-[#f4f8fb]"><Loading label={`Loading ${collection} package plans...`} /></main>;
  }

  if (initialError) {
    return <main className="grid min-h-[70vh] place-items-center bg-[#f4f8fb] px-5"><ErrorState title="Holiday plans could not be loaded" message={initialError} retry={retryInitial} /></main>;
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] text-[#061f3b]">
      <section className="bg-[#061f3b] px-5 py-10 text-white lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <Link href="/services/holiday-packages" className="inline-flex items-center gap-2 text-sm font-bold text-white/65 transition hover:text-white"><ArrowLeft className="size-4" />Holiday collections</Link>
          <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#55d0f2]">{collection} collection</p><h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{page.title}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">{page.description}</p></div>
            <div className="flex gap-2 text-[10px] font-extrabold uppercase tracking-wider"><span className="rounded-lg bg-emerald-500/15 px-3 py-2 text-emerald-300">Collection selected</span><span className="rounded-lg bg-white/10 px-3 py-2 text-white">Choose package</span></div>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-5 py-4 shadow-[0_8px_25px_rgba(6,31,59,.06)] backdrop-blur lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[.18em] text-slate-400">Package tier</p>
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={`${collection} package tiers`}>
            {tiers.map((tier, index) => {
              const Icon = tierIcons[index % tierIcons.length];
              const active = selectedTier === tier.slug;
              return <button key={tier.id} type="button" role="tab" aria-selected={active} onClick={() => chooseTier(tier.slug)} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-5 text-sm font-extrabold transition ${active ? "border-[#087fbe] bg-[#087fbe] text-white shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-[#13a5d8] hover:text-[#087fbe]"}`}><Icon className="size-4" />{tier.name}{active && <Check className="size-3.5" />}</button>;
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14" aria-labelledby="packages-title">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#087fbe]">{selectedTierName} tier</p><h2 id="packages-title" className="mt-1 text-3xl font-extrabold">Available packages</h2><p className="mt-2 text-sm text-slate-500">{selectedDestinationName ? `Showing ${selectedDestinationName} packages.` : `Showing all ${collection} destinations in this tier.`}</p></div>
          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto">
            <label className="flex h-12 min-w-64 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-slate-400 shadow-sm focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10"><MapPin className="size-4 text-[#087fbe]" /><select value={selectedDestination} onChange={(event) => chooseDestination(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[#061f3b] outline-none"><option value="">All destinations</option>{destinations.map((destination) => <option key={destination.id} value={destination.slug}>{destination.name}</option>)}</select></label>
            <label className="flex h-12 min-w-64 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-slate-400 shadow-sm focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-[#13a5d8]/10"><Search className="size-4 text-[#087fbe]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search packages" className="min-w-0 flex-1 text-sm font-semibold text-[#061f3b] outline-none" />{search && <button type="button" onClick={() => setSearch("")} aria-label="Clear package search"><X className="size-4" /></button>}</label>
          </div>
        </div>

        {(selectedDestination || search) && <div className="mt-5 flex flex-wrap items-center gap-2 text-xs"><SlidersHorizontal className="size-4 text-[#087fbe]" />{selectedDestinationName && <button type="button" onClick={() => chooseDestination("")} className="inline-flex items-center gap-1 rounded-full border border-[#087fbe]/20 bg-[#edf8fc] px-3 py-1.5 font-bold text-[#087fbe]">{selectedDestinationName}<X className="size-3" /></button>}{search && <button type="button" onClick={() => setSearch("")} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-600">Search: {search}<X className="size-3" /></button>}</div>}

        {packageLoading && <Loading label={`Loading ${selectedTierName.toLowerCase()} packages...`} />}
        {!packageLoading && packageError && <ErrorState title="Packages could not be loaded" message={packageError} retry={retryPackages} />}

        {!packageLoading && !packageError && visiblePackages.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visiblePackages.map((item, index) => {
              const destinationName = typeof item.destination === "string" ? item.destination : item.destination.name;
              const query = new URLSearchParams({
                step: "enquire",
                type: collection,
                package: String(item.id),
                packageName: item.name,
                destination: destinationName,
                tier: selectedTier,
                days: String(item.days),
              });
              return <Link key={item.id} href={`/services/holiday-packages?${query.toString()}`} className="group flex min-h-[390px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_10px_30px_rgba(6,31,59,.07)] transition duration-300 hover:-translate-y-1 hover:border-[#13a5d8] hover:shadow-[0_18px_42px_rgba(6,31,59,.13)]">
                <span className="relative block h-44 shrink-0 overflow-hidden bg-[#07345d]"><img src={item.image || fallbackImage(collection, index)} alt={item.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /><span className="absolute inset-0 bg-gradient-to-t from-[#061f3b]/75 via-transparent to-transparent" /><span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2.5 py-1.5 text-[10px] font-extrabold text-[#061f3b] shadow-sm"><MapPin className="size-3.5 text-[#087fbe]" />{destinationName}</span><span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-md bg-[#061f3b]/85 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur"><CalendarDays className="size-3.5 text-[#55d0f2]" />{item.nights}N / {item.days}D</span></span>
                <span className="flex flex-1 flex-col p-5"><span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#087fbe]">{selectedTierName} package</span><h3 className="mt-2 text-xl font-extrabold leading-7">{item.name}</h3><span className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{item.short_description}</span><span className="mt-auto flex items-end justify-between border-t border-slate-100 pt-5"><span><small className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Starting from</small><b className="mt-0.5 block text-xl text-[#087fbe]">{item.starting_price ? money.format(Number(item.starting_price)) : "On request"}</b></span><span className="inline-flex items-center gap-2 text-xs font-extrabold text-[#061f3b]">Book package<span className="grid size-9 place-items-center rounded-full bg-[#087fbe] text-white transition group-hover:translate-x-1"><ArrowRight className="size-4" /></span></span></span></span>
              </Link>;
            })}
          </div>
        )}

        {!packageLoading && !packageError && visiblePackages.length === 0 && (
          <div className="mt-8 rounded-lg border border-slate-200 bg-white px-6 py-12 text-center shadow-sm"><CircleAlert className="mx-auto size-8 text-slate-400" /><h3 className="mt-4 text-lg font-extrabold">No matching packages</h3><p className="mt-2 text-sm text-slate-500">Clear the filters or choose another tier.</p>{(selectedDestination || search) && <button type="button" onClick={() => { setSearch(""); chooseDestination(""); }} className="mt-5 rounded-lg bg-[#061f3b] px-5 py-3 text-sm font-bold text-white">Clear filters</button>}</div>
        )}
      </section>
    </main>
  );
}

function Loading({ label }: { label: string }) {
  return <div className="flex min-h-48 items-center justify-center gap-2 text-sm font-bold text-slate-500"><LoaderCircle className="size-5 animate-spin text-[#087fbe]" />{label}</div>;
}

function ErrorState({ title, message, retry }: { title: string; message: string; retry: () => void }) {
  return <section role="alert" className="mt-8 w-full max-w-xl rounded-lg border border-red-100 bg-white px-6 py-10 text-center shadow-sm"><CircleAlert className="mx-auto size-7 text-red-500" /><h2 className="mt-3 text-lg font-extrabold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{message}</p><button type="button" onClick={retry} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#061f3b] px-5 py-3 text-sm font-bold text-white"><RefreshCcw className="size-4" />Try again</button></section>;
}
