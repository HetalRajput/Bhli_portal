"use client";

import { useEffect, useRef, useState } from "react";

const impactStats = [
  { target: 7500, decimals: 0, suffix: "+", label: "Hotels" },
  { target: 250, decimals: 0, suffix: "+", label: "Destinations" },
  { target: 5, decimals: 0, suffix: " Lac+", label: "Holiday Nights" },
  { target: 25000, decimals: 0, suffix: "+", label: "Happy Families" },
  { target: 4.9, decimals: 1, suffix: "", label: "Star Rating" },
  { target: 20, decimals: 0, suffix: "+", label: "Defence Organisations" },
] as const;

function formatValue(value: number, decimals: number, suffix: string) {
  return `${value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;
}

export default function TravelImpactSlider({ className = "" }: { className?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const animationFrame = useRef<number | null>(null);
  const hasAnimated = useRef(false);
  const [values, setValues] = useState<number[]>(() => impactStats.map(() => 0));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasAnimated.current) return;
      hasAnimated.current = true;
      observer.disconnect();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setValues(impactStats.map((stat) => stat.target));
        return;
      }

      const duration = 1700;
      const startedAt = performance.now();
      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setValues(impactStats.map((stat) => {
          const current = stat.target * eased;
          return stat.decimals ? Number(current.toFixed(stat.decimals)) : Math.round(current);
        }));
        if (progress < 1) animationFrame.current = requestAnimationFrame(animate);
      };
      animationFrame.current = requestAnimationFrame(animate);
    }, { threshold: 0.25 });

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className={`bg-[#10284a] text-white ${className}`} aria-label="BHLI travel network highlights">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 py-7 sm:grid-cols-3 lg:grid-cols-6 lg:px-8">
        {impactStats.map((stat, index) => {
          const finalValue = formatValue(stat.target, stat.decimals, stat.suffix);
          return (
            <div key={stat.label} className={`flex min-h-20 flex-col items-center justify-center px-3 py-2 text-center ${index % 2 !== 0 ? "border-l border-white/20" : ""} ${index >= 2 ? "border-t border-white/15 sm:border-t-0" : ""} sm:border-l sm:first:border-l-0 lg:min-h-16`}>
              <p className="min-w-[6ch] text-2xl font-extrabold tabular-nums text-[#f3c94f] sm:text-3xl" aria-label={finalValue}>
                <span aria-hidden="true">{formatValue(values[index], stat.decimals, stat.suffix)}</span>
              </p>
              <p className="mt-1 text-[10px] font-medium uppercase text-white/65 sm:text-[11px]">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
