"use client";

import type { ReactNode } from "react";
import LegalLinksInjector from "@/components/LegalLinksInjector";

export default function AppTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <LegalLinksInjector />
    </>
  );
}
