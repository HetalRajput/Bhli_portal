"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function scrollToPageTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return;
    const previousMode = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousMode;
    };
  }, []);

  useEffect(() => {
    scrollToPageTop();
    const frame = window.requestAnimationFrame(scrollToPageTop);
    const delayedReset = window.setTimeout(scrollToPageTop, 100);

    // The pageshow event also covers browser back/forward cache restoration.
    window.addEventListener("pageshow", scrollToPageTop);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(delayedReset);
      window.removeEventListener("pageshow", scrollToPageTop);
    };
  }, [pathname]);

  return null;
}
