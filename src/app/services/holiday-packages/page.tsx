import { Suspense } from "react";
import HolidayPackagesFlow from "@/components/HolidayPackagesFlow";
import ServicePageSkeleton from "@/components/ServicePageSkeleton";

export default function ServicePage() {
  return <Suspense fallback={<ServicePageSkeleton />}><HolidayPackagesFlow /></Suspense>;
}
