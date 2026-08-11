import { Suspense } from "react";
import CateringServiceRequestForm from "@/components/CateringServiceRequestForm";
import ServicePageSkeleton from "@/components/ServicePageSkeleton";

export default function ServicePage() {
  return <Suspense fallback={<ServicePageSkeleton />}><CateringServiceRequestForm /></Suspense>;
}
