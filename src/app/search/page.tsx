"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function SearchRedirect() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const rawType = params.get("type") || "hotels";
    const destination = params.get("destination") || "";

    const targetMap: Record<string, string> = {
      hotels: "/services/hotel-reservations",
      flights: "/services/flight-booking",
      trains: "/services/train-ticket-booking",
      buses: "/services/bus-ticket-booking",
      taxis: "/services/taxi-services",
    };

    const targetPath = targetMap[rawType] || "/services/hotel-reservations";
    const query = destination ? `?destination=${encodeURIComponent(destination)}` : "";

    router.replace(`${targetPath}${query}`);
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#061f3b] text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#13a5d8] border-t-transparent" />
        <p className="text-sm font-semibold">Redirecting...</p>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#061f3b]" />}>
      <SearchRedirect />
    </Suspense>
  );
}
