import { Suspense, type ReactNode } from "react";

export default function HotelBookingLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-[#f3f8fb]" />}>{children}</Suspense>;
}
