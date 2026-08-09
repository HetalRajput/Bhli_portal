"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, Star } from "lucide-react";
import { getErrorMessage } from "@/lib/api/client";
import { portalService, type ServiceRating } from "@/lib/api/portal";

export default function ServiceRatings({ serviceSlug }: { serviceSlug: string }) {
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [ratings, setRatings] = useState<ServiceRating[]>([]);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([portalService.service(serviceSlug), portalService.ratings({ service_slug: serviceSlug, page_size: 6 })])
      .then(([service, response]) => {
        if (!active) return;
        setServiceId(service.id);
        setRatings(response.data);
      })
      .catch((requestError) => { if (active) setError(getErrorMessage(requestError)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [serviceSlug]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!serviceId) return setError("This service is unavailable for reviews right now.");
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await portalService.submitRating({
        service: serviceId,
        rating,
        title: String(form.get("title") || "").trim(),
        review: String(form.get("review") || "").trim(),
        is_anonymous: form.get("is_anonymous") === "true",
      });
      setSuccess("Thank you. Your review was submitted and will appear after approval.");
      event.currentTarget.reset();
      setRating(5);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  }

  const average = ratings.length ? ratings.reduce((total, item) => total + item.rating, 0) / ratings.length : 0;

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8 lg:pb-24">
      <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(6,55,92,.08)] lg:grid-cols-[1.1fr_.9fr]">
        <div className="p-7 sm:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[.24em] text-[#087fbe]">Client feedback</p>
          <div className="mt-3 flex flex-wrap items-end gap-4"><h2 className="font-serif text-4xl">Hospitality experiences, reviewed.</h2>{average > 0 && <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700"><Star className="size-4 fill-current" />{average.toFixed(1)}</span>}</div>
          {loading ? <p className="mt-8 flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="size-4 animate-spin" />Loading reviews...</p> : ratings.length ? <div className="mt-8 grid gap-4 sm:grid-cols-2">{ratings.map((item) => <article key={item.id} className="rounded-2xl border border-slate-100 bg-[#f8fbfd] p-5"><div className="flex gap-1 text-amber-500">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-4 ${index < item.rating ? "fill-current" : "text-slate-200"}`} />)}</div><h3 className="mt-3 font-bold text-[#173c58]">{item.title || "Service review"}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.review || "A positive service experience."}</p><p className="mt-3 text-xs font-semibold text-[#087fbe]">{item.user_name}{item.is_verified ? " · Verified booking" : ""}</p>{item.admin_reply && <p className="mt-3 rounded-xl bg-white p-3 text-xs leading-5 text-slate-500"><b>BHLI:</b> {item.admin_reply}</p>}</article>)}</div> : <p className="mt-8 rounded-2xl bg-[#f5f9fc] p-6 text-sm text-slate-500">No approved reviews yet. Be the first to share your experience.</p>}
        </div>
        <form onSubmit={submit} className="bg-[#07345d] p-7 text-white sm:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[.22em] text-[#36c5f0]">Rate this service</p>
          <h2 className="mt-3 font-serif text-3xl">Share your experience</h2>
          <div className="mt-6 flex gap-2" role="radiogroup" aria-label="Rating">{Array.from({ length: 5 }, (_, index) => index + 1).map((value) => <button key={value} type="button" role="radio" aria-checked={rating === value} onClick={() => setRating(value)} className="rounded-lg p-1 text-amber-400"><Star className={`size-7 ${value <= rating ? "fill-current" : "text-white/25"}`} /></button>)}</div>
          <label className="mt-5 block text-xs font-bold">Review title<input name="title" maxLength={120} className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#36c5f0]" placeholder="What stood out?" /></label>
          <label className="mt-4 block text-xs font-bold">Your review<textarea name="review" maxLength={1500} rows={4} className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-white/10 p-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#36c5f0]" placeholder="Tell us about the service you received" /></label>
          <label className="mt-4 flex items-center gap-3 text-xs text-white/70"><input name="is_anonymous" value="true" type="checkbox" className="size-4 accent-[#13a5d8]" />Submit anonymously</label>
          {error && <p role="alert" className="mt-4 rounded-xl bg-red-500/15 p-3 text-xs text-red-100">{error}</p>}
          {success && <p className="mt-4 flex gap-2 rounded-xl bg-emerald-400/15 p-3 text-xs text-emerald-100"><CheckCircle2 className="size-4 shrink-0" />{success}</p>}
          <button disabled={saving || !serviceId} className="mt-6 rounded-full bg-[#13a5d8] px-7 py-3 text-sm font-extrabold text-[#061f3b] disabled:opacity-50">{saving ? "Submitting..." : "Submit review"}</button>
        </form>
      </div>
    </section>
  );
}
