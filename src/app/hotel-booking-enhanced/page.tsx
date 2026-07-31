import { Suspense } from "react";
import EnhancedHotelBookingForm from "@/components/EnhancedHotelBookingForm";

export default function EnhancedHotelBookingPage() {
  return (
    <Suspense fallback={<div className="h-full bg-[#061f3b]" />}>
      <EnhancedHotelBookingForm />
    </Suspense>
  );
}
