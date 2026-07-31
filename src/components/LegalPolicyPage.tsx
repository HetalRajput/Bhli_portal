import Link from "next/link";
import { ArrowLeft, FileCheck2, Mail, ShieldCheck } from "lucide-react";

type PolicySection = {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
};

const termsSections: PolicySection[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of these terms",
    paragraphs: [
      "These Terms and Conditions govern your access to and use of the Booking Hospitality website, account features, enquiry forms and travel-related services. By using the website, creating an account or requesting a booking, you agree to these terms.",
      "If you make a request for another traveller or on behalf of an organisation, you confirm that you are authorised to provide their information and accept these terms for that request.",
    ],
  },
  {
    id: "accounts",
    title: "2. Eligibility and accounts",
    items: [
      "You must provide accurate, current and complete information.",
      "You are responsible for safeguarding login codes and activity performed through your account.",
      "Defence, government, corporate or entitlement-related details may be verified before a special rate or benefit is confirmed.",
      "We may suspend access where information is misleading, security is compromised or the website is misused.",
    ],
  },
  {
    id: "bookings",
    title: "3. Enquiries and bookings",
    paragraphs: [
      "Submitting an enquiry or reservation request does not itself create a confirmed booking. A booking is confirmed only when BHLI or the relevant supplier issues a written confirmation or booking reference and any required payment is received.",
      "Availability, room category, itinerary, inclusions and special requests remain subject to supplier confirmation. Please review the final confirmation carefully and report errors promptly.",
    ],
  },
  {
    id: "pricing",
    title: "4. Prices, taxes and payments",
    items: [
      "Displayed prices may be indicative until availability and eligibility are verified.",
      "The final amount may include applicable taxes, supplier charges and disclosed service fees.",
      "Payments must be made only through payment details or channels officially communicated by BHLI.",
      "Obvious pricing or availability errors may be corrected before confirmation; you may then accept the corrected offer or cancel the request.",
    ],
  },
  {
    id: "official-travel",
    title: "5. Government and Defence travel",
    paragraphs: [
      "Government, Defence, LTC, MoU and entitlement rates are restricted to eligible travellers and applicable journeys. Supporting identification, rank, department, service details or travel authority may be requested. Eligibility is subject to the relevant policy and supplier rules.",
      "Unless expressly confirmed otherwise, special BHLI-negotiated or MoU rates are available only for bookings processed through BHLI and cannot be applied retrospectively to direct supplier bookings.",
    ],
  },
  {
    id: "changes",
    title: "6. Changes, cancellations and refunds",
    paragraphs: [
      "Changes, cancellations, no-shows and refunds are governed by the fare, hotel, transport or service-provider rules communicated with your booking. Some rates may be non-refundable or subject to charges.",
      "Approved refunds are returned through the applicable payment channel after the supplier and payment provider complete processing. Processing timelines can vary. Our separate Cancellation and Refund page may provide additional operational details.",
    ],
  },
  {
    id: "responsibilities",
    title: "7. Traveller responsibilities",
    items: [
      "Check names, dates, destination, guest count and other confirmation details before travel.",
      "Carry valid identity, travel, visa, medical and entitlement documents required for the journey.",
      "Comply with supplier rules, property policies, safety requirements and applicable law.",
      "Inform us of accessibility, health or other important requirements early enough for suppliers to review them.",
    ],
  },
  {
    id: "suppliers",
    title: "8. Third-party suppliers",
    paragraphs: [
      "Hotels, airlines, rail operators, transport providers, event vendors, payment providers and other suppliers deliver many of the services offered through BHLI. Their own terms, schedules and policies may also apply.",
      "BHLI coordinates and facilitates reservations but does not control every supplier operation. We will provide reasonable assistance when a supplier changes or fails to deliver a confirmed service, subject to applicable law and the supplier's responsibility.",
    ],
  },
  {
    id: "acceptable-use",
    title: "9. Acceptable website use",
    items: [
      "Do not attempt unauthorised access, interfere with security or introduce malicious code.",
      "Do not scrape, copy or commercially exploit website content without written permission.",
      "Do not submit fraudulent enquiries, impersonate others or misuse official-travel benefits.",
    ],
  },
  {
    id: "liability",
    title: "10. Intellectual property and liability",
    paragraphs: [
      "The website design, brand, text and original materials belong to BHLI or their respective licensors and are protected by applicable intellectual-property law.",
      "To the extent permitted by law, BHLI is not liable for indirect or consequential losses, events outside reasonable control, or losses caused by inaccurate information supplied by a user. Nothing in these terms excludes liability or consumer rights that cannot lawfully be excluded.",
    ],
  },
  {
    id: "law",
    title: "11. Governing law and disputes",
    paragraphs: [
      "These terms are governed by the laws of India. Please contact us first so we can try to resolve a concern promptly. Subject to any mandatory consumer forum or statutory jurisdiction, disputes will be subject to the competent courts in Bengaluru, Karnataka.",
    ],
  },
  {
    id: "updates-contact",
    title: "12. Updates and contact",
    paragraphs: [
      "We may update these terms to reflect service, legal or operational changes. The revised version will be posted here with a new effective date. Material changes will be communicated where required.",
    ],
  },
];

