"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldAlert, Award, Plane, Trophy, Briefcase, Phone, Mail, Landmark } from "lucide-react";

interface ClientItem {
  id: string;
  name: string;
  category: "defence" | "corporate" | "sports" | "aviation";
  categoryName: string;
  badge: string;
  image: string;
  description: string;
}

const defenceAndAlliedClients = [
  "Indian Army", "Indian Air Force", "Indian Navy", "Indian Coast Guard", "DRDO", "NSG", "CRPF", "CISF", "BSF", "SSB", "ITBP", "RAF", "Assam Rifles", "SSF", "SSC", "SPG", "IRB", "NPA"
];

const publicSectorClients = [
  "BHEL", "BEL", "BEML", "HAL", "MIL", "ISRO", "NAL", "ANTRIX", "AAI", "NHAI", "CIL", "Power Grid", "Income Tax", "Revenue", "GST", "Customs", "IOCL", "ONGC", "HPCL", "BPCL", "GAIL", "Indian Railways"
];
const clientsList: ClientItem[] = [
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

  const categories = [
    { id: "all", label: "All Clients", icon: Award },
    { id: "defence", label: "Government & Defence", icon: Landmark },
    { id: "corporate", label: "Corporates & Tech", icon: Briefcase },
    { id: "sports", label: "Sports & Athletics", icon: Trophy },
    { id: "aviation", label: "Airlines & Aviation", icon: Plane }
  ];

  const filteredClients = selectedCategory === "all"
    ? clientsList
    : clientsList.filter(c => c.category === selectedCategory);

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
      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-5 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-black/[.06] bg-white shadow-[0_22px_65px_rgba(6,43,80,.13)]">
          <div className="grid lg:grid-cols-2">
            <article className="p-7 md:p-10 lg:border-r lg:border-black/[.07]">
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#062b50] text-[#13a5d8]"><Landmark className="size-6" /></span>
                <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#087fbe]">Institutional clients</p><h2 className="mt-2 font-serif text-3xl font-semibold text-[#062b50]">Ministry of Defence &amp; Allied Forces</h2></div>
              </div>
              <p className="mt-5 text-sm leading-7 text-[#607789]">Trusted travel and hospitality support across defence commands, forces and allied institutions.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {defenceAndAlliedClients.map((client) => <span key={client} className="rounded-full border border-[#087fbe]/12 bg-[#edf7fc] px-3.5 py-2 text-xs font-semibold text-[#294a63]">{client}</span>)}
                <span className="rounded-full border border-dashed border-[#087fbe]/30 px-3.5 py-2 text-xs font-semibold text-[#087fbe]">and others</span>
              </div>
            </article>

            <article className="border-t border-black/[.07] p-7 md:p-10 lg:border-t-0">
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#13a5d8] text-[#062b50]"><Briefcase className="size-6" /></span>
                <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#087fbe]">Government network</p><h2 className="mt-2 font-serif text-3xl font-semibold text-[#062b50]">Public Sector Undertakings &amp; Government Departments</h2></div>
              </div>
              <p className="mt-5 text-sm leading-7 text-[#607789]">Coordinated reservations and travel assistance for PSUs, departments and national institutions.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {publicSectorClients.map((client) => <span key={client} className="rounded-full border border-[#b47500]/12 bg-[#fff8e9] px-3.5 py-2 text-xs font-semibold text-[#5e522f]">{client}</span>)}
                <span className="rounded-full border border-dashed border-[#b47500]/30 px-3.5 py-2 text-xs font-semibold text-[#9a6900]">and others</span>
              </div>
            </article>
          </div>
        </div>
      </section>
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
          {filteredClients.map(client => {
            return (
              <div
                key={client.id}
                className={`group flex flex-col justify-between overflow-hidden rounded-3xl border border-black/10 bg-white p-6 transition duration-500 hover:shadow-xl hover:-translate-y-1.5`}
              >
                <div>
                  {/* Logo Image Container */}
                  <div className="flex h-24 items-center justify-center rounded-2xl bg-[#f8fafc] border border-black/[0.04] p-4 mb-5 overflow-hidden">
                    <img
                      src={client.image}
                      alt={client.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Client Category Badge */}
                  <span className="inline-block rounded-full bg-[#edf6fc] px-3 py-0.5 text-[9px] font-bold text-[#087fbe] uppercase tracking-wider mb-2.5">
                    {client.badge}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-lg font-semibold text-[#062b50] group-hover:text-[#087fbe] transition-colors mb-2">
                    {client.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs leading-5 text-black/55 mb-4">
                    {client.description}
                  </p>
                </div>

                {/* Footer/Service indicator */}
                <div className="border-t border-black/5 pt-3.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#087fbe] opacity-70 group-hover:opacity-100 transition-opacity">
                    <span>Active Account Desk</span>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
              </div>
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
