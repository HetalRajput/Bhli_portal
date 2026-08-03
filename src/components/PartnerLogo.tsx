"use client";

import { Handshake } from "lucide-react";
import { useState } from "react";

export default function PartnerLogo({ image, name, compact = false }: { image?: string | null; name: string; compact?: boolean }) {
  const [failed, setFailed] = useState(false);
  const hasImage = Boolean(image?.trim()) && !failed;

  if (hasImage) {
    return <img src={image!} alt={`${name} logo`} onError={() => setFailed(true)} className={`${compact ? "max-h-16" : "max-h-20"} max-w-full object-contain`} />;
  }

  return <div aria-label={`${name} partner`} className="flex min-h-20 w-full flex-col items-center justify-center gap-2 text-center">
    <span className={`${compact ? "size-12" : "size-14"} grid shrink-0 place-items-center rounded-2xl border border-sky-100 bg-gradient-to-br from-[#e5f5fc] to-[#d9edf8] text-[#087dbd] shadow-sm`}><Handshake className={compact ? "size-6" : "size-7"} /></span>
    <span className="max-w-36 truncate text-[9px] font-extrabold uppercase tracking-[.14em] text-[#567286]">Partner logo</span>
  </div>;
}
