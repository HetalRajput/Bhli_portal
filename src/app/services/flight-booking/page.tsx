import GenericServiceEnquiry from "@/components/GenericServiceEnquiry";
import { Suspense } from "react";

export default function ServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#061f3b]" />}>
      <GenericServiceEnquiry serviceSlug="flight-booking" />
    </Suspense>
  );
}
