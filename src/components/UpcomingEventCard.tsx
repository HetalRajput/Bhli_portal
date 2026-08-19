"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, MapPin, Plane, ShieldCheck, TrainFront, Mic, PlayCircle, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type EventCardData = {
  type?: "event" | "podcast";
  category: string;
  title: string;
  description: string;
  location: string;
  schedule: string;
  image: string;
  link: string;
  icon: LucideIcon;
};

const events: EventCardData[] = [
  {
    type: "podcast",
    category: "Podcast Series",
    title: "Real Story. Hard Lesson.",
    description: "Clear thinking with Wg Cdr Nimish Jain. Real stories, real lessons.",
    location: "Online Podcast",
    schedule: "Available Now",
    image: "/Asset/podcast-nimish-jain.jpg",
    link: "https://youtu.be/FPdlfJR2BpQ?si=XSim67FPGKOaHJWa",
    icon: Mic,
  },
  {
    category: "Aerospace · Defence",
    title: "Aero India 2027",
    description: "Plan accommodation, transfers and hospitality support early with BHLI.",
    location: "Bengaluru, India",
    schedule: "Schedule to be announced",
    image: "/Asset/WhatsApp Image 2026-07-18 at 10.22.07 PM (2).jpeg",
    link: "/contact-us?enquiry=aero-india-2027",
    icon: Plane,
  },
  {
    category: "Government · Logistics",
    title: "Defence Logistics Summit",
    description: "Coordinate secure transport, accommodation and on-ground support for multi-city missions.",
    location: "New Delhi, India",
    schedule: "October 2027",
    image: "https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=900",
    link: "/contact-us?enquiry=defence-logistics-summit",
    icon: ShieldCheck,
  },
  {
    category: "Corporate · Travel",
    title: "Global Mobility Expo",
    description: "Support executive travel, hotel blocks and local coordination for high-value delegations.",
    location: "Mumbai, India",
    schedule: "December 2027",
    image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=900",
    link: "/contact-us?enquiry=global-mobility-expo",
    icon: TrainFront,
  },
];

