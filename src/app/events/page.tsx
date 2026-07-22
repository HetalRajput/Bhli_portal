import Link from "next/link";
import { 
  ArrowRight, 
  CalendarDays, 
  MapPin, 
  CheckCircle2, 
  Award, 
  Users, 
  Building2, 
  Globe, 
  Sparkles,
  Shield,
  Milestone,
  Cpu,
  Layers,
  Wrench,
  Car,
  Hotel,
  Building,
  Home,
  Coins,
  Bed,
  Star
} from "lucide-react";

const subdisciplines = [
  {
    title: "Aerodynamics: Rotary Wing",
    desc: "Multi-rotors or Compound vertical flight aeromechanics.",
    icon: Compass
  },
  {
    title: "Structures and Materials",
    desc: "Light-weight aerospace grade composite designs.",
    icon: Layers
  },
  {
    title: "Propulsion",
    desc: "Electric or Hybrid power plants driving zero-emission flight.",
    icon: Cpu
  },
  {
    title: "Systems",
    desc: "Onboard and Offboard navigation, telemetry, and avionics.",
    icon: Settings
  },
  {
    title: "Design",
    desc: "All configurations—Manned, Unmanned, or Optional takeoff designs.",
    icon: Milestone
  },
  {
    title: "Operations",
    desc: "Flight and Ground vertiport operations and airspace integration.",
    icon: Globe
  },
  {
    title: "Airworthiness and Regulations",
    desc: "Operational and Technical regulatory framework compliance.",
    icon: Shield
  },
  {
    title: "Airspace Management",
    desc: "Urban and Semi-Urban airspace management systems.",
    icon: MapPin
  },
  {
    title: "Product Support",
    desc: "MROs and Supply Chain establishment for air fleets.",
    icon: Wrench
  }
];

const supporters = [
  {
    name: "Indian Institute of Science",
    role: "Conference Supporter",
    acronym: "IISc",
    image: "/Asset/clients/event1.jpg",
    bg: "from-[#087dbd]/10 to-[#087dbd]/5"
  },
  {
    name: "Indian Air Force",
    role: "Conference Supporter",
    acronym: "IAF",
    image: "/Asset/clients/event2.png",
    bg: "from-[#051b33]/15 to-[#051b33]/5"
  },
  {
    name: "University of Melbourne",
    role: "Conference Supporter",
    acronym: "UoM",
    image: "/Asset/clients/event3.png",
    bg: "from-[#13a5d8]/10 to-[#13a5d8]/5"
  }
];

const chairs = [
  {
    name: "Dr. Arvind Sinha",
    role: "Chair",
    desc: "VP Asia-Australia Region, VFS"
  },
  {
    name: "Mr. Vijaya Kumar Mudubagilu",
    role: "Deputy Chair",
    desc: "Rotary Wing Society of India, India"
  },
  {
    name: "Mr. Robert Hood",
    role: "Technical Chair (Aerospace)",
    desc: "VP Australia Chapter, VFS"
  },
  {
    name: "Wg Cdr BS Singh Deo",
    role: "Technical Chair (Aviation)",
    desc: "VP RWS"
  }
];

