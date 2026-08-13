import HeroBackground from "@/components/HeroBackground"; import BookingSearch from "@/components/HomeBookingSearchWithImpact"; import UpcomingEventCard from "@/components/UpcomingEventCard"; import EventGalleryCarousel from "@/components/EventGalleryCarousel"; import Link from "next/link"; import { ArrowRight, Building2, Bus, CalendarDays, Car, CheckCircle2, Coins, Compass, Map, Plane, ShieldCheck, Ship, Sparkles, Star, Ticket, Train, UtensilsCrossed } from "lucide-react";
import { cmsService } from "@/lib/api/cms";
import type { Banner, ChannelPartner } from "@/lib/api/cms";
import HomeFaqSection, { type HomeFaq } from "@/components/HomeFaqSection";
import ChannelPartnerMarquee from "@/components/ChannelPartnerMarquee";
import ExternalServicesShowcase from "@/components/ExternalServicesShowcase";
import { portalService, type VendorLink } from "@/lib/api/portal";

export const dynamic = "force-dynamic";
const cardImages = ["https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=900", "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=900", "https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=900", "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=900"];
const cards = [["Hotel reservations", "Handpicked stays aligned to comfort, policy and entitlement.", Building2, "/services/hotel-reservations"], ["Air & rail", "Domestic and international journeys, coordinated end to end.", Plane, "/services/flight-booking"], ["Defence travel", "A dedicated desk for LTC, documentation and reservation support.", ShieldCheck, "/defence-help-desk"], ["Holidays", "Thoughtfully built escapes for families, groups and individuals.", Sparkles, "/services/holiday-packages"]];

type HomeService = {
  id: number | string;
  name?: string;
  title?: string;
  short_description?: string;
  description?: string;
  slug: string;
  service_type?: string;
  banner_image?: string;
  image?: string;
};

// Custom SVG brand logo components for the home page ticker
const LogoGramin = () => (
  <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto" aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
    <path d="M18,50 A32,32 0 0,1 82,50" fill="none" stroke="#ea580c" strokeWidth="5" strokeLinecap="round" />
    <path d="M18,50 A32,32 0 0,0 82,50" fill="none" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
    <circle cx="50" cy="50" r="14" fill="none" stroke="#0284c7" strokeWidth="2" />
    <circle cx="45" cy="47" r="2.5" fill="#1e3a8a" />
    <path d="M40,57 C40,52 50,52 50,57" fill="#1e3a8a" />
    <circle cx="55" cy="47" r="2.5" fill="#1e3a8a" />
    <path d="M50,57 C50,52 60,52 60,57" fill="#1e3a8a" />
  </svg>
);

const LogoLeela = () => (
  <svg viewBox="0 0 120 70" className="w-24 h-14 mx-auto" aria-hidden="true">
    <path d="M60,5 C61.5,13 58.5,13 60,22 C61.5,13 58.5,13 60,5 Z" fill="#d97706" />
    <path d="M60,22 C52,20 52,24 44,22 C52,24 52,20 60,22 Z" fill="#d97706" />
    <path d="M60,22 C68,20 68,24 76,22 C68,24 68,20 60,22 Z" fill="#d97706" />
    <path d="M60,22 C54.5,15 58,15 52,9 C58,15 54.5,15 60,22 Z" fill="#d97706" />
    <path d="M60,22 C65.5,15 62,15 68,9 C62,15 65.5,15 60,22 Z" fill="#d97706" />
    <text x="60" y="44" textAnchor="middle" fontSize="10" fontFamily="serif" fontWeight="bold" fill="#0f172a" letterSpacing="1.2">THE LEELA</text>
    <text x="60" y="53" textAnchor="middle" fontSize="4.2" fontFamily="sans-serif" fill="#64748b" letterSpacing="0.6">PALACES HOTELS RESORTS</text>
  </svg>
);

const LogoOyo = () => (
  <svg viewBox="0 0 100 40" className="w-20 h-8 mx-auto" aria-hidden="true">
    <text x="50" y="29" textAnchor="middle" fontSize="26" fontFamily="sans-serif" fontWeight="900" fill="#dc2626" letterSpacing="-1">OYO</text>
  </svg>
);

const LogoAster = () => (
  <svg viewBox="0 0 120 50" className="w-24 h-10 mx-auto" aria-hidden="true">
    <g transform="translate(18, 25)">
      <path d="M-10,0 L10,0 M0,-10 L0,10" stroke="#0d9488" strokeWidth="5" strokeLinecap="round" />
      <path d="M-7,-7 L7,7 M-7,7 L7,-7" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
    </g>
    <text x="42" y="27" fontSize="18" fontFamily="sans-serif" fontWeight="bold" fill="#0f766e">Aster</text>
    <text x="42" y="38" fontSize="7.5" fontFamily="sans-serif" fill="#0d9488" letterSpacing="0.3">HEALTHCARE</text>
  </svg>
);

