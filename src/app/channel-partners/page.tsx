"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Bus, ShieldCheck, HeartHandshake, Stethoscope, Landmark, Phone, Search, X } from "lucide-react";
import { cmsService, type ChannelPartner } from "@/lib/api/cms";
import PartnerLogo from "@/components/PartnerLogo";

// Custom SVG brand logo components to match the brands recognized from the image
const LogoGramin = () => (
  <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto" aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
    {/* Outer Saffron/Green circular shapes representing Gramin Seva Kendra */}
    <path d="M18,50 A32,32 0 0,1 82,50" fill="none" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" />
    <path d="M18,50 A32,32 0 0,0 82,50" fill="none" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
    {/* Center elements */}
    <circle cx="50" cy="50" r="14" fill="none" stroke="#0284c7" strokeWidth="2.5" />
    {/* Simplified holding hands figures */}
    <circle cx="45" cy="47" r="3" fill="#1e3a8a" />
    <path d="M40,57 C40,52 50,52 50,57" fill="#1e3a8a" />
    <circle cx="55" cy="47" r="3" fill="#1e3a8a" />
    <path d="M50,57 C50,52 60,52 60,57" fill="#1e3a8a" />
  </svg>
);

const LogoLeela = () => (
  <svg viewBox="0 0 120 70" className="w-28 h-16 mx-auto" aria-hidden="true">
    {/* Luxury serif flower emblem */}
    <path d="M60,5 C61.5,13 58.5,13 60,22 C61.5,13 58.5,13 60,5 Z" fill="#d97706" />
    <path d="M60,22 C52,20 52,24 44,22 C52,24 52,20 60,22 Z" fill="#d97706" />
    <path d="M60,22 C68,20 68,24 76,22 C68,24 68,20 60,22 Z" fill="#d97706" />
    <path d="M60,22 C54.5,15 58,15 52,9 C58,15 54.5,15 60,22 Z" fill="#d97706" />
    <path d="M60,22 C65.5,15 62,15 68,9 C62,15 65.5,15 60,22 Z" fill="#d97706" />
    {/* Typography */}
    <text x="60" y="44" textAnchor="middle" fontSize="10.5" fontFamily="serif" fontWeight="bold" fill="#0f172a" letterSpacing="1.5">THE LEELA</text>
    <text x="60" y="53" textAnchor="middle" fontSize="4.5" fontFamily="sans-serif" fill="#64748b" letterSpacing="0.8">PALACES HOTELS RESORTS</text>
  </svg>
);

const LogoOyo = () => (
  <svg viewBox="0 0 100 40" className="w-24 h-10 mx-auto" aria-hidden="true">
    <text x="50" y="29" textAnchor="middle" fontSize="28" fontFamily="sans-serif" fontWeight="900" fill="#dc2626" letterSpacing="-1">OYO</text>
  </svg>
);

const LogoAster = () => (
  <svg viewBox="0 0 120 50" className="w-28 h-12 mx-auto" aria-hidden="true">
    {/* Blue/Green medical asterisk star logo */}
    <g transform="translate(18, 25)">
      <path d="M-10,0 L10,0 M0,-10 L0,10" stroke="#0d9488" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M-7,-7 L7,7 M-7,7 L7,-7" stroke="#0f766e" strokeWidth="3.5" strokeLinecap="round" />
    </g>
    <text x="44" y="27" fontSize="20" fontFamily="sans-serif" fontWeight="bold" fill="#0f766e">Aster</text>
    <text x="44" y="38" fontSize="8" fontFamily="sans-serif" fill="#0d9488" letterSpacing="0.5">HEALTHCARE</text>
  </svg>
);

const LogoHolidayInn = () => (
  <svg viewBox="0 0 120 45" className="w-28 h-11 mx-auto" aria-hidden="true">
    <rect x="5" y="4" width="26" height="26" rx="5" fill="#15803d" />
    <text x="18" y="24" textAnchor="middle" fontSize="19" fontFamily="serif" fontWeight="bold" fontStyle="italic" fill="#ffffff">H</text>
    <text x="40" y="21" fontSize="13.5" fontFamily="serif" fontWeight="bold" fill="#0f172a">Holiday Inn</text>
    <text x="40" y="32" fontSize="6.5" fontFamily="sans-serif" fill="#64748b" letterSpacing="1">AN IHG HOTEL</text>
  </svg>
);