const hotelTiers = [
  {
    title: "5 Star Luxury - Hotels",
    price: "Above ₹ 11,000",
    icon: Sparkles,
    badge: "Ultra Luxury",
    image: "https://w4u.in/api/r2-page-asset?k=3224%2Fpages%2Fimagesq-mgjlsu.jpg",
    btnClass: "bg-[#13a5d8] text-[#061f3b] hover:bg-[#061f3b] hover:text-white",
    starCount: 5
  },
  {
    title: "5 Star - Hotels",
    price: "Above ₹ 7,500",
    icon: Hotel,
    badge: "Premium Stay",
    image: "https://w4u.in/api/r2-page-asset?k=3224%2Fpages%2Fimg-7f9c3e431b46.jpg",
    btnClass: "bg-[#061f3b] text-white hover:bg-[#087dbd]",
    starCount: 5
  },
  {
    title: "4 Star - Hotels",
    price: "Above ₹ 5,500",
    icon: Building,
    badge: "Upscale comfort",
    image: "https://w4u.in/api/r2-page-asset?k=3224%2Fpages%2Fibibis-r35jhw.jpg",
    btnClass: "bg-[#061f3b] text-white hover:bg-[#087dbd]",
    starCount: 4
  },
  {
    title: "3 Star - Hotels",
    price: "Above ₹ 4,000 + Taxes",
    icon: Home,
    badge: "Business comfort",
    image: "https://w4u.in/api/r2-page-asset?k=3224%2Fpages%2Funtitled-p7j7qt.jpg",
    btnClass: "bg-[#061f3b] text-white hover:bg-[#087dbd]",
    starCount: 3
  },
  {
    title: "Service Apartment",
    price: "Above ₹ 3,000 + Taxes",
    icon: Building2,
    badge: "Extended Stay",
    image: "https://w4u.in/api/r2-page-asset?k=3224%2Fpages%2Fimg-b8d638e8d3fc.jpg",
    btnClass: "bg-[#061f3b] text-white hover:bg-[#087dbd]",
    starCount: 0
  },
  {
    title: "Budget - Hotels",
    price: "Above ₹ 2,500 + Taxes",
    icon: Coins,
    badge: "Value Stay",
    image: "https://w4u.in/api/r2-page-asset?k=3224%2Fpages%2Frv-stay-x9pt75.jpg",
    btnClass: "bg-[#061f3b] text-white hover:bg-[#087dbd]",
    starCount: 0
  },
  {
    title: "Artha Stays - PG House",
    price: "Above ₹ 1,500 + Taxes",
    icon: Bed,
    badge: "Paying Guest",
    image: "https://w4u.in/api/r2-page-asset?k=3224%2Fpages%2Fartha-mhurs8.jpg",
    btnClass: "bg-[#061f3b] text-white hover:bg-[#087dbd]",
    starCount: 0
  }
];

// Reusing helper icons or aliases since Compass and Settings were used
import { Compass, Settings } from "lucide-react";

