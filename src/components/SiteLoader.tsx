"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BusFront, CarTaxiFront, Hotel, Plane, TrainFront } from "lucide-react";

const bookingServices = [
  { label: "Hotel", Icon: Hotel },
  { label: "Flight", Icon: Plane },
  { label: "Train", Icon: TrainFront },
  { label: "Bus", Icon: BusFront },
  { label: "Taxi", Icon: CarTaxiFront },
] as const;

/** Cycles through the core booking services while a page is loading. */
export function BookingLoaderMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative grid place-items-center ${compact ? "size-12" : "size-20"}`} aria-hidden="true">
      <motion.span
        className="absolute inset-0 rounded-full border border-[#087fbe]/20 bg-white/90 shadow-[0_16px_45px_rgba(8,127,190,.18)]"
        animate={{ scale: [0.94, 1.05, 0.94], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="absolute inset-1 rounded-full bg-gradient-to-br from-sky-50 to-cyan-100/70" />
      {bookingServices.map(({ label, Icon }, index) => (
        <span
          key={label}
          className="booking-service-loader-icon absolute inset-0 grid place-items-center text-[#087fbe]"
          style={{ animationDelay: `${index * 0.5}s` }}
        >
          <Icon className={compact ? "size-5" : "size-9"} strokeWidth={1.8} />
        </span>
      ))}
    </div>
  );
}

export default function SiteLoader() {
  const [activeRequests, setActiveRequests] = useState(0);

  useEffect(() => {
    const startRequest = () => setActiveRequests((count) => count + 1);
    const finishRequest = () => setActiveRequests((count) => Math.max(0, count - 1));
    window.addEventListener("bhli:network-start", startRequest);
    window.addEventListener("bhli:network-end", finishRequest);

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args) => { startRequest(); try { return await originalFetch(...args); } finally { finishRequest(); } };

    return () => {
      window.removeEventListener("bhli:network-start", startRequest);
      window.removeEventListener("bhli:network-end", finishRequest);
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <AnimatePresence>
      {activeRequests > 0 && <motion.div className="pointer-events-none fixed inset-x-0 top-0 z-[200]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status" aria-label="Loading content"><motion.div className="h-1 bg-gradient-to-r from-[#087fbe] via-[#45c7ed] to-[#087fbe]" animate={{ backgroundPositionX: ["0%", "200%"] }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }} style={{ backgroundSize: "200% 100%" }} /></motion.div>}
    </AnimatePresence>
  );
}
