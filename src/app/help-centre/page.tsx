"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  Handshake,
  MessageSquareWarning,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const pathways = [
  {
    number: "01",
    title: "Build your career",
    description: "Discover open roles and apply to help us create dependable journeys across India.",
    action: "View opportunities",
    href: "/careers",
    icon: BriefcaseBusiness,
    accent: "from-[#5f55c8] to-[#8678e8]",
    soft: "bg-violet-50 text-violet-700",
  },
  {
    number: "02",
    title: "Partner with BHLI",
    description: "Introduce your business and begin secure onboarding as a client or service partner.",
    action: "Start onboarding",
    href: "/onboarding",
    icon: Handshake,
    accent: "from-[#07966f] to-[#2bbf91]",
    soft: "bg-emerald-50 text-emerald-700",
  },
  {
    number: "03",
    title: "Feedback & resolution",
    description: "Share feedback or raise a concern and receive a reference number for follow-up.",
    action: "Submit feedback",
    href: "/complaints",
    icon: MessageSquareWarning,
    accent: "from-[#de6b42] to-[#ef9b55]",
    soft: "bg-orange-50 text-orange-700",
  },
];

const assurances = [
  { icon: Clock3, title: "Responsive support", text: "Requests are routed to the appropriate BHLI team." },
  { icon: ShieldCheck, title: "Secure submissions", text: "Application and onboarding documents are handled carefully." },
  { icon: BadgeCheck, title: "Clear follow-up", text: "Complaint submissions receive a trackable ticket reference." },
];

export default function HelpCentre() {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };
  return <div className="bg-[#f4f9fc] text-[#071f38]">
    <section className="relative overflow-hidden bg-[#061f3b] text-white">
      <div className="absolute -right-28 -top-36 size-[520px] rounded-full bg-[#13a5d8]/20 blur-3xl" />
      <div className="absolute -bottom-48 left-[18%] size-[430px] rounded-full bg-[#087dbd]/25 blur-3xl" />
      <div className="absolute inset-0 opacity-[.08] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:54px_54px]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-32 pt-20 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-8 lg:pb-36 lg:pt-24">
        <div>
          <div><button type="button" onClick={goBack} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white/80 backdrop-blur transition hover:border-white/40 hover:bg-white/20 hover:text-white" aria-label="Go back to the previous page"><ArrowLeft className="size-4" />Back</button></div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-sky-200"><Sparkles className="size-4" />Help & opportunities</div>
          <h1 className="mt-7 max-w-4xl font-serif text-5xl leading-[1.05] md:text-7xl">The right next step, all in one place.</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 md:text-lg">Whether you need travel support, want to work with us, are ready to become a partner, or need a concern resolved—we’ll help you move forward.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/complaints" className="inline-flex items-center gap-2 rounded-full bg-[#13a5d8] px-6 py-3.5 text-sm font-extrabold text-[#061f3b] shadow-lg shadow-sky-950/20 hover:-translate-y-0.5 hover:bg-white">Raise a request <ArrowRight className="size-4" /></Link>
            <Link href="/careers" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:border-white/40 hover:bg-white/10">Explore careers <ArrowUpRight className="size-4" /></Link>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="ml-auto max-w-sm rounded-[2rem] border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-xl">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#13a5d8] text-[#061f3b]"><Sparkles className="size-6" /></span>
            <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-sky-200">Choose with confidence</p>
            <h2 className="mt-2 font-serif text-3xl">Three clear pathways. One BHLI team.</h2>
            <div className="mt-6 space-y-3 text-sm text-white/65">
              {pathways.map(item => <div key={item.number} className="flex items-center gap-3 border-t border-white/10 pt-3"><span className="font-mono text-xs text-sky-300">{item.number}</span><span>{item.title}</span></div>)}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="relative z-10 mx-auto -mt-16 max-w-7xl px-5 lg:px-8">
      <div className="grid gap-5 md:grid-cols-3">
        {pathways.map(({ number, title, description, action, href, icon: Icon, accent, soft }) => <Link key={href} href={href} className="group relative flex min-h-[330px] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-7 shadow-[0_18px_50px_rgba(6,55,92,.09)] hover:-translate-y-2 hover:border-sky-200 hover:shadow-[0_26px_65px_rgba(6,55,92,.16)]">
          <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent}`} />
          <div className="flex items-start justify-between"><span className={`grid size-12 place-items-center rounded-2xl ${soft}`}><Icon className="size-6" /></span><span className="font-mono text-xs font-bold tracking-widest text-slate-300">{number}</span></div>
          <h2 className="mt-8 text-2xl font-extrabold tracking-tight text-[#071f38]">{title}</h2>
          <p className="mt-4 flex-1 text-sm leading-7 text-slate-500">{description}</p>
          <span className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5 text-sm font-extrabold text-[#087dbd]">{action}<span className="grid size-9 place-items-center rounded-full bg-sky-50 transition group-hover:translate-x-1 group-hover:bg-[#087dbd] group-hover:text-white"><ArrowRight className="size-4" /></span></span>
        </Link>)}
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="grid gap-10 rounded-[2rem] border border-sky-100 bg-white p-7 shadow-sm lg:grid-cols-[.75fr_1.25fr] lg:p-12">
        <div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#087dbd]">What to expect</p><h2 className="mt-4 font-serif text-4xl">A clearer way to get things done.</h2><p className="mt-4 text-sm leading-7 text-slate-500">Each pathway connects directly to a dedicated form or service area—no searching, no unnecessary steps.</p></div>
        <div className="grid gap-4 sm:grid-cols-3">{assurances.map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl bg-[#f4f9fc] p-5"><Icon className="size-6 text-[#087dbd]" /><h3 className="mt-5 font-extrabold">{title}</h3><p className="mt-2 text-xs leading-6 text-slate-500">{text}</p></div>)}</div>
      </div>
    </section>
  </div>;
}
