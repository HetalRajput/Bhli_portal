"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Crown, Flag, Flame, Gift, Heart, Map, Sparkles, Image as ImageIcon, Music, PartyPopper, Palette, Flower2, CircleDot, X, Maximize2 } from "lucide-react";
import UnifiedBookingForm from "@/components/UnifiedBookingForm";

type ServiceData = {
  id: string;
  name: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  bannerImage: string;
  features: string[];
  cards: {
    title: string;
    desc: string;
    icon: any;
    color: string;
    image: string;
    badge?: string;
  }[];
  gallery: { title: string; image: string }[];
};

const servicesData: Record<string, ServiceData> = {
  "Corporate Events": {
    id: "corporate-events",
    name: "Corporate Events",
    eyebrow: "Thematic Celebrations",
    title: "Elevated Brand Image & Professionalism",
    subtitle: "Corporate Events play a crucial role in team building, client engagement, and brand promotion. We create theme-based decorations and cost-effective setups.",
    bannerImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    features: ["Theme-based decorations", "Interactive & Cost-Effective", "Company Color Branding"],
    cards: [
      {
        title: "Dasara Celebration",
        desc: "We'll create an atmosphere that captures the essence of Dasara with traditional lights & florals.",
        icon: Crown,
        color: "bg-[#e7ad38]",
        image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
        badge: "Festival Special",
      },
      {
        title: "Karnataka Rajyotsava",
        desc: "Let us help you honor Karnataka's spirit with yellow & red themed ambient floral decor.",
        icon: Map,
        color: "bg-[#d94f4f]",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80",
        badge: "State Heritage",
      },
      {
        title: "Deepavali Celebration",
        desc: "Vibrant colors, intricate rangoli designs, diya displays and warm ambient lighting.",
        icon: Flame,
        color: "bg-[#f0ba4f]",
        image: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?auto=format&fit=crop&w=800&q=80",
        badge: "Most Popular",
      },
      {
        title: "Independence Day",
        desc: "Transform your office with tricolor balloons, stage setups, and national pride theme.",
        icon: Flag,
        color: "bg-[#38b98b]",
        image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80",
        badge: "National Event",
      },
      {
        title: "Christmas Decoration",
        desc: "Spread the joy with illuminated Christmas trees, wreath arches, and winter wonderland decor.",
        icon: Gift,
        color: "bg-[#13a5d8]",
        image: "https://images.unsplash.com/photo-1543589077-47d511666522?auto=format&fit=crop&w=800&q=80",
        badge: "Winter Decor",
      },
      {
        title: "Women's Day",
        desc: "An inspiring purple & pastel themed setup that empowers and celebrates womanhood.",
        icon: Heart,
        color: "bg-[#8b7bd8]",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        badge: "Empowerment Theme",
      },
    ],
    gallery: [
      { title: "Corporate Gala Night Stage", image: "/Asset/events/event-01.jpg" },
      { title: "Annual Award Night", image: "/Asset/events/event-02.jpg" },
      { title: "Office Festive Decoration", image: "/Asset/events/event-03.jpg" },
      { title: "Theme Entrance Setup", image: "/Asset/events/event-04.jpg" },
    ],
  },

  "Balloon Decoration": {
    id: "balloon-decoration",
    name: "Balloon Decoration",
    eyebrow: "Creative Balloon Artistry",
    title: "Vibrant & Customized Balloon Styling",
    subtitle: "We incorporate company colors and logos into balloon displays to subtly promote your brand and create a fun, high-energy environment.",
    bannerImage: "/Asset/event_management/Balloon-decor-1.png",
    features: ["Custom Company Colors", "Organic Balloon Arches", "Photo Booth Backdrops"],
    cards: [
      {
        title: "Organic Entrance Arch",
        desc: "Stunning entrance arches blended with your brand colors to welcome guests.",
        icon: CircleDot,
        color: "bg-[#38b98b]",
        image: "/Asset/event_management/Balloon-decor-1.png",
        badge: "Best Seller",
      },
      {
        title: "Branded Balloon Columns",
        desc: "Sleek balloon pillars with company logos for corporate launch events.",
        icon: Sparkles,
        color: "bg-[#13a5d8]",
        image: "/Asset/event_management/Balloon-decor-4.png",
        badge: "Brand Highlight",
      },
      {
        title: "Photo Booth Backdrop",
        desc: "Interactive balloon wall backdrops perfect for social media check-ins.",
        icon: ImageIcon,
        color: "bg-[#8b7bd8]",
        image: "/Asset/event_management/balloon-decor5.png",
        badge: "Social Media Ready",
      },
      {
        title: "Ceiling & Pathway Floating Decor",
        desc: "Helium balloon clusters and floating pathways throughout the venue.",
        icon: PartyPopper,
        color: "bg-[#f0ba4f]",
        image: "/Asset/event_management/Balloon-decor7.png",
        badge: "Ambient Decor",
      },
    ],
    gallery: [
      { title: "Grand Entrance Arch", image: "/Asset/event_management/balloon-decor8.png" },
      { title: "Celebration Backdrop", image: "/Asset/event_management/balloon-decor9.png" },
      { title: "Helium Ceiling Display", image: "/Asset/event_management/balloon-decor11.png" },
      { title: "Branded Balloon Pillars", image: "/Asset/event_management/balloon-decor-12.png" },
    ],
  },

  "Flower Decoration": {
    id: "flower-decoration",
    name: "Flower Decoration",
    eyebrow: "Fresh Floral Elegance",
    title: "Premium Floral Styling & Stage Decor",
    subtitle: "From traditional marigold garlands to contemporary orchid centerpieces, we design eco-friendly, fresh floral setups for corporate & formal events.",
    bannerImage: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80",
    features: ["Fresh Flower Guarantee", "Custom Theme Styling", "Eco-Friendly Arrangements"],
    cards: [
      {
        title: "Traditional Floral Mandap & Stage",
        desc: "Rich marigold and jasmine decorations for traditional corporate pujas & festivals.",
        icon: Flower2,
        color: "bg-[#e7ad38]",
        image: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800",
        badge: "Traditional Classic",
      },
      {
        title: "Fresh Flower Entrance Arch",
        desc: "Fragrant floral welcome gates using roses, lilies, and lush greenery.",
        icon: Sparkles,
        color: "bg-[#38b98b]",
        image: "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=800",
        badge: "Grand Welcome",
      },
      {
        title: "Executive Table Floral Centerpieces",
        desc: "Sophisticated floral arrangements for VIP seating and conference dining tables.",
        icon: Heart,
        color: "bg-[#d94f4f]",
        image: "https://images.pexels.com/photos/931168/pexels-photo-931168.jpeg?auto=compress&cs=tinysrgb&w=800",
        badge: "Executive Premium",
      },
      {
        title: "Eco-Friendly Floral Installations",
        desc: "Sustainable floral decor using natural flowers, bamboo frames, and minimal plastic.",
        icon: Crown,
        color: "bg-[#13a5d8]",
        image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800",
        badge: "Sustainable Choice",
      },
    ],
    gallery: [
      { title: "Floral Stage Setup", image: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { title: "Rose Entrance Arch", image: "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { title: "Conference Table Centerpiece", image: "https://images.pexels.com/photos/931168/pexels-photo-931168.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { title: "Festive Flower Decoration", image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800" },
    ],
  },

  "Artist Management": {
    id: "artist-management",
    name: "Artist Management",
    eyebrow: "Live Entertainment",
    title: "Talented Artists, MCs & Live Performances",
    subtitle: "Elevate your corporate event with professional emcees, live music bands, DJs, folk performers, and celebrity artists tailored to your audience.",
    bannerImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    features: ["Professional Emcees & MCs", "Live Bands & DJs", "Cultural & Folk Dancers"],
    cards: [
      {
        title: "Corporate Emcees & Anchors",
        desc: "Charismatic hosts to engage your audience, manage event flow, and drive energy.",
        icon: Music,
        color: "bg-[#8b7bd8]",
        image: "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800",
        badge: "Professional Host",
      },
      {
        title: "Live Music Bands & Singers",
        desc: "Acoustic, rock, classical, or Bollywood fusion live bands for corporate gala dinners.",
        icon: PartyPopper,
        color: "bg-[#13a5d8]",
        image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800",
        badge: "Live Band",
      },
      {
        title: "DJ & High-Energy Concert Setup",
        desc: "Professional DJs with state-of-the-art sound systems and concert lighting.",
        icon: Sparkles,
        color: "bg-[#d94f4f]",
        image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
        badge: "High Energy",
      },
      {
        title: "Cultural & Folk Dance Troupes",
        desc: "Traditional Dollu Kunitha, Yakshagana, or fusion dance acts for cultural celebrations.",
        icon: Crown,
        color: "bg-[#f0ba4f]",
        image: "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800",
        badge: "Cultural Act",
      },
    ],
    gallery: [
      { title: "Live Concert Performance", image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { title: "Corporate Emcee Host", image: "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { title: "DJ Night Celebration", image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { title: "Cultural Performance", image: "https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=800" },
    ],
  },

  "Decor Yourself": {
    id: "decor-yourself",
    name: "Decor Yourself",
    eyebrow: "DIY Decor Kits & Rentals",
    title: "Self-Decor Kits & Prop Rental Packages",
    subtitle: "Prefer hands-on decorating? We provide curated DIY kits, theme props, backdrop frames, neon signs, and fairy lights delivered directly to your venue.",
    bannerImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    features: ["Curated Prop Kits", "Backdrop Frame Rentals", "Easy Assembly Guide"],
    cards: [
      {
        title: "Party Props & Photo Booth Kits",
        desc: "Custom corporate photo props, fun speech bubbles, and branded photo frames.",
        icon: Palette,
        color: "bg-[#f0ba4f]",
        image: "https://images.pexels.com/photos/34098/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
        badge: "Fun Props",
      },
      {
        title: "Fairy Lights & Neon Sign Kits",
        desc: "Warm LED curtain lights, glowing neon quote signs, and mood lighting rentals.",
        icon: Sparkles,
        color: "bg-[#13a5d8]",
        image: "https://images.pexels.com/photos/1543762/pexels-photo-1543762.jpeg?auto=compress&cs=tinysrgb&w=800",
        badge: "Ambient Lighting",
      },
      {
        title: "Standee & Backdrop Frame Rentals",
        desc: "Modular popup backdrop frames, standees, and easel boards easy to assemble.",
        icon: ImageIcon,
        color: "bg-[#38b98b]",
        image: "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=800",
        badge: "Easy Setup",
      },
      {
        title: "Eco-Friendly DIY Crafts",
        desc: "Paper lanterns, origami ornaments, and fabric drapes for quick office decorating.",
        icon: Heart,
        color: "bg-[#8b7bd8]",
        image: "https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=800",
        badge: "Craft Kit",
      },
    ],
    gallery: [
      { title: "Neon Sign & Backdrop Kit", image: "https://images.pexels.com/photos/1543762/pexels-photo-1543762.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { title: "DIY Photo Booth Set", image: "https://images.pexels.com/photos/34098/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800" },
      { title: "Fairy Lights Setup", image: "https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=800" },
      { title: "Modular Standee Display", image: "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=800" },
    ],
  },
};

const serviceKeys = [
  "Balloon Decoration",
  "Flower Decoration",
  "Corporate Events",
  "Artist Management",
  "Decor Yourself",
];

export default function EventManagementFlow() {
  const [activeServiceKey, setActiveServiceKey] = useState<string>("Balloon Decoration");
  const [previewImage, setPreviewImage] = useState<{ title: string; image: string } | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);

  const activeService = servicesData[activeServiceKey] || servicesData["Balloon Decoration"];

  return (
    <main className="min-h-screen bg-[#f4f8fb] text-[#122b42]">
      {/* Reduced Header Section */}
      <section className="relative overflow-hidden bg-[#061f3b] px-5 py-8 text-center text-white sm:py-10 lg:px-8">
        <div className="absolute -left-28 top-0 size-64 rounded-full bg-[#087fbe]/15 blur-3xl" />
        <div className="absolute -right-20 bottom-0 size-56 rounded-full bg-[#13a5d8]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[.05] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:40px_40px]" />
        
        <div className="relative mx-auto max-w-4xl">
          <p className="text-[10px] font-extrabold uppercase tracking-[.28em] text-[#13a5d8]">
            Professional Event Management
          </p>
          <h1 className="mx-auto mt-2 font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">
            Corporate Events & Decor
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-white/70 sm:text-sm">
            Elevated Brand Image & Professionalism. We specialize in theme-based decorations, interactive setups, balloon art, and live entertainment.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#13a5d8] px-6 py-2.5 text-xs font-bold text-[#062b50] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#13a5d8]/25"
            >
              Request Event Quote <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr] items-start">
          
          {/* Sidebar Menu */}
          <aside className="sticky top-24 self-start space-y-6">
            <div className="rounded-3xl border border-black/[.05] bg-white p-6 shadow-sm">
              <h3 className="font-serif text-xl font-semibold text-[#062b50]">Our Services</h3>
              <p className="mt-1 text-xs text-[#607789]">Select a service to view themes & gallery</p>
              <ul className="mt-4 space-y-2">
                {serviceKeys.map((key) => {
                  const isActive = key === activeServiceKey;
                  return (
                    <li key={key}>
                      <button
                        onClick={() => setActiveServiceKey(key)}
                        className={`group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                          isActive
                            ? "bg-[#062b50] text-white font-bold shadow-md shadow-[#062b50]/20"
                            : "text-[#607789] hover:bg-[#edf7fb] hover:text-[#087fbe]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`h-2 w-2 rounded-full ${isActive ? "bg-[#13a5d8]" : "bg-slate-300 group-hover:bg-[#087fbe]"}`} />
                          <span>{key}</span>
                        </div>
                        <ArrowRight className={`size-4 transition-transform ${isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="rounded-3xl bg-[#edf7fb] p-6 text-[#062b50]">
              <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-[#13a5d8] p-3 text-white">
                <Sparkles className="size-5" />
              </div>
              <h4 className="font-serif text-lg font-semibold">Custom Branding</h4>
              <p className="mt-2 text-xs leading-5 text-[#587083]">
                We incorporate company colors and logos into balloon displays to subtly promote your brand and create a cohesive visual identity for the event.
              </p>
            </div>
          </aside>

          {/* Main Content Area for Active Service */}
          <section className="space-y-10">
            {/* Active Service Banner & Features */}
            <div className="relative overflow-hidden rounded-3xl border border-black/[.05] bg-white shadow-sm">
              <div className="relative h-44 w-full overflow-hidden sm:h-56">
                <img
                  src={activeService.bannerImage}
                  alt={activeService.name}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061f3b] via-[#061f3b]/65 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="rounded-full bg-[#13a5d8] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#061f3b]">
                    {activeService.eyebrow}
                  </span>
                  <h2 className="mt-2 font-serif text-2xl font-bold md:text-3xl">{activeService.title}</h2>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-sm leading-6 text-[#607789]">{activeService.subtitle}</p>
                <div className="mt-5 flex flex-wrap gap-2.5 border-t border-slate-100 pt-5">
                  {activeService.features.map((feature) => (
                    <span key={feature} className="inline-flex items-center gap-1.5 rounded-full border border-black/[.08] bg-[#f8fafc] px-3.5 py-1.5 text-xs font-semibold text-[#456078]">
                      <CheckCircle2 className="size-3.5 text-[#13a5d8]" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Package / Theme Cards Grid */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-serif text-2xl font-semibold text-[#062b50]">
                  {activeService.name} Packages & Themes
                </h3>
                <span className="text-xs text-[#607789]">Click image to preview</span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {activeService.cards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <article key={card.title} className="group relative overflow-hidden rounded-[2rem] border border-black/[.05] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#062b50]/10">
                      <div
                        onClick={() => setPreviewImage({ title: card.title, image: card.image })}
                        className="relative h-48 cursor-pointer overflow-hidden"
                      >
                        <img
                          src={card.image}
                          alt={card.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#061f3b]/85 via-transparent to-transparent" />
                        
                        {card.badge && (
                          <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#062b50] backdrop-blur-md shadow-sm">
                            {card.badge}
                          </span>
                        )}

                        <div className={`absolute bottom-4 left-4 grid size-11 place-items-center rounded-2xl ${card.color} text-white shadow-md`}>
                          <Icon className="size-5" />
                        </div>

                        <div className="absolute bottom-4 right-4 grid size-9 place-items-center rounded-xl bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm">
                          <Maximize2 className="size-4" />
                        </div>
                      </div>

                      <div className="p-5">
                        <h4 className="font-serif text-xl font-semibold text-[#062b50]">{card.title}</h4>
                        <p className="mt-2 text-xs leading-5 text-[#607789]">{card.desc}</p>
                        <button
                          onClick={() => setIsFormModalOpen(true)}
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#087fbe] transition hover:gap-2"
                        >
                          Book this service <ArrowRight className="size-3.5" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Interactive Photo Gallery for Selected Service */}
            <div className="rounded-3xl border border-black/[.05] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.22em] text-[#087fbe]">Work Portfolio</p>
                  <h3 className="font-serif text-2xl font-semibold text-[#062b50]">{activeService.name} Gallery</h3>
                </div>
                <span className="w-fit rounded-full bg-[#edf7fb] px-3.5 py-1 text-xs font-bold text-[#087fbe]">
                  Click to Expand
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {activeService.gallery.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewImage(item)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-100 aspect-4/3 shadow-sm hover:shadow-md"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        <p className="text-[10px] text-white/70">{activeService.name}</p>
                      </div>
                      <Maximize2 className="size-4 shrink-0 text-white/80" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>

        </div>
      </div>

      {/* Fullscreen Image Preview Lightbox Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-4xl w-full overflow-hidden rounded-3xl bg-[#061f3b] text-white shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-black/50 text-white transition hover:bg-black/80"
            >
              <X className="size-5" />
            </button>
            <div className="relative max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={previewImage.image}
                alt={previewImage.title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
            <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
              <div>
                <p className="text-xs text-[#13a5d8] uppercase font-bold tracking-wider">{activeService.name}</p>
                <h4 className="font-serif text-2xl font-bold mt-1">{previewImage.title}</h4>
              </div>
              <button
                onClick={() => {
                  setPreviewImage(null);
                  setIsFormModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#13a5d8] px-6 py-3 text-xs font-bold text-[#062b50] transition hover:bg-[#108cb8]"
              >
                Book This Theme <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Booking Form Popup Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative my-8 max-w-4xl w-full rounded-3xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsFormModalOpen(false)}
              className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            >
              <X className="size-5" />
            </button>
            <div className="mb-6 text-center">
              <p className="text-xs font-bold uppercase tracking-[.24em] text-[#087fbe]">Service Enquiry</p>
              <h3 className="mt-1 font-serif text-2xl font-semibold text-[#061f3b] sm:text-3xl">
                Event Request & Quotation
              </h3>
              <p className="mt-1 text-xs font-medium text-[#607789]">
                Selected Category: <span className="font-bold text-[#087fbe]">{activeService.name}</span>
              </p>
            </div>
            <UnifiedBookingForm serviceSlug="event-management" />
          </div>
        </div>
      )}
    </main>
  );
}

