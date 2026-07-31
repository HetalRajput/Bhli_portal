import type { ReactNode } from "react";
import LegalPolicyPage from "@/components/LegalPolicyPage";

export default function TermsTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="hidden">{children}</div>
      <LegalPolicyPage type="terms" />
    </>
  );
}
