"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldAlert, Award, Plane, Trophy, Briefcase, Phone, Mail, Landmark } from "lucide-react";
import { cmsService, type ClientCategory, type OurClient } from "@/lib/api/cms";

interface InstitutionalClient {
  name: string;
  mark: string;
  image?: string;
}
interface ClientItem {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  badge: string;
  image: string;
  description: string;
  websiteUrl?: string;
  accountStatus?: string;
  hasActiveAccount?: boolean;
}

const institutionalLogoPaths: Record<string, string> = {
  "NSG": "/Asset/clients/institutional/nsg.png",
  "CRPF": "/Asset/clients/institutional/crpf.png",
  "CISF": "/Asset/clients/institutional/cisf.png",
  "BSF": "/Asset/clients/institutional/bsf.png",
  "SSB": "/Asset/clients/institutional/ssb.png",
  "ITBP": "/Asset/clients/institutional/itbp.png",
  "Assam Rifles": "/Asset/clients/institutional/assam-rifles.png",
  "SPG": "/Asset/clients/institutional/spg.png",
  "BEML": "/Asset/clients/institutional/beml.png",
  "NAL": "/Asset/clients/institutional/nal.png",
  "NHAI": "/Asset/clients/institutional/nhai.png",
  "GST": "/Asset/clients/institutional/gst.png",
  "Customs": "/Asset/clients/institutional/customs.png",
  "IOCL": "/Asset/clients/institutional/iocl.png",
  "ONGC": "/Asset/clients/institutional/ongc.png",
  "HPCL": "/Asset/clients/institutional/hpcl.png",
  "BPCL": "/Asset/clients/institutional/bpcl.png"
};
const defenceAndAlliedClients: InstitutionalClient[] = [
  { name: "Indian Army", mark: "IA", image: "/Asset/clients/001-xt9sc6.png" },
  { name: "Indian Air Force", mark: "IAF", image: "/Asset/clients/badge_of_the_indian_air_force.svg-qqwm2n.png" },
  { name: "Indian Navy", mark: "IN", image: "/Asset/clients/institutional/indian-navy.png" },
  { name: "Indian Coast Guard", mark: "ICG", image: "/Asset/clients/institutional/indian-coast-guard.png" },
  { name: "DRDO", mark: "DRDO", image: "/Asset/clients/drdo-logo-dvxed4-91dtld.png" },
  ...["NSG", "CRPF", "CISF", "BSF", "SSB", "ITBP", "RAF", "Assam Rifles", "SSF", "SSC", "SPG", "IRB", "NPA"].map(name => ({ name, mark: name.split(" ").map(word => word[0]).join("").slice(0, 4), image: institutionalLogoPaths[name] }))
];

