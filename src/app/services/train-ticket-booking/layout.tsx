import type { ReactNode } from "react";
import TrainPassengerCountNormalizer from "@/components/TrainPassengerCountNormalizer";

export default function TrainBookingLayout({ children }: { children: ReactNode }) {
  return <>{children}<TrainPassengerCountNormalizer /></>;
}
