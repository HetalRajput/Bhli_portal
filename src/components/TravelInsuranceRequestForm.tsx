"use client";

import { FormEvent, ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft, CalendarDays, CheckCircle2, FileCheck2, FileUp, Globe2,
  HeartPulse, Mail, MapPin, Phone, Plane, Send, ShieldCheck, UserRound,
} from "lucide-react";
import BookingSuccessModal from "@/components/BookingSuccessModal";
import { useSuccessChime } from "@/hooks/useSuccessChime";
import { getErrorMessage } from "@/lib/api/client";
import type { TravelInsuranceBookingFields, TravellerType } from "@/lib/api/travelInsurance";
import {
  useCountriesQuery, useServiceQuery, useSubmitTravelInsuranceBookingMutation,
  useTravelInsuranceTypesQuery, useVisaTypesQuery,
} from "@/store/websiteApi";

type Values = {
  full_name: string; dob: string; mobile: string; email: string; passport_number: string;
  nationality: string; traveller_type: TravellerType | ""; number_of_travellers: string;
  insurance_type: string; destination_country: string; trip_start_date: string;
  trip_end_date: string; purpose_of_travel: string; visa_type: string;
  other_add_ons: string; coverage_amount_required: string; remarks: string;
};

type Documents = { passport_copy: File | null; visa_copy: File | null; other_document: File | null };

const initialValues: Values = {
  full_name: "", dob: "", mobile: "", email: "", passport_number: "", nationality: "",
  traveller_type: "", number_of_travellers: "1", insurance_type: "", destination_country: "",
  trip_start_date: "", trip_end_date: "", purpose_of_travel: "", visa_type: "",
  other_add_ons: "", coverage_amount_required: "", remarks: "",
};
const initialDocuments: Documents = { passport_copy: null, visa_copy: null, other_document: null };
const coverageOptions = [
  "Medical Expenses Cover", "Personal Accident Cover", "Baggage Loss / Delay",
  "Trip Cancellation / Interruption", "Passport Loss", "Emergency Assistance",
];
const travellerTypeOptions: ReadonlyArray<readonly [TravellerType, string]> = [
  ["adult", "Adult"],
  ["child", "Child"],
  ["senior_citizen", "Senior Citizen"],
];

const toLocalDateValue = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

