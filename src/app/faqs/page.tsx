"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cmsService } from "@/lib/api/cms";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const fallbackFaqs: FAQ[] = [
  {
    id: 1,
    question: "How do I book under Government or Defence MoU rates?",
    answer: "To book under special MoU rates, submit a request via our Defence Help Desk page or the Contact Us form, choosing 'Defence Travel' or 'Government' as the enquiry type. Please provide your official email, rank/designation, and command/department details. Direct bookings with hotels are not eligible for these rates."
  },
  {
    id: 2,
    question: "What documents are required at check-in for Defence rates?",
    answer: "Guests booking under Defence MoU rates must produce a valid serving ID card, veteran card, or dependent card along with the BHLI confirmation voucher at the time of check-in."
  },
  {
    id: 3,
    question: "Can I modify or cancel my booking request?",
    answer: "Yes, you can modify or cancel booking requests by contacting our 24/7 helpline at reservations@bookinghospitality.com or calling +91 99163 56691 with your booking reference number."
  },
  {
    id: 4,
    question: "Is airport transit transport included in hospitality bookings?",
    answer: "Airport pickup and drop services are available upon request. You can specify transport requirements when submitting a booking form, or request them from your travel manager before departure."
  }
];

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await cmsService.getFaqs();
        console.log("FAQs API Response:", res);
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setFaqs(res.data);
        } else if (res && Array.isArray(res) && res.length > 0) {
          setFaqs(res);
        } else {
          setFaqs(fallbackFaqs);
        }
      } catch (err) {
        console.warn("Failed to fetch FAQs, using fallback", err);
        setFaqs(fallbackFaqs);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f9fc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0879b7] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#062b50]">Loading FAQs...</p>
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
            <HelpCircle className="size-4 text-[#13a5d8]" /> Help & Support
          </p>
          <h1 className="mt-5 font-serif text-5xl md:text-6xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Find quick answers to common questions about booking eligibility, MoU rates, and general reservation services at BHLI.
          </p>
        </div>
      </section>

      {/* Accordion List */}
      <section className="mx-auto max-w-4xl px-5 py-20">
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-black/8 bg-white transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left focus:outline-none"
                >
                  <h3 className="font-serif text-lg font-bold text-[#062b50] md:text-xl">
                    {faq.question}
                  </h3>
                  {isOpen ? (
                    <ChevronUp className="size-5 shrink-0 text-[#087dbd]" />
                  ) : (
                    <ChevronDown className="size-5 shrink-0 text-black/45" />
                  )}
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[300px] border-t border-black/5" : "max-h-0"
                  }`}
                >
                  <p className="p-6 text-sm leading-relaxed text-black/60 font-semibold bg-[#fafcfe]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
