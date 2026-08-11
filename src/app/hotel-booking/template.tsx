"use client";

import type { ReactNode } from "react";
import EnhancedHotelBookingForm from "@/components/EnhancedHotelBookingForm";

export default function HotelBookingTemplate({ children }: { children: ReactNode }) {
  return <><div className="hidden">{children}</div><EnhancedHotelBookingForm /></>;
}
