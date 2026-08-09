import Link from "next/link";
import { ArrowRight, Bus, CalendarDays, Car, Coins, Ship, Hotel, Map, Plane, ShieldCheck, Ticket, Train, UtensilsCrossed } from "lucide-react";
import { cmsService } from "@/lib/api/cms";
import VendorCardLink from "@/components/VendorCardLink";

// Fallback items in case API is empty or fails
const fallbackItems = [
  ["Hotel reservations", "Verified stays for business, duty and leisure.", Hotel, "/services/hotel-reservations", "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Flight bookings", "Domestic and international ticketing support.", Plane, "/services/flight-booking", "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Train tickets", "Rail reservations with itinerary coordination.", Train, "/services/train-ticket-booking", "https://images.pexels.com/photos/2031758/pexels-photo-2031758.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Bus tickets", "Reliable intercity and group transport options.", Bus, "/services/bus-ticket-booking", "https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Taxi services", "Airport transfers, local travel and outstation cabs.", Car, "/services/taxi-services", "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Holiday packages", "Curated family, group and individual escapes.", Map, "/services/holiday-packages", "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Event management", "Professional corporate events and thematic celebrations.", CalendarDays, "/services/event-management", "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Hotel Consultancy", "Concept, pre-opening, people, controls and performance support for hospitality businesses.", ArrowRight, "/services/hotel-consultancy", "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=900"],
];

const iconMap: Record<string, any> = {
  hotel: Hotel,
  flight: Plane,
  train: Train,
  bus: Bus,
  taxi: Car,
  holiday: Map,
  cruise: Ship,
  visa: Ticket,
  insurance: ShieldCheck,
  currency: Coins,
  event: CalendarDays,
  catering: UtensilsCrossed,
  consultancy: ArrowRight,
};

export default async function Services() {
  let apiServices: any[] = [];
  try {
    const res = await cmsService.getServices();
    const serviceData = Array.isArray(res) ? res : res?.data;
    if (Array.isArray(serviceData)) {
      apiServices = [...serviceData].sort((a, b) => Number(a.id) - Number(b.id));
    }
  } catch (error) {
    console.error("Failed to fetch services:", error);
  }

  const getIcon = (slug: string, serviceType?: string) => {
    const normalized = (slug || "").toLowerCase();
    const type = (serviceType || "").toLowerCase();
    if (normalized.includes("hotel") || type.includes("hotel")) return iconMap.hotel;
    if (normalized.includes("flight") || type.includes("flight")) return iconMap.flight;
    if (normalized.includes("train") || type.includes("train")) return iconMap.train;
    if (normalized.includes("bus") || type.includes("bus")) return iconMap.bus;
    if (normalized.includes("taxi") || type.includes("taxi")) return iconMap.taxi;
    if (normalized.includes("holiday") || type.includes("holiday")) return iconMap.holiday;
    if (normalized.includes("cruise") || type.includes("cruise")) return iconMap.cruise;
    if (normalized.includes("visa") || type.includes("visa")) return iconMap.visa;
    if (normalized.includes("insurance") || type.includes("insurance")) return iconMap.insurance;
    if (normalized.includes("currency") || type.includes("currency")) return iconMap.currency;
    if (normalized.includes("event") || type.includes("event")) return iconMap.event;
    if (normalized.includes("catering") || type.includes("catering")) return iconMap.catering;
    if (normalized.includes("consultancy") || type.includes("consultancy")) return iconMap.consultancy;
    return Hotel;
  };

  const isHolidayPackage = (service: any) => {
    const identity = [service.slug, service.service_type, service.name, service.title]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return identity.includes("holiday") && identity.includes("package");
  };

  // Use API data if available, otherwise use fallback data mapped to the same structure
  const displayServices = apiServices.length > 0
    ? apiServices.map(s => {
      const vendorUrl = s.vendor_links?.[0]?.tracking_url;
      const isCatering = s.slug === "catering-services" || s.slug?.includes("catering");
      const usesVendor = Boolean(vendorUrl) && (isCatering || s.booking_mode === "third_party");
      const targetLink = usesVendor
        ? vendorUrl
        : isHolidayPackage(s) ? "/services/holiday-packages" : `/services/${s.slug}`;

      return {
        title: s.name || s.title || "",
        description: s.short_description || s.description || "",
        Icon: getIcon(s.slug, s.service_type),
        link: targetLink,
        isExternal: usesVendor,
        image: s.banner_image || s.image || fallbackItems[0][4]
      };
    })
    : fallbackItems.map(item => ({
      title: item[0],
      description: item[1],
      Icon: item[2],
      link: item[3],
      isExternal: false,
      image: item[4]
    }));

  if (apiServices.length > 0 && !displayServices.some(s => s.title.toLowerCase().includes("event"))) {
    const eventFallback = fallbackItems.find(item => typeof item[0] === 'string' && item[0].toLowerCase().includes("event"));
    if (eventFallback) {
      displayServices.push({
        title: eventFallback[0] as string,
        description: eventFallback[1] as string,
        Icon: eventFallback[2] as any,
        link: eventFallback[3] as string,
        isExternal: false,
        image: eventFallback[4] as string
      });
    }
  }


  return (
    <div className="bg-[#f5f9fc] text-[#122b42]">
      <section className="relative overflow-hidden bg-[#062b50] px-5 py-14 text-white sm:py-20 lg:px-8 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(215,181,109,.18),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]">Our services</p>
          <h1 className="mt-4 max-w-4xl font-serif text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-7xl">One partner for every part of the journey.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:mt-6 sm:text-lg sm:leading-8">Travel, hospitality, mobility and event solutions delivered with clarity, care and dependable support.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayServices.map((service, i) => {
            const cardContent = (
              <>
                <div className="relative h-44 overflow-hidden sm:h-48">
                  <img src={String(service.image)} alt={String(service.title)} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061f3b]/50 to-transparent" />
                  <span className="absolute bottom-4 left-5 grid size-12 place-items-center rounded-2xl bg-white/92 text-[#087fbe] shadow-lg backdrop-blur">
                    <service.Icon className="size-6" />
                  </span>
                </div>
                <div className="p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-serif text-2xl transition-colors group-hover:text-[#087fbe]">{String(service.title)}</h2>
                    <ArrowRight className="size-5 shrink-0 text-black/25 transition group-hover:translate-x-1 group-hover:text-[#087fbe]" />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-black/55">{String(service.description)}</p>
                </div>
              </>
            );

            return service.isExternal ? (
              <VendorCardLink
                key={i}
                trackingUrl={String(service.link)}
                className="service-list-card group block min-w-0 overflow-hidden rounded-3xl border border-black/10 bg-white"
              >
                {cardContent}
              </VendorCardLink>
            ) : (
              <Link
                key={i}
                href={String(service.link)}
                className="service-list-card group block min-w-0 overflow-hidden rounded-3xl border border-black/10 bg-white"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] bg-[#07345d] text-white lg:grid-cols-2">
          <img src="https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Travel planning" className="h-full min-h-[360px] w-full object-cover" />
          <div className="p-8 md:p-14">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#13a5d8]">Need a tailored solution?</p>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl">Tell us the outcome. We will plan the route.</h2>
            <p className="mt-5 leading-8 text-white/60">For group movement, official travel, conferences or complex itineraries, our team can shape a solution around your requirements.</p>
            <Link href="/contact-us" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#13a5d8] px-6 py-3 font-bold text-[#061f3b]">
              Start an enquiry <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
