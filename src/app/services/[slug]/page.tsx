import GenericServiceEnquiry from "@/components/GenericServiceEnquiry";
import HolidayPackagesFlow from "@/components/HolidayPackagesFlow";
import EventManagementFlow from "@/components/EventManagementFlow";
import { Suspense } from "react";

type GenericServicePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GenericServicePage({ params }: GenericServicePageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase().replace(/[_-]+/g, " ");
  const isHolidayPackage = normalizedSlug.includes("holiday") && normalizedSlug.includes("package");
  const isEventManagement = normalizedSlug.includes("event") && normalizedSlug.includes("management");

  if (isHolidayPackage) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#edf5f9]" />}>
        <HolidayPackagesFlow />
      </Suspense>
    );
  }

  if (isEventManagement) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#f4f8fb]" />}>
        <EventManagementFlow />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#061f3b]" />}>
      <GenericServiceEnquiry />
    </Suspense>
  );
}