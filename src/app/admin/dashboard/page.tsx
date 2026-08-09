"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ClipboardList, MessageSquareWarning, Plane, ShieldCheck, Star, UserRound, UsersRound } from "lucide-react";
import { CRM_ACCESS_TOKEN_KEY } from "@/lib/api/crm";

const modules = [
  ["Team members", "Manage CRM access, roles and passwords.", "/admin/users-and-roles", UsersRound],
  ["Typed bookings", "Review and update every service booking type.", "/admin/bookings", ClipboardList],
  ["FTD flights", "Refresh, manage and cancel flight bookings.", "/admin/flights", Plane],
  ["Complaints", "Track feedback, priority and resolution status.", "/admin/complaints", MessageSquareWarning],
  ["Onboarding", "Review client and vendor applications.", "/admin/onboarding", UserRound],
  ["Ratings", "Approve reviews and manage public feedback.", "/admin/ratings", Star],
] as const;

export default function AdminDashboard() {
  const router = useRouter();
  useEffect(() => { if (!window.localStorage.getItem(CRM_ACCESS_TOKEN_KEY)) router.replace("/admin/login"); }, [router]);
  return <main className="min-h-screen bg-[#edf5f9]"><section className="bg-[#061f3b] px-5 py-16 text-white lg:px-8"><div className="mx-auto max-w-7xl"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-[#13a5d8]"><ShieldCheck className="size-4" />BHLI CRM</p><h1 className="mt-4 font-serif text-5xl">Operations dashboard</h1><p className="mt-4 max-w-2xl text-white/55">Manage the workflows introduced in today&apos;s API release from one secure workspace.</p></div></section><section className="mx-auto grid max-w-7xl gap-5 px-5 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">{modules.map(([title, description, href, Icon]) => <Link key={href} href={href} className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:-translate-y-1 hover:shadow-xl"><span className="grid size-12 place-items-center rounded-2xl bg-[#e6f7fd] text-[#087fbe]"><Icon /></span><h2 className="mt-5 font-serif text-3xl text-[#122b42]">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{description}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#087fbe]">Open module <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span></Link>)}</section></main>;
}
