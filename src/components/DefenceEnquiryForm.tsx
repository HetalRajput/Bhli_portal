"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { type ContactLeadPayload } from "@/lib/api/base";
import { getErrorMessage } from "@/lib/api/client";
import { useCreateContactLeadMutation, useEnquiryTypesQuery } from "@/store/websiteApi";

type EnquiryTypeItem = {
  id: number;
  name: string;
  slug: string;
};

const fallbackEnquiryTypes = [
  "Leisure travel",
  "Defence travel",
  "Government / Corporate",
  "Event management",
  "Catering services",
];

export default function DefenceEnquiryForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [enquiryType, setEnquiryType] = useState("Defence travel");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { data: enquiryTypeResponse } = useEnquiryTypesQuery();
  const [createContactLead, { isLoading: isSubmitting }] = useCreateContactLeadMutation();
  const enquiryTypes: EnquiryTypeItem[] = enquiryTypeResponse?.data ?? [];
  const defaultRemoteType = enquiryTypes.find((type) => `${type.name} ${type.slug}`.toLowerCase().includes("defence")) ?? enquiryTypes[0];
  const selectedEnquiryType = enquiryTypes.length && !enquiryTypes.some((type) => String(type.id) === enquiryType)
    ? String(defaultRemoteType.id)
    : enquiryType;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      setError(`Please enter: ${missingFields.join(", ")}.`);
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

    const selectedType = enquiryTypes.find((type) => String(type.id) === selectedEnquiryType);
    const selectedTypeName = selectedType?.name ?? selectedEnquiryType;
    const payload: ContactLeadPayload = {
      name: trimmedName,
      email: trimmedEmail,
      mobile_number: trimmedPhone,
      subject: `Defence Desk - ${selectedTypeName}`,
      message: trimmedMessage,
    };

    if (selectedType) {
      payload.service = selectedType.id;
      payload.enquiry_type = selectedType.id;
    }

    try {
      await createContactLead(payload).unwrap();
      setIsSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (submissionError) {
      setError(getErrorMessage(submissionError));
    }
  }

  return (
    <section className="mt-14 rounded-[2rem] bg-white p-6 shadow-sm md:p-10">
      <p className="text-xs font-bold uppercase tracking-[.22em] text-[#087fbe]">Send an enquiry</p>
      <h2 className="mt-3 font-serif text-4xl">How can we help?</h2>

      {isSuccess ? (
        <div className="mt-8 space-y-3 rounded-2xl border border-emerald-300 bg-[#e4f8ee] p-6 text-center">
          <CheckCircle2 className="mx-auto size-12 text-[#178653]" />
          <h3 className="font-serif text-2xl font-bold text-[#122b42]">Enquiry Submitted Successfully</h3>
          <p className="text-sm text-[#456276]">
            Our defence reservation team has received your message and will get back to you shortly.
          </p>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="mt-4 rounded-full bg-[#07345d] px-6 py-2.5 text-sm font-bold text-white shadow"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
          {error && (
            <div role="alert" className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              <AlertCircle className="size-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Full name *
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="rounded-xl border border-black/10 bg-[#f8fbfd] px-4 py-3.5 outline-none focus:border-[#087fbe]"
                placeholder="Your full name"
                autoComplete="name"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Phone number *
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                className="rounded-xl border border-black/10 bg-[#f8fbfd] px-4 py-3.5 outline-none focus:border-[#087fbe]"
                placeholder="10-digit mobile number"
                autoComplete="tel"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Email address *
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-xl border border-black/10 bg-[#f8fbfd] px-4 py-3.5 outline-none focus:border-[#087fbe]"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Service *
              <select
                value={selectedEnquiryType}
                onChange={(event) => setEnquiryType(event.target.value)}
                className="rounded-xl border border-black/10 bg-[#f8fbfd] px-4 py-3.5 outline-none focus:border-[#087fbe]"
              >
                {enquiryTypes.length > 0
                  ? enquiryTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))
                  : fallbackEnquiryTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold">
            Tell us about your requirement *
            <textarea
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
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
    </section>
  );
}
