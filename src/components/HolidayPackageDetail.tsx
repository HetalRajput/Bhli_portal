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
import DomesticPricingTable from "./DomesticPricingTable";
import InternationalPricingTable from "./InternationalPricingTable";

export type HolidayPackageType = "domestic" | "international";

const catalogs = {
  domestic: {
    eyebrow: "Explore India",
    title: "Incredible India",
    subtitle: "Diverse Destinations for Every Traveler",
    description: "Discover hill stations, heritage cities, beaches, wildlife, pilgrimage destinations and snowfall escapes across India.",
    icon: MapPinned,
    accent: "from-[#0875b7] to-[#13a5d8]",
    summary: ["Silver: From ₹9,999", "Gold: From ₹13,999", "Platinum: From ₹24,999"],
    pricingCards: [
      { title: "Silver Package", price: "₹9,999", subtitle: "Budget Hotel & Resort" },
      { title: "Gold Package", price: "₹13,999", subtitle: "3-Star Hotel & Resort" },
      { title: "Platinum Package", price: "₹24,999", subtitle: "4/5-Star Luxury Hotels" }
    ],
    sections: [
      {
        title: "Hill Stations & Nature Retreats",
        description: "Refreshing breaks surrounded by mountains, forests, lakes and scenic valleys.",
        icon: Compass,
        items: [
          { title: "South India", description: "Yercaud, Ooty, Munnar, Coorg, Kodaikanal, Chikmagalur, Wayanad, Sakleshpur.", tags: ["Ooty", "Munnar", "Coorg"], image: "https://images.pexels.com/photos/1666012/pexels-photo-1666012.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "North India", description: "Mussoorie, Nainital, Auli, Kurseong, Dalhousie.", tags: ["Mussoorie", "Nainital", "Auli"], image: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "West & Central India", description: "Lonavala, Mahabaleshwar, Mount Abu.", tags: ["Lonavala", "Mount Abu"], image: "https://images.pexels.com/photos/1450361/pexels-photo-1450361.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Northeast India", description: "Meghalaya, Mechuka, Shillong, Gangtok, Kalimpong, Sikkim.", tags: ["Shillong", "Gangtok"], image: "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Leisure & Historical Destinations",
        description: "Explore historic cities, forts, palaces, monuments and local traditions.",
        icon: Landmark,
        items: [
          { title: "Rajasthan & North", description: "Jaipur, Udaipur, Agra, Jaisalmer, Jodhpur, Delhi.", tags: ["Jaipur", "Udaipur", "Agra"], image: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Central & South", description: "Hampi, Mysuru, Hyderabad, Khajuraho, Gwalior, Madurai, Thanjavur.", tags: ["Hampi", "Mysuru"], image: "https://images.pexels.com/photos/2446702/pexels-photo-2446702.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Beaches & Island Destinations",
        description: "Relax by the coast with laid-back stays, water activities and island experiences.",
        icon: Plane,
        items: [
          { title: "West Coast", description: "Goa, Kovalam, Varkala, Gokarna, Mumbai, Mangalore, Kozhikode, Daman.", tags: ["Goa", "Gokarna", "Kovalam"], image: "https://images.pexels.com/photos/1024984/pexels-photo-1024984.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "East Coast & Islands", description: "Lakshadweep, Puri, Nellore, Chennai, Kanyakumari, Puducherry, Andaman and Nicobar.", tags: ["Andaman", "Lakshadweep"], image: "https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "National Parks & Wildlife Safaris",
        description: "Plan safaris, forest stays and outdoor activities for an active holiday.",
        icon: Route,
        items: [
          { title: "Wildlife Reserves", description: "Jim Corbett, Ranthambore, Kaziranga, Bandipur, Dandeli, Bekal.", tags: ["Jim Corbett", "Ranthambore", "Kaziranga"], image: "https://images.pexels.com/photos/4038869/pexels-photo-4038869.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Spiritual & Pilgrimage Tours",
        description: "Comfortable, carefully planned visits to important spiritual destinations.",
        icon: Heart,
        items: [
          { title: "North India Circuit", description: "Varanasi, Haridwar, Rishikesh, Prayagraj, Badrinath, Pushkar, Ayodhya.", tags: ["Varanasi", "Rishikesh"], image: "https://images.pexels.com/photos/7178726/pexels-photo-7178726.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Himalayan & Buddhist", description: "Spiti Valley, Dharamshala, Leh.", tags: ["Spiti Valley", "Leh"], image: "https://images.pexels.com/photos/3636151/pexels-photo-3636151.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "South India Circuit", description: "Tirupati, Rameswaram, Tiruvannamalai, Nellore.", tags: ["Tirupati", "Rameswaram"], image: "https://images.pexels.com/photos/3152124/pexels-photo-3152124.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Multi-Faith Destinations", description: "Amritsar, Ajmer, Mumbai.", tags: ["Amritsar", "Ajmer"], image: "https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Top Snowfall Destinations",
        description: "Winter itineraries designed around snow views, seasonal activities and cosy stays.",
        icon: Sparkles,
        items: [
          { title: "Kashmir & Himachal", description: "Kashmir, Gulmarg, Pahalgam, Manali, Shimla, Spiti Valley, Kasol.", tags: ["Gulmarg", "Manali", "Shimla"], image: "https://images.pexels.com/photos/700871/pexels-photo-700871.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Uttarakhand & Northeast", description: "Auli, Sikkim, Lachung, Darjeeling, Tawang.", tags: ["Auli", "Sikkim", "Darjeeling"], image: "https://images.pexels.com/photos/1125212/pexels-photo-1125212.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
    ],
  },
  international: {
    eyebrow: "Explore the world",
    title: "Top International Destinations",
    subtitle: "Premium Travel Packages | Best Deals | Trusted Service",
    description: "Explore the world with us through popular, budget-friendly, honeymoon, luxury, European and emerging international holiday ideas.",
    icon: Globe2,
    accent: "from-[#061f3b] to-[#13a5d8]",
    summary: ["Budget: ₹50K - ₹90K", "Mid-Range: ₹90K - ₹1.5L", "Premium: ₹2L - ₹5L+"],
    pricingCards: [
      { title: "Budget Packages", price: "₹50K - ₹90K", subtitle: "Best Value Options" },
      { title: "Mid-Range Packages", price: "₹90K - ₹1.5L", subtitle: "Standard Comfort" },
      { title: "Premium Packages", price: "₹2L - ₹5L+", subtitle: "Luxury Experiences" }
    ],
    sections: [
      {
        title: "Most Popular & High-Demand Destinations",
        description: "Amazing Places. Unforgettable Memories.",
        icon: Landmark,
        items: [
          { title: "UAE (Dubai / Abu Dhabi)", description: "Experience luxury shopping, thrilling desert safaris, and the iconic Burj Khalifa.", tags: ["₹90K - ₹1.5L", "Luxury Shopping", "Desert Safari", "Burj Khalifa"], image: "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Singapore", description: "World-class attractions including Universal Studios, Sentosa Island, and vibrant city experiences.", tags: ["₹90K - ₹1.5L", "Universal Studios", "Sentosa Island", "City Experience"], image: "https://images.pexels.com/photos/3152124/pexels-photo-3152124.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Thailand", description: "Beautiful beaches in Phuket and Krabi, paired with the legendary Bangkok nightlife.", tags: ["₹50K - ₹90K", "Phuket", "Krabi", "Bangkok Nightlife"], image: "https://images.pexels.com/photos/1682748/pexels-photo-1682748.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Budget-Friendly International Packages",
        description: "Perfect for LTC & Economical Travel. Best value for money.",
        icon: MapPin,
        items: [
          { title: "Nepal", description: "Explore Kathmandu, Pokhara, and witness the breathtaking Everest views.", tags: ["₹50K - ₹90K", "Kathmandu", "Pokhara", "Everest Views"], image: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Vietnam", description: "Cruise through Halong Bay, explore historic Hanoi, and relax on beautiful beaches.", tags: ["₹50K - ₹90K", "Halong Bay", "Hanoi", "Beaches"], image: "https://images.pexels.com/photos/3058827/pexels-photo-3058827.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Sri Lanka", description: "A perfect blend of pristine beaches, ancient culture, and exotic wildlife.", tags: ["₹50K - ₹90K", "Beaches", "Culture", "Wildlife"], image: "https://images.pexels.com/photos/4038869/pexels-photo-4038869.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Beach & Honeymoon Destinations",
        description: "Perfect for Love & Memories. Create memories that last forever.",
        icon: Heart,
        items: [
          { title: "Maldives", description: "Iconic water villas, luxury resorts, and the ultimate honeymoon paradise.", tags: ["₹2L - ₹5L+", "Water Villas", "Luxury Resorts", "Honeymoon"], image: "https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Bali (Indonesia)", description: "Stunning beautiful beaches, spiritual temples, and vibrant nightlife.", tags: ["₹90K - ₹1.5L", "Beautiful Beaches", "Spiritual Temples", "Vibrant Nightlife"], image: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Mauritius", description: "Ideal for family trips, destination weddings, and a premium luxury experience.", tags: ["₹90K - ₹1.5L", "Family Trips", "Destination Weddings", "Luxury"], image: "https://images.pexels.com/photos/1024984/pexels-photo-1024984.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Luxury & Europe Tour Packages",
        description: "Luxury Experience Starts Here. Europe calling, experience the best!",
        icon: Crown,
        items: [
          { title: "France (Paris)", description: "Visit the iconic Eiffel Tower, enjoy world-class shopping, and experience pure romance.", tags: ["₹2L - ₹5L+", "Eiffel Tower", "Shopping", "Romance"], image: "https://images.pexels.com/photos/1125212/pexels-photo-1125212.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Switzerland", description: "Breathtaking Alps, scenic train journeys, and unforgettable snow experiences.", tags: ["₹2L - ₹5L+", "Alps", "Scenic Trains", "Snow Experience"], image: "https://images.pexels.com/photos/700871/pexels-photo-700871.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Italy", description: "Explore the ancient streets of Rome, romantic Venice canals, and rich cultural history.", tags: ["₹2L - ₹5L+", "Rome", "Venice", "Culture & History"], image: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Trending & Emerging Destinations",
        description: "New Places, New Experiences. Explore more, live more!",
        icon: Sparkles,
        items: [
          { title: "Georgia", description: "Stunning landscapes, rich culture, delicious wine, and perfect for explorers.", tags: ["Stunning Landscapes", "Rich Culture", "Delicious Wine"], image: "https://images.pexels.com/photos/3636151/pexels-photo-3636151.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Philippines", description: "Endless island hopping, crystal clear beaches, adventure activities, and picture-perfect destinations.", tags: ["Island Hopping", "Crystal Clear Beaches", "Adventure"], image: "https://images.pexels.com/photos/2450296/pexels-photo-2450296.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Cambodia", description: "Explore ancient temples, enjoy relaxing getaways, uncover hidden gems, and experience rich culture.", tags: ["Ancient Temples", "Relaxing Getaways", "Hidden Gems"], image: "https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
    ],
  },
};

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

          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <span className="grid size-16 place-items-center rounded-2xl border border-white/15 bg-white/10 text-[#36c5f0] shadow-xl backdrop-blur">
                <Icon className="size-8" />
              </span>
              <p className="mt-7 text-[11px] font-extrabold uppercase tracking-[.28em] text-[#36c5f0]">{catalog.eyebrow}</p>
              <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-6xl lg:text-7xl">{catalog.title}</h1>
              <p className="mt-4 text-lg font-semibold text-white/85">{catalog.subtitle}</p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">{catalog.description}</p>

              <Link href={`/services/holiday-packages?type=${packageType}&step=enquire`} className={`mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${catalog.accent} px-8 py-4 text-sm font-bold text-white shadow-lg transition hover:scale-105`}>
                Plan this holiday
                <ArrowRight className="size-4" />
              </Link>
            </div>

            {/* Pricing Cards Column */}
            {catalog.pricingCards && (
              <div className="flex w-full flex-col gap-4 lg:w-[380px] lg:pt-8">
                {catalog.pricingCards.map((card) => (
                  <div key={card.title} className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md transition hover:bg-white/15 hover:shadow-[#13a5d8]/20">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-white">{card.title}</h3>
                      <p className="mt-1 text-xs text-white/60">{card.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#36c5f0]">Starting from</span>
                      <p className="font-serif text-2xl font-bold text-white">{card.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Package information directly below the page header */}
      {packageType === "domestic" && <DomesticPricingTable />}
      {packageType === "international" && <InternationalPricingTable />}

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
