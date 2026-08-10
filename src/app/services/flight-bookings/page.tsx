import { Suspense } from "react";
import FlightBookingFlow from "@/components/FlightBookingFlow";
import ServicePageSkeleton from "@/components/ServicePageSkeleton";

export default function FlightBookingsPage() {
  return (
    <Suspense fallback={<ServicePageSkeleton />}>
      <FlightBookingFlow />
    </Suspense>
  );
}