const privacySections: PolicySection[] = [
  {
    id: "scope",
    title: "1. Scope",
    paragraphs: [
      "This Privacy Policy explains how Booking Hospitality & Leisure Infra LLP (BHLI) collects, uses, shares, retains and protects personal data when you visit our website, create an account, contact us or request travel and hospitality services.",
    ],
  },
  {
    id: "collection",
    title: "2. Personal data we collect",
    items: [
      "Identity and contact details, including name, email address and mobile number.",
      "Account and official-travel details, such as rank, department, service number or limited employee/identity-number details supplied for eligibility verification.",
      "Travel and booking details, including destinations, dates, companions, preferences, enquiries and support communications.",
      "Transaction and booking-status information. Payment credentials may be processed directly by authorised payment providers and need not be stored by BHLI.",
      "Technical information such as IP address, device/browser data, security logs, cookie identifiers and website usage.",
    ],
  },
  {
    id: "purposes",
    title: "3. Why we use personal data",
    items: [
      "To create and secure accounts and verify login requests.",
      "To respond to enquiries, prepare options and process or support reservations.",
      "To verify eligibility for Government, Defence, corporate, LTC, MoU or other restricted rates.",
      "To communicate confirmations, service updates, support messages and requested information.",
      "To prevent fraud, protect the website, comply with legal obligations and resolve disputes.",
      "To improve services and send optional promotional communications where permitted; you may opt out of marketing messages.",
    ],
  },
  {
    id: "consent",
    title: "4. Consent and lawful processing",
    paragraphs: [
      "We process personal data for specified, lawful purposes, including providing services you request, meeting legal obligations, protecting legitimate interests recognised by law and obtaining consent where required. You may withdraw consent for future processing through the contact details below, although this will not affect earlier lawful processing and may limit services that require the information.",
    ],
  },
  {
    id: "sharing",
    title: "5. When we share information",
    paragraphs: [
      "We share only the information reasonably necessary for the relevant purpose. Recipients may include hotels, airlines, rail or road transport providers, event and travel partners, payment processors, communications and cloud-service providers, professional advisers, and government or law-enforcement authorities where legally required.",
      "We do not sell personal data. Service providers acting for BHLI are expected to use information only for authorised purposes and apply appropriate safeguards.",
    ],
  },
  {
    id: "transfers",
    title: "6. Data location and transfers",
    paragraphs: [
      "Some technology or travel suppliers may process information outside your state or outside India. Where cross-border processing occurs, we take reasonable steps to use appropriate contractual, technical and legal safeguards and comply with applicable transfer restrictions.",
    ],
  },
  {
    id: "retention",
    title: "7. Retention",
    paragraphs: [
      "We retain personal data only for as long as it is needed for the stated purpose, an active account or booking, support, accounting, fraud prevention, dispute resolution and applicable legal requirements. Data is then deleted, anonymised or securely archived according to operational and legal retention needs.",
    ],
  },
  {
    id: "security",
    title: "8. Security",
    paragraphs: [
      "We use reasonable administrative, technical and organisational safeguards designed to protect personal data from unauthorised access, alteration, disclosure or loss. No internet service can guarantee absolute security, so users should also protect login codes and promptly report suspicious activity.",
    ],
  },
  {
    id: "cookies",
    title: "9. Cookies and analytics",
    paragraphs: [
      "The website may use essential storage and cookies for authentication, preferences, security and performance measurement. Browser settings can restrict cookies, but some account or booking features may then not function correctly.",
    ],
  },
  {
    id: "rights",
    title: "10. Your choices and rights",
    items: [
      "Request information about personal data processed by BHLI.",
      "Ask us to correct, complete or update inaccurate personal data.",
      "Request erasure where retention is no longer required or otherwise mandated by law.",
      "Withdraw consent and opt out of optional marketing communications.",
      "Raise a grievance and, where applicable, nominate another person to exercise rights under law.",
    ],
    paragraphs: [
      "We may need to verify identity before acting on a request. Some requests may be limited where information must be retained for bookings, security, legal claims or statutory duties.",
    ],
  },
  {
    id: "children",
    title: "11. Children and third-party links",
    paragraphs: [
      "A parent, guardian or authorised adult should provide and manage information for a child traveller. Our website may link to supplier websites governed by their own privacy practices; please review those notices before submitting data directly to them.",
    ],
  },
  {
    id: "privacy-contact",
    title: "12. Updates and privacy contact",
    paragraphs: [
      "We may update this policy when services, technology or legal requirements change. The current version and effective date will remain available on this page.",
    ],
  },
];

