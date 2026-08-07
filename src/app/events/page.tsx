import Link from "next/link";
import UpcomingEventCard from "@/components/UpcomingEventCard";
import { cmsService } from "@/lib/api/cms";
import {
  ArrowRight,
  Award,
  Building2,
  CalendarDays,
  CheckCircle2,
  Footprints,
  MapPin,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

type EventData = {
  id?: number | string;
  title?: string;
  subtitle?: string;
  description?: string;
  location?: string;
  venue?: string;
  event_date?: string;
  start_date?: string;
  banner_image?: string | null;
};

const completedEvents = [
  {
    number: "01",
    title: "Subroto Cup",
    category: "Football tournament",
    description: "Travel, accommodation and hospitality coordination for teams, officials and invited guests.",
    icon: Trophy,
    accent: "bg-[#13a5d8]",
    logo: "/Asset/clients/event1.jpg",
  },
  {
    number: "02",
    title: "Marshal Arjan Singh Hockey Cup",
    category: "Hockey tournament",
    description: "Coordinated stays, local movement and guest support throughout the sporting programme.",
    icon: Award,
    accent: "bg-[#e7ad38]",
    logo: "/Asset/clients/event2.png",
  },
  {
    number: "03",
    title: "Run Samwad",
    category: "Community sporting event",
    description: "Participant-focused hospitality and responsive on-ground coordination for a smooth event experience.",
    icon: Footprints,
    accent: "bg-[#38b98b]",
    logo: "/Asset/clients/event3.png",
  },
  {
    number: "04",
    title: "ICAAMS",
    category: "International conference",
    description: "Hospitality support for the First International Conference on Advanced Air Mobility Systems.",
    icon: MessageCircle,
    accent: "bg-[#8b7bd8]",
    logo: "/Asset/clients/badge_of_the_indian_air_force.svg-qqwm2n.png",
  },
];

const capabilities = [
  [Building2, "Accommodation desk", "Curated rooms, negotiated rates and rooming-list coordination."],
  [Plane, "Travel & transfers", "Flight assistance, airport transfers and local movement planning."],
  [Users, "Delegation support", "A single coordination point for teams, speakers, officials and VIP guests."],
  [ShieldCheck, "On-ground assistance", "Responsive help throughout arrivals, the event programme and departures."],
] as const;

export default async function EventsPage() {
  let apiEvents: EventData[] = [];
  try {
    const response = await cmsService.getEvents() as unknown as { success?: boolean; data?: EventData[] } | EventData[];
    if (Array.isArray(response)) apiEvents = response;
    else if (response.success && Array.isArray(response.data)) apiEvents = response.data;
  } catch {
    // The curated event portfolio remains available if the API is offline.
  }

  return (
    <div className="bg-[#f4f8fb] text-[#122b42]">
      {/* Upcoming event first */}
      <section className="relative isolate overflow-hidden bg-[#061f3b] px-5 py-16 text-white lg:px-8 lg:py-20">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_76%_30%,rgba(19,165,216,.24),transparent_32%),radial-gradient(circle_at_15%_80%,rgba(231,173,56,.12),transparent_30%)]" />
        <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:54px_54px]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#f0ba4f]"><Sparkles className="size-4" />Upcoming event</p>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.02] md:text-7xl">Plan ahead for <span className="text-[#5bc6ea]">Aero India 2027.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65">BHLI coordinates accommodation, airport transfers, delegation movement and complete hospitality support for visitors, exhibitors and officials in Bengaluru.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact-us?enquiry=aero-india-2027" className="inline-flex items-center gap-2 rounded-full bg-[#13a5d8] px-6 py-3.5 font-bold text-[#061f3b]">Start planning <ArrowRight className="size-4" /></Link>
              <a href="#completed-events" className="rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white/85 transition hover:bg-white/10">View our work</a>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end"><UpcomingEventCard /></div>
        </div>
      </section>

      {/* Completed portfolio */}
      <section id="completed-events" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.24em] text-[#087fbe]">Selected portfolio</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#062b50] md:text-5xl">Events we have delivered</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#607789]">A track record spanning national sporting competitions, community experiences and specialist international conferences.</p>
          </div>
          <span className="w-fit rounded-full border border-[#087fbe]/15 bg-[#e8f5fb] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#087fbe]">4 featured events</span>
        </div>

        <div className="mt-10 flex snap-x gap-5 overflow-x-auto pb-5 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {completedEvents.map((event) => {
            const Icon = event.icon;
            return (
              <article key={event.title} className="group min-w-[280px] snap-start overflow-hidden rounded-3xl border border-black/[.07] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:min-w-0">
                <div className="flex items-start justify-between">
                  {event.logo ? (
                    <div className="flex h-16 w-32 items-center justify-start">
                      <img src={event.logo} alt={`${event.title} logo`} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                    </div>
                  ) : (
                    <span className={`grid size-12 place-items-center rounded-2xl ${event.accent} text-[#061f3b] shrink-0`}><Icon className="size-6" /></span>
                  )}
                  <span className="font-serif text-4xl text-[#062b50]/10 shrink-0">{event.number}</span>
                </div>
                <p className="mt-7 text-[10px] font-bold uppercase tracking-[.18em] text-[#087fbe]">{event.category}</p>
                <h3 className="mt-2 min-h-14 font-serif text-2xl font-semibold leading-tight text-[#062b50]">{event.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#607789]">{event.description}</p>
                <div className="mt-6 h-1 w-10 rounded-full bg-[#13a5d8] transition-all group-hover:w-20" />
              </article>
            );
          })}
        </div>
      </section>

      {/* ICAAMS spotlight */}
      <section className="bg-white px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.25rem] border border-black/[.06] bg-[#edf7fb] lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#1767ad] to-[#06345d] p-5 md:p-8 lg:min-h-[420px]">
            <img src="https://w4u.in/api/r2-page-asset?k=3224%2Fpages%2Ficaams20233-mzcdc4.jpg" alt="ICAAMS conference banner" className="max-h-[340px] w-full rounded-2xl object-contain shadow-[0_18px_45px_rgba(0,20,50,.25)]" />
            <span className="absolute bottom-4 left-4 rounded-full bg-[#13a5d8] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#061f3b] md:bottom-6 md:left-6 md:text-xs">Conference spotlight</span>
          </div>
          <div className="flex flex-col justify-center p-7 md:p-12">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#087fbe]">ICAAMS · Bengaluru</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[#062b50]">The First International Conference on Advanced Air Mobility Systems</h2>
            <p className="mt-6 text-sm leading-7 text-[#587083]">A specialist gathering connecting aerospace leaders, technical experts and industry stakeholders across advanced air mobility, aviation systems and future flight operations.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {["Delegate accommodation", "Airport and venue transfers", "Speaker and VIP assistance", "Central coordination desk"].map((item) => <p key={item} className="flex items-center gap-2 text-sm font-semibold text-[#294a63]"><CheckCircle2 className="size-5 shrink-0 text-[#087fbe]" />{item}</p>)}
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-[#587083]"><span className="flex items-center gap-2"><MapPin className="size-4 text-[#087fbe]" />Bengaluru, India</span><span className="flex items-center gap-2"><CalendarDays className="size-4 text-[#b47500]" />International conference</span></div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-[#062b50] px-5 py-20 text-white lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.24em] text-[#f0ba4f]">One accountable event desk</p><h2 className="mt-4 font-serif text-4xl font-semibold md:text-5xl">Hospitality support around the entire event</h2><p className="mt-5 text-sm leading-7 text-white/60">From the first arrival to the final departure, one team coordinates the practical details.</p></div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{capabilities.map(([Icon, title, description]) => <article key={title} className="rounded-3xl border border-white/10 bg-white/[.06] p-6"><span className="grid size-11 place-items-center rounded-xl bg-[#13a5d8] text-[#062b50]"><Icon className="size-5" /></span><h3 className="mt-6 font-serif text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{description}</p></article>)}</div>
        </div>
      </section>

      {/* Additional events from CMS */}
      {apiEvents.length > 0 && <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"><p className="text-xs font-bold uppercase tracking-[.24em] text-[#087fbe]">More from our portfolio</p><h2 className="mt-3 font-serif text-4xl font-semibold text-[#062b50]">Other notable events</h2><div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{apiEvents.map((event, index) => <article key={event.id ?? `${event.title}-${index}`} className="overflow-hidden rounded-3xl border border-black/[.07] bg-white shadow-sm">{event.banner_image && <img src={event.banner_image} alt={event.title || "Event"} className="h-48 w-full object-cover" />}<div className="p-6"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#087fbe]">{event.location || "Coordinated event"}</p><h3 className="mt-2 font-serif text-2xl font-semibold text-[#062b50]">{event.title || "Event"}</h3>{event.description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#607789]">{event.description}</p>}<div className="mt-5 flex flex-wrap gap-3 border-t border-black/[.06] pt-4 text-xs text-[#607789]">{(event.event_date || event.start_date) && <span className="flex items-center gap-1.5"><CalendarDays className="size-4 text-[#087fbe]" />{event.event_date || event.start_date}</span>}{event.venue && <span className="flex items-center gap-1.5"><MapPin className="size-4 text-[#087fbe]" />{event.venue}</span>}</div></div></article>)}</div></section>}

      {/* CTA */}
      <section className="bg-[#e8f5fb] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 text-center shadow-[0_20px_60px_rgba(6,43,80,.1)] md:p-12">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#062b50] text-[#13a5d8]"><Users className="size-7" /></span>
          <h2 className="mt-6 font-serif text-4xl font-semibold text-[#062b50] md:text-5xl">Planning your next event?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#607789]">Tell us the event, destination and expected scale. Our team will coordinate the next steps with you.</p>
          <Link href="/contact-us?enquiry=event" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#13a5d8] px-7 py-3.5 font-bold text-[#062b50]">Start an enquiry <ArrowRight className="size-4" /></Link>
        </div>
      </section>
    </div>
  );
}