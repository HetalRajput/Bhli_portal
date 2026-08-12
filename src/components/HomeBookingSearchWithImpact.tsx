import BookingSearch from "@/components/BookingSearch";
import TravelImpactSlider from "@/components/TravelImpactSlider";

export default function HomeBookingSearchWithImpact() {
  return (
    <>
      <BookingSearch />
      <TravelImpactSlider className="relative left-1/2 mt-20 w-screen -translate-x-1/2 sm:mt-24" />
    </>
  );
}
