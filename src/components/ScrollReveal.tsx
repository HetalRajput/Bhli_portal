"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const selector = "main section, main article, main figure, main .rounded-3xl";
const revealedElements = new WeakSet<HTMLElement>();

function isServiceContent(element: HTMLElement) {
  return Boolean(
    element.closest(".no-scroll-reveal, .travel-solution-card, .service-list-card") ||
    element.querySelector(".travel-solution-card, .service-list-card")
  );
}

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (pathname.startsWith("/services")) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const elementIndexes = new Map(elements.map((element, index) => [element, index]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        if (!entry.isIntersecting || revealedElements.has(element)) return;

        revealedElements.add(element);
        observer.unobserve(element);

        const index = elementIndexes.get(element) ?? 0;
        const isEvenSection = element.matches("main section:nth-of-type(even)");
        element.animate(
          [
            {
              opacity: 0,
              transform: isEvenSection
                ? "translate3d(-20px, 30px, 0) scale(.99)"
                : "translate3d(0, 34px, 0) scale(.985)",
              filter: "blur(4px)",
            },
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)", filter: "blur(0)" },
          ],
          {
            duration: 850,
            delay: (index % 4) * 70,
            easing: "cubic-bezier(.22, 1, .36, 1)",
            fill: "backwards",
          },
        );
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

    elements.forEach((element) => {
      if (
        element.closest("header, footer") ||
        revealedElements.has(element) ||
        isServiceContent(element)
      ) return;

      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