const LogoHolidayInn = () => (
  <svg viewBox="0 0 120 45" className="w-24 h-10 mx-auto" aria-hidden="true">
    <rect x="5" y="4" width="24" height="24" rx="4" fill="#15803d" />
    <text x="17" y="23" textAnchor="middle" fontSize="17" fontFamily="serif" fontWeight="bold" fontStyle="italic" fill="#ffffff">H</text>
    <text x="36" y="21" fontSize="12" fontFamily="serif" fontWeight="bold" fill="#0f172a">Holiday Inn</text>
    <text x="36" y="31" fontSize="6" fontFamily="sans-serif" fill="#64748b" letterSpacing="0.8">AN IHG HOTEL</text>
  </svg>
);

const LogoRedBus = () => (
  <svg viewBox="0 0 120 40" className="w-24 h-8 mx-auto" aria-hidden="true">
    <rect x="5" y="5" width="26" height="16" rx="3" fill="#dc2626" />
    <circle cx="11" cy="22" r="1.8" fill="#ffffff" />
    <circle cx="25" cy="22" r="1.8" fill="#ffffff" />
    <path d="M9,11 L27,11 L25,18 L11,18 Z" fill="#ffffff" />
    <text x="38" y="19" fontSize="14" fontFamily="sans-serif" fontWeight="bold" fill="#dc2626">red</text>
    <text x="60" y="19" fontSize="14" fontFamily="sans-serif" fontWeight="bold" fill="#0f172a">Bus</text>
  </svg>
);

const LogoLemonTree = () => (
  <svg viewBox="0 0 120 45" className="w-24 h-10 mx-auto" aria-hidden="true">
    <g transform="translate(16, 20)">
      <path d="M0,8 L0,-10" stroke="#65a30d" strokeWidth="2" />
      <circle cx="0" cy="-8" r="7" fill="#a3e635" opacity="0.8" />
      <circle cx="-3" cy="-5" r="5" fill="#84cc16" opacity="0.9" />
      <circle cx="3" cy="-5" r="5" fill="#65a30d" />
    </g>
    <text x="32" y="20" fontSize="10.5" fontFamily="sans-serif" fontWeight="bold" fill="#65a30d" letterSpacing="0.2">lemon tree</text>
    <text x="32" y="29" fontSize="5.5" fontFamily="sans-serif" fill="#4d7c0f" letterSpacing="1">HOTELS</text>
  </svg>
);

const LogoMarriott = () => (
  <svg viewBox="0 0 120 45" className="w-24 h-10 mx-auto" aria-hidden="true">
    <rect x="5" y="4" width="24" height="24" fill="#991b1b" />
    <path d="M9,19 L9,8 L12,8 L15,13.5 L18,8 L21,8 L21,19 L18,19 L18,11.5 L15,17 L12,11.5 L12,19 Z" fill="#ffffff" />
    <text x="36" y="19" fontSize="12.5" fontFamily="serif" fontWeight="bold" fill="#0f172a">Marriott</text>
    <text x="36" y="28" fontSize="5.5" fontFamily="sans-serif" fill="#64748b" letterSpacing="0.5">HOTELS & RESORTS</text>
  </svg>
);

const fallbackPartners = [
  { id: "marriott", name: "Marriott Hotels", role: "Luxury Lodging Partner", logo: LogoMarriott },
  { id: "leela", name: "The Leela", role: "Premium Stays Partner", logo: LogoLeela },
  { id: "holiday-inn", name: "Holiday Inn", role: "Business Stays Partner", logo: LogoHolidayInn },
  { id: "lemontree", name: "Lemon Tree Hotels", role: "Corporate Stays Partner", logo: LogoLemonTree },
  { id: "oyo", name: "OYO Hotels", role: "Budget Stays Partner", logo: LogoOyo },
  { id: "redbus", name: "redBus", role: "Intercity Bus Partner", logo: LogoRedBus },
  { id: "aster", name: "Aster Healthcare", role: "Medical Services Partner", logo: LogoAster },
  { id: "gramin", name: "Gramin Seva Kendra", role: "Civic Services Network", logo: LogoGramin }
];

