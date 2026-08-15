import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Mail,
  ReceiptText,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

type PolicySection = {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
};

const sections: PolicySection[] = [
  {
    id: "scope",
    title: "1. Scope of this policy",
    paragraphs: [
      "This policy explains how cancellation, modification and refund requests are handled for travel, accommodation, transport, events and other services coordinated by Booking Hospitality & Leisure Infra LLP (BHLI).",
      "Every booking may also be governed by the applicable airline, hotel, rail operator, transport provider, insurer, event vendor or other supplier. Where a confirmed booking has stricter supplier terms, those terms form part of your booking and will apply alongside this policy.",
    ],
  },
  {
    id: "before-confirmation",
    title: "2. Requests before confirmation",
    paragraphs: [
      "Submitting an enquiry or reservation request does not by itself create a confirmed booking. You may withdraw an unconfirmed request without a cancellation charge unless BHLI has already incurred a disclosed, non-recoverable cost on your instruction.",
      "A booking becomes confirmed when a written confirmation or booking reference is issued and any required payment, approval or documentation has been received.",
    ],
  },
  {
    id: "requesting",
    title: "3. How to request a cancellation or change",
    items: [
      "Use the cancellation option in your BHLI account where it is available, or contact the reservations team using the details below.",
      "Provide the booking reference, lead traveller or guest name, service date and a clear cancellation or modification request.",
      "Submit the request as early as possible. Charges are normally determined using the time at which BHLI receives the request during support operations, subject to the supplier's rules.",
      "A request is not complete until BHLI or the relevant supplier confirms that it has been processed. Please retain the confirmation for your records.",
    ],
  },
  {
    id: "service-rules",
    title: "4. Service-specific rules",
    items: [
      "Flights, trains and buses: fare conditions, cancellation windows, no-show rules and carrier charges apply. Some promotional or restricted fares may be non-refundable.",
      "Hotels and accommodation: the selected rate plan controls the free-cancellation deadline and charges. No-shows, late cancellations and early departures may be charged up to the full reservation value.",
      "Holiday packages and cruises: supplier deposits, tickets, permits and confirmed components may be non-refundable. Charges can increase as the departure date approaches.",
      "Events, catering and group services: customised work, committed inventory, staffing, venue costs and advance purchases may be deducted according to the accepted quotation or contract.",
      "Visa assistance, travel insurance and foreign exchange: government, insurer, banking, processing or professional fees already incurred may not be refundable after processing begins.",
      "Third-party or externally linked services: cancellation and refund requests may need to be raised directly with the provider under the terms shown on its platform.",
    ],
  },
  {
    id: "charges",
    title: "5. Cancellation charges and non-refundable amounts",
    paragraphs: [
      "The refundable amount is calculated after deducting applicable supplier penalties, used or partially used services, non-refundable taxes or fees, payment-provider charges where permitted, and any BHLI service or processing fee disclosed with the booking.",
      "Convenience fees, documentation charges, special-request costs and amounts already paid to a supplier may be non-refundable where they cannot be recovered. We will share the available calculation or supplier response when confirming the cancellation outcome.",
    ],
  },
  {
    id: "refunds",
    title: "6. Refund eligibility and processing",
    items: [
      "A refund is initiated only after eligibility is confirmed and, where required, the supplier returns or authorises the relevant amount.",
      "Approved refunds are normally returned to the original payment method. A different verified method may be used only where operationally required and legally permitted.",
      "Processing time depends on the supplier, payment gateway, bank and payment method. BHLI will communicate an available estimate, but banking or supplier delays may be outside our direct control.",
      "Currency conversion differences, card-issuer charges or exchange-rate movements are controlled by the relevant financial institution and may affect the amount finally credited.",
      "If only part of a booking is cancelled, any refund will be limited to the eligible unused component after applicable deductions.",
    ],
  },
  {
    id: "supplier-changes",
    title: "7. Supplier cancellations or significant changes",
    paragraphs: [
      "If a supplier cancels or materially changes a confirmed service, BHLI will provide reasonable assistance with the options made available by that supplier. Depending on the circumstances, these may include rebooking, a credit note or a refund of the supplier-approved amount.",
      "Alternative arrangements and refunds remain subject to availability, supplier policy and applicable law. BHLI is not responsible for separate costs arranged without prior written approval unless liability cannot lawfully be excluded.",
    ],
  },
  {
    id: "unused-services",
    title: "8. No-shows, unused services and force majeure",
    paragraphs: [
      "Failure to arrive, travel or use a confirmed service is treated according to the supplier's no-show policy and may result in no refund. Unused portions of a commenced itinerary are refundable only where the supplier permits it.",
      "Weather, strikes, government restrictions, natural events, security incidents and other circumstances outside reasonable control may affect service delivery. Refunds or credits in these cases depend on supplier policy and rights available under applicable law.",
    ],
  },
  {
    id: "disputes",
    title: "9. Questions and disputes",
    paragraphs: [
      "Contact BHLI promptly if you believe a cancellation or refund has been calculated incorrectly. Include the booking reference and relevant confirmation or payment details, but do not send passwords, one-time codes or full payment-card information.",
      "We will review the booking record and coordinate with the supplier where necessary. Nothing in this policy limits consumer rights or remedies that cannot be excluded under applicable law.",
    ],
  },
];

