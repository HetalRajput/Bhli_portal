import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Plane } from "lucide-react";

export default function UpcomingEventCard() {
  return (
    <article className="w-full max-w-[390px] overflow-hidden rounded-[1.75rem] border border-white/20 bg-white text-[#062b50] shadow-[0_25px_70px_rgba(0,15,35,.32)]">
      <div className="relative h-40 overflow-hidden bg-[#087fbe]">
        <img src="https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=900" alt="Aircraft representing Aero India 2027" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062b50]/75 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#062b50]/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur"><Plane className="size-3.5 text-[#f0ba4f]" />Upcoming event</span>
      </div>
      <div className="p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#b47500]">Aerospace · Defence</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold">Aero India <span className="text-[#087fbe]">2027</span></h2>
        <p className="mt-3 text-sm leading-6 text-[#587083]">Plan accommodation, transfers and hospitality support early with BHLI.</p>
        <div className="mt-5 grid gap-2 text-xs font-semibold text-[#496276]">
          <span className="flex items-center gap-2"><MapPin className="size-4 text-[#087fbe]" />Bengaluru, India</span>
          <span className="flex items-center gap-2"><CalendarDays className="size-4 text-[#b47500]" />Schedule to be announced</span>
        </div>
        <Link href="/contact-us?enquiry=aero-india-2027" className="mt-6 flex items-center justify-between rounded-xl bg-[#062b50] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#087fbe]">Plan your visit <ArrowUpRight className="size-4" /></Link>
      </div>
    </article>
  );
}