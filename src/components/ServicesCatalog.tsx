"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Bus, CalendarDays, Car, Coins, Hotel, Map, Plane, Search, ShieldCheck, Ship, Ticket, Train, UtensilsCrossed, X } from "lucide-react";
import VendorCardLink from "@/components/VendorCardLink";

export type ServiceCatalogItem = {
  title: string;
  description: string;
  slug: string;
  serviceType?: string;
  link: string;
  isExternal: boolean;
  image: string;
};

const getIcon = (slug: string, serviceType = "") => {
  const identity = `${slug} ${serviceType}`.toLowerCase();
  if (identity.includes("flight")) return Plane;
  if (identity.includes("train")) return Train;
  if (identity.includes("bus")) return Bus;
  if (identity.includes("taxi") || identity.includes("car")) return Car;
  if (identity.includes("holiday")) return Map;
  if (identity.includes("cruise")) return Ship;
  if (identity.includes("visa")) return Ticket;
  if (identity.includes("insurance")) return ShieldCheck;
  if (identity.includes("currency")) return Coins;
  if (identity.includes("event")) return CalendarDays;
  if (identity.includes("catering")) return UtensilsCrossed;
  if (identity.includes("consultancy")) return ArrowRight;
  return Hotel;
};

export default function ServicesCatalog({ services }: { services: ServiceCatalogItem[] }) {
  const [query, setQuery] = useState("");
  const filteredServices = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return services;
    return services.filter((service) =>
      `${service.title} ${service.description} ${service.slug} ${service.serviceType || ""}`.toLowerCase().includes(normalized),
    );
  }, [query, services]);

  return (
    <>
      <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <label className="relative block w-full max-w-xl">
          <span className="sr-only">Search services</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#087fbe]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services..."
            className="h-12 w-full rounded-2xl border border-[#087fbe]/15 bg-white pl-11 pr-11 text-sm font-semibold outline-none shadow-sm transition focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10"
          />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear service search" className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-100"><X className="size-4" /></button>}
        </label>
        <p className="text-xs font-bold text-slate-400">{filteredServices.length} service{filteredServices.length === 1 ? "" : "s"}</p>
      </div>

      {filteredServices.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredServices.map((service) => {
            const Icon = getIcon(service.slug, service.serviceType);
            const cardContent = <>
              <div className="relative h-36 overflow-hidden sm:h-40">
                <img src={service.image} alt={service.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061f3b]/50 to-transparent" />
                <span className="absolute bottom-3 left-4 grid size-10 place-items-center rounded-xl bg-white/92 text-[#087fbe] shadow-lg backdrop-blur"><Icon className="size-5" /></span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-serif text-xl leading-tight transition-colors group-hover:text-[#087fbe]">{service.title}</h2>
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-black/25 transition group-hover:translate-x-1 group-hover:text-[#087fbe]" />
                </div>
                <p className="mt-2 line-clamp-3 text-xs leading-5 text-black/55">{service.description}</p>
              </div>
            </>;
            const className = "service-list-card group block min-w-0 overflow-hidden rounded-2xl border border-black/10 bg-white";
            return service.isExternal
              ? <VendorCardLink key={service.slug} trackingUrl={service.link} className={className}>{cardContent}</VendorCardLink>
              : <Link key={service.slug} href={service.link} className={className}>{cardContent}</Link>;
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#087fbe]/25 bg-white px-6 py-14 text-center">
          <Search className="mx-auto size-7 text-[#087fbe]" />
          <h2 className="mt-3 font-serif text-2xl">No matching services</h2>
          <p className="mt-2 text-sm text-slate-500">Try another service name or keyword.</p>
        </div>
      )}
    </>
  );
}