export default function LegalPolicyPage({ type }: { type: "terms" | "privacy" }) {
  const isTerms = type === "terms";
  const title = isTerms ? "Terms & Conditions" : "Privacy Policy";
  const eyebrow = isTerms ? "Website and booking terms" : "Your information and choices";
  const summary = isTerms
    ? "The rules that apply when you use BHLI's website, submit an enquiry or request travel and hospitality services."
    : "How BHLI handles personal data across accounts, enquiries, official-travel verification and reservations.";
  const sections = isTerms ? termsSections : privacySections;

  return (
    <div className="min-h-screen bg-[#f4f8fb] text-[#122b42]">
      <header className="bg-[#061f3b] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white">
            <ArrowLeft className="size-4" /> Back to home
          </Link>
          <div className="mt-10 flex items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#13a5d8]">
              {isTerms ? <FileCheck2 className="size-7" /> : <ShieldCheck className="size-7" />}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.22em] text-[#13a5d8]">{eyebrow}</p>
              <h1 className="mt-3 font-serif text-5xl md:text-7xl">{title}</h1>
            </div>
          </div>
          <p className="mt-7 max-w-3xl text-base leading-8 text-white/65">{summary}</p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-white/40">Effective 31 July 2026</p>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl items-start gap-8 px-5 py-14 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#087fbe]">On this page</p>
          <nav className="mt-5 grid gap-2">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="rounded-xl px-3 py-2 text-sm text-black/55 transition hover:bg-[#edf7fc] hover:text-[#087fbe]">
                {section.title.replace(/^\d+\.\s*/, "")}
              </a>
            ))}
          </nav>
        </aside>

        <article className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm md:p-10">
          <div className="rounded-2xl border border-[#087fbe]/15 bg-[#edf7fc] p-5 text-sm leading-7 text-[#35556a]">
            This policy applies to Booking Hospitality &amp; Leisure Infra LLP (BHLI), its website and the services it coordinates. Supplier-specific terms or notices may also apply to individual bookings.
          </div>
          <div className="mt-4 divide-y divide-black/8">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28 py-8 first:pt-5">
                <h2 className="font-serif text-3xl text-[#062b50]">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-8 text-black/60">{paragraph}</p>
                ))}
                {section.items && (
                  <ul className="mt-5 grid gap-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-3 leading-7 text-black/60">
                        <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[#13a5d8]" />{item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <section className="rounded-3xl bg-[#061f3b] p-7 text-white md:p-9">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#13a5d8]">Contact BHLI</p>
            <h2 className="mt-3 font-serif text-3xl">Questions, requests or grievances</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">Please include enough information for us to identify and respond to your request. Do not email full payment-card details, passwords or one-time login codes.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="mailto:info@bookinghospitality.com" className="inline-flex items-center gap-2 rounded-full bg-[#13a5d8] px-5 py-3 text-sm font-bold text-[#061f3b]"><Mail className="size-4" /> info@bookinghospitality.com</a>
              <Link href="/contact-us" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold">Contact page</Link>
            </div>
          </section>

          <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-[#087fbe]">
            <Link href={isTerms ? "/privacy-policy" : "/terms-and-conditions"}>{isTerms ? "Read our Privacy Policy" : "Read our Terms & Conditions"}</Link>
            <Link href="/cancellation-and-refund">Cancellation and Refund Policy</Link>
          </div>
        </article>
      </main>
    </div>
  );
}
