"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRightLeft,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  FileUp,
  Mail,
  MapPin,
  Phone,
  Search,
  Send,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BookingSuccessModal from "@/components/BookingSuccessModal";
import { getErrorMessage } from "@/lib/api/client";
import { useSuccessChime } from "@/hooks/useSuccessChime";
import { useCurrenciesQuery, useServiceQuery, useSubmitServiceBookingMutation, type CurrencyMaster } from "@/store/websiteApi";

type Values = {
  full_name: string;
  mobile_number: string;
  email: string;
  city: string;
  from_currency: string;
  to_currency: string;
  amount: string;
  purpose: string;
  travel_destination: string;
  travel_date: string;
  passport_number: string;
  collection_delivery: string;
  preferred_datetime: string;
  remarks: string;
};

const initialValues: Values = {
  full_name: "",
  mobile_number: "",
  email: "",
  city: "",
  from_currency: "",
  to_currency: "",
  amount: "",
  purpose: "",
  travel_destination: "",
  travel_date: "",
  passport_number: "",
  collection_delivery: "",
  preferred_datetime: "",
  remarks: "",
};

const purposes = [["travel", "Travel"], ["business", "Business"], ["education", "Education"], ["medical", "Medical"], ["other", "Other"]] as const;

export default function CurrencyExchangeRequestForm() {
  const router = useRouter();
  const pathname = usePathname();
  const [values, setValues] = useState<Values>(initialValues);
  const [document, setDocument] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const { data: currencies = [], isLoading: loadingCurrencies, error: currencyError } = useCurrenciesQuery();
  const { data: service, isLoading: loadingService } = useServiceQuery("currency-exchange");
  const [submitBooking, { isLoading: submitting }] = useSubmitServiceBookingMutation();
  const successChime = useSuccessChime();
  const update = <K extends keyof Values>(key: K, value: Values[K]) => setValues((current) => ({ ...current, [key]: value }));
  const fromCurrency = currencies.find((currency) => String(currency.id) === values.from_currency);
  const toCurrency = currencies.find((currency) => String(currency.id) === values.to_currency);

  const reset = () => {
    setValues(initialValues);
    setDocument(null);
    setConsent(false);
    setError("");
    (documentById("currency-exchange-form") as HTMLFormElement | null)?.reset();
  };

  const chooseDocument = (file: File | null) => {
    if (file && file.size > 10_485_760) {
      setError("The supporting document must be 10 MB or smaller.");
      return;
    }
    setError("");
    setDocument(file);
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!values.full_name.trim()) return setError("Please enter your full name.");
    if (!values.mobile_number.trim()) return setError("Please enter your mobile number.");
    if (!values.from_currency || !values.to_currency) return setError("Select both currencies from the currency master list.");
    if (values.from_currency === values.to_currency) return setError("From currency and to currency must be different.");
    if (!values.amount || Number(values.amount) <= 0) return setError("Enter an amount greater than zero.");
    if (!values.purpose) return setError("Please select the purpose of exchange.");
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) return setError("Please enter a valid email address.");
    if (!consent) return setError("Please accept the declaration before submitting.");
    if (!localStorage.getItem("access_token")) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!service?.id) return setError("Currency Exchange is not available right now. Please try again shortly.");

    const requestData: Record<string, unknown> = {
      service: service.id,
      full_name: values.full_name.trim(),
      mobile_number: values.mobile_number.trim(),
      from_currency: Number(values.from_currency),
      to_currency: Number(values.to_currency),
      amount: Number(values.amount).toFixed(2),
      purpose: values.purpose,
      message: "Please confirm the applicable exchange rate and charges.",
      consent_to_contact: true,
      declaration_accepted: true,
    };
    (["email", "city", "travel_destination", "travel_date", "passport_number", "collection_delivery", "remarks"] as const).forEach((key) => {
      const value = values[key].trim();
      if (value) requestData[key] = value;
    });
    if (values.preferred_datetime) requestData.preferred_datetime = new Date(values.preferred_datetime).toISOString();

    let payload: Record<string, unknown> | FormData = requestData;
    if (document) {
      const formData = new FormData();
      Object.entries(requestData).forEach(([key, value]) => formData.append(key, String(value)));
      formData.append("supporting_document", document);
      payload = formData;
    }

    successChime.arm();
    try {
      const response = await submitBooking({ serviceSlug: "currency-exchange", payload }).unwrap() as { data?: { booking?: { id?: number }; id?: number }; reference?: string };
      const id = response?.data?.booking?.id ?? response?.data?.id;
      setReference(id ? `BH${String(id).padStart(6, "0")}` : response.reference || "Submitted");
      successChime.play();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    }
  }

  if (reference) return <BookingSuccessModal reference={reference} serviceName="Currency Exchange" heading="Currency exchange request received" description="Our team will contact you with the applicable exchange rate, charges and processing details." backHref="/services" backLabel="Back to services" />;

  return (
    <div className="min-h-screen bg-[#edf5f9] pb-10 text-[#122b42]">
      <section className="relative overflow-hidden bg-[#061f3b] px-5 pb-28 pt-9 text-white lg:px-8">
        <div className="absolute -right-24 -top-40 size-[30rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-white/65 hover:text-white"><ArrowLeft className="size-4" />All services</Link>
          <p className="mt-8 text-[11px] font-extrabold uppercase tracking-[.28em] text-[#4fc3ea]">BHLI financial travel assistance</p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl md:text-6xl">Currency Exchange Request</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65">Request foreign currency for travel, business, education or medical needs. BHLI will confirm the exchange rate and applicable charges.</p>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-20 max-w-6xl px-5 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_90px_rgba(6,31,59,.2)] lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="relative hidden bg-gradient-to-b from-[#061f3b] to-[#073d69] p-7 text-white lg:flex lg:flex-col">
            <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-[#4fc3ea]"><WalletCards className="size-7" /></span>
            <h2 className="mt-7 font-serif text-3xl">Exchange with confidence</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">Submit your currency requirement and our team will confirm the live rate, fees and fulfilment process.</p>
            <div className="mt-8 space-y-4 text-sm text-white/75">
              {["API-verified currency master", "Rate confirmed before processing", "Secure document submission"].map((item) => <p key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#4fc3ea]" />{item}</p>)}
            </div>
            <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-5 text-xs text-white/55"><p className="font-bold uppercase tracking-[.18em] text-[#4fc3ea]">Selected exchange</p><p className="mt-3 text-base font-bold text-white">{fromCurrency?.code || "—"} <ArrowRightLeft className="mx-2 inline size-4 text-[#4fc3ea]" /> {toCurrency?.code || "—"}</p><p className="mt-2">Amount: <b className="text-white">{values.amount || "Not entered"}</b></p></div>
          </aside>

          <form id="currency-exchange-form" onSubmit={submit} className="p-5 sm:p-7 md:p-9" noValidate>
            <header className="mb-8"><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#087fbe]">BHLI LLP</p><h2 className="mt-2 font-serif text-3xl font-semibold text-[#061f3b]">Currency Exchange Request Form</h2><p className="mt-2 text-xs text-slate-400">Fields marked with an asterisk are required.</p></header>

            <FormSection number="01" title="Customer Details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" required icon={<UserRound />}><input value={values.full_name} onChange={(event) => update("full_name", event.target.value)} /></Field>
                <Field label="Mobile Number" required icon={<Phone />}><input type="tel" value={values.mobile_number} onChange={(event) => update("mobile_number", event.target.value)} /></Field>
                <Field label="Email ID" icon={<Mail />}><input type="email" value={values.email} onChange={(event) => update("email", event.target.value)} /></Field>
                <Field label="City" icon={<MapPin />}><input value={values.city} onChange={(event) => update("city", event.target.value)} /></Field>
              </div>
            </FormSection>

            <FormSection number="02" title="Currency Exchange Details">
              {currencyError && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">Currency list could not be loaded. Please refresh and try again.</p>}
              {!currencyError && <div className="mb-3 flex items-center justify-between gap-3"><p className="text-[10px] font-semibold text-slate-400">API currency master · {currencies.length} currencies available</p><button type="button" disabled={!values.from_currency && !values.to_currency} onClick={() => setValues((current) => ({ ...current, from_currency: current.to_currency, to_currency: current.from_currency }))} className="inline-flex items-center gap-1.5 rounded-lg border border-sky-100 bg-sky-50 px-3 py-1.5 text-[10px] font-extrabold text-[#087fbe] transition hover:border-sky-300 disabled:cursor-not-allowed disabled:opacity-40"><ArrowRightLeft className="size-3.5" />Swap currencies</button></div>}
              <div className="grid gap-4 sm:grid-cols-2">
                <CurrencySelect label="From Currency" required value={values.from_currency} currencies={currencies} loading={loadingCurrencies} onChange={(value) => update("from_currency", value)} />
                <CurrencySelect label="To Currency" required value={values.to_currency} currencies={currencies} loading={loadingCurrencies} onChange={(value) => update("to_currency", value)} />
                <Field label="Amount" required icon={<Banknote />}><input type="number" min="0.01" step="0.01" value={values.amount} onChange={(event) => update("amount", event.target.value)} placeholder="0.00" /></Field>
                <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-4"><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#087fbe]">BHLI quote</p><div className="mt-2 grid grid-cols-3 gap-2 text-[10px] text-slate-500"><span>Rate<br /><b className="text-[#061f3b]">To confirm</b></span><span>Converted<br /><b className="text-[#061f3b]">To confirm</b></span><span>Fee<br /><b className="text-[#061f3b]">To confirm</b></span></div></div>
              </div>
            </FormSection>

            <FormSection number="03" title="Purpose & Delivery">
              <fieldset><legend className="mb-2 text-xs font-bold text-[#456078]">Purpose <b className="text-red-500">*</b></legend><div className="flex flex-wrap gap-2">{purposes.map(([value, label]) => <label key={value} className={`cursor-pointer rounded-xl border px-4 py-2.5 text-xs font-bold transition ${values.purpose === value ? "border-[#087fbe] bg-[#087fbe] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-sky-300"}`}><input type="radio" name="purpose" value={value} checked={values.purpose === value} onChange={() => update("purpose", value)} className="sr-only" />{label}</label>)}</div></fieldset>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Travel Destination" icon={<MapPin />}><input value={values.travel_destination} onChange={(event) => update("travel_destination", event.target.value)} /></Field>
                <Field label="Travel Date" icon={<CalendarDays />}><input type="date" value={values.travel_date} onChange={(event) => update("travel_date", event.target.value)} /></Field>
                <Field label="Passport Number (Optional)" icon={<ShieldCheck />}><input value={values.passport_number} onChange={(event) => update("passport_number", event.target.value)} /></Field>
                <label className="text-xs font-bold text-[#456078]">Collection / Delivery<select value={values.collection_delivery} onChange={(event) => update("collection_delivery", event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-[#13a5d8] focus:ring-4 focus:ring-sky-100"><option value="">Select preference</option><option value="office_collection">Office Collection</option><option value="home_delivery">Home Delivery</option></select></label>
                <Field label="Preferred Date & Time" icon={<CalendarDays />}><input type="datetime-local" value={values.preferred_datetime} onChange={(event) => update("preferred_datetime", event.target.value)} /></Field>
              </div>
            </FormSection>

            <FormSection number="04" title="Additional Information">
              <label className="text-xs font-bold text-[#456078]">Remarks / Special Request<textarea value={values.remarks} onChange={(event) => update("remarks", event.target.value)} rows={4} placeholder="Tell us about denominations, delivery or other requirements." className="mt-2 w-full resize-y rounded-xl border border-slate-200 p-4 text-sm font-normal leading-6 outline-none focus:border-[#13a5d8] focus:ring-4 focus:ring-sky-100" /></label>
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-sky-200 bg-[#f8fcfe] p-4"><span className="grid size-10 place-items-center rounded-xl bg-white text-[#087fbe] shadow-sm"><FileUp className="size-5" /></span><span className="min-w-0 flex-1"><b className="block text-xs text-[#173852]">Supporting Document</b><span className="mt-1 block truncate text-[10px] text-slate-400">{document?.name || "Attach PDF, DOC or image (max 10 MB)"}</span></span><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" onChange={(event) => chooseDocument(event.target.files?.[0] || null)} className="sr-only" /></label>
            </FormSection>

            <FormSection number="05" title="Declaration">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/70 p-4 text-xs leading-5 text-slate-600"><input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[#087fbe]" /><span>I confirm that the information provided is correct and authorize BHLI LLP to contact me regarding my currency exchange request. I understand that the applicable exchange rate and charges will be confirmed by BHLI at the time of processing.</span></label>
            </FormSection>

            {error && <p role="alert" className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={reset} className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-500">Reset Form</button><button type="submit" disabled={submitting || loadingService || loadingCurrencies} className="inline-flex min-w-56 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-sky-600/20 disabled:opacity-60">{loadingService || loadingCurrencies ? "Loading..." : submitting ? "Submitting..." : "Submit Currency Request"}<Send className="size-4" /></button></div>
          </form>
        </div>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400"><ShieldCheck className="size-4 text-[#087fbe]" />Rates and fees are confirmed by BHLI before processing.</p>
      </main>
    </div>
  );
}

function documentById(id: string) {
  return typeof document === "undefined" ? null : document.getElementById(id);
}

function FormSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <section className="mb-8"><div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3"><span className="grid size-8 place-items-center rounded-xl bg-[#e4f5fb] text-[10px] font-extrabold text-[#087fbe]">{number}</span><h3 className="font-serif text-xl font-semibold text-[#061f3b]">{title}</h3></div>{children}</section>;
}

function Field({ label, required, icon, children }: { label: string; required?: boolean; icon: React.ReactNode; children: React.ReactNode }) {
  return <label className="text-xs font-bold text-[#456078]">{label}{required && <b className="text-red-500"> *</b>}<span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-[#087fbe] transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-sky-100 [&_input]:min-w-0 [&_input]:flex-1 [&_input]:bg-transparent [&_input]:text-sm [&_input]:font-semibold [&_input]:text-[#122b42] [&_input]:outline-none">{icon}{children}</span></label>;
}

function CurrencySelect({ label, required, value, currencies, loading, onChange }: { label: string; required?: boolean; value: string; currencies: CurrencyMaster[]; loading: boolean; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = currencies.find((currency) => String(currency.id) === value);
  const filtered = useMemo(() => currencies.filter((currency) => `${currency.code} ${currency.name} ${currency.symbol}`.toLowerCase().includes(search.toLowerCase())).slice(0, 40), [currencies, search]);
  return <div className="relative"><label className="text-xs font-bold text-[#456078]">{label}{required && <b className="text-red-500"> *</b>}</label><button type="button" onClick={() => setOpen((current) => !current)} className="mt-2 flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left text-sm font-semibold text-[#122b42] transition focus:border-[#13a5d8] focus:ring-4 focus:ring-sky-100"><span className={selected ? "" : "text-slate-400"}>{loading ? "Loading currencies..." : selected?.display_name || "Select currency"}</span><ChevronDown className="size-4 text-[#087fbe]" /></button>{open && <div className="absolute inset-x-0 z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"><div className="flex items-center gap-2 border-b border-slate-100 p-3"><Search className="size-4 text-slate-400" /><input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search code or currency" className="min-w-0 flex-1 text-xs font-semibold outline-none" /></div><div className="max-h-64 overflow-y-auto p-2">{filtered.map((currency) => <button key={currency.id} type="button" onClick={() => { onChange(String(currency.id)); setOpen(false); setSearch(""); }} className="w-full rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#173852] hover:bg-sky-50">{currency.display_name}</button>)}{!filtered.length && <p className="p-3 text-center text-xs text-slate-400">No currencies found.</p>}</div></div>}</div>;
}
