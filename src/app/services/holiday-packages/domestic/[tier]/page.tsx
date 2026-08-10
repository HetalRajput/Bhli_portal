import { notFound } from "next/navigation";
import HolidayTierHotels, { type DomesticPackageTier } from "@/components/HolidayTierHotels";

const packageTiers = ["silver", "gold", "platinum"] as const;

export function generateStaticParams() {
  return packageTiers.map((tier) => ({ tier }));
}

export default async function DomesticTierPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params;
  if (!packageTiers.includes(tier as DomesticPackageTier)) notFound();
  return <HolidayTierHotels tier={tier as DomesticPackageTier} />;
}
