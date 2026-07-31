"use client";

import { usePathname } from "next/navigation";
import DefenceEnquiryForm from "@/components/DefenceEnquiryForm";

export default function DefenceEnquiryRouteSection() {
  const pathname = usePathname();

  if (pathname !== "/defence-help-desk") return null;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
      <DefenceEnquiryForm />
    </div>
  );
}
