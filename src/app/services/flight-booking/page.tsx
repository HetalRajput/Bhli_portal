import { Suspense } from "react";
import FlightBookingFlow from "@/components/FlightBookingFlow";

export default function FlightBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#edf5f9]" />}>
      <FlightBookingFlow />
    </Suspense>
  );
}
