import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  Crown,
  Globe2,
  Heart,
  Landmark,
  MapPin,
  MapPinned,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

export type HolidayPackageType = "domestic" | "international";

const catalogs = {
  domestic: {
    eyebrow: "Explore India",
    title: "Incredible India",
    subtitle: "Diverse destinations for every traveller",
    description:
      "Discover hill stations, heritage cities, beaches, wildlife, pilgrimage destinations and snowfall escapes across India.",
    icon: MapPinned,
    accent: "from-[#0875b7] to-[#13a5d8]",
    summary: ["India-wide journeys", "LTC package options", "Personal travel assistance"],
    sections: [
      {
        title: "Destinations across India",
        description:
          "Choose the travel style that fits your family, season and preferred pace.",
        icon: Compass,
        items: [
          { title: "Nature & hill retreats", description: "Refreshing breaks surrounded by mountains, forests, lakes and scenic valleys.", tags: ["Hill stations", "Nature stays", "Cool weather"], image: "https://images.pexels.com/photos/1666012/pexels-photo-1666012.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Heritage & culture", description: "Explore historic cities, forts, palaces, monuments and local traditions.", tags: ["Heritage", "Architecture", "Culture"], image: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Beaches & islands", description: "Relax by the coast with laid-back stays, water activities and island experiences.", tags: ["Beaches", "Islands", "Leisure"], image: "https://images.pexels.com/photos/1450361/pexels-photo-1450361.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Wildlife & adventure", description: "Plan safaris, forest stays and outdoor activities for an active holiday.", tags: ["Wildlife", "Safari", "Adventure"], image: "https://images.pexels.com/photos/2446702/pexels-photo-2446702.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Pilgrimage journeys", description: "Comfortable, carefully planned visits to important spiritual destinations.", tags: ["Pilgrimage", "Temples", "Spiritual travel"], image: "https://images.pexels.com/photos/7178726/pexels-photo-7178726.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Snowfall escapes", description: "Winter itineraries designed around snow views, seasonal activities and cosy stays.", tags: ["Snow", "Winter", "Mountains"], image: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "All-India Domestic LTC Packages",
        description:
          "Compare package levels and let the travel desk confirm current inclusions, eligibility and pricing.",
        icon: Route,
        items: [
          { title: "Silver package", description: "A practical package level focused on essential travel arrangements and value.", tags: ["Value focused", "Essential inclusions"], image: "https://images.pexels.com/photos/4006143/pexels-photo-4006143.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Gold package", description: "An upgraded option balancing added comfort, convenience and sightseeing.", tags: ["Enhanced comfort", "Popular choice"], image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Platinum package", description: "A premium package level for travellers seeking elevated stays and services.", tags: ["Premium stays", "Added comfort"], image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Package inclusions", description: "Accommodation, transfers, sightseeing and meals are reviewed for the selected itinerary.", tags: ["Stay", "Transfers", "Sightseeing"], image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "LTC planning support", description: "Get assistance with suitable routing, package selection and required travel information.", tags: ["LTC guidance", "Route planning"], image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Flexible customisation", description: "Adjust the destination, duration, hotel preference and guest requirements before confirmation.", tags: ["Custom itinerary", "Family friendly"], image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
    ],
  },
  international: {
    eyebrow: "Explore the world",
    title: "Top International Destinations",
    subtitle: "One world. Endless possibilities.",
    description:
      "Browse popular, budget-friendly, honeymoon, luxury, European and emerging international holiday ideas.",
    icon: Globe2,
    accent: "from-[#061f3b] to-[#13a5d8]",
    summary: ["Worldwide destinations", "Honeymoon and family tours", "Tailored travel planning"],
    sections: [
      {
        title: "International holiday collection",
        description: "Start with the holiday style that best matches your plans.",
        icon: Plane,
        items: [
          { title: "Popular favourites", description: "High-demand destinations with a broad choice of attractions and experiences.", tags: ["Best sellers", "First-time travellers"], image: "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Budget-friendly tours", description: "Value-conscious international journeys with memorable culture and sightseeing.", tags: ["Great value", "Short-haul options"], image: "https://images.pexels.com/photos/2104152/pexels-photo-2104152.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Beach & honeymoon", description: "Romantic island escapes, tropical resorts and relaxed coastal itineraries.", tags: ["Couples", "Beaches", "Resorts"], image: "https://images.pexels.com/photos/1024984/pexels-photo-1024984.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Luxury & Europe", description: "Premium stays, scenic routes and iconic European city experiences.", tags: ["Luxury", "Europe", "Premium stays"], image: "https://images.pexels.com/photos/1125212/pexels-photo-1125212.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Trending destinations", description: "Emerging travel choices for guests looking for something fresh and distinctive.", tags: ["Trending", "New experiences"], image: "https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Custom journeys", description: "Combine destinations, hotel preferences and sightseeing into a personalised plan.", tags: ["Tailor-made", "Flexible duration"], image: "https://images.pexels.com/photos/2450296/pexels-photo-2450296.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Most Popular & High-Demand Destinations",
        description: "Three versatile favourites for shopping, family attractions and vibrant city experiences.",
        icon: Landmark,
        items: [
          { title: "UAE", description: "Modern city experiences, desert activities, iconic architecture and premium shopping.", tags: ["Dubai", "City break", "Desert"], image: "https://images.pexels.com/photos/3152124/pexels-photo-3152124.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Singapore", description: "Family-friendly attractions, waterfront landmarks, gardens and excellent connectivity.", tags: ["Family", "Attractions", "City"], image: "https://images.pexels.com/photos/1682748/pexels-photo-1682748.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Thailand", description: "A flexible mix of beaches, nightlife, temples, shopping and island excursions.", tags: ["Bangkok", "Phuket", "Beaches"], image: "https://images.pexels.com/photos/3058827/pexels-photo-3058827.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Budget-Friendly International Packages",
        description: "Value-led journeys with culture, scenery and comfortable short-haul travel options.",
        icon: MapPin,
        items: [
          { title: "Nepal", description: "Mountain scenery, spiritual landmarks and relaxed cultural experiences close to home.", tags: ["Mountains", "Culture", "Value"], image: "https://images.pexels.com/photos/4038869/pexels-photo-4038869.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Vietnam", description: "Historic cities, beautiful bays, local food and varied landscapes at excellent value.", tags: ["Culture", "Food", "Scenery"], image: "https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Sri Lanka", description: "Beaches, wildlife, tea country and heritage locations in one compact itinerary.", tags: ["Beaches", "Wildlife", "Heritage"], image: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Beach & Honeymoon Destinations",
        description: "Romantic tropical holidays designed around privacy, resorts and memorable experiences.",
        icon: Heart,
        items: [
          { title: "Maldives", description: "Private island resorts, turquoise lagoons and peaceful overwater stays.", tags: ["Honeymoon", "Island resort", "Luxury"], image: "https://images.pexels.com/photos/700871/pexels-photo-700871.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Bali", description: "Romantic villas, temples, beaches, wellness and scenic day trips.", tags: ["Villas", "Culture", "Wellness"], image: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Mauritius", description: "Beautiful beaches, resort experiences and activities for couples and families.", tags: ["Resorts", "Beaches", "Couples"], image: "https://images.pexels.com/photos/3636151/pexels-photo-3636151.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Luxury & Europe Tour Packages",
        description: "Iconic cities, scenic routes and premium European experiences.",
        icon: Crown,
        items: [
          { title: "France", description: "Paris landmarks, art, dining and elegant city experiences.", tags: ["Paris", "Culture", "Luxury"], image: "https://images.pexels.com/photos/1162607/pexels-photo-1162607.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Switzerland", description: "Alpine landscapes, panoramic train journeys and picture-perfect towns.", tags: ["Alps", "Scenic trains", "Nature"], image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Italy", description: "Historic cities, celebrated cuisine, architecture and romantic routes.", tags: ["Rome", "Venice", "Cuisine"], image: "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Trending & Emerging Destinations",
        description: "Distinctive experiences beyond the usual international holiday circuit.",
        icon: Sparkles,
        items: [
          { title: "Georgia", description: "Mountain landscapes, old towns, regional cuisine and excellent seasonal variety.", tags: ["Mountains", "Old towns", "Trending"], image: "https://images.pexels.com/photos/3282133/pexels-photo-3282133.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Philippines", description: "Island hopping, clear waters and laid-back tropical experiences.", tags: ["Islands", "Beaches", "Adventure"], image: "https://images.pexels.com/photos/1666012/pexels-photo-1666012.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Cambodia", description: "Ancient temples, cultural landmarks and welcoming city experiences.", tags: ["Temples", "Heritage", "Culture"], image: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Our Travel Packages",
        description: "Select a package style, then personalise the duration, stays and activities.",
        icon: UsersRound,
        items: [
          { title: "Family holidays", description: "Balanced itineraries with comfortable stays and activities for different age groups.", tags: ["Family", "Flexible pace"], image: "https://images.pexels.com/photos/1450361/pexels-photo-1450361.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Honeymoon escapes", description: "Romantic destinations, special stays and memorable couple experiences.", tags: ["Couples", "Romantic"], image: "https://images.pexels.com/photos/2446702/pexels-photo-2446702.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Group journeys", description: "Coordinated travel plans for friends, colleagues and larger families.", tags: ["Groups", "Coordinated travel"], image: "https://images.pexels.com/photos/7178726/pexels-photo-7178726.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Premium experiences", description: "Luxury stays, private arrangements and carefully curated activities.", tags: ["Premium", "Private options"], image: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Why Choose Booking Hospitality?",
        description: "Personal support from initial ideas through final travel planning.",
        icon: ShieldCheck,
        items: [
          { title: "Personalised planning", description: "Recommendations are shaped around your dates, guests, budget and interests.", tags: ["Tailored advice"], image: "https://images.pexels.com/photos/4006143/pexels-photo-4006143.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Verified options", description: "The travel desk reviews availability, inclusions and suitable service options.", tags: ["Reviewed choices"], image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Clear assistance", description: "Receive guidance on itinerary, documentation and the next booking steps.", tags: ["End-to-end support"], image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Flexible enquiries", description: "Share preferences first and confirm only after reviewing the proposed plan.", tags: ["No instant charge"], image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
    ],
  },
} as const;

export default function HolidayPackageDetail({
  packageType,
}: {
  packageType: HolidayPackageType;
}) {
  const catalog = catalogs[packageType];
  const Icon = catalog.icon;

  return (
    <main className="min-h-screen bg-[#edf5f9] text-[#122b42]">
      <section className="relative isolate overflow-hidden bg-[#061f3b] px-5 pb-16 pt-8 text-white lg:px-8 lg:pb-24">
        <div className="absolute -left-32 top-8 -z-10 size-80 rounded-full bg-[#087fbe]/20 blur-3xl" />
        <div className="absolute -right-28 bottom-0 -z-10 size-96 rounded-full bg-[#13a5d8]/15 blur-3xl" />
        <div className="absolute inset-0 -z-10 opacity-[.06] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:52px_52px]" />

        <div className="mx-auto max-w-7xl">
          <Link href="/services/holiday-packages" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white">
            <ArrowLeft className="size-4" />
            All holiday packages
          </Link>

          <div className="mt-14 max-w-4xl">
            <span className="grid size-16 place-items-center rounded-2xl border border-white/15 bg-white/10 text-[#36c5f0] shadow-xl backdrop-blur">
              <Icon className="size-8" />
            </span>
            <p className="mt-7 text-[11px] font-extrabold uppercase tracking-[.28em] text-[#36c5f0]">{catalog.eyebrow}</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-6xl lg:text-7xl">{catalog.title}</h1>
            <p className="mt-4 text-lg font-semibold text-white/85">{catalog.subtitle}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">{catalog.description}</p>

            <div className="mt-7 flex flex-wrap gap-2">
              {catalog.summary.map((item) => <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-white/75"><CheckCircle2 className="size-3.5 text-[#36c5f0]" />{item}</span>)}
            </div>

            <Link href={`/services/holiday-packages?type=${packageType}&step=enquire`} className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${catalog.accent} px-6 py-3.5 text-sm font-bold text-white shadow-lg`}>
              Plan this holiday
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-[#087fbe]">Curated holiday collection</p>
            <h2 className="mt-2 font-serif text-3xl text-[#061f3b] sm:text-4xl">Explore every package</h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-slate-500">Browse destinations and package styles through clear, icon-led sections.</p>
        </div>

        <nav className="mb-8 flex gap-2 overflow-x-auto pb-2" aria-label="Package sections">
          {catalog.sections.map((section, index) => (
            <a key={section.title} href={`#package-section-${index + 1}`} className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-[#13a5d8] hover:text-[#087fbe]">
              {String(index + 1).padStart(2, "0")} · {section.title}
            </a>
          ))}
        </nav>

        <div className="space-y-8">
          {catalog.sections.map((section, index) => {
            const SectionIcon = section.icon;
            return (
              <article id={`package-section-${index + 1}`} key={section.title} className="scroll-mt-6 overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-[0_18px_55px_rgba(6,31,59,.09)] sm:rounded-[2rem]">
                <header className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-[#f7fcff] to-white px-5 py-6 sm:flex-row sm:items-center sm:px-7">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#e5f5fb] text-[#087fbe]"><SectionIcon className="size-6" /></span>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#087fbe]">Package section {String(index + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 font-serif text-2xl text-[#061f3b] sm:text-3xl">{section.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{section.description}</p>
                  </div>
                </header>

                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
                  {section.items.map((item) => (
                    <section key={item.title} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#13a5d8]/50 hover:shadow-[0_14px_35px_rgba(6,31,59,.09)]">
                      {'image' in item && item.image && (
                        <div className="relative h-48 w-full overflow-hidden border-b border-slate-100 bg-slate-50">
                          <img src={item.image as string} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute left-4 top-4 grid size-10 place-items-center rounded-xl bg-white/95 text-[#087fbe] shadow-sm backdrop-blur">
                            <CheckCircle2 className="size-5" />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-grow flex-col p-5">
                        {!('image' in item && item.image) && (
                          <span className="mb-4 grid size-10 place-items-center rounded-xl bg-[#edf9fd] text-[#087fbe]"><CheckCircle2 className="size-5" /></span>
                        )}
                        <h4 className="text-base font-extrabold text-[#061f3b]">{item.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                        <div className="mt-auto pt-5">
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-600">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-5 pb-14 lg:px-8 lg:pb-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-[2rem] bg-[#061f3b] px-6 py-8 text-white shadow-[0_20px_60px_rgba(6,31,59,.18)] sm:flex-row sm:items-center sm:justify-between sm:px-9">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#36c5f0]"><ShieldCheck className="size-4" />Personal travel assistance</p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl">Ready to plan your trip?</h2>
            <p className="mt-2 text-sm text-white/55">Our travel desk will confirm availability, inclusions and final pricing.</p>
          </div>
          <Link href={`/services/holiday-packages?type=${packageType}&step=enquire`} className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${catalog.accent} px-6 py-3.5 text-sm font-bold text-white`}>
            Fill enquiry form
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}