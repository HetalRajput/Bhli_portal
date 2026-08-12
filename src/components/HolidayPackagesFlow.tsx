"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CircleAlert, Globe2, LoaderCircle, MapPinned, PackageOpen, RefreshCcw } from "lucide-react";
import UnifiedBookingForm from "@/components/UnifiedBookingForm";
import { getErrorMessage } from "@/lib/api/client";
import { portalService, type HolidayCollection } from "@/lib/api/portal";

const collectionImages = {
  domestic: "/holiday-packages/domestic/domestic-01.jpg",
  international: "/holiday-packages/international/international-01.jpg",
} as const;

export default function HolidayPackagesFlow() {
  const searchParams = useSearchParams();
  const [collections, setCollections] = useState<HolidayCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let active = true;
    portalService.holidayCollections()
      .then((rows) => {
        if (active) setCollections(rows);
      })
      .catch((requestError) => {
        if (!active) return;
        setCollections([]);
        setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [requestVersion]);

  if (searchParams.get("step") === "enquire") {
    return <UnifiedBookingForm serviceSlug="holiday-packages" />;
  }

  function retry() {
    setLoading(true);
    setError("");
    setRequestVersion((current) => current + 1);
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] text-[#061f3b]">
      <section className="bg-[#061f3b] px-5 py-14 text-white lg:px-8 lg:py-18">
        <div className="mx-auto max-w-7xl">
          <span className="grid size-11 place-items-center rounded-xl bg-[#13a5d8]/15 text-[#55d0f2]">
            <PackageOpen className="size-5" />
          </span>
          <p className="mt-6 text-xs font-extrabold uppercase tracking-[.2em] text-[#55d0f2]">Holiday packages</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">Choose your holiday collection</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">Select Domestic or International to browse the packages currently available in that collection.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16" aria-label="Holiday package collections">
        {loading && (
          <div className="flex min-h-64 items-center justify-center gap-2 text-sm font-bold text-slate-500">
            <LoaderCircle className="size-5 animate-spin text-[#087fbe]" />Loading holiday collections...
          </div>
        )}

        {!loading && error && (
          <div role="alert" className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-white px-6 py-10 text-center shadow-sm">
            <CircleAlert className="mx-auto size-7 text-red-500" />
            <h2 className="mt-3 text-lg font-extrabold">Collections could not be loaded</h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button type="button" onClick={retry} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#087fbe] px-5 py-3 text-sm font-bold text-white">
              <RefreshCcw className="size-4" />Try again
            </button>
          </div>
        )}

        {!loading && !error && collections.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">No holiday collections are currently available.</div>
        )}

        {!loading && !error && collections.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {collections.map((collection) => {
              const isInternational = collection.slug === "international";
              const Icon = isInternational ? Globe2 : MapPinned;
              const image = collection.banner_image || collectionImages[isInternational ? "international" : "domestic"];
              return (
                <Link key={collection.id} href={`/services/holiday-packages/${encodeURIComponent(collection.slug)}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(6,31,59,.08)] transition duration-300 hover:-translate-y-1 hover:border-[#13a5d8]/50 hover:shadow-[0_20px_50px_rgba(6,31,59,.14)]">
                  <div className="relative h-56 overflow-hidden bg-[#07345d]">
                    <img src={image} alt={collection.title || collection.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061f3b]/80 via-[#061f3b]/15 to-transparent" />
                    <span className="absolute bottom-5 left-5 grid size-11 place-items-center rounded-xl bg-white text-[#087fbe] shadow"><Icon className="size-5" /></span>
                  </div>
                  <div className="flex items-center justify-between gap-5 p-6">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#087fbe]">{collection.name}</p>
                      <h2 className="mt-2 text-2xl font-extrabold">{collection.title || collection.name}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{collection.short_description || collection.description}</p>
                    </div>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#087fbe] text-white transition group-hover:translate-x-1"><ArrowRight className="size-5" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
