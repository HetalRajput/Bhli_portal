"use client";

import { ArrowRight, ChevronDown, HelpCircle, MessageCircleQuestion, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type HomeFaq = {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
  display_order: number;
};

export default function HomeFaqSection({ faqs }: { faqs: HomeFaq[] }) {
  const visibleFaqs = faqs
    .filter((faq) => faq.is_active !== false && faq.question && faq.answer)
    .sort((first, second) => (first.display_order ?? 0) - (second.display_order ?? 0));
  const [openId, setOpenId] = useState<number | null>(visibleFaqs[0]?.id ?? null);

  if (!visibleFaqs.length) return null;

  return (
    <section className="relative overflow-hidden border-t border-[#087fbe]/10 bg-[#edf6fa] py-20 md:py-24" aria-labelledby="home-faq-heading">
      <div className="pointer-events-none absolute -left-40 top-10 size-96 rounded-full bg-[#13a5d8]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-80 rounded-full bg-[#0875b7]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.72fr_1.28fr] lg:px-8">
        <div className="lg:pr-8">
          <span className="grid size-14 place-items-center rounded-2xl bg-[#061f3b] text-[#13a5d8] shadow-[0_14px_35px_rgba(6,31,59,.18)]"><MessageCircleQuestion className="size-7" /></span>
          <p className="mt-7 text-xs font-bold uppercase tracking-[.22em] text-[#087fbe]">Frequently asked questions</p>
          <h2 id="home-faq-heading" className="mt-3 max-w-md font-serif text-4xl font-semibold leading-tight text-[#061f3b] md:text-5xl">Helpful answers before you begin.</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#456078]">Learn how BHLI booking requests, guest details and cancellation support work.</p>

          <div className="mt-8 rounded-2xl border border-[#087fbe]/15 bg-white/75 p-5 shadow-sm backdrop-blur">
            <p className="flex items-center gap-2 text-sm font-bold text-[#061f3b]"><HelpCircle className="size-5 text-[#087fbe]" />Still have a question?</p>
            <p className="mt-2 text-xs leading-6 text-slate-500">Our reservation team is ready to help with your travel or hospitality requirement.</p>
            <Link href="/contact-us" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#087fbe] transition hover:gap-3">Contact our team <ArrowRight className="size-4" /></Link>
          </div>
        </div>

        <div className="space-y-3">
          {visibleFaqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            const answerId = `home-faq-answer-${faq.id}`;
            return (
              <article key={faq.id} className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${isOpen ? "border-[#13a5d8]/45 shadow-[0_16px_45px_rgba(6,70,110,.11)]" : "border-black/[.07] shadow-sm hover:border-[#74bddb]"}`}>
                <h3>
                  <button type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenId((current) => current === faq.id ? null : faq.id)} className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-6 md:py-6">
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full text-[10px] font-extrabold transition ${isOpen ? "bg-[#087fbe] text-white" : "bg-[#e7f6fc] text-[#087fbe]"}`}>{String(index + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-sm font-bold leading-6 text-[#061f3b] md:text-base">{faq.question}</span>
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full transition duration-300 ${isOpen ? "rotate-180 bg-[#e7f6fc] text-[#087fbe]" : "bg-slate-50 text-slate-400"}`}><ChevronDown className="size-4" /></span>
                  </button>
                </h3>
                <div id={answerId} className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="mx-5 border-t border-slate-100 pb-6 pl-[3.25rem] pr-3 pt-4 text-sm leading-7 text-[#52697d] md:mx-6">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <Link href="/faqs" className="mt-5 flex items-center justify-between rounded-2xl bg-[#061f3b] px-6 py-5 text-white transition hover:-translate-y-0.5 hover:shadow-xl">
            <span><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#13a5d8]"><ShieldCheck className="size-4" />BHLI help centre</span><span className="mt-1 block text-sm text-white/65">View all frequently asked questions</span></span>
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
