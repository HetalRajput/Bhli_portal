"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import { cmsService, type Testimonial } from "@/lib/api/cms";

const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Lt. Col. Arvind Sharma",
    designation: "Command Logistics Officer",
    organization: "Indian Army",
    message: "BHLI's defence help desk has simplified our transit bookings tremendously. Their command liaison and compliance matching with official MoU rates are exceptional.",
    rating: 5,
    is_active: true,
    display_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: 2,
    name: "A. K. Roy",
    designation: "Deputy Director",
    organization: "Ministry of Defence",
    message: "Highly reliable and professional travel service. The corporate rates and VVIP security protocols handled for our delegation stay in Delhi were top-notch.",
    rating: 5,
    is_active: true,
    display_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: 3,
    name: "Meera Deshmukh",
    designation: "Senior HR Manager",
    organization: "PSU Aerospace Division",
    message: "Our entire team transits and event banquets have been handled by BHLI for over 2 years now. The seamless billing and 24x7 reservation support save us time and effort.",
    rating: 5,
    is_active: true,
    display_order: 3,
    created_at: "",
    updated_at: "",
  }
];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await cmsService.getTestimonials();
        const activeTestimonials = res
          .filter((testimonial) => testimonial.is_active)
          .sort((first, second) => first.display_order - second.display_order || second.id - first.id);
        setTestimonials(activeTestimonials.length ? activeTestimonials : fallbackTestimonials);
      } catch (err) {
        console.warn("Failed to fetch testimonials, loading fallback", err);
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f9fc] text-[#122b42]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#062b50] px-5 py-20 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(215,181,109,.15),transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl text-center md:text-left">
          <p className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]">
            <MessageSquare className="size-4 text-[#13a5d8]" /> Customer Stories
          </p>
          <h1 className="mt-5 font-serif text-5xl md:text-6xl">
            What Our Clients Say About Us
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Read feedback from Defence officials, Government departments, and corporate partners about their experience booking with BHLI.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-8">
        {loading ? <TestimonialsSkeleton /> : <TestimonialsSlider testimonials={testimonials} />}
      </section>
    </div>
  );
}

function TestimonialsSkeleton() {
  return (
    <div role="status" aria-label="Loading testimonials">
      <span className="sr-only">Loading testimonials...</span>
      <div className="mb-5 flex items-center justify-between"><div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" /><div className="flex gap-2"><div className="size-9 animate-pulse rounded-full bg-slate-200" /><div className="size-9 animate-pulse rounded-full bg-sky-100" /></div></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((card) => (
          <div key={card} className="min-h-[340px] animate-pulse rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="size-10 rounded-xl bg-sky-100" />
            <div className="mt-4 h-3.5 w-20 rounded-full bg-amber-100" />
            <div className="mt-5 space-y-3"><div className="h-3.5 w-full rounded-full bg-slate-100" /><div className="h-3.5 w-full rounded-full bg-slate-100" /><div className="h-3.5 w-5/6 rounded-full bg-slate-100" /></div>
            <div className="mt-16 border-t border-slate-100 pt-4"><div className="h-5 w-32 rounded-full bg-slate-200" /><div className="mt-2 h-3 w-24 rounded-full bg-slate-100" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