export default function TravelInsuranceRequestForm() {
  const router = useRouter();
  const pathname = usePathname();
  const [values, setValues] = useState(initialValues);
  const [coverage, setCoverage] = useState<string[]>([]);
  const [documents, setDocuments] = useState<Documents>(initialDocuments);
  const [declaration, setDeclaration] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const { data: service, isLoading: loadingService } = useServiceQuery("travel-insurance");
  const { data: insuranceTypes = [], isLoading: loadingInsurance, error: insuranceError } = useTravelInsuranceTypesQuery();
  const { data: countries = [], isLoading: loadingCountries, error: countryError } = useCountriesQuery();
  const { data: visaTypes = [], isLoading: loadingVisas, error: visaError } = useVisaTypesQuery();
  const [submitBooking, { isLoading: submitting }] = useSubmitTravelInsuranceBookingMutation();
  const successChime = useSuccessChime();
  const loading = loadingService || loadingInsurance || loadingCountries || loadingVisas;
  const today = toLocalDateValue(new Date());
  const update = <K extends keyof Values>(key: K, value: Values[K]) => setValues((current) => ({ ...current, [key]: value }));

  const toggleCoverage = (item: string) => setCoverage((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  const reset = () => {
    setValues(initialValues); setCoverage([]); setDocuments(initialDocuments); setDeclaration(false); setError("");
    (typeof document !== "undefined" ? document.getElementById("travel-insurance-form") as HTMLFormElement | null : null)?.reset();
  };
  const chooseFile = (key: keyof Documents, file: File | null) => {
    if (file && file.size > 10_485_760) return setError("Each document must be 10 MB or smaller.");
    setError(""); setDocuments((current) => ({ ...current, [key]: file }));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!values.full_name.trim()) return setError("Please enter the traveller's full name.");
    if (!values.dob) return setError("Please enter the traveller's date of birth.");
    if (values.dob >= today) return setError("Date of birth must be in the past.");
    if (!/^\+?[0-9\s-]{7,15}$/.test(values.mobile.trim())) return setError("Please enter a valid mobile number.");
    if (!/^\S+@\S+\.\S+$/.test(values.email)) return setError("Please enter a valid email address.");
    if (!values.passport_number.trim()) return setError("Please enter the passport number.");
    if (!values.nationality || !values.traveller_type) return setError("Please select nationality and traveller type.");
    const travellerCount = Number(values.number_of_travellers);
    if (!Number.isInteger(travellerCount) || travellerCount < 1) return setError("Number of travellers must be at least 1.");
    if (!values.insurance_type || !values.destination_country) return setError("Please select an insurance type and destination country.");
    if (!values.trip_start_date || !values.trip_end_date) return setError("Please enter both trip dates.");
    if (values.trip_start_date < today) return setError("Trip start date cannot be in the past.");
    if (values.trip_end_date < values.trip_start_date) return setError("Trip end date cannot be before the start date.");
    if (!values.purpose_of_travel.trim()) return setError("Please enter the purpose of travel.");
    if (!declaration) return setError("Please accept the declaration before submitting.");
    if (!localStorage.getItem("access_token")) { router.push(`/login?redirect=${encodeURIComponent(pathname)}`); return; }
    if (!service?.id) return setError("Travel Insurance is not available right now. Please try again shortly.");

    const formData = new FormData();
    const requiredPayload: TravelInsuranceBookingFields = {
      service: String(service.id), full_name: values.full_name.trim(), dob: values.dob,
      mobile: values.mobile.trim(), email: values.email.trim(), passport_number: values.passport_number.trim().toUpperCase(),
      nationality: values.nationality, traveller_type: values.traveller_type,
      number_of_travellers: values.number_of_travellers, insurance_type: values.insurance_type,
      destination_country: values.destination_country, trip_start_date: values.trip_start_date,
      trip_end_date: values.trip_end_date, purpose_of_travel: values.purpose_of_travel.trim(), declaration_accepted: "true",
    };
    Object.entries(requiredPayload).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value);
    });
    (["visa_type", "other_add_ons", "coverage_amount_required", "remarks"] as const).forEach((key) => {
      if (values[key].trim()) formData.append(key, values[key].trim());
    });
    coverage.forEach((item) => formData.append("coverage_requirements", item));
    Object.entries(documents).forEach(([key, file]) => { if (file) formData.append(key, file); });

    successChime.arm();
    try {
      const response = await submitBooking(formData).unwrap();
      const booking = response.data?.booking;
      const id = typeof booking === "number" ? booking : booking?.id ?? response.data?.id;
      setReference(id ? `BH${String(id).padStart(6, "0")}` : response.reference || "Submitted");
      successChime.play();
    } catch (submitError) { setError(getErrorMessage(submitError)); }
  }

  if (reference) return <BookingSuccessModal reference={reference} serviceName="Travel Insurance" heading="Travel insurance request received" description="Our team will contact you with suitable policy options, coverage details and premium information." backHref="/services" backLabel="Back to services" />;

  return (
    <div className="min-h-screen bg-[#edf5f9] pb-10 text-[#122b42]">
      <section className="relative overflow-hidden bg-[#061f3b] px-5 pb-28 pt-9 text-white lg:px-8">
        <div className="absolute -right-24 -top-40 size-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"><ArrowLeft className="size-4" />All services</Link>
          <p className="mt-8 text-[11px] font-extrabold uppercase tracking-[.28em] text-[#4fc3ea]">BHLI travel protection</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl sm:text-5xl md:text-6xl">Travel with confidence, wherever you go.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65">Tell us about your journey and coverage needs. We’ll help you compare suitable travel insurance options.</p>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-20 max-w-6xl px-5 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_90px_rgba(6,31,59,.2)] lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="relative hidden bg-gradient-to-b from-[#061f3b] to-[#073d69] p-7 text-white lg:flex lg:flex-col">
            <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-[#4fc3ea]"><ShieldCheck className="size-7" /></span>
            <h2 className="mt-7 font-serif text-3xl">Protection for the unexpected</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">Coverage depends on the selected insurer and policy. Our team will explain premiums, exclusions and deductibles before you proceed.</p>
            <div className="mt-8 space-y-4 text-sm text-white/75">
              {["Medical and emergency cover options", "Trip and baggage protection", "Secure document submission"].map((item) => <p key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#4fc3ea]" />{item}</p>)}
            </div>
            <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#4fc3ea]">Your trip</p>
              <p className="mt-3 flex items-center gap-2 text-sm font-bold"><MapPin className="size-4 text-[#4fc3ea]" />{countries.find((item) => String(item.id) === values.destination_country)?.name || "Destination not selected"}</p>
              <p className="mt-2 text-xs text-white/55">{values.trip_start_date || "Start date"} — {values.trip_end_date || "End date"}</p>
            </div>
          </aside>

          <form id="travel-insurance-form" onSubmit={submit} className="p-5 sm:p-7 md:p-9" encType="multipart/form-data" noValidate>
            <input type="hidden" name="service" value={service?.id || ""} />
            <header className="mb-8"><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#087fbe]">BHLI LLP</p><h2 className="mt-2 font-serif text-3xl font-semibold text-[#061f3b]">Travel Insurance Request Form</h2><p className="mt-2 text-xs text-slate-400">Fields marked with an asterisk are required.</p></header>

            {(insuranceError || countryError || visaError) && <p role="alert" className="mb-6 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700">Some selection lists could not be loaded. Please refresh the page and try again.</p>}

            <FormSection number="01" title="Traveller Details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" required icon={<UserRound />}><input name="full_name" value={values.full_name} onChange={(e) => update("full_name", e.target.value)} autoComplete="name" /></Field>
                <Field label="Date of Birth" required icon={<CalendarDays />}><input name="dob" type="date" max={today} value={values.dob} onChange={(e) => update("dob", e.target.value)} /></Field>
                <Field label="Mobile Number" required icon={<Phone />}><input name="mobile" type="tel" inputMode="tel" value={values.mobile} onChange={(e) => update("mobile", e.target.value)} autoComplete="tel" /></Field>
                <Field label="Email Address" required icon={<Mail />}><input name="email" type="email" value={values.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" /></Field>
                <Field label="Passport Number" required icon={<FileCheck2 />}><input name="passport_number" value={values.passport_number} onChange={(e) => update("passport_number", e.target.value)} autoComplete="off" /></Field>
                <SelectField name="nationality" label="Nationality" required icon={<Globe2 />} value={values.nationality} onChange={(value) => update("nationality", value)} loading={loadingCountries} placeholder="Select nationality">{countries.map((country) => <option key={country.id} value={country.country_code}>{country.name} ({country.country_code})</option>)}</SelectField>
              </div>
              <fieldset className="mt-4"><legend className="mb-2 text-xs font-bold text-[#456078]">Traveller Type <b className="text-red-500">*</b></legend><div className="flex flex-wrap gap-2">{travellerTypeOptions.map(([value, label]) => <Choice key={value} selected={values.traveller_type === value}><input className="sr-only" type="radio" name="traveller_type" value={value} checked={values.traveller_type === value} onChange={() => update("traveller_type", value)} />{label}</Choice>)}</div></fieldset>
              <div className="mt-4 max-w-xs"><Field label="Number of Travellers" required icon={<UserRound />}><input name="number_of_travellers" type="number" min="1" max="99" step="1" inputMode="numeric" value={values.number_of_travellers} onChange={(e) => update("number_of_travellers", e.target.value)} /></Field></div>
            </FormSection>

            <FormSection number="02" title="Trip Details">
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField name="insurance_type" label="Insurance Type" required icon={<ShieldCheck />} value={values.insurance_type} onChange={(value) => update("insurance_type", value)} loading={loadingInsurance} placeholder="Select insurance type">{insuranceTypes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</SelectField>
                <SelectField name="destination_country" label="Destination Country" required icon={<MapPin />} value={values.destination_country} onChange={(value) => update("destination_country", value)} loading={loadingCountries} placeholder="Select destination">{countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}</SelectField>
                <Field label="Trip Start Date" required icon={<CalendarDays />}><input name="trip_start_date" type="date" min={today} value={values.trip_start_date} onChange={(e) => update("trip_start_date", e.target.value)} /></Field>
                <Field label="Trip End Date" required icon={<CalendarDays />}><input name="trip_end_date" type="date" min={values.trip_start_date || today} value={values.trip_end_date} onChange={(e) => update("trip_end_date", e.target.value)} /></Field>
                <Field label="Purpose of Travel" required icon={<Plane />}><input name="purpose_of_travel" value={values.purpose_of_travel} onChange={(e) => update("purpose_of_travel", e.target.value)} placeholder="Tourism, business, study…" /></Field>
                <SelectField name="visa_type" label="Visa Type (Optional)" icon={<FileCheck2 />} value={values.visa_type} onChange={(value) => update("visa_type", value)} loading={loadingVisas} placeholder="Select visa type">{visaTypes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</SelectField>
              </div>
            </FormSection>

            <FormSection number="03" title="Coverage Requirements">
              <div className="grid gap-2 sm:grid-cols-2">{coverageOptions.map((item) => <label key={item} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-xs font-bold transition ${coverage.includes(item) ? "border-sky-400 bg-sky-50 text-[#087fbe]" : "border-slate-200 text-slate-600 hover:border-sky-200"}`}><input name="coverage_requirements" value={item} type="checkbox" checked={coverage.includes(item)} onChange={() => toggleCoverage(item)} className="size-4 accent-[#087fbe]" />{item}</label>)}</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Other Add-ons" icon={<HeartPulse />}><input name="other_add_ons" value={values.other_add_ons} onChange={(e) => update("other_add_ons", e.target.value)} placeholder="Adventure sports cover" /></Field>
                <Field label="Coverage Amount Required" icon={<ShieldCheck />}><input name="coverage_amount_required" value={values.coverage_amount_required} onChange={(e) => update("coverage_amount_required", e.target.value)} placeholder="e.g. USD 100,000" /></Field>
              </div>
            </FormSection>

            <FormSection number="04" title="Documents & Additional Information">
              <div className="grid gap-3 sm:grid-cols-3">
                <FileField name="passport_copy" label="Passport Copy" file={documents.passport_copy} onChange={(file) => chooseFile("passport_copy", file)} />
                <FileField name="visa_copy" label="Visa Copy" file={documents.visa_copy} onChange={(file) => chooseFile("visa_copy", file)} />
                <FileField name="other_document" label="Other Document" file={documents.other_document} onChange={(file) => chooseFile("other_document", file)} />
              </div>
              <label className="mt-4 block text-xs font-bold text-[#456078]">Remarks / Additional Notes<textarea name="remarks" value={values.remarks} onChange={(e) => update("remarks", e.target.value)} rows={4} placeholder="Share any health, itinerary or special coverage requirements." className="mt-2 w-full resize-y rounded-xl border border-slate-200 p-4 text-sm font-normal leading-6 outline-none focus:border-[#13a5d8] focus:ring-4 focus:ring-sky-100" /></label>
            </FormSection>

            <FormSection number="05" title="Declaration">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/70 p-4 text-xs leading-5 text-slate-600"><input name="declaration_accepted" value="true" type="checkbox" checked={declaration} onChange={(e) => setDeclaration(e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[#087fbe]" /><span>I confirm that the information provided is correct and authorize BHLI LLP to contact me regarding suitable travel insurance options. I understand that premiums, coverage, exclusions, deductibles and policy terms depend on the selected insurer and policy.</span></label>
            </FormSection>

            {error && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={reset} className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-500 transition hover:border-slate-300">Reset Form</button><button type="submit" disabled={submitting || loading} className="inline-flex min-w-60 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-sky-600/20 disabled:opacity-60">{loading ? "Loading options..." : submitting ? "Submitting..." : "Submit Insurance Request"}<Send className="size-4" /></button></div>
          </form>
        </div>
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-400"><ShieldCheck className="size-4 shrink-0 text-[#087fbe]" />Your details and documents are securely sent to BHLI for quotation.</p>
      </main>
    </div>
  );
}

function FormSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <section className="mb-8"><div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3"><span className="grid size-8 place-items-center rounded-xl bg-[#e4f5fb] text-[10px] font-extrabold text-[#087fbe]">{number}</span><h3 className="font-serif text-xl font-semibold text-[#061f3b]">{title}</h3></div>{children}</section>;
}
function Field({ label, required, icon, children }: { label: string; required?: boolean; icon: ReactNode; children: ReactNode }) {
  return <label className="text-xs font-bold text-[#456078]">{label}{required && <b className="text-red-500"> *</b>}<span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-[#087fbe] transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-sky-100 [&_input]:min-w-0 [&_input]:flex-1 [&_input]:bg-transparent [&_input]:text-sm [&_input]:font-semibold [&_input]:text-[#122b42] [&_input]:outline-none">{icon}{children}</span></label>;
}
function SelectField({ name, label, required, icon, value, onChange, loading, placeholder, children }: { name: string; label: string; required?: boolean; icon: ReactNode; value: string; onChange: (value: string) => void; loading: boolean; placeholder: string; children: ReactNode }) {
  return <label className="text-xs font-bold text-[#456078]">{label}{required && <b className="text-red-500"> *</b>}<span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-[#087fbe] transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-sky-100">{icon}<select name={name} value={value} onChange={(event) => onChange(event.target.value)} disabled={loading} className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#122b42] outline-none"><option value="">{loading ? "Loading..." : placeholder}</option>{children}</select></span></label>;
}
function Choice({ selected, children }: { selected: boolean; children: ReactNode }) {
  return <label className={`cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-bold transition ${selected ? "border-[#087fbe] bg-[#087fbe] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-sky-300"}`}>{children}</label>;
}
function FileField({ name, label, file, onChange }: { name: keyof Documents; label: string; file: File | null; onChange: (file: File | null) => void }) {
  return <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-sky-200 bg-[#f8fcfe] p-4 text-center transition hover:border-sky-400"><FileUp className="size-5 text-[#087fbe]" /><b className="mt-2 text-xs text-[#173852]">{label}</b><span className="mt-1 max-w-full truncate text-[10px] text-slate-400">{file?.name || "PDF or image · max 10 MB"}</span><input name={name} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(event) => onChange(event.target.files?.[0] || null)} className="sr-only" /></label>;
}