const publicSectorClients: InstitutionalClient[] = [
  { name: "BEL", mark: "BEL", image: "/Asset/clients/1-cre4co.png" },
  { name: "ISRO", mark: "ISRO", image: "/Asset/clients/003-89g2gd.png" },
  { name: "Income Tax", mark: "IT", image: "/Asset/clients/02-gy2630.png" },
  { name: "Indian Railways", mark: "IR", image: "/Asset/clients/005-7myd83.jpg" },
  ...["BHEL", "BEML", "HAL", "MIL", "NAL", "ANTRIX", "AAI", "NHAI", "CIL", "Power Grid", "Revenue", "GST", "Customs", "IOCL", "ONGC", "HPCL", "BPCL", "GAIL"].map(name => ({ name, mark: name.split(" ").map(word => word[0]).join("").slice(0, 4), image: institutionalLogoPaths[name] }))
];const clientsList: ClientItem[] = [
  // --- GOVERNMENT & DEFENCE ---
  {
    id: "mod",
    name: "Ministry of Defence",
    category: "defence",
    categoryName: "Government & Defence",
    badge: "Official Protocol",
    image: "/Asset/clients/ministry_of_defence-3v7qxr-h5a75u.png",
    description: "Official protocol travel, delegation lodging, and command liaison operations."
  },
  {
    id: "army",
    name: "Indian Army",
    category: "defence",
    categoryName: "Government & Defence",
    badge: "Official Protocol",
    image: "/Asset/clients/001-xt9sc6.png",
    description: "Duty travel, commands transit desks, and accommodation management."
  },
  {
    id: "iaf-emblem",
    name: "Indian Air Force (Emblem)",
    category: "defence",
    categoryName: "Government & Defence",
    badge: "Official Protocol",
    image: "/Asset/clients/badge_of_the_indian_air_force.svg-qqwm2n.png",
    description: "Liaison support for Air Force commands, officer training transits, and lodging."
  },
  {
    id: "iaf-seal",
    name: "Indian Air Force (Seal)",
    category: "defence",
    categoryName: "Government & Defence",
    badge: "Official Protocol",
    image: "/Asset/clients/006-3v2z8i.jpg",
    description: "Official travel desk operations, base postings lodging, and event support."
  },
  {
    id: "iaf-wings",
    name: "Indian Air Force (Crest)",
    category: "defence",
    categoryName: "Government & Defence",
    badge: "Official Protocol",
    image: "/Asset/clients/03-p775bw.png",
    description: "Aviation command liaison, transport logistics, and official stays."
  },
  {
    id: "drdo",
    name: "DRDO",
    category: "defence",
    categoryName: "Government & Defence",
    badge: "Defence R&D",
    image: "/Asset/clients/drdo-logo-dvxed4-91dtld.png",
    description: "Research delegation transits, seminar travel management, and lodging."
  },
  {
    id: "isro",
    name: "ISRO",
    category: "defence",
    categoryName: "Government & Defence",
    badge: "Space Research Org",
    image: "/Asset/clients/003-89g2gd.png",
    description: "Space program administrative travel, scientist transits, and accommodation desks."
  },
  {
    id: "incometax",
    name: "Income Tax Department",
    category: "defence",
    categoryName: "Government & Defence",
    badge: "Civic Authority",
    image: "/Asset/clients/02-gy2630.png",
    description: "Official delegation transits, regional seminars lodging, and protocol support."
  },
  {
    id: "post",
    name: "India Post",
    category: "defence",
    categoryName: "Government & Defence",
    badge: "Postal Network",
    image: "/Asset/clients/05-ch4ls1.png",
    description: "Nationwide postal administration travel, staff transits, and corporate lodging."
  },
  {
    id: "railways",
    name: "Indian Railways",
    category: "defence",
    categoryName: "Government & Defence",
    badge: "National Infrastructure",
    image: "/Asset/clients/005-7myd83.jpg",
    description: "Official transits, railway board lodging, and administrative logistics support."
  },
  {
    id: "gov-seal",
    name: "Government of India Seal",
    category: "defence",
    categoryName: "Government & Defence",
    badge: "Official Protocol",
    image: "/Asset/clients/images-(1)-sll83.png",
    description: "Official protocol travel, liaison support, and government guest services."
  },

  // --- SPORTS & ATHLETICS ---
  {
    id: "bcci",
    name: "BCCI",
    category: "sports",
    categoryName: "Sports & Athletics",
    badge: "Governing Body",
    image: "/Asset/clients/download-5-849s67.png",
    description: "Official team travel, luxury stay desks, and VIP transport coordination."
  },
  {
    id: "nca",
    name: "National Cricket Academy",
    category: "sports",
    categoryName: "Sports & Athletics",
    badge: "Sports Academy",
    image: "/Asset/clients/national-cricket-academy-wqkqtj-71v597.jpg",
    description: "Athlete transits, coach lodging, and sports camp logistics management."
  },
  {
    id: "bulls",
    name: "Bengaluru Bulls",
    category: "sports",
    categoryName: "Sports & Athletics",
    badge: "Pro Kabaddi League",
    image: "/Asset/clients/2-uukr0.jpg",
    description: "Kabaddi squad travel desk, training camp lodging, and local transit."
  },
  {
    id: "bfc",
    name: "Bengaluru FC",
    category: "sports",
    categoryName: "Sports & Athletics",
    badge: "Indian Super League",
    image: "/Asset/clients/6-vq1nhj.jpg",
    description: "Football club matchday travel, squad lodging, and stadium logistics."
  },
  {
    id: "hockey",
    name: "Karnataka State Hockey Association",
    category: "sports",
    categoryName: "Sports & Athletics",
    badge: "Sports Association",
    image: "/Asset/clients/01-hrqsno.jpg",
    description: "State team transits, hockey tournament travel, and crew accommodations."
  },

  // --- CORPORATE & TECHNOLOGY ---
  {
    id: "gf",
    name: "GlobalFoundries",
    category: "corporate",
    categoryName: "Corporates & Tech",
    badge: "Technology Partner",
    image: "/Asset/clients/3-rafffz.png",
    description: "Corporate travel desk, business stays, and airport transit coordination."
  },
  {
    id: "astra",
    name: "AstraZeneca",
    category: "corporate",
    categoryName: "Corporates & Tech",
    badge: "Pharmaceuticals",
    image: "/Asset/clients/002-b3of9a.png",
    description: "Executive travel management, negotiated stays, and corporate policy compliance."
  },
  {
    id: "autoliv",
    name: "Autoliv",
    category: "corporate",
    categoryName: "Corporates & Tech",
    badge: "Automotive Tech",
    image: "/Asset/clients/3-67jtkj.png",
    description: "Operational travel program, corporate stays, and team meetings transport."
  },
  {
    id: "bel",
    name: "Bharat Electronics Limited",
    category: "corporate",
    categoryName: "Corporates & Tech",
    badge: "Defence PSU",
    image: "/Asset/clients/1-cre4co.png",
    description: "PSU travel desks, executive stays, and corporate delegation transport."
  },
  {
    id: "concentrix",
    name: "Concentrix",
    category: "corporate",
    categoryName: "Corporates & Tech",
    badge: "Global IT Services",
    image: "/Asset/clients/4-cf054c.jpg",
    description: "High-volume corporate transits, executive stays, and employee travel."
  },
  {
    id: "inbev",
    name: "AB InBev",
    category: "corporate",
    categoryName: "Corporates & Tech",
    badge: "Global Consumer Brand",
    image: "/Asset/clients/5-jyturd.png",
    description: "Corporate lodging desks, team seminar transits, and flight coordination."
  },
  {
    id: "ansr",
    name: "ANSR",
    category: "corporate",
    categoryName: "Corporates & Tech",
    badge: "Global Capability Centers",
    image: "/Asset/clients/004-rq7kok.jpg",
    description: "Leadership lodging, GCC setup travel support, and airport services."
  },
  {
    id: "aster-healthcare",
    name: "Aster Healthcare",
    category: "corporate",
    categoryName: "Corporates & Tech",
    badge: "Healthcare Partner",
    image: "/Asset/clients/aster-(1)-d3e6zp-lr2d8h.png",
    description: "Emergency support coordination, medical travel, and administrative lodging."
  },

  // --- AVIATION ---
  {
    id: "emirates",
    name: "Emirates Airlines",
    category: "aviation",
    categoryName: "Airlines & Aviation",
    badge: "Airlines Partner",
    image: "/Asset/clients/04-91ekvg.png",
    description: "Flight crew layover lodging, corporate aviation transits, and VIP support."
  },
  {
    id: "airasia",
    name: "AirAsia",
    category: "aviation",
    categoryName: "Airlines & Aviation",
    badge: "Airlines Partner",
    image: "/Asset/clients/02-xy5oei.png",
    description: "Crew transits, operations team lodging, and flight layover desks."
  },
  {
    id: "airfrance",
    name: "Air France",
    category: "aviation",
    categoryName: "Airlines & Aviation",
    badge: "Airlines Partner",
    image: "/Asset/clients/05-3mlmvh.jpg",
    description: "Cabin crew layovers, pilot lodging support, and operational transits."
  },
  {
    id: "malaysia",
    name: "Malaysia Airlines",
    category: "aviation",
    categoryName: "Airlines & Aviation",
    badge: "Airlines Partner",
    image: "/Asset/clients/4-gf8wnb.png",
    description: "Layover crew stays, airline administration travel, and operational desks."
  }
];

