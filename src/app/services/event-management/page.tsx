import EventManagementFlow from "@/components/EventManagementFlow";
import { Suspense } from "react";
import ServicePageSkeleton from "@/components/ServicePageSkeleton";

export default function ServicePage() {
  return (
    <Suspense fallback={<ServicePageSkeleton />}>
      <EventManagementFlow />
    </Suspense>
  );
}
