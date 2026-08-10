import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { consultancyServices, getConsultancyService } from "@/lib/hotel-consultancy";
import HotelConsultancyForm from "@/components/HotelConsultancyForm";

type PageProps = { params: Promise<{ service: string }> };

const detailVisuals: Record<string, { src: string; alt: string }[]> = {
  "concept-development": [
    { src: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Hospitality concept planning workshop" },
    { src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Creative brand development meeting" },
    { src: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Commercial strategy presentation" },
  ],
  "pre-opening-projects": [
    { src: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Hospitality project planning and construction" },
    { src: "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Operations readiness meeting" },
    { src: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Hotel prepared for opening" },
  ],
  "marketing-support": [
    { src: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Marketing team planning a campaign" },
    { src: "https://images.pexels.com/photos/6476595/pexels-photo-6476595.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Digital marketing channel planning" },
    { src: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Hospitality performance reporting" },
  ],
  "people-and-training": [
    { src: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Hospitality staff training session" },
    { src: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Professional learning resources" },
    { src: "https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Hospitality advisory meeting" },
    { src: "https://images.pexels.com/photos/4252137/pexels-photo-4252137.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Chef developing regional cuisine" },
  ],
  "food-beverage-controls": [
    { src: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Restaurant menu performance and presentation" },
    { src: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Food and beverage cost control review" },
    { src: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Hospitality systems and reporting" },
  ],
  "business-analysis": [
    { src: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Business performance analysis" },
    { src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Hospitality transformation planning" },
    { src: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200", alt: "Ongoing business advisory session" },
  ],
};

export function generateStaticParams() {
  return consultancyServices.map(({ slug }) => ({ service: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getConsultancyService(slug);
  return service ? { title: `${service.detailTitle || service.title} | BHLI Hotel Consultancy`, description: service.summary } : {};
}

export default async function ConsultancyServiceDetail({ params }: PageProps) {
  const { service: slug } = await params;
  const service = getConsultancyService(slug);
  if (!service) notFound();

  const currentIndex = consultancyServices.findIndex((item) => item.slug === service.slug);
  const nextService = consultancyServices[(currentIndex + 1) % consultancyServices.length];
  const visuals = detailVisuals[service.slug] || [];

  return (
    <div className="min-h-screen bg-[#f4f8fb] text-[#122b42]">
      <section className="relative isolate min-h-[520px] overflow-hidden bg-[#061f3b] px-5 pb-20 pt-10 text-white lg:px-8 lg:pb-28">
        <Image src={service.image} alt="" fill priority unoptimized sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#04182e]/95 via-[#062b50]/88 to-[#062b50]/30" />
        <div className="mx-auto max-w-7xl">
          <Link href="/services/hotel-consultancy" className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 hover:text-white"><ArrowLeft className="size-4" />All consultancy services</Link>
          <div className="mt-16 max-w-4xl">
            <p className="text-xs font-extrabold uppercase tracking-[.28em] text-[#28b8e8]">{service.number} · {service.eyebrow}</p>
            <h1 className="mt-5 font-serif text-5xl leading-none sm:text-6xl lg:text-8xl">{service.detailTitle || service.title}</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">{service.introduction}</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-5 lg:px-8">
        <div className="grid overflow-hidden rounded-[1.75rem] border border-white/60 bg-white shadow-[0_22px_65px_rgba(6,43,80,.16)] sm:grid-cols-3">
          {[`${service.sections.length} focused modules`, "Practical deliverables", "Tailored to your project"].map((item, index) => (
            <div key={item} className="flex items-center gap-4 border-b border-slate-100 px-6 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e6f7fd] text-xs font-extrabold text-[#087fbe]">{String(index + 1).padStart(2, "0")}</span>
              <p className="text-sm font-bold text-[#173c58]">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <main className="relative overflow-hidden">
        <div className="absolute left-0 top-32 size-96 rounded-full bg-[#13a5d8]/5 blur-3xl" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[.48fr_1.52fr] lg:px-8 lg:py-24">
          <aside>
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-extrabold uppercase tracking-[.24em] text-[#087fbe]">What we deliver</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight">A practical scope built around your project.</h2>
              <p className="mt-5 text-sm leading-7 text-slate-600">We tailor the depth, sequence and deliverables to your stage of development and internal capability.</p>
              <Link href="#consultancy-request" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#087fbe] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#087fbe]/20 hover:-translate-y-0.5 hover:bg-[#07345d]">Request consultancy <ArrowRight className="size-4" /></Link>

              <nav aria-label="Hotel consultancy services" className="mt-9 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:block">
                {consultancyServices.map((item) => (
                  <Link key={item.slug} href={`/services/hotel-consultancy/${item.slug}`} className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold transition ${item.slug === service.slug ? "bg-[#07345d] text-white" : "text-slate-500 hover:bg-[#eef8fc] hover:text-[#087fbe]"}`}>
                    <span className="line-clamp-1">{item.title}</span><ChevronRight className="size-3.5 shrink-0" />
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <div className="space-y-7">
            {service.sections.map((section, index) => (
              <article key={section.title} className="group grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(6,55,92,.08)] lg:grid-cols-[.78fr_1.22fr]">
                <div className={`relative min-h-64 overflow-hidden lg:min-h-[350px] ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  {visuals[index] ? <Image src={visuals[index].src} alt={visuals[index].alt} fill unoptimized sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" /> : <div className="absolute inset-0 bg-gradient-to-br from-[#07345d] to-[#13a5d8]" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04182e]/75 via-transparent to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-[#061f3b]/55 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.18em] text-white backdrop-blur">Service module</span>
                  <span className="absolute bottom-5 left-5 font-serif text-6xl leading-none text-white/90">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className={`flex flex-col justify-center p-6 sm:p-8 lg:p-10 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#087fbe]">{service.detailTitle || service.title}</p>
                  <h3 className="mt-3 font-serif text-3xl leading-tight lg:text-4xl">{section.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">{section.description}</p>
                  <ul className="mt-5 grid gap-3">
                    {section.points.map((point) => <li key={point} className="flex items-start gap-3 text-sm leading-6 text-slate-700"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#e6f7fd] text-[#087fbe]"><Check className="size-3" /></span>{point}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <section className="border-t border-slate-200 bg-white px-5 py-12 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#087fbe]">Next service</p><h2 className="mt-2 font-serif text-3xl">{nextService.title}</h2></div>
          <Link href={`/services/hotel-consultancy/${nextService.slug}`} className="inline-flex items-center gap-2 text-sm font-extrabold text-[#087fbe]">Explore service <ChevronRight className="size-4" /></Link>
        </div>
      </section>

      <HotelConsultancyForm
        selectedServiceSlug={service.slug}
        selectedServiceTitle={service.detailTitle || service.title}
      />
    </div>
  );
}
