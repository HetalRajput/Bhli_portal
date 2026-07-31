"use client";

import { useEffect } from "react";

const stockFallbackPaths = new Set([
  "/photos/271618/pexels-photo-271618.jpeg",
  "/photos/271624/pexels-photo-271624.jpeg",
  "/photos/189296/pexels-photo-189296.jpeg",
  "/photos/258154/pexels-photo-258154.jpeg",
  "/photos/261102/pexels-photo-261102.jpeg",
  "/photos/271619/pexels-photo-271619.jpeg",
]);

function isGeneratedStockFallback(source: string) {
  try {
    const url = new URL(source, window.location.origin);
    return url.hostname === "images.pexels.com" && stockFallbackPaths.has(url.pathname);
  } catch {
    return false;
  }
}

export default function HotelImagePlaceholderController() {
  useEffect(() => {
    const markedContainers = new Set<HTMLElement>();

    const markMissingHotelImages = () => {
      document.querySelectorAll<HTMLImageElement>("img[src]").forEach((image) => {
        if (!isGeneratedStockFallback(image.currentSrc || image.src)) return;

        const container = image.parentElement;
        if (!container || !container.classList.contains("h-56")) return;

        container.dataset.hotelImagePlaceholder = "true";
        markedContainers.add(container);
      });
    };

    markMissingHotelImages();
    const observer = new MutationObserver(markMissingHotelImages);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["src"],
    });

    return () => {
      observer.disconnect();
      markedContainers.forEach((container) => {
        delete container.dataset.hotelImagePlaceholder;
      });
    };
  }, []);

  return null;
}
