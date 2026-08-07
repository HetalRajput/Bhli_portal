"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const MINIMUM_DISPLAY_TIME = 450;

/** A service-neutral reservation-card animation. */
export function BookingLoaderMark({ compact = false }: { compact?: boolean }) {
  const frame = compact ? "h-12 w-20" : "h-20 w-32";

  return (
    <div className={`relative ${frame}`} aria-hidden="true">
      <motion.span className="absolute inset-x-2 top-6 h-11 rounded-xl border border-[#087fbe]/15 bg-white/35" animate={{ y: [3, 7, 3], scale: [0.94, 0.98, 0.94] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.span className="absolute inset-x-1 top-3 h-12 rounded-xl border border-[#087fbe]/20 bg-white/55 shadow-sm" animate={{ y: [2, -1, 2], scale: [0.97, 1, 0.97] }} transition={{ duration: 1.8, delay: 0.1, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute inset-x-0 top-0 rounded-xl border border-[#087fbe]/20 bg-white/85 p-3 shadow-[0_8px_22px_rgba(8,127,190,.12)]" animate={{ y: [0, -4, 0] }} transition={{ duration: 1.8, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}>
        <div className="flex items-center gap-2">
          <span className="size-5 rounded-md bg-[#087fbe]/12" />
          <span className="h-1.5 w-12 rounded-full bg-[#087fbe]/22" />
        </div>
        <div className="mt-3 flex gap-1.5"><span className="h-1.5 flex-1 rounded-full bg-[#087fbe]/14" /><span className="h-1.5 w-6 rounded-full bg-[#13a5d8]/45" /></div>
        <motion.span className="mt-3 block h-1.5 w-16 rounded-full bg-[#087fbe]" animate={{ scaleX: [0.35, 1, 0.35], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "left" }} />
      </motion.div>
    </div>
  );
}

export default function SiteLoader() {
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeRequests, setActiveRequests] = useState(0);

  useEffect(() => {
    const finishInitialLoad = () => window.setTimeout(() => setInitialLoad(false), MINIMUM_DISPLAY_TIME);
    if (document.readyState === "complete") finishInitialLoad();
    else window.addEventListener("load", finishInitialLoad, { once: true });

    const startRequest = () => setActiveRequests((count) => count + 1);
    const finishRequest = () => setActiveRequests((count) => Math.max(0, count - 1));
    window.addEventListener("bhli:network-start", startRequest);
    window.addEventListener("bhli:network-end", finishRequest);

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (...args) => { startRequest(); try { return await originalFetch(...args); } finally { finishRequest(); } };

    return () => {
      window.removeEventListener("load", finishInitialLoad);
      window.removeEventListener("bhli:network-start", startRequest);
      window.removeEventListener("bhli:network-end", finishRequest);
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {initialLoad && <motion.div className="pointer-events-none fixed inset-0 z-[200] grid place-items-center bg-[#eff9fd]/50 backdrop-blur-[2px]" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} role="status" aria-label="Loading website"><BookingLoaderMark /></motion.div>}
      </AnimatePresence>
      <AnimatePresence>
        {activeRequests > 0 && !initialLoad && <motion.div className="pointer-events-none fixed inset-x-0 top-0 z-[200]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status" aria-label="Loading content"><motion.div className="h-1 bg-gradient-to-r from-[#087fbe] via-[#45c7ed] to-[#087fbe]" animate={{ backgroundPositionX: ["0%", "200%"] }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }} style={{ backgroundSize: "200% 100%" }} /></motion.div>}
      </AnimatePresence>
    </>
  );
}