import { Suspense } from "react";
import EnhancedHotelBookingForm from "@/components/EnhancedHotelBookingForm";
import GlobalPageSkeleton from "@/components/GlobalPageSkeleton";

export default function EnhancedHotelBookingPage() {
  return (
    <Suspense fallback={<GlobalPageSkeleton />}>
      <EnhancedHotelBookingForm />
    </Suspense>
  );
}
