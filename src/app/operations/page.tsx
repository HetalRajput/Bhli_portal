import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Handshake, MessageSquareWarning } from "lucide-react";

const services = [
  { title: "Careers", description: "Explore current openings and apply to join our team.", href: "/careers", icon: BriefcaseBusiness },
  { title: "Complaint management", description: "Submit a complaint or feedback and receive a ticket reference.", href: "/complaints", icon: MessageSquareWarning },
  { title: "Onboarding management", description: "Register your organisation as a Booking Hospitality client or vendor.", href: "/onboarding", icon: Handshake },
];

export default function OperationsPage() {
  return <div className="bg-[#f5faff] px-5 py-20"><section className="mx-auto max-w-6xl"><p className="font-bold uppercase tracking-[.22em] text-[#087dbd]">Public services</p><h1 className="mt-3 font-serif text-5xl font-bold text-[#071f38]">Operations navigation</h1><p className="mt-4 max-w-2xl text-slate-600">Applications, onboarding and customer-care services in one place.</p><div className="mt-10 grid gap-5 md:grid-cols-3">{services.map(({ title, description, href, icon: Icon }) => <Link key={href} href={href} className="group rounded-3xl border border-sky-100 bg-white p-7 shadow-sm"><span className="grid size-12 place-items-center rounded-2xl bg-sky-50 text-[#087dbd]"><Icon /></span><h2 className="mt-6 text-2xl font-bold">{title}</h2><p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">{description}</p><span className="mt-5 flex items-center gap-2 font-bold text-[#087dbd]">Open page <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></Link>)}</div></section></div>;
}
