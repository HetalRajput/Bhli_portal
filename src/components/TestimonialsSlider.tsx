"use client";

import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/api/cms";

export default function TestimonialsSlider({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label="Client testimonials">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#087fbe]">Client stories</p>
        <p className="text-xs font-semibold text-slate-400">{testimonials.length} testimonials · Auto sliding</p>
      </div>

      <div className="testimonial-marquee-mask overflow-hidden pb-4">
        <div className="testimonial-marquee-track flex w-max items-stretch motion-reduce:transform-none">
          <div className="flex shrink-0 items-stretch gap-4 pr-4">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={`primary-${testimonial.id}`} testimonial={testimonial} position={index + 1} total={testimonials.length} />
            ))}
          </div>

          <div className="flex shrink-0 items-stretch gap-4 pr-4" aria-hidden="true">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={`duplicate-${testimonial.id}`} testimonial={testimonial} position={index + 1} total={testimonials.length} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial, position, total }: { testimonial: Testimonial; position: number; total: number }) {
  const rating = Math.min(5, Math.max(0, Number(testimonial.rating) || 0));

  return (
    <article className="testimonial-compact-card relative flex min-h-[340px] w-[min(78vw,300px)] shrink-0 flex-col overflow-hidden rounded-[1.5rem] border border-[#0a79bf]/10 bg-white p-5 shadow-[0_12px_36px_rgba(6,43,80,.08)] sm:w-[310px] sm:p-6 lg:w-[320px]" aria-label={`Testimonial ${position} of ${total}`}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#087fbe] via-[#13a5d8] to-[#70d7ed]" />
      <Quote className="absolute right-5 top-6 size-12 text-[#087fbe]/[.07]" aria-hidden="true" />
      <span className="grid size-10 place-items-center rounded-xl bg-[#e9f7fc] text-[#087fbe]"><Quote className="size-5" /></span>

      <div className="mt-4 flex gap-1" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, starIndex) => (
          <Star key={starIndex} className={`size-3.5 ${starIndex < rating ? "fill-amber-400 text-amber-400" : "fill-transparent text-slate-200"}`} />
        ))}
      </div>

      <blockquote className="relative z-10 mt-6 flex-1 text-[15px] font-medium leading-8 text-slate-600">“{testimonial.message}”</blockquote>

      <footer className="mt-5 border-t border-slate-100 pt-4">
        <p className="font-serif text-lg font-bold text-[#062b50]">{testimonial.name}</p>
        {(testimonial.designation || testimonial.organization) && (
          <p className="mt-1 text-xs font-bold text-slate-400">{[testimonial.designation, testimonial.organization].filter(Boolean).join(" · ")}</p>
        )}
      </footer>
    </article>
  );
}
