"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DefenceEnquiryForm from "@/components/DefenceEnquiryForm";

export default function DefenceReservationFormPortal() {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const heading = Array.from(document.querySelectorAll("h2")).find(
      (element) => element.textContent?.trim() === "Reservation request",
    );
    const card = heading?.parentElement?.parentElement;

    if (!(card instanceof HTMLElement)) return;

    const requirementsGrid = Array.from(card.children).find(
      (element) => element instanceof HTMLElement && element.classList.contains("mt-7"),
    );

    if (requirementsGrid instanceof HTMLElement) requirementsGrid.hidden = true;
    setTarget(card);

    return () => {
      if (requirementsGrid instanceof HTMLElement) requirementsGrid.hidden = false;
      setTarget(null);
    };
  }, []);

  useEffect(() => {
    if (!target) return;

    const hideStandaloneForm = () => {
      Array.from(document.querySelectorAll("h2"))
        .filter((element) => element.textContent?.trim() === "How can we help?")
        .forEach((heading) => {
          const section = heading.closest("section");
          if (section && !target.contains(section)) {
            section.parentElement?.classList.add("hidden");
          }
        });
    };

    hideStandaloneForm();
    const frame = window.requestAnimationFrame(hideStandaloneForm);
    return () => window.cancelAnimationFrame(frame);
  }, [target]);

  if (!target) return null;

  return createPortal(
    <div className="[&>section]:!m-0 [&>section]:!rounded-none [&>section]:!bg-transparent [&>section]:!p-0 [&>section]:!shadow-none [&>section>h2]:hidden [&>section>p:first-child]:hidden [&>section>form]:!mt-6">
      <DefenceEnquiryForm />
    </div>,
    target,
  );
}
