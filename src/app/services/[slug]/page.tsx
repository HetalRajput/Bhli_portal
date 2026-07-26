import GenericServiceEnquiry from "@/components/GenericServiceEnquiry";
import { Suspense } from "react";

export default function GenericServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#061f3b]" />}>
      <GenericServiceEnquiry />
    </Suspense>
  );
}