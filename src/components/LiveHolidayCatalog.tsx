"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, CircleAlert, MapPin, RefreshCcw } from "lucide-react";
import { getErrorMessage } from "@/lib/api/client";
import { portalService, type HolidayPackage } from "@/lib/api/portal";

const fallbackImages = {
  all: "/holiday-packages/domestic/domestic-01.jpg",
  domestic: "/holiday-packages/domestic/domestic-01.jpg",
  international: "/holiday-packages/international/international-01.jpg",
} as const;

export default function LiveHolidayCatalog({ collection }: { collection?: "domestic" | "international" }) {
  const [packages, setPackages] = useState<HolidayPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let active = true;
    portalService.holidayPackages(collection ? { collection } : undefined)
      .then((rows) => { if (active) setPackages(rows); })
      .catch((requestError) => {
        if (!active) return;
        setPackages([]);
        setError(getErrorMessage(requestError));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [collection, requestVersion]);

  function retry() {
    setLoading(true);
    setError("");
    setRequestVersion((current) => current + 1);
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-18" aria-labelledby="live-holiday-packages-title">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#087fbe]">Available now</p>
          <h2 id="live-holiday-packages-title" className="mt-2 text-3xl font-extrabold text-[#061f3b] sm:text-4xl">All holiday packages</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Select a package to view its latest variants, prices, inclusions and hotel choices.</p>
        </div>
        {!loading && !error && <p className="text-xs font-bold text-slate-400">{packages.length} package{packages.length === 1 ? "" : "s"} found</p>}
      </div>

      {loading && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => <div key={index} className="h-[370px] animate-pulse rounded-2xl bg-white shadow-sm"><div className="h-48 rounded-t-2xl bg-slate-200" /><div className="space-y-3 p-5"><div className="h-3 w-24 rounded bg-slate-200" /><div className="h-6 w-4/5 rounded bg-slate-200" /><div className="h-3 w-full rounded bg-slate-100" /><div className="h-3 w-2/3 rounded bg-slate-100" /></div></div>)}
        </div>
      )}

      {!loading && error && (
        <div role="alert" className="mt-8 flex flex-col items-center rounded-2xl border border-red-100 bg-white px-5 py-10 text-center shadow-sm">
          <CircleAlert className="size-7 text-red-500" />
          <h3 className="mt-3 text-sm font-extrabold text-[#061f3b]">Packages could not be loaded</h3>
          <p className="mt-2 max-w-lg text-xs leading-5 text-slate-500">{error}</p>
          <button type="button" onClick={retry} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#061f3b] px-4 py-2.5 text-xs font-bold text-white"><RefreshCcw className="size-3.5" />Try again</button>
        </div>
      )}

      {!loading && !error && packages.length === 0 && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center"><p className="text-sm font-bold text-[#061f3b]">No packages are currently available.</p><p className="mt-2 text-xs text-slate-500">Please check again soon or contact our travel desk.</p></div>
      )}

      {!loading && !error && packages.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((item) => {
            const destination = typeof item.destination === "string" ? item.destination : item.destination.name;
            const packageCollection = typeof item.destination === "string" ? collection || "domestic" : item.destination.collection_slug;
            const query = new URLSearchParams({
              step: "enquire",
              type: packageCollection,
              package: String(item.id),
              packageName: item.name,
              destination,
              days: String(item.days),
            });
            return (
              <Link key={item.id} href={`/services/holiday-packages?${query.toString()}`} className="group flex min-h-[370px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(6,31,59,.07)] transition duration-300 hover:-translate-y-1 hover:border-[#13a5d8]/45 hover:shadow-[0_18px_45px_rgba(6,31,59,.13)]">
                <div className="relative h-48 overflow-hidden bg-[#07345d]">
                  <img src={item.image || fallbackImages[collection || "all"]} alt={item.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061f3b]/70 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold text-[#087fbe] shadow backdrop-blur"><MapPin className="size-3" />{destination}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400"><CalendarDays className="size-3.5 text-[#13a5d8]" />{item.nights} nights / {item.days} days</p>
                  <h3 className="mt-2 text-xl font-extrabold leading-7 text-[#061f3b]">{item.name}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{item.short_description}</p>
                  <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
                    <div><span className="text-[9px] font-bold uppercase text-slate-400">Starting from</span><p className="mt-0.5 text-lg font-extrabold text-[#087fbe]">{item.starting_price ? `₹${Number(item.starting_price).toLocaleString("en-IN")}` : "On request"}</p></div>
                    <span className="grid size-10 place-items-center rounded-full bg-gradient-to-r from-[#0875b7] to-[#13a5d8] text-white shadow transition group-hover:translate-x-1"><ArrowRight className="size-4" /></span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
