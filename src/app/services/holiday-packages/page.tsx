import { Suspense } from "react";
import HolidayPackagesFlow from "@/components/HolidayPackagesFlow";

export default function ServicePage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#edf5f9]" />}><HolidayPackagesFlow /></Suspense>;
}
