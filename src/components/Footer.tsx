import Link from "next/link";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";

const locationUrl = "https://www.google.com/maps/place/13.04072,77.539637";
const locationEmbedUrl =
  "https://www.google.com/maps?q=13.04072,77.539637&z=16&output=embed";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white text-[#122b42]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <img src="/booking-hospitality-logo-transparent.png" alt="Booking Hospitality" className="h-14 w-auto max-w-full object-contain" />
          <p className="mt-5 text-sm leading-7 text-[#344a5c]/75">
            Hospitality Beyond Borders. Complete travel management for defence,
            government, corporate and leisure travellers.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#087dbd]">Explore</h3>
          <div className="grid gap-3 text-sm text-[#344a5c]/75">
            <Link href="/services" className="transition-colors hover:text-[#087dbd]">Services</Link>
            <Link href="/events" className="transition-colors hover:text-[#087dbd]">Events</Link>
            <Link href="/about-us" className="transition-colors hover:text-[#087dbd]">About us</Link>
            <Link href="/channel-partners" className="transition-colors hover:text-[#087dbd]">Channel Partners</Link>
            <Link href="/clients" className="transition-colors hover:text-[#087dbd]">Clients</Link>
            <Link href="/gallery" className="transition-colors hover:text-[#087dbd]">Gallery</Link>
            <Link href="/contact-us" className="transition-colors hover:text-[#087dbd]">Contact us</Link>
            <Link href="/defence-help-desk" className="transition-colors hover:text-[#087dbd]">Defence help desk</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#087dbd]">Reservations</h3>
          <div className="grid gap-3 text-sm text-[#344a5c]/75">
            <Link href="/bank-details" className="font-semibold text-[#087dbd] transition-colors hover:text-[#075f91]">Bank &amp; payment details</Link>
            <a href="mailto:reservations@bookinghospitality.com" className="transition-colors hover:text-[#087dbd]">reservations@bookinghospitality.com</a>
            <a href="mailto:sales@bookinghospitality.com" className="transition-colors hover:text-[#087dbd]">sales@bookinghospitality.com</a>
            <a href="mailto:info@bookinghospitality.com" className="transition-colors hover:text-[#087dbd]">info@bookinghospitality.com</a>
            <a href="https://wa.me/919945123211" className="transition-colors hover:text-[#087dbd]">WhatsApp: +91 99451 23211</a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#087dbd]">Office</h3>
          <div className="grid gap-4 text-sm text-[#344a5c]/75">
            <a href="tel:+919916356691" className="flex gap-3 transition-colors hover:text-[#087dbd]">
              <Phone className="size-4 shrink-0 text-[#087dbd]" /> +91 99163 56691
            </a>
            <span className="flex gap-3"><Mail className="size-4 shrink-0 text-[#087dbd]" />24x7 reservation support</span>
            <span className="flex gap-3 leading-6">
              <MapPin className="mt-1 size-4 shrink-0 text-[#087dbd]" />
              <span>The Mashaal Officers Institute (TMOI)<br />HMT Main Road, Jalahalli East<br />Bengaluru - 560014</span>
            </span>

            <div className="group relative h-36 overflow-hidden rounded-xl border border-black/10 bg-slate-100 shadow-sm">
              <iframe
                src={locationEmbedUrl}
                title="Booking Hospitality office location"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0 transition-transform duration-300 group-hover:scale-105"
              />
              <a
                href={locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open office location in Google Maps"
                className="absolute inset-0 flex items-end bg-transparent p-2 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#087dbd]"
              >
                <span className="ml-auto flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#087dbd] shadow-md">
                  View map <ExternalLink className="size-3" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/5 px-5 py-5 text-center text-xs text-[#344a5c]/50">
        &copy; {new Date().getFullYear()} Booking Hospitality &amp; Leisure Infra LLP.
      </div>
    </footer>
  );
}

