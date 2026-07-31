import type { ReactNode } from "react";
import DefenceEnquiryRouteSection from "@/components/DefenceEnquiryRouteSection";

export default function DefenceHelpDeskLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <DefenceEnquiryRouteSection />
    </>
  );
}
