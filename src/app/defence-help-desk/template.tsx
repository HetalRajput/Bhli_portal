"use client";

import type { ReactNode } from "react";
import DefenceReservationFormPortal from "@/components/DefenceReservationFormPortal";

export default function DefenceHelpDeskTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <DefenceReservationFormPortal />
    </>
  );
}
