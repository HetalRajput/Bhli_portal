import EventManagementFlow from "@/components/EventManagementFlow";
import { Suspense } from "react";

export default function ServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f8fb]" />}>
      <EventManagementFlow />
    </Suspense>
  );
}
