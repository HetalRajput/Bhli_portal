import { Suspense, type ReactNode } from "react";
import ServicePageSkeleton from "@/components/ServicePageSkeleton";

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<ServicePageSkeleton />}>{children}</Suspense>;
}
