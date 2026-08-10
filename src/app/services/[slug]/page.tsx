import GenericServiceEnquiry from "@/components/GenericServiceEnquiry";
import HolidayPackagesFlow from "@/components/HolidayPackagesFlow";
import EventManagementFlow from "@/components/EventManagementFlow";
import HotelConsultancyPage from "@/app/services/hotel-consultancy/page";
import { Suspense } from "react";
import ServicePageSkeleton from "@/components/ServicePageSkeleton";

type GenericServicePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GenericServicePage({ params }: GenericServicePageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase().replace(/[_-]+/g, " ");
  const isHolidayPackage = normalizedSlug.includes("holiday") && normalizedSlug.includes("package");
  const isEventManagement = normalizedSlug.includes("event") && normalizedSlug.includes("management");

  // Keep this explicit fallback in the dynamic route as well as the dedicated
  // route. It ensures a running dev server with an older route manifest never
  // falls back to the generic booking-enquiry screen for Hotel Consultancy.
  if (slug === "hotel-consultancy") {
    return <HotelConsultancyPage />;
  }

  if (isHolidayPackage) {
    return (
      <Suspense fallback={<ServicePageSkeleton />}>
        <HolidayPackagesFlow />
      </Suspense>
    );
  }

  if (isEventManagement) {
    return (
      <Suspense fallback={<ServicePageSkeleton />}>
        <EventManagementFlow />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<ServicePageSkeleton />}>
      <GenericServiceEnquiry />
    </Suspense>
  );
}
