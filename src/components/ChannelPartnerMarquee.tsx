"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import PartnerLogo from "@/components/PartnerLogo";

type Partner = { id: string; name: string; role: string; logo: string | null };

export default function ChannelPartnerMarquee({ partners }: { partners: Partner[] }) {
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = viewport.current;
    if (!element || partners.length === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let previous = performance.now();
    const animate = (time: number) => {
      const elapsed = Math.min(time - previous, 50);
      element.scrollLeft += (40 * elapsed) / 1000;
      previous = time;
      const halfway = element.scrollWidth / 2;
      if (element.scrollLeft >= halfway) element.scrollLeft -= halfway;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [partners.length]);

  if (!partners.length) return null;
  const loop = [...partners, ...partners];

  return <div className="relative w-full py-3">
    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white via-white/80 to-transparent" />
    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white via-white/80 to-transparent" />
    <div ref={viewport} className="overflow-hidden" aria-label="Channel partners carousel">
      <div className="flex w-max gap-6 px-3">
        {loop.map((partner, index) => <Link aria-hidden={index >= partners.length} tabIndex={index >= partners.length ? -1 : 0} key={`${partner.id}-${index}`} href="/channel-partners" className="flex h-40 w-52 shrink-0 flex-col items-center justify-between rounded-2xl border border-black/[0.04] bg-[#f8fafc] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#13a5d8]/40 hover:bg-white hover:shadow-lg">
          <div className="flex w-full flex-1 items-center justify-center"><PartnerLogo image={partner.logo} name={partner.name} compact /></div>
          <div className="mt-2 w-full border-t border-black/5 pt-2 text-center"><h4 className="truncate text-xs font-bold text-[#062b50]">{partner.name}</h4><p className="mt-0.5 truncate text-[10px] font-medium text-black/50">{partner.role}</p></div>
        </Link>)}
      </div>
    </div>
  </div>;
}
