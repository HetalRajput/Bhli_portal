import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, BriefcaseBusiness, ChefHat, Lightbulb, Megaphone, UsersRound } from "lucide-react";
import { consultancyServices } from "@/lib/hotel-consultancy";
import ServiceRatings from "@/components/ServiceRatings";

const icons = [Lightbulb, BriefcaseBusiness, Megaphone, UsersRound, ChefHat, BarChart3];

export default function HotelConsultancyPage() {
  return (
    <div className="bg-[#f4f8fb] text-[#122b42]">
      <section className="relative isolate min-h-[500px] overflow-hidden bg-[#061f3b] px-5 py-20 text-white lg:px-8 lg:py-28">
        <Image src="https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1800" alt="Hospitality consultants planning a project" fill priority unoptimized sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#051d37]/95 via-[#062b50]/88 to-[#062b50]/35" />
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-extrabold uppercase tracking-[.28em] text-[#28b8e8]">BHLI Hotel Consultancy</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[.98] sm:text-6xl lg:text-8xl">Ideas shaped into remarkable hospitality businesses.</h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">From concept and pre-opening planning to people, controls and business transformation, our specialists help hospitality projects open well and perform with confidence.</p>
          <Link href="#consultancy-services" className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#13a5d8] px-6 py-3.5 text-sm font-extrabold text-[#061f3b] shadow-lg shadow-black/15 hover:bg-white">Explore our expertise <ArrowRight className="size-4" /></Link>
        </div>
      </section>

      <section id="consultancy-services" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.24em] text-[#087fbe]">Our services</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Expert support at every stage.</h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-600 lg:justify-self-end">Choose a service to see its complete scope. Each engagement is adapted to the property, market, brand and commercial outcome you want to achieve.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {consultancyServices.map((service, index) => {
            const Icon = icons[index];
            return (
              <article key={service.slug} className="group flex min-h-[470px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(6,55,92,.07)]">
                <div className="relative h-52 overflow-hidden">
                  <Image src={service.image} alt="" fill unoptimized sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061f3b]/75 to-transparent" />
                  <span className="absolute bottom-4 left-5 grid size-12 place-items-center rounded-2xl bg-white text-[#087fbe] shadow-xl"><Icon className="size-6" /></span>
                  <span className="absolute right-5 top-4 font-serif text-3xl text-white/75">{service.number}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#087fbe]">{service.eyebrow}</p>
                  <h3 className="mt-3 font-serif text-3xl leading-none">{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{service.summary}</p>
                  <Link href={`/services/hotel-consultancy/${service.slug}`} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-extrabold text-[#087fbe]">Know More <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <ServiceRatings serviceSlug="hotel-consultancy" />

      <section className="bg-[#07345d] px-5 py-16 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div><p className="text-xs font-extrabold uppercase tracking-[.24em] text-[#28b8e8]">Plan your project</p><h2 className="mt-3 max-w-3xl font-serif text-4xl">Let’s turn your hospitality vision into a working plan.</h2></div>
          <Link href="/contact-us" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-[#07345d] hover:bg-[#13a5d8]">Start a conversation <ArrowRight className="size-4" /></Link>
        </div>
      </section>
    </div>
  );
}
