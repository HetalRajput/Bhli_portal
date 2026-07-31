"use client";

import type { ReactNode } from "react";
import UnifiedBookingForm from "@/components/UnifiedBookingForm";

export default function HotelBookingTemplate({ children }: { children: ReactNode }) {
  return <><div className="hidden">{children}</div><UnifiedBookingForm serviceSlug="hotel-reservations" /></>;
}
