"use client";

import {
  Building2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { FormEvent, useState, useEffect } from "react";
import { baseService, type ContactLeadPayload } from "@/lib/api/base";
import { getErrorMessage } from "@/lib/api/client";

interface EnquiryTypeItem {
  id: number;
  name: string;
  slug: string;
}

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [enquiryType, setEnquiryType] = useState("Leisure travel");
  const [enquiryTypes, setEnquiryTypes] = useState<EnquiryTypeItem[]>([]);
  const [message, setMessage] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchEnquiryTypes = async () => {
      try {
        const res = await baseService.getEnquiryTypes();
        console.log("Enquiry Types API Response:", res);
        if (res && res.success && Array.isArray(res.data)) {
          setEnquiryTypes(res.data);
          if (res.data.length > 0) {
            setEnquiryType(res.data[0].id.toString());
          }
        } else if (res && Array.isArray(res)) {
          setEnquiryTypes(res);
          if (res.length > 0) {
            setEnquiryType(res[0].id.toString());
          }
        }
      } catch (err) {
        console.warn("Failed to fetch enquiry types", err);
      }
    };
    fetchEnquiryTypes();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    const missingFields = [
      !trimmedName && "full name",
      !trimmedPhone && "phone number",
      !trimmedEmail && "email address",
      !trimmedMessage && "requirement details",
    ].filter(Boolean);

    if (missingFields.length > 0) {
      setError(`Please enter: ${missingFields.join(String.fromCharCode(44, 32))}.`);
      return;
    }

    if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      setError("Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: ContactLeadPayload = {
        name: trimmedName,
        email: trimmedEmail,
        mobile_number: trimmedPhone,
        subject: `General Contact`,
        message: trimmedMessage
      };

      if (enquiryTypes.length > 0) {
        payload.service = parseInt(enquiryType);
        payload.enquiry_type = payload.service;
        const selectedType = enquiryTypes.find(t => t.id === payload.service);
        if (selectedType) {
          payload.subject = `General Contact - ${selectedType.name}`;
        }
      } else {
        payload.subject = `General Contact - ${enquiryType}`;
      }

      console.log("Contact Lead Submission Payload:", payload);
      const res = await baseService.createContactLead(payload);
      console.log("Contact Lead Submission Response:", res);

      setIsSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f5f9fc] text-[#122b42]">
      {/* Hero Header */}
      <section className="bg-[#062b50] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]">
            Contact us
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl md:text-7xl">
            Tell us where you need to go. We will take it from there.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Reach the right desk for personal travel, official movement, defence support or business requirements.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {[
          [Phone, "Call us", "+91 99163 56691"],
          [Mail, "Email", "reservations@bookinghospitality.com"],
          [MessageCircle, "WhatsApp", "+91 99451 23211"],
          [Clock, "Availability", "Reservation support: 24x7"]
        ].map(([Icon, title, text]) => (
          <div key={String(title)} className="rounded-3xl bg-white p-7 shadow-sm">
            <Icon className="size-7 text-[#087fbe]" />
            <h2 className="mt-6 font-serif text-xl">{String(title)}</h2>
            <p className="mt-2 text-sm text-black/50">{String(text)}</p>
          </div>
        ))}
      </section>

      {/* Form & Sidebar Grid */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-10">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-[#087fbe]">
            Send an enquiry
          </p>
          <h2 className="mt-3 font-serif text-4xl">How can we help?</h2>

          {isSuccess ? (
            <div className="mt-8 p-6 rounded-2xl bg-[#e4f8ee] border border-emerald-300 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#178653] mx-auto" />
              <h3 className="text-2xl font-serif font-bold text-[#122b42]">Enquiry Submitted Successfully</h3>
              <p className="text-sm text-[#456276]">
                Thank you for contacting BHLI. Our reservation team has received your message and will get back to you shortly.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-4 rounded-full bg-[#07345d] px-6 py-2.5 text-sm font-bold text-white shadow"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
              {error && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 flex items-center gap-2.5"
                >
                  <AlertCircle className="size-5 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  Full name *
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl border border-black/10 bg-[#f8fbfd] px-4 py-3.5 outline-none focus:border-[#087fbe]"
                    placeholder="Your full name"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold">
                  Phone number *
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="rounded-xl border border-black/10 bg-[#f8fbfd] px-4 py-3.5 outline-none focus:border-[#087fbe]"
                    placeholder="10-digit mobile number"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  Email address *
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border border-black/10 bg-[#f8fbfd] px-4 py-3.5 outline-none focus:border-[#087fbe]"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold">
                  Service *
                  <select
                    value={enquiryType}
                    onChange={(e) => setEnquiryType(e.target.value)}
                    className="rounded-xl border border-black/10 bg-[#f8fbfd] px-4 py-3.5 outline-none focus:border-[#087fbe]"
                  >
                    {enquiryTypes.length > 0 ? (
                      enquiryTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Leisure travel">Leisure travel</option>
                        <option value="Defence travel">Defence travel</option>
                        <option value="Government / Corporate">Government / Corporate</option>
                        <option value="Event management">Event management</option>
                        <option value="Catering services">Catering services</option>
                      </>
                    )}
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-sm font-semibold">
                Tell us about your requirement *
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none rounded-xl border border-black/10 bg-[#f8fbfd] px-4 py-3.5 outline-none focus:border-[#087fbe]"
                  placeholder="Destination, dates, travellers and anything we should know..."
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-fit items-center gap-2 rounded-full bg-[#07345d] px-7 py-3.5 font-bold text-white shadow-lg transition hover:bg-[#062442] disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send enquiry"} <Send className="size-4" />
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-[2rem] bg-[#07345d] p-8 text-white">
            <ShieldCheck className="size-8 text-[#13a5d8]" />
            <h2 className="mt-6 font-serif text-3xl">Defence help desk</h2>
            <p className="mt-4 leading-7 text-white/55">
              For Government and Defence MoU reservations, LTC, entitlements, official travel and documentation assistance. Helplines: +91 97407 56691, +91 72045 18641, +91 99451 23176, +91 72040 56691, +91 99451 23169 and +91 99451 23211.
            </p>
            <a href="https://wa.me/919945123211" target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-full border border-[#13a5d8]/50 px-5 py-2.5 text-sm text-[#13a5d8]">
              WhatsApp: +91 99451 23211
            </a>
          </div>
          <div className="rounded-[2rem] border border-black/10 bg-[#e5f3fa] p-8">
            <Building2 className="size-7 text-[#087fbe]" />
            <h2 className="mt-5 font-serif text-3xl">Office</h2>
            <p className="mt-4 flex gap-3 text-sm leading-7 text-black/55">
              <MapPin className="mt-1 size-5 shrink-0 text-[#087fbe]" />
              The Mashaal Officers Institute-(TMOI)
              HMT Main Road
              Jalahalli East
              Bengaluru - 560014
            </p>
            <div className="mt-7 h-40 rounded-2xl bg-[radial-gradient(circle_at_center,#9ccde2,transparent_2px)] bg-[length:20px_20px] opacity-60" />
          </div>
        </aside>
      </section>
    </div>
  );
}