const LogoRedBus = () => (
  <svg viewBox="0 0 120 40" className="w-28 h-10 mx-auto" aria-hidden="true">
    <rect x="5" y="5" width="28" height="18" rx="4" fill="#dc2626" />
    <circle cx="12" cy="23" r="2" fill="#ffffff" />
    <circle cx="26" cy="23" r="2" fill="#ffffff" />
    <path d="M10,11 L28,11 L26,19 L12,19 Z" fill="#ffffff" />
    <text x="40" y="20" fontSize="15" fontFamily="sans-serif" fontWeight="bold" fill="#dc2626">red</text>
    <text x="63" y="20" fontSize="15" fontFamily="sans-serif" fontWeight="bold" fill="#0f172a">Bus</text>
  </svg>
);

const LogoLemonTree = () => (
  <svg viewBox="0 0 120 45" className="w-28 h-11 mx-auto" aria-hidden="true">
    <g transform="translate(16, 20)">
      <path d="M0,8 L0,-10" stroke="#65a30d" strokeWidth="2.5" />
      <circle cx="0" cy="-8" r="8" fill="#a3e635" opacity="0.8" />
      <circle cx="-4" cy="-5" r="6" fill="#84cc16" opacity="0.9" />
      <circle cx="4" cy="-5" r="6" fill="#65a30d" />
    </g>
    <text x="34" y="20" fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#65a30d" letterSpacing="0.3">lemon tree</text>
    <text x="34" y="29" fontSize="6" fontFamily="sans-serif" fill="#4d7c0f" letterSpacing="1.5">HOTELS</text>
  </svg>
);

const LogoMarriott = () => (
  <svg viewBox="0 0 120 45" className="w-28 h-11 mx-auto" aria-hidden="true">
    <rect x="5" y="4" width="26" height="26" fill="#991b1b" />
    <path d="M9,20 L9,8 L12,8 L15,14 L18,8 L21,8 L21,20 L18,20 L18,12 L15,18 L12,12 L12,20 Z" fill="#ffffff" />
    <text x="38" y="19" fontSize="13.5" fontFamily="serif" fontWeight="bold" fill="#0f172a">Marriott</text>
    <text x="38" y="29" fontSize="6" fontFamily="sans-serif" fill="#64748b" letterSpacing="0.8">HOTELS & RESORTS</text>
  </svg>
);

interface Partner {
  id: string;
  name: string;
  category: "hospitality" | "travel" | "healthcare" | "civic";
  categoryName: string;
  tagline: string;
  badge: string;
  description: string;
  logo: React.ComponentType;
  accentColor: string;
  features?: string[];
}

const partnersList: Partner[] = [
  {
    id: "marriott",
    name: "Marriott Hotels & Resorts",
    category: "hospitality",
    categoryName: "Hospitality & Stays",
    tagline: "World-class luxury and comfort across global destinations.",
    badge: "Premium Hotel Partner",
    description: "Negotiated government, defence, and corporate MoU tariffs across premium Marriott properties nationwide. Enjoy flexible room configurations and premium executive lounge access.",
    logo: LogoMarriott,
    accentColor: "border-l-[#991b1b]",
    features: ["Negotiated rates", "Executive lounges", "Pan-India presence"]
  },
  {
    id: "leela",
    name: "The Leela Palaces & Resorts",
    category: "hospitality",
    categoryName: "Hospitality & Stays",
    tagline: "Iconic luxury hospitality celebrating Indian heritage.",
    badge: "Ultra-Luxury Hospitality Partner",
    description: "Preferred partner rate agreements for government dignitaries, official delegations, and luxury business travellers. Experience exceptional security, comfort, and service.",
    logo: LogoLeela,
    accentColor: "border-l-[#d97706]",
    features: ["VVIP security compliance", "5-star luxury", "Official delegation rates"]
  },
  {
    id: "holiday-inn",
    name: "Holiday Inn",
    category: "hospitality",
    categoryName: "Hospitality & Stays",
    tagline: "Dependable, modern rooms for corporate and transit stays.",
    badge: "Business Stays Partner",
    description: "Strategic partnerships covering business transits, corporate travel programs, and domestic airline layovers. Provides seamless high-speed connectivity and modern meeting amenities.",
    logo: LogoHolidayInn,
    accentColor: "border-l-[#15803d]",
    features: ["Business facilities", "Airport transit locations", "Reliable standards"]
  },
  {
    id: "lemontree",
    name: "Lemon Tree Hotels",
    category: "hospitality",
    categoryName: "Hospitality & Stays",
    tagline: "Spirited, business-focused midscale accommodations.",
    badge: "Midscale Corporate Partner",
    description: "Ensures accessible, high-value corporate stays near major commercial business districts, IT corridors, and airports. Provides cheerful service and policy-compliant tariffs.",
    logo: LogoLemonTree,
    accentColor: "border-l-[#65a30d]",
    features: ["Central business locations", "Value pricing", "Warm hospitality"]
  },
  {
    id: "oyo",
    name: "OYO Hotels & Homes",
    category: "hospitality",
    categoryName: "Hospitality & Stays",
    tagline: "Widespread, budget-friendly hotels for transiting personnel.",
    badge: "Budget Stay Network Partner",
    description: "Enables highly distributed, cost-effective stay options for fieldwork teams, security patrols, and last-mile transiting personnel in tier-2 and tier-3 cities across India.",
    logo: LogoOyo,
    accentColor: "border-l-[#dc2626]",
    features: ["Tier 2 & 3 coverage", "Flexible check-in", "Highly cost-effective"]
  },
  {
    id: "redbus",
    name: "redBus Mobility Network",
    category: "travel",
    categoryName: "Travel & Transport",
    tagline: "India's leading intercity coach and transport network.",
    badge: "Intercity Bus Partner",
    description: "Integrated reservation engine covering official group movement, intercity duty deployments, and leisure excursions with pre-screened coach operators across thousands of routes.",
    logo: LogoRedBus,
    accentColor: "border-l-[#dc2626]",
    features: ["Multi-operator access", "Group travel packages", "GPS-tracked coaches"]
  },
  {
    id: "aster",
    name: "Aster DM Healthcare",
    category: "healthcare",
    categoryName: "Healthcare & Welfare",
    tagline: "Professional clinical care and emergency transit support.",
    badge: "Clinical Care Partner",
    description: "Emergency support network for travellers, pre-travel health checkups, medical tourism assistance, and round-the-clock priority clinical support for cardholders.",
    logo: LogoAster,
    accentColor: "border-l-[#0d9488]",
    features: ["Emergency hotline", "Priority medical transits", "Health check diagnostics"]
  },
  {
    id: "gramin",
    name: "Gramin Seva Kendra",
    category: "civic",
    categoryName: "Civic & Community Services",
    tagline: "Localized community service and travel support.",
    badge: "Civic Service Partner",
    description: "Providing localized citizen travel registration, documentation assistance, and rural community coordination desks to support regional deployments and entitlement travel.",
    logo: LogoGramin,
    accentColor: "border-l-[#f97316]",
    features: ["Rural service desks", "Entitlement assistance", "Local coordinators"]
  }
];