export default function Events() {
  return (
    <div className="bg-[#f5f9fc] text-[#122b42]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#062b50] px-5 py-24 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(215,181,109,.15),transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]">
            <Sparkles className="size-4 animate-pulse" /> Events & Services
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">
            We Make Events To Remember
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            We are here to create memorable and successful events that exceed our client's expectations, nurture relationships, and delight the senses.
          </p>
        </div>
      </section>

      {/* Welcome & Philosophy Section */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[.25em] text-[#087fbe]">Explore our expert</span>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-snug text-[#062b50] md:text-5xl">
              Welcome To Booking Hospitality Events & Services!
            </h2>
            <p className="mt-6 text-lg font-medium text-[#087dbd]">
              We take the responsibility of making your dream a reality!
            </p>
            <p className="mt-4 leading-7 text-black/60">
              We are here to create memorable and successful events that exceed our client’s expectations, nurture relationships and delight the senses – one client, one event, one experience at a time.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white p-2 shadow-lg">
            <img 
              src="https://w4u.in/api/r2-page-asset?k=3224%2Fpages%2Fimagessa-f6cabu.jpg" 
              alt="Welcome to Booking Hospitality Events" 
              className="w-full h-auto rounded-[1.7rem] block" 
            />
          </div>
        </div>
      </section>

      {/* Conference Section: ICAAMS 2023 */}
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="border border-black/10 rounded-[2.5rem] bg-white p-6 md:p-12 shadow-sm overflow-hidden">
          {/* Official ICAAMS Banner Image */}
          <div className="w-full rounded-2xl overflow-hidden mb-10 border border-black/5">
            <img 
              src="https://w4u.in/api/r2-page-asset?k=3224%2Fpages%2Ficaams20233-mzcdc4.jpg" 
              alt="ICAAMS 2023 Banner" 
              className="w-full h-auto block"
            />
          </div>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e5f5fc] px-4 py-1.5 text-xs font-semibold text-[#087dbd]">
              <Award className="size-3.5" /> Conference Program Now Available!
            </span>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[#062b50]">
              The First International Conference on Advanced Air Mobility Systems (ICAAMS)
            </h2>
            <p className="mt-6 leading-8 text-black/60 text-justify">
              Organized by the Vertical Flight Society's Asia-Australia Region and Rotary Wing Society of India (RWSI) with the support of the VFS Australia Chapter. The event brings together global aerospace leaders at the <strong>Yelahanka Air Force Station</strong> in Bengaluru, India.
            </p>
          </div>

          {/* Schedule & Venue Metadata */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 border-t border-black/5 pt-8">
            <div className="flex gap-4">
              <CalendarDays className="size-6 text-[#087dbd] shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-[#062b50]">Conference Schedule</h3>
                <p className="text-sm text-black/55 mt-1">December 4-6, 2023</p>
                <p className="text-xs text-[#087dbd] mt-1 font-semibold">Includes VTOL airspace workshop on Dec 6th</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="size-6 text-[#087dbd] shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-[#062b50]">Event Location</h3>
                <p className="text-sm text-black/55 mt-1">Yelahanka Air Force Station</p>
                <p className="text-xs text-black/55">Bengaluru, India</p>
              </div>
            </div>
            <div className="flex gap-4 md:col-span-2 lg:col-span-1">
              <Building2 className="size-6 text-[#087dbd] shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-[#062b50]">Hosted Capabilities</h3>
                <p className="text-sm text-black/55 mt-1">Advanced Air Mobility Systems</p>
                <p className="text-xs text-black/55">Delegations, technical panels & MROs</p>
              </div>
            </div>
          </div>

          {/* Subdisciplines Grid */}
          <div className="mt-16">
            <h3 className="font-serif text-2xl font-semibold mb-8 text-[#062b50]">
              Subdisciplines of Aerospace & Aviation Covered:
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subdisciplines.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.title + "-" + idx} className="p-6 rounded-2xl border border-black/[0.05] bg-[#edf6fc]/40 hover:border-[#087dbd]/30 transition duration-300">
                    <span className="inline-grid size-10 place-items-center rounded-xl bg-[#edf6fc] text-[#087dbd] mb-4">
                      <IconComponent className="size-5" />
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#062b50]">{item.title}</h4>
                    <p className="mt-2 text-xs text-black/55 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supporters */}
          <div className="mt-16 border-t border-black/5 pt-12">
            <h3 className="font-serif text-2xl font-semibold text-center mb-8 text-[#062b50]">
              Conference Supporters
            </h3>
            <div className="grid gap-6 sm:grid-cols-3">
              {supporters.map((sup) => (
                <div key={sup.name} className={`flex flex-col items-center justify-between text-center rounded-2xl bg-gradient-to-br ${sup.bg} border border-black/[0.02] p-6`}>
                  <div className="w-full h-28 flex items-center justify-center bg-white rounded-xl shadow-sm overflow-hidden p-3">
                    <img 
                      src={sup.image} 
                      alt={sup.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#062b50] mt-4">{sup.name}</h4>
                  <p className="text-[10px] text-black/50 mt-1 uppercase tracking-wide">{sup.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership Chairs */}
          <div className="mt-16 border-t border-black/5 pt-12">
            <h3 className="font-serif text-2xl font-semibold text-center mb-8 text-[#062b50]">
              Conference Chairs
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {chairs.map((chair) => (
                <div key={chair.name} className="bg-[#f8fafc] border border-black/[0.04] rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#087dbd] bg-[#e5f5fc] px-2 py-0.5 rounded-full">
                      {chair.role}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#062b50] mt-3">{chair.name}</h4>
                  </div>
                  <p className="mt-2 text-xs text-black/50 leading-relaxed border-t border-black/5 pt-2">
                    {chair.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Book Taxi Section */}
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-[#061f3b] to-[#07345d] border border-black/10 overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
            <div className="text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-[#13a5d8] bg-white/10 px-3 py-1 rounded-full">Explore Taxi desk</span>
              <h2 className="mt-4 font-serif text-4xl font-semibold">Book Taxi</h2>
              <p className="mt-3 text-white/70 leading-relaxed">
                Travel around the city at affordable prices with our professional, on-time taxi and cab services. Sourced for official visits and corporate travel.
              </p>
              <div className="mt-8">
                <Link href="/search?type=taxis" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#13a5d8] px-7 py-3.5 font-bold text-[#061f3b] shadow-lg transition hover:-translate-y-0.5 hover:brightness-110">
                  Book Now <Car className="size-4" />
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2">
              <img 
                src="https://w4u.in/api/r2-page-asset?k=3224%2Fpages%2Ftaxi-rental-amritsar-v26g85.jpg" 
                alt="Book Taxi Amritsar" 
                className="w-full h-auto rounded-xl block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hotel Rooms Section */}
      <section className="bg-white border-t border-b border-black/[0.03] py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[.25em] text-[#087fbe]">Accommodation Tariff Portal</span>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#062b50]">
              BOOK YOUR HOTEL ROOMS NOW
            </h2>
            <p className="mt-3 text-sm text-black/55">
              Select from our wide network of hotel categories, corporate lodging partners, and private guest houses.
            </p>
          </div>

          {/* Grid of Hotel Tier Cards */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hotelTiers.map((tier) => {
              const IconComponent = tier.icon;
              return (
                <div 
                  key={tier.title} 
                  className="flex flex-col overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white shadow-sm hover:shadow-md transition duration-300 group"
                >
                  {/* Image container */}
                  <div className="relative h-44 w-full overflow-hidden bg-black/5">
                    <img 
                      src={tier.image} 
                      alt={tier.title} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-4 right-4 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 text-[#087dbd] shadow-sm">
                      {tier.badge}
                    </span>
                    <span className="absolute bottom-4 left-4 grid size-10 place-items-center rounded-xl bg-white/90 text-[#087dbd] shadow-md">
                      <IconComponent className="size-5" />
                    </span>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#062b50] leading-snug">{tier.title}</h3>
                      
                      {/* Stars */}
                      {tier.starCount > 0 && (
                        <div className="flex gap-1 mt-2">
                          {Array.from({ length: tier.starCount }).map((_, i) => (
                            <Star key={i} className="size-3.5 fill-[#facc15] text-[#facc15]" />
                          ))}
                        </div>
                      )}

                      <div className="mt-4 border-t border-black/5 pt-4">
                        <p className="text-[10px] uppercase tracking-wider text-black/40">Tariff Estimate</p>
                        <p className="text-lg font-extrabold text-[#062b50] mt-0.5">{tier.price}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link 
                        href={`/search?type=hotels&destination=${encodeURIComponent(tier.title)}`}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-sm transition-all duration-300 ${tier.btnClass}`}
                      >
                        Book Now <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-14 text-center">
            <a 
              href="https://drive.google.com/file/d/1TdFpH6tO7_fgW2PqRBnmTBtn5Nubssu3/view?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 rounded-full border border-[#087dbd] px-6 py-3 font-bold text-[#087dbd] transition hover:bg-[#edf6fc]"
            >
              <Award className="size-4" /> Download Hotel Tariff Card
            </a>
          </div>
        </div>
      </section>

      {/* Event Enquiry Call to Action */}
      <section className="bg-[#061f3b] text-white py-20 text-center px-5">
        <div className="mx-auto max-w-3xl">
          <Users className="mx-auto size-10 text-[#13a5d8] mb-6" />
          <h2 className="font-serif text-4xl leading-tight">
            Plan your next event with BHLI
          </h2>
          <p className="mt-4 text-white/60 leading-7">
            From conference logistics to flight bookings and hotel reservation support, we manage everything so you can focus on the experience.
          </p>
          <div className="mt-8">
            <Link href="/contact-us?enquiry=event" className="inline-flex items-center gap-2 rounded-full bg-[#13a5d8] px-7 py-3.5 font-bold text-[#061f3b] transition hover:-translate-y-0.5 hover:brightness-110">
              Start an Enquiry <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
