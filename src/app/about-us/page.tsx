import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Target,
  Users,
  Mail,
  Quote,
  Star,
} from "lucide-react";
import { cmsService, type GalleryAlbum, type GalleryCategory, type Testimonial } from "@/lib/api/cms";
import TeamAvatar from "@/components/TeamAvatar";
import AboutGallerySlider from "@/components/AboutGallerySlider";

interface TeamMember {
  id: number;
  name: string;
  slug: string;
  designation: string;
  subtitle?: string;
  bio?: string;
  photo?: string | null;
  email?: string;
  linkedin_url?: string;
}

const PROFILE_ICON_PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23edf6fc' stroke='%23087dbd' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='11' fill='%23edf6fc'/><path d='M18 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 6 18.5V20' fill='none'/><circle cx='12' cy='8.5' r='3.5' fill='%23087dbd' stroke='none'/></svg>";

const fallbackTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Mazher Ul Huq",
    slug: "mazher-ul-huq",
    designation: "CEO & Founder",
    photo: null,
  },
  {
    id: 2,
    name: "Waseem Ahmed",
    slug: "waseem-ahmed",
    designation: "Chief Finance Officer",
    photo: null,
  },
  {
    id: 6,
    name: "Javed Rashid",
    slug: "javed-rashid",
    designation: "Director of Technology",
    photo:
      "https://bhli-project-images.s3.eu-north-1.amazonaws.com/bhli-main-folder/team/javed-rashid-90d00aaff17641298cff87c4d1a94f5e.jpeg",
  },
  {
    id: 16,
    name: "Devender Singh",
    slug: "devender-singh",
    designation: "Advisor",
    photo:
      "https://bhli-project-images.s3.eu-north-1.amazonaws.com/bhli-main-folder/team/devinder-singh-7f416d0937554466b679265ab002b53e.jpeg",
  },
];

