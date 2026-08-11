"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  MessageSquareWarning,
  Send,
  Star,
  TicketCheck,
} from "lucide-react";
import { Field, FormNotice, SelectField, TextArea } from "@/components/WorkflowField";
import { getErrorMessage } from "@/lib/api/client";
import { workflowService, type ServiceOption } from "@/lib/api/workflows";

function FormSection({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
      <span className="grid size-8 place-items-center rounded-full bg-sky-100 text-xs font-extrabold text-[#087dbd]">
        {number}
      </span>
      <h3 className="font-serif text-xl font-semibold text-[#061f3b]">{title}</h3>
    </div>
  );
}

export default function ComplaintPage() {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    workflowService.services().then(setServices).catch(() => {});
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);
      const files = formData.getAll("attachments") as File[];

      if (files.some((file) => file.size > 10_485_760)) {
        throw new Error("Each attachment must be 10 MB or smaller.");
      }

      const response = await workflowService.complain(formData);
      setSuccess(
        `Submission received${response?.data?.ticket_number ? `. Ticket: ${response.data.ticket_number}` : ""}. Please save this reference.`,
      );
      form.reset();
      setRating(0);
      setHoveredRating(0);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  };

  const visibleRating = hoveredRating || rating;

  return (
    <main className="bg-gradient-to-b from-[#edf7fc] to-white px-5 py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
        <aside className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#061f3b] via-[#073b67] to-[#087dbd] p-7 text-white shadow-xl shadow-sky-950/10 lg:sticky lg:top-28 md:p-9">
          <span className="grid size-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <MessageSquareWarning className="size-7 text-sky-200" />
          </span>
          <p className="mt-8 text-xs font-extrabold uppercase tracking-[.22em] text-sky-300">Support desk</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight">Complaint &amp; feedback</h1>
          <p className="mt-4 leading-7 text-sky-50/75">
            Tell us what happened. We will route your request to the right service team and create a trackable ticket.
          </p>
          <div className="mt-8 space-y-4 border-t border-white/10 pt-7 text-sm text-sky-50/85">
            <p className="flex items-center gap-3"><TicketCheck className="size-5 text-sky-300" />Trackable ticket reference</p>
            <p className="flex items-center gap-3"><Clock3 className="size-5 text-sky-300" />Priority-based review</p>
            <p className="flex items-center gap-3"><CheckCircle2 className="size-5 text-sky-300" />Secure document upload</p>
          </div>
        </aside>

        <form onSubmit={submit} className="rounded-[2rem] border border-sky-100 bg-white p-5 shadow-[0_18px_60px_rgba(7,61,103,.09)] sm:p-7 md:p-9">
          <div className="mb-8">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#087dbd]">Contact support</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-[#061f3b]">How can we help?</h2>
            <p className="mt-2 text-sm text-slate-500">Fields marked with an asterisk are required.</p>
          </div>

          <section>
            <FormSection number="01" title="Contact details" />
            <div className="grid gap-4 md:grid-cols-2">
              <Field name="full_name" label="Full name" required />
              <Field name="company_name" label="Company name" />
              <Field name="email" type="email" label="Email" required />
              <Field name="mobile_number" type="tel" label="Mobile number" required />
              <SelectField name="preferred_contact_method" label="Preferred contact" required className="md:col-span-2">
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
              </SelectField>
            </div>
          </section>

          <section className="mt-9">
            <FormSection number="02" title="Request details" />
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField name="feedback_type" label="Submission type" required>
                {[
                  ["complaint", "Complaint"], ["feedback", "Feedback"], ["suggestion", "Suggestion"],
                  ["appreciation", "Appreciation"], ["billing_issue", "Billing issue"],
                  ["technical_issue", "Technical issue"], ["service_issue", "Service issue"], ["other", "Other"],
                ].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </SelectField>
              <SelectField name="service" label="Related service">
                <option value="">Select a service</option>
                {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
              </SelectField>
              <SelectField name="priority" label="Priority">
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </SelectField>
              <div className="hidden md:block" />
              <Field name="incident_date" type="date" label="Incident date" />
              <Field name="incident_time" type="time" label="Incident time" />
              <Field name="subject" label="Subject" required className="md:col-span-2" />
            </div>
            <TextArea name="description" label="Description" required className="mt-4" placeholder="Describe what happened and include any useful details." />
          </section>

          <section className="mt-9">
            <FormSection number="03" title="Rating & attachments" />
            <div className="grid gap-5 md:grid-cols-2">
              <fieldset className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <legend className="px-1 text-sm font-semibold text-[#173852]">Overall rating</legend>
                <input type="hidden" name="overall_rating" value={rating || ""} />
                <div className="mt-1 flex items-center gap-1" role="radiogroup" aria-label="Overall rating from 1 to 5 stars" onMouseLeave={() => setHoveredRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      role="radio"
                      aria-checked={rating === star}
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onFocus={() => setHoveredRating(star)}
                      onBlur={() => setHoveredRating(0)}
                      className="rounded-lg p-1.5 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                      <Star className={`size-7 transition-colors ${star <= visibleRating ? "fill-amber-400 text-amber-400" : "fill-white text-slate-300"}`} />
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs font-medium text-slate-500">{rating ? `${rating} out of 5 selected` : "Select a star rating"}</p>
              </fieldset>
              <Field name="attachments" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.txt" label="Attachments (max 10 MB each)" />
            </div>
          </section>

          <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/60 p-4 text-sm text-slate-600">
            <input name="is_information_confirmed" value="true" type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-[#087dbd]" />
            <span>I confirm the supplied information is accurate.</span>
          </label>

          <div className="mt-5"><FormNotice error={error} success={success} /></div>
          <button disabled={saving} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#087dbd] to-[#12a7d7] px-8 py-3.5 font-extrabold text-white shadow-lg shadow-sky-600/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-wait disabled:opacity-60 sm:w-auto">
            {saving ? "Submitting..." : "Submit & create ticket"}
            {!saving && <Send className="size-4" />}
          </button>
        </form>
      </div>
    </main>
  );
}
