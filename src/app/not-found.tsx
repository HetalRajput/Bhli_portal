"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Compass,
  Headphones,
  Home,
  MapPin,
  Plane,
  Search,
} from "lucide-react";

const destinations = [
  { href: "/services", label: "Explore services", icon: Compass },
  { href: "/services/hotel-reservations", label: "Find a hotel", icon: Building2 },
  { href: "/contact-us", label: "Contact support", icon: Headphones },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative isolate flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-[#edf8fc] px-5 py-14 text-[#082a46] md:py-20">
      <div className="pointer-events-none absolute -left-32 -top-32 size-[28rem] rounded-full bg-[#13a5d8]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-28 size-[34rem] rounded-full bg-[#087fbe]/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(#087fbe_1px,transparent_1px)] [background-size:26px_26px]" />

      <section className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_.95fr]">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#087fbe]/15 bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#087fbe] shadow-sm backdrop-blur">
            <Compass className="size-4" /> Route unavailable
          </span>

          <p className="mt-7 font-serif text-[clamp(6.5rem,22vw,12rem)] font-bold leading-[0.72] tracking-[-0.07em] text-[#062b50]">
            4<span className="inline-block text-[#13a5d8]">0</span>4
          </p>

          <h1 className="mt-9 max-w-xl font-serif text-4xl font-semibold leading-tight md:text-6xl">
            This journey took an unexpected turn.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#557187]">
            The page may have moved, the link may be outdated, or this destination is not available yet. Let&apos;s get you back on the right route.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-[#087fbe] px-6 py-3.5 font-bold text-white shadow-lg shadow-sky-900/15 transition hover:-translate-y-0.5 hover:bg-[#066fa9]">
              <Home className="size-4" /> Back to home
            </Link>
            <button type="button" onClick={() => router.back()} className="inline-flex items-center gap-2 rounded-full border border-[#087fbe]/20 bg-white px-6 py-3.5 font-bold text-[#0874af] transition hover:-translate-y-0.5 hover:border-[#087fbe]/40 hover:bg-sky-50">
              <ArrowLeft className="size-4" /> Go back
            </button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="relative aspect-square overflow-hidden rounded-[3rem] border border-white/80 bg-gradient-to-br from-white/95 to-[#dff4fb]/90 p-7 shadow-[0_35px_90px_rgba(6,55,88,.18)] backdrop-blur md:p-10">
            <div className="absolute inset-7 rounded-[2.25rem] border border-dashed border-[#087fbe]/20" />

            <div className="absolute left-[12%] top-[18%] flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#087fbe] shadow-md">
              <MapPin className="size-3.5 fill-[#13a5d8]/20" /> Your route
            </div>
            <div className="absolute bottom-[17%] right-[10%] flex items-center gap-2 rounded-full bg-[#062b50] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-md">
              <Search className="size-3.5 text-[#13a5d8]" /> Page not found
            </div>

            <svg viewBox="0 0 440 440" className="absolute inset-0 size-full" aria-hidden="true">
              <path d="M72 115 C 155 40, 210 208, 300 125 S 398 180, 345 280 C 310 345, 208 250, 120 340" fill="none" stroke="#70c9e7" strokeWidth="3" strokeDasharray="9 11" strokeLinecap="round" />
              <circle cx="72" cy="115" r="8" fill="#13a5d8" />
              <circle cx="120" cy="340" r="8" fill="#062b50" />
              <circle cx="120" cy="340" r="15" fill="none" stroke="#062b50" strokeWidth="2" opacity=".25" />
            </svg>

            <div className="not-found-plane absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#13a5d8]/20 bg-white text-[#087fbe] shadow-[0_18px_45px_rgba(8,127,190,.22)]">
              <Plane className="size-10 -rotate-12" strokeWidth={1.6} />
            </div>

            <div className="absolute inset-x-10 bottom-9 rounded-2xl border border-[#087fbe]/10 bg-white/85 p-4 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#087fbe]">Navigation status</p>
                  <p className="mt-1 text-sm font-bold text-[#062b50]">Recalculating your journey...</p>
                </div>
                <span className="relative flex size-3">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#13a5d8] opacity-60" />
                  <span className="relative inline-flex size-3 rounded-full bg-[#087fbe]" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="absolute inset-x-5 bottom-5 hidden justify-center gap-3 xl:flex" aria-label="Helpful destinations">
        {destinations.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="group inline-flex items-center gap-2 rounded-full border border-[#087fbe]/10 bg-white/80 px-4 py-2.5 text-xs font-bold text-[#46667d] shadow-sm backdrop-blur transition hover:border-[#087fbe]/30 hover:text-[#087fbe]">
            <Icon className="size-4" /> {label}<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </section>
    </main>
  );
}