export default function ChannelPartnersPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiPartners, setApiPartners] = useState<ChannelPartner[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await cmsService.getChannelPartners();
        console.log("Channel Partners API Response:", res);
        setApiPartners(res.filter((partner) => partner.is_active !== false));
      } catch (err) {
        console.warn("Failed to fetch channel partners", err);
      }
    };
    fetchPartners();
  }, []);

  const categories = [
    { id: "all", label: "All Partners", icon: HeartHandshake },
    { id: "hospitality", label: "Hospitality & Stays", icon: Building2 },
    { id: "travel", label: "Travel & Mobility", icon: Bus },
    { id: "healthcare", label: "Healthcare & Support", icon: Stethoscope },
    { id: "civic", label: "Civic & Community", icon: Landmark }
  ];

  // Map API partners to UI partner structure
  const mappedApiPartners = apiPartners.map(ap => {
    const slug = (ap.slug || "").toLowerCase();
    const title = (ap.title || "").toLowerCase();
    let category: "hospitality" | "travel" | "healthcare" | "civic" = "travel";
    let categoryName = "Travel & Mobility";
    let accentColor = "border-l-[#087fbe]";
    
    if (slug.includes("hotel") || slug.includes("stay") || slug.includes("leela") || title.includes("hotel") || title.includes("resort") || title.includes("stay") || title.includes("palace")) {
      category = "hospitality";
      categoryName = "Hospitality & Stays";
      accentColor = "border-l-[#d97706]";
    } else if (slug.includes("health") || slug.includes("clinic") || slug.includes("medical") || title.includes("health") || title.includes("care") || title.includes("hospital")) {
      category = "healthcare";
      categoryName = "Healthcare & Welfare";
      accentColor = "border-l-[#0d9488]";
    } else if (slug.includes("gramin") || slug.includes("civic") || slug.includes("seva") || title.includes("seva") || title.includes("civic")) {
      category = "civic";
      categoryName = "Civic & Community Services";
      accentColor = "border-l-[#f97316]";
    }

    // Render API image with a resilient branded fallback.
    const LogoComponent = () => {
      return <PartnerLogo image={ap.image} name={ap.title} />;
    };

    return {
      id: ap.slug || String(ap.id),
      name: ap.title,
      category,
      categoryName,
      tagline: ap.subtitle || "Trusted hospitality and travel provider.",
      badge: ap.subtitle || "Verified Partner",
      description: ap.description || "",
      logo: LogoComponent,
      accentColor,
      websiteUrl: ap.website_url
    };
  });

  const allPartners = mappedApiPartners;

  const filteredPartners = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return allPartners.filter((partner) => {
      const matchesCategory = selectedCategory === "all" || partner.category === selectedCategory;
      const matchesSearch = !normalizedQuery || `${partner.name} ${partner.categoryName} ${partner.tagline} ${partner.description}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [allPartners, searchQuery, selectedCategory]);

  return (
    <div className="bg-[#f5f9fc] text-[#122b42] min-h-screen">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-[#062b50] px-5 py-9 text-white sm:py-11 lg:px-8 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(215,181,109,.18),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]">Trusted Network</p>
          <h1 className="mt-2 max-w-4xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
            Our Channel Partners
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
            Collaborating with India&apos;s leading hotel chains, transportation networks, medical providers, and civic services to deliver hospitality and travel support without boundaries.
          </p>
        </div>
      </section>

      {/* Main Content & Interactive Filter Section */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:py-12 lg:px-8 lg:py-14">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <label className="relative block w-full max-w-xl">
            <span className="sr-only">Search channel partners</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#087fbe]" />
            <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search channel partners..." className="h-12 w-full rounded-2xl border border-[#087fbe]/15 bg-white pl-11 pr-11 text-sm font-semibold outline-none shadow-sm transition focus:border-[#13a5d8] focus:ring-4 focus:ring-[#13a5d8]/10" />
            {searchQuery && <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear partner search" className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-100"><X className="size-4" /></button>}
          </label>
          <p className="text-xs font-bold text-slate-400">{filteredPartners.length} partner{filteredPartners.length === 1 ? "" : "s"}</p>
        </div>
        {/* Category Tabs */}
        <div className="mb-8 flex flex-wrap gap-1.5 border-b border-black/10 pb-4">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition duration-300 ${
                  isActive
                    ? "bg-[#062b50] text-white border-[#062b50] shadow-md"
                    : "bg-white text-[#344a5c] border-black/8 hover:border-[#13a5d8]/75 hover:bg-slate-50"
                }`}
              >
                <Icon className="size-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Partners Grid */}
        <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {filteredPartners.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-[#087fbe]/25 bg-white px-6 py-14 text-center"><Search className="mx-auto size-7 text-[#087fbe]" /><h2 className="mt-3 font-serif text-2xl">No matching partners</h2><p className="mt-2 text-sm text-slate-500">Try another partner name, category, or keyword.</p></div>}
          {filteredPartners.map(partner => {
            const Logo = partner.logo;
            return (
              <div
                key={partner.id}
                className={`group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white p-4 border-l-[3px] ${partner.accentColor} transition duration-500 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div>
                  {/* Logo Container */}
                  <div className="mb-4 flex h-20 items-center justify-center rounded-xl border border-black/[0.04] bg-[#f8fafc] p-8 ">
                    <Logo />
                  </div>


                  {/* Title & Tagline */}
                  <h3 className="mb-1 font-serif text-lg font-semibold leading-tight text-[#062b50] transition-colors group-hover:text-[#087fbe]">
                    {partner.name}
                  </h3>
                  <p className="mb-2 line-clamp-2 text-[11px] font-semibold leading-4 text-[#13a5d8]">
                    {partner.tagline}
                  </p>


                </div>

                {/* Key Features & CTA */}
                {/* <div className="border-t border-black/5 pt-3">
                  <Link
                    href="/contact-us"
                    className="inline-flex w-full items-center justify-between rounded-lg bg-[#f8fafc] px-3 py-2.5 text-[11px] font-bold text-[#087fbe] transition group-hover:bg-[#087fbe] group-hover:text-white"
                  >
                    <span>Request Booking / Rates</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div> */}
              </div>
            );
          })}
        </div>
      </section>

      {/* Become a Partner Call to Action */}
      <section className="bg-white border-t border-black/10 py-20 px-5 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <HeartHandshake className="size-10 text-[#087fbe] mx-auto mb-6" />
          <h2 className="font-serif text-4xl font-semibold text-[#062b50]">
            Expand Your Reach with BHLI
          </h2>
          <p className="mt-4 max-w-xl mx-auto leading-8 text-black/55">
            Are you a hotel operator, transport provider, or clinical network looking to serve government, defence, and corporate travel clients? Let&apos;s build a partnership.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 rounded-full bg-[#062b50] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#062b50]/20 hover:-translate-y-0.5 hover:brightness-110"
            >
              Partner with us <ArrowRight className="size-4" />
            </Link>
            <a
              href="tel:+919916356691"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-7 py-3.5 font-bold text-[#344a5c] hover:bg-slate-50"
            >
              <Phone className="size-4" /> Call Partnership Desk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
