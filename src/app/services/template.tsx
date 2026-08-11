"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { documentedBookingConfigs, documentedRouteAliases } from "@/components/DocumentedBookingForm";
import UnifiedBookingForm from "@/components/UnifiedBookingForm";
import CorporateTravelRequestForm from "@/components/CorporateTravelRequestForm";

export default function ServicesTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const routeSlug = pathname.split("/").filter(Boolean).at(-1) || "";
  const serviceSlug = documentedRouteAliases[routeSlug] || routeSlug;
  const usesCustomServicePage =
    routeSlug === "hotel-reservations" ||
    serviceSlug === "bus-ticket-booking" ||
    serviceSlug === "holiday-packages" ||
    serviceSlug === "event-management" ||
    serviceSlug === "flight-booking" ||
    serviceSlug === "catering-services" ||
    serviceSlug === "currency-exchange" ||
    serviceSlug === "visa-assistance" ||
    serviceSlug === "hotel-consultancy";
  const replaceWithUnifiedForm =
    pathname !== "/services" &&
    !usesCustomServicePage &&
    Boolean(documentedBookingConfigs[serviceSlug]);

  if (!replaceWithUnifiedForm) return children;
  if (serviceSlug === "corporate-travel") return <CorporateTravelRequestForm />;
  return <><div className="hidden">{children}</div><UnifiedBookingForm serviceSlug={serviceSlug} /></>;
}
