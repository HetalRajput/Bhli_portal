import { Suspense, type ReactNode } from "react";
import GlobalPageSkeleton from "@/components/GlobalPageSkeleton";

export default function HotelBookingLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<GlobalPageSkeleton />}>{children}</Suspense>;
}
