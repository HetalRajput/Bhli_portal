"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { documentedBookingConfigs, documentedRouteAliases } from "@/components/DocumentedBookingForm";
import UnifiedBookingForm from "@/components/UnifiedBookingForm";

export default function ServicesTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const routeSlug = pathname.split("/").filter(Boolean).at(-1) || "";
  const serviceSlug = documentedRouteAliases[routeSlug] || routeSlug;
  const usesCustomServicePage =
    routeSlug === "hotel-reservations" ||
    serviceSlug === "holiday-packages" ||
    serviceSlug === "event-management" ||
    serviceSlug === "flight-booking" ||
    serviceSlug === "catering-services";
  const replaceWithUnifiedForm =
    pathname !== "/services" &&
    !usesCustomServicePage &&
    Boolean(documentedBookingConfigs[serviceSlug]);

  if (!replaceWithUnifiedForm) return children;
  return <><div className="hidden">{children}</div><UnifiedBookingForm serviceSlug={serviceSlug} /></>;
}
