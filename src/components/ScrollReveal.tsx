"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const selector = "main section, main article, main figure, main .rounded-3xl";

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

    let observer: IntersectionObserver | undefined;
    const timer = window.setTimeout(() => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer?.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

      elements.forEach((element, index) => {
        if (
          element.closest("header, footer") ||
          element.classList.contains("scroll-reveal") ||
          pathname.startsWith("/services") ||
          isServiceContent(element)
        ) return;

        element.classList.add("scroll-reveal");
        element.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
        observer?.observe(element);
      });
    }, 700);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
