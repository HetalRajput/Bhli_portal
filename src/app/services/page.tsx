import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cmsService } from "@/lib/api/cms";
import ServicesCatalog, { type ServiceCatalogItem } from "@/components/ServicesCatalog";

type ApiService = {
  name?: string;
  title?: string;
  slug?: string;
  service_type?: string;
  short_description?: string;
  description?: string;
  banner_image?: string;
  image?: string;
  booking_mode?: string;
  vendor_links?: Array<{ tracking_url?: string }>;
};

// Fallback items in case API is empty or fails
const fallbackItems: Array<[string, string, string, string, string]> = [
  ["Hotel reservations", "Verified stays for business, duty and leisure.", "hotel-reservations", "/services/hotel-reservations", "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Flight bookings", "Domestic and international ticketing support.", "flight-booking", "/services/flight-booking", "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Train tickets", "Rail reservations with itinerary coordination.", "train-ticket-booking", "/services/train-ticket-booking", "https://images.pexels.com/photos/2031758/pexels-photo-2031758.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Bus tickets", "Reliable intercity and group transport options.", "bus-ticket-booking", "/services/bus-ticket-booking", "https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Taxi services", "Airport transfers, local travel and outstation cabs.", "taxi-services", "/services/taxi-services", "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Holiday packages", "Curated family, group and individual escapes.", "holiday-packages", "/services/holiday-packages", "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Event management", "Professional corporate events and thematic celebrations.", "event-management", "/services/event-management", "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=900"],
  ["Hotel Consultancy", "Concept, pre-opening, people, controls and performance support for hospitality businesses.", "hotel-consultancy", "/services/hotel-consultancy", "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=900"],
];

export default async function Services() {
  let apiServices: ApiService[] = [];
  try {
    const res = await cmsService.getServices();
    const serviceData = Array.isArray(res) ? res : res?.data;
    if (Array.isArray(serviceData)) {
      apiServices = serviceData as ApiService[];
    }
  } catch (error) {
    console.error("Failed to fetch services:", error);
  }

  const isHolidayPackage = (service: ApiService) => {
    const identity = [service.slug, service.service_type, service.name, service.title]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return identity.includes("holiday") && identity.includes("package");
  };

  // Use API data if available, otherwise use fallback data mapped to the same structure
  const displayServices: ServiceCatalogItem[] = apiServices.length > 0
    ? apiServices.map(s => {
      const vendorUrl = s.vendor_links?.[0]?.tracking_url;
      const isCatering = s.slug === "catering-services" || s.slug?.includes("catering");
      const usesVendor = Boolean(vendorUrl) && (isCatering || s.booking_mode === "third_party");
      const targetLink = usesVendor
        ? String(vendorUrl)
        : isHolidayPackage(s) ? "/services/holiday-packages" : `/services/${s.slug}`;

      return {
        title: s.name || s.title || "",
        description: s.short_description || s.description || "",
        slug: String(s.slug || "service"),
        serviceType: String(s.service_type || ""),
        link: targetLink,
        isExternal: usesVendor,
        image: String(s.banner_image || s.image || fallbackItems[0][4])
      };
    })
    : fallbackItems.map(item => ({
      title: item[0],
      description: item[1],
      slug: item[2],
      serviceType: "",
      link: item[3],
      isExternal: false,
      image: item[4]
    }));

  return (
    <div className="bg-[#f5f9fc] text-[#122b42]">
      <section className="relative overflow-hidden bg-[#062b50] px-5 py-9 text-white sm:py-11 lg:px-8 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(215,181,109,.18),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]">Our services</p>
          <h1 className="mt-2 max-w-4xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">One partner for every part of the journey.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">Travel, hospitality, mobility and event solutions delivered with clarity, care and dependable support.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:py-12 lg:px-8 lg:py-14">
        <ServicesCatalog services={displayServices} />
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
