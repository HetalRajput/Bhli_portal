import type { Metadata } from "next";
import VisaAssistanceForm from "@/components/VisaAssistanceForm";

export const metadata: Metadata = {
  title: "Visa Assistance | Booking Hospitality",
  description: "Submit your visa assistance request, traveller details and supporting documents securely.",
};

export default function ServicePage() {
  return <VisaAssistanceForm />;
}