export default async function About() {
  let teamMembers: TeamMember[] = [];
  let testimonials: Testimonial[] = [];
  let galleryAlbums: GalleryAlbum[] = [];
  let galleryCategories: GalleryCategory[] = [];
  try {
    const res = await cmsService.getTeam();
    console.log("About Page - Team API Response:", res);
    if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
      teamMembers = res.data;
    } else if (Array.isArray(res) && res.length > 0) {
      teamMembers = res;
    }
  } catch (err) {
    console.error("Failed to fetch team members for About page:", err);
  }

  try {
    testimonials = (await cmsService.getTestimonials())
      .filter((testimonial) => testimonial.is_active)
      .sort((a, b) => a.display_order - b.display_order);
  } catch (err) {
    console.error("Failed to fetch testimonials for About page:", err);
  }

  try {
    [galleryAlbums, galleryCategories] = await Promise.all([
      cmsService.getGallery(),
      cmsService.getGalleryCategories(),
    ]);
    galleryAlbums = galleryAlbums.filter((album) => album.is_active).sort((a, b) => a.display_order - b.display_order);
    galleryCategories = galleryCategories.filter((category) => category.is_active !== false).sort((a, b) => a.display_order - b.display_order);
  } catch (err) {
    console.error("Failed to fetch gallery for About page:", err);
  }

  const displayTeam = teamMembers.length > 0 ? teamMembers : fallbackTeamMembers;

  return (
    <div className="bg-[#f5f9fc] text-[#122b42]">
      {/* Hero Section */}
      <section className="relative grid min-h-[620px] items-end overflow-hidden bg-[#07345d] text-white">
        <img
          src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1800"
          alt="Professional hospitality team"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#051b33] via-[#051b33]/55 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]">
            About BHLI LLP
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-tight md:text-7xl">
            Built on trust. Designed for journeys that matter.
          </h1>
        </div>
      </section>

      {/* Who We Are */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.22em] text-[#087fbe]">
            Who we are
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">
            Hospitality with purpose, travel with precision.
          </h2>
        </div>
        <div className="space-y-5 leading-8 text-black/60">
          <p>
            Established in 2020 by seasoned hospitality professionals, Booking
            Hospitality & Leisure Infra LLP is a one-stop travel management
            company covering hotels, resorts, service apartments, holidays,
            catering, events, car rentals and travel assistance.
          </p>
          <p>
            Our network includes 7,500+ domestic and international hotels and
            service apartments, supported through channel partners in Bengaluru,
            Mumbai, Delhi, Chennai and other major cities.
          </p>
          <p>
            Our team brings experience across leading hospitality brands and
            focuses on business travel, leisure travel, group meetings and
            dependable guest service.
          </p>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-20 md:grid-cols-3 lg:px-8">
          {[
            [
              Compass,
              "Our vision",
              "To become India's most trusted integrated travel and hospitality partner.",
            ],
            [
              Target,
              "Our mission",
              "To make every journey seamless, compliant and genuinely well cared for.",
            ],
            [
              HeartHandshake,
              "Our values",
              "Trust, respect, clarity, accountability and service before self.",
            ],
          ].map(([Icon, title, desc]) => {
            const IconComponent = Icon as any;
            return (
              <div key={String(title)} className="rounded-3xl bg-[#edf6fb] p-8">
                <IconComponent className="size-8 text-[#087fbe]" />
                <h3 className="mt-8 font-serif text-3xl">{String(title)}</h3>
                <p className="mt-4 text-sm leading-7 text-black/55">
                  {String(desc)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose BHLI */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <img
            src="https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Travel consultant"
            className="h-[520px] w-full rounded-[2rem] object-cover"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#087fbe]">
              Why choose BHLI
            </p>
            <h2 className="mt-4 font-serif text-4xl">
              One standard: dependable excellence.
            </h2>
            <div className="mt-8 grid gap-5">
              {[
                "Dedicated desks for specialised travel needs",
                "Pan-India partner and service network",
                "Policy-aware planning for official journeys",
                "Responsive human support when plans change",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 border-b border-black/10 pb-5"
                >
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-[#087fbe]" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
            <Link
              href="/contact-us"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#07345d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#087fbe]"
            >
              Meet our approach <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <AboutGallerySlider categories={galleryCategories} albums={galleryAlbums} />

      {/* Dynamic Team Section (Integrated from Team API) */}
      <section className="bg-white px-5 py-12 lg:px-8 border-t border-black/5 relative overflow-hidden">
        <div className="mx-auto max-w-7xl">
          {/* Header & View All CTA */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#087fbe]">
                <Users className="size-4 text-[#087fbe]" /> Leadership & Operations
              </p>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl font-semibold text-[#062b50]">
                The Experts Behind Every Journey
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
                From hospitality specialists to travel desk professionals, our dedicated team combines experience, responsiveness, and local knowledge to deliver seamless experiences.
              </p>
            </div>
            <Link
              href="/our-team"
              className="inline-flex items-center gap-2 shrink-0 rounded-full bg-[#062b50] px-6 py-3 text-xs font-bold text-white transition-all duration-300 hover:bg-[#087fbe] hover:shadow-lg"
            >
              Explore All Members <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Quick Feature Badges Bar */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl bg-[#f0f7fc] p-3 border border-[#dce9f5]">
            <div className="flex items-center gap-3 justify-center text-center sm:text-left">
              <CheckCircle2 className="size-5 text-[#087fbe] shrink-0" />
              <span className="text-xs font-bold text-[#062b50] tracking-wide">Dedicated Help Desks</span>
            </div>
            <div className="flex items-center gap-3 justify-center text-center sm:text-left">
              <CheckCircle2 className="size-5 text-[#087fbe] shrink-0" />
              <span className="text-xs font-bold text-[#062b50] tracking-wide">Pan-India Support Network</span>
            </div>
            <div className="flex items-center gap-3 justify-center text-center sm:text-left">
              <CheckCircle2 className="size-5 text-[#087fbe] shrink-0" />
              <span className="text-xs font-bold text-[#062b50] tracking-wide">100% Policy Compliant</span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayTeam.slice(0, 8).map((member) => (
              <div
                key={member.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-black/10 bg-[#f8fafc] p-6 transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1 hover:border-[#087dbd]/30 overflow-hidden"
              >
                {/* Decorative Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#062b50] via-[#087dbd] to-[#13a5d8] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="relative mb-5 flex items-center justify-center">
                    <TeamAvatar photo={member.photo} name={member.name} />
                  </div>

                  <div className="text-center">
                    <h3 className="font-serif text-xl font-bold text-[#062b50] group-hover:text-[#087fbe] transition-colors">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#087fbe]">
                      {member.designation}
                    </p>
                    {member.subtitle && (
                      <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-widest text-[#087dbd] bg-[#087dbd]/8 px-2.5 py-0.5 rounded-full">
                        {member.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 border-t border-black/5 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {member.email ? (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 rounded-full bg-white border border-black/5 text-[#087dbd] hover:bg-[#087dbd] hover:text-white transition-all shadow-xs"
                        title="Send Email"
                      >
                        <Mail className="size-3.5" />
                      </a>
                    ) : null}
                  </div>

                  <Link
                    href="/our-team"
                    className="text-xs font-bold text-[#087dbd] hover:text-[#062b50] flex items-center gap-1 transition-colors"
                  >
                    View Profile <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="bg-[#edf6fb] px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[.22em] text-[#087fbe]">Client testimonials</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">Trusted by the people we serve.</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article key={testimonial.id} className="flex h-full flex-col rounded-3xl border border-black/5 bg-white p-7 shadow-sm">
                  <Quote className="size-8 text-[#13a5d8]" />
                  <div className="mt-5 flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star key={index} className={`size-4 ${index < Math.min(5, Math.max(0, testimonial.rating)) ? "fill-[#f4b942] text-[#f4b942]" : "text-black/15"}`} />
                    ))}
                  </div>
                  <blockquote className="mt-5 flex-1 text-base leading-8 text-black/60">“{testimonial.message}”</blockquote>
                  <footer className="mt-7 border-t border-black/10 pt-5">
                    <p className="font-bold text-[#062b50]">{testimonial.name}</p>
                    {(testimonial.designation || testimonial.organization) && <p className="mt-1 text-sm text-black/45">{[testimonial.designation, testimonial.organization].filter(Boolean).join(" · ")}</p>}
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call To Action */}
      <section className="bg-[#07345d] px-5 py-20 text-center text-white">
        <ShieldCheck className="mx-auto size-9 text-[#13a5d8]" />
        <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl">
          Every detail handled with the respect your journey deserves.
        </h2>
        <Link
          href="/contact-us"
          className="mt-8 inline-block rounded-full bg-[#13a5d8] px-7 py-3 font-bold text-[#061f3b] transition hover:bg-white"
        >
          Start a conversation
        </Link>
      </section>
    </div>
  );
}