export default function UpcomingEventCard() {
  const [activeIndex, setActiveIndex] = useState(0);

  const previous = () => setActiveIndex((current) => (current - 1 + events.length) % events.length);
  const next = () => setActiveIndex((current) => (current + 1) % events.length);

  useEffect(() => {
    // Increased interval to give users more time to read before changing
    const timer = window.setInterval(next, 7000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[400px] overflow-x-clip sm:overflow-visible">
      {/* 3D Stacked Cards Viewport */}
      <div className="relative mx-auto flex h-[500px] w-full items-center justify-center overflow-visible sm:h-[530px]">
        <AnimatePresence initial={false}>
          {events.map((event, index) => {
            let offset = index - activeIndex;
            if (offset < -Math.floor(events.length / 2)) {
              offset += events.length;
            } else if (offset > Math.floor(events.length / 2)) {
              offset -= events.length;
            }

            const isActive = offset === 0;
            const isPrev = offset === -1;
            const isNext = offset === 1;
            const isVisible = isActive || isPrev || isNext;

            const handleCardClick = () => {
              if (isPrev) previous();
              if (isNext) next();
            };

            const Icon = event.icon;

            return (
              <motion.div
                role="article"
                key={event.title}
                onClick={handleCardClick}
                className={`absolute left-1/2 top-1/2 h-[460px] w-[min(280px,calc(100vw-2.5rem))] select-none overflow-hidden rounded-[1.5rem] border border-white/20 bg-white text-[#062b50] shadow-[0_25px_70px_rgba(0,15,35,.32)] sm:h-[490px] sm:w-[310px] sm:rounded-[1.75rem] md:h-[500px] md:w-[320px] ${
                  isActive ? "cursor-default" : isVisible ? "cursor-pointer" : "pointer-events-none"
                }`}
                initial={false}
                animate={{
                  x: isActive ? "-50%" : isPrev ? "calc(-50% - 60px)" : isNext ? "calc(-50% + 60px)" : "-50%",
                  y: "-50%",
                  scale: isActive ? 1 : isVisible ? 0.9 : 0.8,
                  rotate: isActive ? 0 : isPrev ? -4 : isNext ? 4 : 0,
                  zIndex: isActive ? 30 : isVisible ? 20 : 10,
                  opacity: isActive ? 1 : isVisible ? 0.7 : 0,
                  filter: isActive ? "blur(0px)" : isVisible ? "blur(1px)" : "blur(2px)",
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1], // Custom spring-like easing for super smooth transition
                }}
              >
                {event.type === "podcast" ? (
                  <div className="relative h-full w-full bg-[#041124] text-white">
                    <img src={event.image} alt={event.title} className="absolute inset-0 h-full w-full object-cover pointer-events-none opacity-[0.85]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#041124] via-[#041124]/70 to-transparent pointer-events-none" />
                    
                    <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur pointer-events-none">
                      <Icon className="size-3.5 text-[#13a5d8]" />
                      New Episode
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-7 flex flex-col justify-end">
                      <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#13a5d8] pointer-events-none">{event.category}</p>
                      <h2 className="mt-2 font-serif text-3xl font-semibold pointer-events-none leading-tight">{event.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-white/70 pointer-events-none line-clamp-2">{event.description}</p>
                      
                      <Link 
                        href={event.link} 
                        target={event.link.startsWith("http") ? "_blank" : undefined}
                        rel={event.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        className={`mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#13a5d8] px-5 py-3.5 text-sm font-bold text-[#061f3b] transition hover:bg-white ${
                          isActive ? "pointer-events-auto" : "pointer-events-none opacity-50"
                        }`}
                      >
                        <PlayCircle className="size-5" /> Listen Now
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative h-40 overflow-hidden bg-[#087fbe]">
                      <img src={event.image} alt={event.title} className="h-full w-full object-cover pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#062b50]/75 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#062b50]/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur pointer-events-none">
                        <Icon className="size-3.5 text-[#f0ba4f]" />
                        Upcoming event
                      </span>
                    </div>
                    <div className="p-6 flex flex-col h-[calc(100%-10rem)] justify-between">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#b47500] pointer-events-none">{event.category}</p>
                        <h2 className="mt-2 font-serif text-2xl font-semibold pointer-events-none leading-snug">{event.title}</h2>
                        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#587083] pointer-events-none line-clamp-3">{event.description}</p>
                      </div>
                      <div>
                        <div className="mt-4 grid gap-2 text-xs font-semibold text-[#496276] pointer-events-none">
                          <span className="flex items-center gap-2"><MapPin className="size-4 text-[#087fbe]" />{event.location}</span>
                          <span className="flex items-center gap-2"><CalendarDays className="size-4 text-[#b47500]" />{event.schedule}</span>
                        </div>
                        <Link 
                          href={event.link} 
                          className={`mt-5 flex items-center justify-between rounded-xl bg-[#062b50] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#087fbe] ${
                            isActive ? "pointer-events-auto" : "pointer-events-none opacity-50"
                          }`}
                        >
                          Plan your visit <ArrowUpRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation and Dots */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {events.map((event, index) => (
            <button
              key={event.title}
              type="button"
              aria-label={`Show ${event.title}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-500 ${index === activeIndex ? "w-8 bg-[#13a5d8]" : "w-2.5 bg-slate-300/80 hover:bg-slate-400"}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous event"
            onClick={previous}
            className="grid size-10 place-items-center rounded-full border border-white/20 bg-[#062b50]/90 text-white transition hover:bg-[#087fbe]"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next event"
            onClick={next}
            className="grid size-10 place-items-center rounded-full border border-white/20 bg-[#062b50]/90 text-white transition hover:bg-[#087fbe]"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
