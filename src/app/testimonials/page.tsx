"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Star, Quote } from "lucide-react";
import { cmsService } from "@/lib/api/cms";

interface Testimonial {
  id: number;
  name: string;
  designation?: string;
  organization?: string;
  message: string;
  rating?: number;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Lt. Col. Arvind Sharma",
    designation: "Command Logistics Officer",
    organization: "Indian Army",
    message: "BHLI's defence help desk has simplified our transit bookings tremendously. Their command liaison and compliance matching with official MoU rates are exceptional.",
    rating: 5
  },
  {
    id: 2,
    name: "A. K. Roy",
    designation: "Deputy Director",
    organization: "Ministry of Defence",
    message: "Highly reliable and professional travel service. The corporate rates and VVIP security protocols handled for our delegation stay in Delhi were top-notch.",
    rating: 5
  },
  {
    id: 3,
    name: "Meera Deshmukh",
    designation: "Senior HR Manager",
    organization: "PSU Aerospace Division",
    message: "Our entire team transits and event banquets have been handled by BHLI for over 2 years now. The seamless billing and 24x7 reservation support save us time and effort.",
    rating: 5
  }
];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await cmsService.getTestimonials();
        console.log("Testimonials API Response:", res);
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setTestimonials(res.data);
        } else if (res && Array.isArray(res) && res.length > 0) {
          setTestimonials(res);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch (err) {
        console.warn("Failed to fetch testimonials, loading fallback", err);
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f9fc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0879b7] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#062b50]">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f9fc] text-[#122b42] min-h-screen">
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

      {/* Testimonials Grid */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-black/8 bg-white p-8 shadow-sm transition duration-300 hover:shadow-xl"
            >
              <div>
                <Quote className="absolute top-6 right-6 h-12 w-12 text-[#087dbd]/10 pointer-events-none" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Message */}
                <p className="text-sm font-semibold leading-relaxed text-black/65 relative z-10 italic">
                  "{t.message}"
                </p>
              </div>

              {/* Author */}
              <div className="mt-8 border-t border-black/5 pt-5">
                <h4 className="font-serif text-lg font-bold text-[#062b50]">{t.name}</h4>
                {(t.designation || t.organization) && (
                  <p className="text-xs font-bold text-black/45 mt-0.5">
                    {t.designation} {t.designation && t.organization && "|"} {t.organization}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
