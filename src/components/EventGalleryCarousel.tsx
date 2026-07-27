"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Camera, Images } from "lucide-react";

const eventPhotos = Array.from({ length: 9 }, (_, index) => ({
  src: `/Asset/events/event-${String(index + 1).padStart(2, "0")}.jpg`,
  alt: `BHLI successfully organized event moment ${index + 1}`,
}));

export default function EventGalleryCarousel() {
  const [active, setActive] = useState(0);
  const previous = () => setActive((current) => (current - 1 + eventPhotos.length) % eventPhotos.length);
  const next = () => setActive((current) => (current + 1) % eventPhotos.length);

  useEffect(() => {
    const timer = window.setInterval(next, 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="overflow-hidden bg-[#f4f8fb] px-5 py-20 lg:px-8 lg:py-24" aria-labelledby="event-gallery-title">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-[#087fbe]"><Camera className="size-4" />Event moments</p>
            <h2 id="event-gallery-title" className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-[#062b50] md:text-5xl">Events successfully organized</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#607789]">A look at the people, coordination and experiences behind events supported by Booking Hospitality.</p>
          </div>
          <Link href="/events" className="inline-flex w-fit items-center gap-2 rounded-full border border-[#087fbe]/20 bg-white px-5 py-3 text-sm font-bold text-[#087fbe] transition hover:bg-[#087fbe] hover:text-white">Explore events <ArrowRight className="size-4" /></Link>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] bg-[#061f3b] shadow-[0_25px_70px_rgba(6,31,59,.2)]">
          <div className="relative grid min-h-[430px] place-items-center md:min-h-[560px]">
            {eventPhotos.map((photo, index) => <img key={photo.src} src={photo.src} alt={photo.alt} className={`absolute inset-0 h-full w-full object-contain transition duration-700 ${index === active ? "scale-100 opacity-100" : "pointer-events-none scale-[.98] opacity-0"}`} />)}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061f3b]/65 via-transparent to-[#061f3b]/15" />
            <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#061f3b]/65 px-4 py-2 text-xs font-bold text-white backdrop-blur-md"><Images className="size-4 text-[#13a5d8]" />Photo {active + 1} of {eventPhotos.length}</span>
            <button type="button" onClick={previous} aria-label="Previous event photo" className="absolute left-4 grid size-11 place-items-center rounded-full border border-white/20 bg-[#061f3b]/65 text-white backdrop-blur transition hover:bg-[#13a5d8] hover:text-[#061f3b] md:left-6"><ArrowLeft className="size-5" /></button>
            <button type="button" onClick={next} aria-label="Next event photo" className="absolute right-4 grid size-11 place-items-center rounded-full border border-white/20 bg-[#061f3b]/65 text-white backdrop-blur transition hover:bg-[#13a5d8] hover:text-[#061f3b] md:right-6"><ArrowRight className="size-5" /></button>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 md:p-7">
              <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#65d3f3]">BHLI event portfolio</p><p className="mt-1 font-serif text-xl text-white md:text-2xl">Hospitality in action</p></div>
              <div className="flex gap-1.5">{eventPhotos.map((photo, index) => <button key={photo.src} type="button" onClick={() => setActive(index)} aria-label={`Show event photo ${index + 1}`} className={`h-1.5 rounded-full transition-all ${index === active ? "w-7 bg-[#13a5d8]" : "w-1.5 bg-white/40 hover:bg-white/70"}`} />)}</div>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto border-t border-white/10 bg-[#04182d] p-4">
            {eventPhotos.map((photo, index) => <button key={photo.src} type="button" onClick={() => setActive(index)} aria-label={`Select event photo ${index + 1}`} className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition md:h-20 md:w-28 ${index === active ? "border-[#13a5d8] opacity-100" : "border-transparent opacity-55 hover:opacity-90"}`}><img src={photo.src} alt="" className="h-full w-full object-cover" /></button>)}
          </div>
        </div>
      </div>
    </section>
  );
}