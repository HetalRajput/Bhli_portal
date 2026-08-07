import { BookingLoaderMark } from "@/components/SiteLoader";

export default function Loading() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[200] grid place-items-center bg-[#eff9fd]/50 backdrop-blur-[2px]" role="status" aria-label="Loading page">
      <BookingLoaderMark />
    </div>
  );
}