const highlights = [
  { icon: CalendarClock, title: "Request early", text: "Supplier charges can increase as the service date approaches." },
  { icon: ReceiptText, title: "Check your fare rules", text: "Your confirmation contains the terms specific to the selected booking." },
  { icon: CircleDollarSign, title: "Refunds follow approval", text: "Eligible amounts are processed after supplier confirmation and deductions." },
];

export default function CancellationAndRefundPage() {
  return (
    <div className="min-h-screen bg-[#f4f8fb] text-[#122b42]">
      <header className="relative overflow-hidden bg-[#061f3b] px-5 py-20 text-white lg:px-8">
        <div className="absolute -right-28 -top-40 size-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white">
            <ArrowLeft className="size-4" /> Back to home
          </Link>
          <div className="mt-10 flex items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#13a5d8]">
              <RefreshCcw className="size-7" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.22em] text-[#13a5d8]">Booking support policy</p>
              <h1 className="mt-3 font-serif text-5xl md:text-7xl">Cancellation &amp; Refund</h1>
            </div>
          </div>
          <p className="mt-7 max-w-3xl text-base leading-8 text-white/65">
            Clear guidance on cancelling or changing a BHLI booking request, applicable charges and how eligible refunds are processed.
          </p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-white/40">Effective 15 August 2026</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <span className="grid size-11 place-items-center rounded-2xl bg-[#e6f7fd] text-[#087fbe]"><Icon className="size-5" /></span>
              <h2 className="mt-5 font-serif text-2xl text-[#062b50]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-black/55">{text}</p>
            </article>
          ))}
        </section>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#087fbe]">On this page</p>
            <nav className="mt-5 grid gap-2" aria-label="Cancellation policy sections">
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="rounded-xl px-3 py-2 text-sm text-black/55 transition hover:bg-[#edf7fc] hover:text-[#087fbe]">
                  {section.title.replace(/^\d+\.\s*/, "")}
                </a>
              ))}
            </nav>
          </aside>

          <article className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm md:p-10">
            <div className="flex gap-3 rounded-2xl border border-[#087fbe]/15 bg-[#edf7fc] p-5 text-sm leading-7 text-[#35556a]">
              <ShieldCheck className="mt-1 size-5 shrink-0 text-[#087fbe]" />
              <p>Always review the cancellation terms shown with your quotation or confirmation. Supplier-specific rules determine the final eligibility and amount for an individual booking.</p>
            </div>

            <div className="mt-4 divide-y divide-black/8">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28 py-8 first:pt-5">
                  <h2 className="font-serif text-3xl text-[#062b50]">{section.title}</h2>
                  {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-4 leading-8 text-black/60">{paragraph}</p>)}
                  {section.items && (
                    <ul className="mt-5 grid gap-3">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-3 leading-7 text-black/60">
                          <CheckCircle2 className="mt-1.5 size-4 shrink-0 text-[#13a5d8]" />{item}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <section className="rounded-3xl bg-[#061f3b] p-7 text-white md:p-9">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#13a5d8]">Cancellation assistance</p>
              <h2 className="mt-3 font-serif text-3xl">Have your booking reference ready</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
                Send your request as soon as possible so the reservations team can check the applicable supplier rules and available refund amount.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="mailto:reservations@bookinghospitality.com" className="inline-flex items-center gap-2 rounded-full bg-[#13a5d8] px-5 py-3 text-sm font-bold text-[#061f3b]"><Mail className="size-4" /> reservations@bookinghospitality.com</a>
                <Link href="/contact-us" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold">Contact support</Link>
                <Link href="/profile" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold">View my bookings</Link>
              </div>
            </section>

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-[#087fbe]">
              <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/faqs">Frequently Asked Questions</Link>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
