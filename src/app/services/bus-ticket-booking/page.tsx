import { Suspense } from "react";
import ServicePageSkeleton from "@/components/ServicePageSkeleton";
import BusTicketRequestForm from "@/components/BusTicketRequestForm";

export default function ServicePage() {
  return (
    <Suspense fallback={<ServicePageSkeleton />}>
      <BusTicketRequestForm />
    </Suspense>
  );
}