export default async function Home() {
  let apiServices: HomeService[] = [];
  let apiPartners: ChannelPartner[] = [];
  let apiBanners: Banner[] = [];
  let apiFaqs: HomeFaq[] = [];
  let externalServices: VendorLink[] = [];

  try {
    const [servicesResult, partnersResult, bannersResult, faqsResult, vendorsResult] = await Promise.allSettled([
      cmsService.getServices({ is_featured: true }),
      cmsService.getChannelPartners(),
      cmsService.getBanners(),
      cmsService.getFaqs(),
      portalService.vendors()
    ]);

    if (servicesResult.status === "fulfilled") {
      const servicesRes = servicesResult.value;
      const serviceData = Array.isArray(servicesRes) ? servicesRes : servicesRes?.data;
      if (Array.isArray(serviceData)) {
        apiServices = [...serviceData as HomeService[]].sort((a, b) => Number(a.id) - Number(b.id));
      }
    }

    if (partnersResult.status === "fulfilled" && Array.isArray(partnersResult.value)) {
      apiPartners = partnersResult.value;
    }

    if (bannersResult.status === "fulfilled" && Array.isArray(bannersResult.value)) {
      apiBanners = bannersResult.value
        .filter((banner: Banner) => banner.is_active !== false && Boolean(banner.image))
        .sort((a: Banner, b: Banner) => (a.display_order ?? 0) - (b.display_order ?? 0));
    }

    if (faqsResult.status === "fulfilled") {
      const faqsRes = faqsResult.value;
      const faqData = Array.isArray(faqsRes) ? faqsRes : faqsRes?.data;
      if (Array.isArray(faqData)) apiFaqs = faqData;
    }

    if (vendorsResult.status === "fulfilled" && vendorsResult.value.success && Array.isArray(vendorsResult.value.data)) {
      externalServices = vendorsResult.value.data;
    }
  } catch (err) {
    console.warn("Failed to prepare home page data; displaying skeleton placeholders.", err);
  }

  const getIcon = (slug: string, serviceType?: string) => {
    const identity = `${slug || ""} ${serviceType || ""}`.toLowerCase();
    if (identity.includes("flight")) return Plane;
    if (identity.includes("train") || identity.includes("rail")) return Train;
    if (identity.includes("bus")) return Bus;
    if (identity.includes("taxi") || identity.includes("car") || identity.includes("transfer")) return Car;
    if (identity.includes("cruise")) return Ship;
    if (identity.includes("holiday") || identity.includes("package") || identity.includes("tour")) return Map;
    if (identity.includes("visa")) return Ticket;
    if (identity.includes("insurance")) return ShieldCheck;
    if (identity.includes("currency") || identity.includes("forex") || identity.includes("exchange")) return Coins;
    if (identity.includes("event")) return CalendarDays;
    if (identity.includes("catering") || identity.includes("food")) return UtensilsCrossed;
    if (identity.includes("consultancy") || identity.includes("consulting")) return Compass;
    return Building2;
  };

  const displayServices = apiServices.length > 0
    ? apiServices.slice(0, 4).map(s => ({
      title: s.name || s.title || "",
      description: s.short_description || s.description || "",
      Icon: getIcon(s.slug, s.service_type),
      link: `/services/${s.slug}`,
      image: s.banner_image || s.image || cardImages[0]
    }))
    : cards.map((_, index) => ({
      title: `Loading service ${index + 1}`,
      description: "Loading service information",
      Icon: Building2,
      link: "#",
      image: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
    }));


  const displayPartners = apiPartners.map(c => ({
      id: String(c.id),
      name: c.title,
      role: c.subtitle || "Trusted network partner",
      logo: c.image || null,
    }));

  return <div className="bg-[#f5f9fc] text-[#122b42]"><section className="relative isolate min-h-[760px] overflow-hidden bg-[#061f3b] text-white"><HeroBackground banners={apiBanners} /><div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8"><div className="max-w-3xl"><p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#7bd5f1]"><ShieldCheck className="size-4" />Trusted travel. Distinguished service.</p><h1 className="font-serif text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-7xl">Journeys planned with precision. <span className="text-[#4fc3ea]">Hospitality delivered with honour.</span></h1><p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">A one-stop travel management partner with access to 7,500+ hotels and service apartments, serving defence, government, corporate and leisure travellers.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/contact-us" className="inline-flex items-center gap-2 rounded-full bg-[#13a5d8] px-6 py-3.5 font-bold text-[#061f3b]">Plan your journey <ArrowRight className="size-4" /></Link><Link href="/services" className="rounded-full border border-white/25 px-6 py-3.5 font-semibold">Explore services</Link></div></div><div className="flex justify-center lg:justify-end"><UpcomingEventCard /></div></div></section><section className="relative z-10 mx-auto -mt-16 w-full max-w-7xl px-5 lg:px-8"><BookingSearch /></section><section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.22em] text-[#087fbe]">Everything in one place</p><div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end"><h2 className="max-w-2xl font-serif text-3xl font-semibold md:text-5xl">Travel solutions built around you</h2><Link href="/services" className="flex items-center gap-2 font-bold">View all services <ArrowRight className="size-4" /></Link></div><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{displayServices.map((service) => <Link href={String(service.link)} key={String(service.title)} aria-label={`Explore ${String(service.title)}`} className="travel-solution-card group relative overflow-hidden rounded-3xl border border-black/10 bg-white focus:outline-none focus:ring-4 focus:ring-[#13a5d8]/20"><div className="relative h-44 overflow-hidden"><img src={String(service.image)} alt={String(service.title)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#061f3b]/45 to-transparent" /><span className="absolute bottom-4 left-4 grid size-11 place-items-center rounded-xl bg-white/90 text-[#087fbe] shadow-lg backdrop-blur"><service.Icon className="size-6" /></span></div><div className="p-7"><div className="flex items-start justify-between"><h3 className="font-serif text-2xl font-semibold transition-colors group-hover:text-[#087fbe]">{String(service.title)}</h3><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e7f6fc] text-[#087fbe] transition group-hover:bg-[#087fbe] group-hover:text-white"><ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span></div><p className="mt-3 text-sm leading-7 text-black/55">{String(service.description)}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#087fbe] opacity-70 transition group-hover:opacity-100">View Details <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></div></Link>)}</div></section><ExternalServicesShowcase vendors={externalServices} /><section className="bg-[#07345d] text-white"><div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#13a5d8]">Defence help desk</p><h2 className="mt-4 font-serif text-3xl md:text-5xl">Hospitality that understands your service.</h2><p className="mt-6 max-w-xl leading-8 text-white/60">Specialised support for government and defence bookings, LTC travel, documentation, entitlements and reservation assistance.</p><ul className="mt-7 grid gap-3 text-sm">{["Dedicated reservation assistance", "Policy-aware travel planning", "Responsive support across India"].map(x => <li className="flex gap-2" key={x}><CheckCircle2 className="size-5 text-[#13a5d8]" />{x}</li>)}</ul><Link href="/defence-help-desk" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#13a5d8] px-6 py-3 font-bold text-[#061f3b]">Visit defence desk <ArrowRight className="size-4" /></Link></div><img src="https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Indian mountain destination" className="h-[440px] w-full rounded-[2rem] object-cover" /></div></section><EventGalleryCarousel /><section className="mx-auto max-w-7xl px-5 py-24 lg:px-8"><div className="text-center"><p className="text-xs font-bold uppercase tracking-[.22em] text-[#087fbe]">Why BHLI</p><h2 className="mt-3 font-serif text-3xl md:text-4xl">Confidence at every step</h2></div><div className="mt-12 grid gap-8 md:grid-cols-3">{[["01", "One accountable partner", "From the first enquiry to your return, one team coordinates the details."], ["02", "Curated, not crowded", "Relevant options selected for your purpose, policy and preferences."], ["03", "Support that stays", "Real people and dedicated desks when plans change or help is needed."]].map(x => <div key={x[0]} className="border-t border-black/15 pt-6"><span className="text-sm text-[#087fbe]">{x[0]}</span><h3 className="mt-5 font-serif text-2xl">{x[1]}</h3><p className="mt-3 text-sm leading-7 text-black/55">{x[2]}</p></div>)}</div></section>

    <section className="py-16 overflow-hidden bg-white border-t border-b border-black/[0.03]">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-[#087fbe]">Our Network</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-[#062b50] md:text-4xl">
          Our Channel Partners
        </h2>
        <p className="mt-3 text-sm text-black/55 max-w-xl mx-auto">
          Collaborating with India&apos;s leading hotel chains, mobility platforms, healthcare networks, and local civic centers to support your journeys.
        </p>
      </div>
      <ChannelPartnerMarquee partners={displayPartners} skeletonCount={fallbackPartners.length} />
    </section>

    <section className="bg-[#061f3b] text-white py-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 text-center">
        <Star className="mx-auto fill-[#13a5d8] text-[#13a5d8]" /><blockquote className="mx-auto mt-5 max-w-3xl font-serif text-2xl leading-relaxed md:text-3xl text-white">Hospitality Beyond Borders - thoughtful travel management, trusted support and memorable journeys.</blockquote><p className="mt-5 text-sm text-white/60">The BHLI service promise</p>
      </div>
    </section><HomeFaqSection faqs={apiFaqs} />
  </div>
}




