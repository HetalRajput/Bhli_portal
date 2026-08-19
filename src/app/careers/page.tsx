"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CalendarDays, Clock3, IndianRupee, Laptop, MapPin, Search, X } from "lucide-react";
import { getErrorMessage } from "@/lib/api/client";
import { workflowService, type Career } from "@/lib/api/workflows";
import { Field, FormNotice, TextArea } from "@/components/WorkflowField";

function JobCard({ job, onOpen }: { job: Career; onOpen: (job: Career) => void }) {
  const details = [
    { label: "Location", value: job.location, Icon: MapPin },
    { label: "Experience", value: job.experience || "Open experience", Icon: Clock3 },
    { label: "Employment type", value: job.employment_type, Icon: BriefcaseBusiness },
    { label: "Work mode", value: job.work_mode, Icon: Laptop },
    { label: "Salary range", value: job.salary_range, Icon: IndianRupee },
    {
      label: "Apply by",
      value: job.closing_date
        ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(job.closing_date))
        : "",
      Icon: CalendarDays,
    },
  ].filter((detail) => detail.value);

  return <article className="flex h-full flex-col rounded-3xl border border-sky-100 bg-white p-5 shadow-sm sm:p-7">
    <div className="flex justify-between gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-sky-50 text-[#087dbd]"><BriefcaseBusiness /></span><span className="h-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{job.vacancy_count} opening{job.vacancy_count === 1 ? "" : "s"}</span></div>
    <h3 className="mt-5 text-2xl font-bold">{job.title}</h3>
    <p className="mt-2 text-sm font-semibold text-[#087dbd]">{job.department_name}</p>
    <p className="mt-4 leading-7 text-slate-600">{job.short_description}</p>
    <dl className="mt-5 grid gap-x-5 gap-y-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
      {details.map(({ label, value, Icon }) => <div key={label} className="flex min-w-0 items-start gap-2.5">
        <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#087dbd]" />
        <div className="min-w-0"><dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-0.5 text-sm font-medium text-slate-600">{value}</dd></div>
      </div>)}
    </dl>
    <button type="button" onClick={() => onOpen(job)} className="mt-7 w-full rounded-full bg-[#087dbd] px-6 py-3 font-bold text-white transition hover:bg-[#066a9f] sm:w-fit">View &amp; apply</button>
  </article>;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Career[]>([]), [selected, setSelected] = useState<Career | null>(null);
  const [search, setSearch] = useState(""), [loading, setLoading] = useState(true), [saving, setSaving] = useState(false);
  const [error, setError] = useState(""), [success, setSuccess] = useState("");

  useEffect(() => { workflowService.careers().then(setJobs).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false)); }, []);
  const filteredJobs = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return jobs;
    return jobs.filter((job) => [job.title, job.department_name, job.location, job.experience, job.employment_type, job.work_mode, job.short_description].some((value) => value?.toLocaleLowerCase().includes(query)));
  }, [jobs, search]);
  const open = async (job: Career) => { setSelected(job); setError(""); setSuccess(""); try { setSelected(await workflowService.career(job.slug)); } catch {} };
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (!selected) return; setSaving(true); setError(""); setSuccess("");
    const form = e.currentTarget;
    try { const fd = new FormData(form), file = fd.get("resume"); if (file instanceof File && file.size > 5242880) throw new Error("Resume must be 5 MB or smaller."); await workflowService.apply(selected.slug, fd); form.reset(); setSuccess("Application submitted successfully. We will contact shortlisted candidates."); }
    catch (requestError) { setError(getErrorMessage(requestError)); } finally { setSaving(false); }
  };

  return <div className="bg-[#f5faff]">
    <section className="bg-gradient-to-br from-[#061f3b] via-[#075a91] to-[#10a4d5] px-4 py-16 text-white sm:px-5 sm:py-24"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-sky-200 sm:text-base sm:tracking-[.25em]">Build meaningful journeys</p><h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">Careers at Booking Hospitality</h1><p className="mt-5 max-w-2xl text-base leading-7 text-sky-50/85 sm:text-lg">Join a team shaping dependable travel and hospitality experiences across India.</p></div></section>
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><h2 className="font-serif text-4xl font-bold">Open positions</h2><p className="mt-2 text-slate-600">Find the role where your experience can make an impact.</p></div>
        <div className="relative w-full md:max-w-md"><label htmlFor="career-search" className="sr-only">Search open positions</label><Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#087dbd]" /><input id="career-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search role, department or location" className="h-14 w-full rounded-2xl border border-sky-100 bg-white pl-12 pr-12 text-sm font-semibold text-[#122b42] shadow-sm outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-[#10a4d5] focus:ring-4 focus:ring-sky-100" />{search && <button type="button" onClick={() => setSearch("")} aria-label="Clear career search" className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="size-4" /></button>}</div>
      </div>
      {!loading && jobs.length > 0 && <p className="mb-6 mt-5 text-sm text-slate-500" aria-live="polite">Showing <b className="text-[#087dbd]">{filteredJobs.length}</b> of {jobs.length} open position{jobs.length === 1 ? "" : "s"}</p>}
      {loading ? <p className="py-16 text-center">Loading opportunities...</p> : filteredJobs.length ? <div className="grid items-stretch gap-5 md:grid-cols-2">{filteredJobs.map((job) => <JobCard key={job.id} job={job} onOpen={(selectedJob) => void open(selectedJob)} />)}</div> : jobs.length ? <div className="rounded-3xl border border-sky-100 bg-white p-12 text-center"><Search className="mx-auto size-8 text-slate-300" /><h3 className="mt-4 text-xl font-bold">No matching positions</h3><p className="mt-2 text-slate-500">Try another role, department, location or keyword.</p><button type="button" onClick={() => setSearch("")} className="mt-5 rounded-full bg-sky-50 px-5 py-2.5 text-sm font-bold text-[#087dbd]">Clear search</button></div> : <div className="rounded-3xl border bg-white p-12 text-center">No active openings right now. Please check again soon.</div>}
    </section>
    {selected && <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#061f3b]/70 p-4 backdrop-blur-sm"><div className="mx-auto my-8 max-w-3xl rounded-3xl bg-white p-6 shadow-2xl md:p-9"><div className="flex justify-between"><div><p className="text-sm font-bold text-[#087dbd]">{selected.department_name}<span aria-hidden="true" className="mx-2">·</span>{selected.location}</p><h2 className="text-3xl font-bold">{selected.title}</h2></div><button onClick={() => setSelected(null)} aria-label="Close"><X /></button></div><p className="mt-5 leading-7 text-slate-600">{selected.description || selected.short_description}</p><div className="mt-5 grid gap-5 md:grid-cols-2">{[["Responsibilities", selected.responsibilities], ["Requirements", selected.requirements], ["Benefits", selected.benefits]].filter((x) => x[1]).map((x) => <div key={x[0]}><h3 className="font-bold">{x[0]}</h3><p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">{x[1]}</p></div>)}</div><form onSubmit={submit} className="mt-8 border-t pt-7"><h3 className="text-xl font-bold">Apply for this role</h3><div className="mt-5 grid gap-4 md:grid-cols-2"><Field name="full_name" label="Full name" required /><Field name="email" type="email" label="Email" required /><Field name="mobile_number" label="Mobile number" required /><Field name="current_company" label="Current company" /><Field name="current_designation" label="Current designation" /><Field name="experience_years" type="number" step="0.1" label="Experience (years)" /><Field name="current_salary" label="Current salary" /><Field name="expected_salary" label="Expected salary" /><Field name="notice_period" label="Notice period" /><Field name="resume" type="file" accept=".pdf,.doc,.docx" label="Resume (max 5 MB)" required /></div><TextArea name="cover_letter" label="Cover letter" className="mt-4" /><div className="mt-5"><FormNotice error={error} success={success} /></div><button disabled={saving} className="mt-5 rounded-full bg-[#087dbd] px-7 py-3 font-bold text-white">{saving ? "Submitting..." : "Submit application"}</button></form></div></div>}
  </div>;
}