export default function ClientsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [displayClients, setDisplayClients] = useState<ClientItem[]>([]);
  const [clientCategories, setClientCategories] = useState<ClientCategory[]>([]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([cmsService.getClients(), cmsService.getClientCategories()]).then(([clients, categories]) => {
      if (cancelled) return;

      const mappedClients = clients
        .filter((client) => client.is_active !== false && Boolean(client.logo))
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .map((client: OurClient): ClientItem => ({
          id: String(client.id),
          name: client.name,
          category: client.category_slug,
          categoryName: client.category_name || "Our Clients",
          badge: client.label || client.account_status_label || "Trusted Client",
          image: client.logo,
          description: client.description || `Travel and hospitality services for ${client.name}.`,
          websiteUrl: client.website_url,
          accountStatus: client.account_status_label || "Client account",
          hasActiveAccount: client.has_active_account,
        }));

      setDisplayClients(mappedClients);
      setClientCategories(categories.filter((category) => category.is_active !== false).sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || a.name.localeCompare(b.name)));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const getCategoryIcon = (category: Pick<ClientCategory, "name" | "slug">) => {
    const value = `${category.name} ${category.slug}`.toLowerCase();
    if (/airline|aviation/.test(value)) return Plane;
    if (/sport|league|kabaddi|football|cricket/.test(value)) return Trophy;
    if (/defence|government|civic|postal|protocol|research|infrastructure/.test(value)) return Landmark;
    return Briefcase;
  };

  const categories = [
    { id: "all", label: "All Clients", icon: Award },
    ...clientCategories.map((category) => ({
      id: category.slug,
      label: category.name,
      icon: getCategoryIcon(category),
    })),
  ];

  const filteredClients = selectedCategory === "all"
    ? displayClients
    : displayClients.filter(c => c.category === selectedCategory);

  return (
    <div className="bg-[#f5f9fc] text-[#122b42] min-h-screen">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-[#062b50] px-5 py-24 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(215,181,109,.18),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]">Trusted Relationships</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">
            Our Client Portfolio
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
            Proudly serving defence commands, government ministries, multinational corporations, professional athletic clubs, and leading global airlines.
          </p>
        </div>
      </section>

      {/* Institutional Client Groups */}
      {false && <section className="hidden">
        <div className="overflow-hidden rounded-[2rem] border border-[#dce8ef] bg-white shadow-[0_24px_70px_rgba(6,43,80,.14)]">
          <div className="flex flex-col justify-between gap-6 border-b border-[#e4edf2] bg-gradient-to-r from-[#f6fbfe] to-white p-7 md:flex-row md:items-end md:p-10">
            <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#087fbe]">Institutional clients</p><h2 className="mt-2 max-w-2xl font-serif text-3xl font-semibold text-[#062b50] md:text-4xl">Trusted by institutions that serve the nation</h2></div>
            <div className="flex gap-6 text-sm text-[#607789]"><span><b className="block font-serif text-2xl text-[#087fbe]">40+</b>Institutions</span><span><b className="block font-serif text-2xl text-[#087fbe]">24×7</b>Account desks</span></div>
          </div>
          <div className="grid gap-8 p-6 md:p-8 lg:p-10">
            <article className="overflow-hidden rounded-[1.75rem] border border-[#dbe8ef] bg-[#f8fbfd]">
              <div className="flex flex-col gap-5 bg-[#062b50] p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
                <div className="flex items-center gap-4"><span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white p-2 shadow-lg"><img src="/Asset/clients/ministry_of_defence-3v7qxr-h5a75u.png" alt="Ministry of Defence" className="size-full object-contain" /></span><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#4fc3ea]">Defence network</p><h3 className="mt-1 font-serif text-2xl font-semibold md:text-3xl">Ministry of Defence &amp; Allied Forces</h3></div></div>
                <p className="max-w-md text-sm leading-6 text-white/60">Trusted travel and hospitality support across defence commands, forces and allied institutions.</p>
              </div>
              <div className="grid gap-3 p-5 sm:grid-cols-2 md:p-6 lg:grid-cols-4">
                {defenceAndAlliedClients.map((client) => <div key={client.name} className="group flex min-h-24 items-center gap-3 rounded-2xl border border-[#dce8ef] bg-white p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-[#13a5d8]/45 hover:shadow-[0_12px_30px_rgba(6,43,80,.09)]"><span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#edf7fc] p-1.5 text-[11px] font-black tracking-tight text-[#087fbe]">{client.image ? <img src={client.image} alt="" className="size-full object-contain" /> : client.mark}</span><span className="text-sm font-bold leading-5 text-[#294a63]">{client.name}</span></div>)}
                <div className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-[#087fbe]/30 bg-[#edf7fc]/50 p-3 text-xs font-bold uppercase tracking-[.14em] text-[#087fbe]">And others</div>
              </div>
            </article>
            <article className="overflow-hidden rounded-[1.75rem] border border-[#eadfca] bg-[#fffdf8]">
              <div className="flex flex-col gap-5 bg-gradient-to-r from-[#81601d] to-[#a77d28] p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
                <div className="flex items-center gap-4"><span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-[#ffe5a9]"><Briefcase className="size-7" /></span><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#ffe5a9]">Government network</p><h3 className="mt-1 font-serif text-2xl font-semibold md:text-3xl">PSUs &amp; Government Departments</h3></div></div>
                <p className="max-w-md text-sm leading-6 text-white/70">Coordinated reservations and travel assistance for PSUs, departments and national institutions.</p>
              </div>
              <div className="grid gap-3 p-5 sm:grid-cols-2 md:p-6 lg:grid-cols-4">
                {publicSectorClients.map((client) => <div key={client.name} className="group flex min-h-24 items-center gap-3 rounded-2xl border border-[#eadfca] bg-white p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-[#bd8b2b]/45 hover:shadow-[0_12px_30px_rgba(91,67,20,.09)]"><span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#fff6df] p-1.5 text-[11px] font-black tracking-tight text-[#936817]">{client.image ? <img src={client.image} alt="" className="size-full object-contain" /> : client.mark}</span><span className="text-sm font-bold leading-5 text-[#53492f]">{client.name}</span></div>)}
                <div className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-[#bd8b2b]/30 bg-[#fff8e9] p-3 text-xs font-bold uppercase tracking-[.14em] text-[#936817]">And others</div>
              </div>
            </article>
          </div>
        </div>
      </section>}
      {/* Main Content & Interactive Filter Section */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-black/10 pb-6 mb-12">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-semibold transition border duration-300 ${
                  isActive
                    ? "bg-[#062b50] text-white border-[#062b50] shadow-md"
                    : "bg-white text-[#344a5c] border-black/8 hover:border-[#13a5d8]/75 hover:bg-slate-50"
                }`}
              >
                <Icon className="size-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Clients Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredClients.length === 0 && (
            <div className="col-span-full rounded-3xl border border-dashed border-[#087fbe]/25 bg-white px-6 py-16 text-center">
              <h2 className="font-serif text-2xl font-semibold text-[#062b50]">No clients available</h2>
              <p className="mt-2 text-sm text-[#607789]">Client information will appear here when it is added.</p>
            </div>
          )}
          {filteredClients.map(client => {
            return (
              <article
                key={client.id}
                className="group relative flex min-h-[360px] flex-col overflow-hidden rounded-[2rem] border border-[#dce8ef] bg-white shadow-[0_10px_35px_rgba(6,43,80,.06)] transition duration-500 hover:-translate-y-1.5 hover:border-[#13a5d8]/40 hover:shadow-[0_24px_55px_rgba(6,43,80,.14)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#087fbe] via-[#13a5d8] to-[#6dd5f5] opacity-70 transition group-hover:opacity-100" />
                <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-[#f8fbfd] via-white to-[#edf7fc] p-7">
                  <div className="absolute left-5 top-5 rounded-full border border-[#087fbe]/15 bg-white/85 px-3 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-[#087fbe] shadow-sm backdrop-blur">
                    {client.categoryName}
                  </div>
                  <img src={client.image} alt={`${client.name} logo`} className="mt-5 max-h-20 max-w-[75%] object-contain drop-shadow-sm transition duration-500 group-hover:scale-105" loading="lazy" />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <span className="w-fit rounded-full bg-[#edf6fc] px-3 py-1 text-[9px] font-bold uppercase tracking-[.14em] text-[#087fbe]">{client.badge}</span>
                  <h3 className="mt-4 font-serif text-xl font-semibold leading-tight text-[#062b50] transition-colors group-hover:text-[#087fbe]">{client.name}</h3>
                  <p className="mt-3 line-clamp-3 text-xs leading-5 text-[#607789]">{client.description}</p>

                  <div className="mt-auto flex items-center justify-between border-t border-[#e4edf2] pt-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#4d6b7f]">
                      <span className={`size-2 rounded-full ${client.hasActiveAccount ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.12)]" : "bg-slate-300"}`} />
                      {client.accountStatus}
                    </div>
                    {client.websiteUrl && <a href={client.websiteUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${client.name} website`} className="grid size-9 place-items-center rounded-full bg-[#062b50] text-white transition hover:bg-[#087fbe]"><ArrowRight className="size-4 -rotate-45" /></a>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Advisory & Liaison Desk CTA */}
      <section className="bg-white border-t border-black/10 py-20 px-5 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <ShieldAlert className="size-10 text-[#087fbe] mx-auto mb-6" />
          <h2 className="font-serif text-4xl font-semibold text-[#062b50]">
            Dedicated Support for Institutional Clients
          </h2>
          <p className="mt-4 max-w-xl mx-auto leading-8 text-black/55">
            BHLI sets up exclusive travel and reservation desks for ministries, official commands, and major corporate divisions. Contact our liaison officer to configure your protocol desks.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 rounded-full bg-[#062b50] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#062b50]/20 hover:-translate-y-0.5 hover:brightness-110"
            >
              Contact Liaison Desk <ArrowRight className="size-4" />
            </Link>
            <a
              href="mailto:ceo@bookinghospitality.com"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-7 py-3.5 font-bold text-[#344a5c] hover:bg-slate-50"
            >
              <Mail className="size-4" /> Email CEO Desk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
