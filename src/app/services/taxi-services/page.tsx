import GenericServiceEnquiry from "@/components/GenericServiceEnquiry";
import { Suspense } from "react";
import ServicePageSkeleton from "@/components/ServicePageSkeleton";

export default function ServicePage() {
  return (
    <Suspense fallback={<ServicePageSkeleton />}>
      <GenericServiceEnquiry serviceSlug="taxi-services" />
    </Suspense>
  );
}
