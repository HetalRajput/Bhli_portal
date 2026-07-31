import type { ReactNode } from "react";
import LegalPolicyPage from "@/components/LegalPolicyPage";

export default function PrivacyTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="hidden">{children}</div>
      <LegalPolicyPage type="privacy" />
    </>
  );
}
