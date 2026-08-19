"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  FileUp,
  Landmark,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BookingSuccessModal from "@/components/BookingSuccessModal";
import { getErrorMessage } from "@/lib/api/client";
import { useSuccessChime } from "@/hooks/useSuccessChime";
import { useServiceQuery, useSubmitServiceBookingMutation } from "@/store/websiteApi";

type FormValues = Record<string, string | boolean>;
type InputProps = {
  name: string;
  label: string;
  values: FormValues;
  update: (name: string, value: string | boolean) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  icon?: ReactNode;
  min?: string | number;
};

type ServiceGroup = {
  title: string;
  options: readonly (readonly [string, string])[];
};

const serviceGroups: readonly ServiceGroup[] = [
  { title: "Air Travel", options: [["svc_dom_flight", "Domestic Flight Booking"], ["svc_intl_flight", "International Flight Booking"], ["svc_group_flight", "Group Flight Booking"], ["svc_corp_airfare", "Corporate Airfare"]] },
  { title: "Hotel & Accommodation", options: [["svc_dom_hotel", "Domestic Hotel Booking"], ["svc_intl_hotel", "International Hotel Booking"], ["svc_long_stay", "Long Stay Accommodation"], ["svc_serviced_apts", "Serviced Apartments"], ["svc_extended_stay", "Extended Stay Solutions"]] },
  { title: "Ground Transportation", options: [["svc_airport_transfers", "Airport Transfers"], ["svc_chauffeur_car", "Chauffeur-Driven Car Rental"], ["svc_self_drive", "Self-Drive Car Rental"], ["svc_coach_bus", "Coach / Bus Rental"]] },
  { title: "Rail Travel", options: [["svc_train_booking", "Train Ticket Booking"]] },
  { title: "Corporate Travel Solutions", options: [["svc_business_travel_mgmt", "Business Travel Management"], ["svc_corp_travel_desk", "Corporate Travel Desk Management"], ["svc_exec_vip_travel", "Executive & VIP Travel"], ["svc_employee_biz_travel", "Employee Business Travel"], ["svc_group_corp_travel", "Group Corporate Travel"], ["svc_mice", "MICE (Meetings, Incentives, Conferences & Exhibitions)"], ["svc_corp_events", "Conferences, Seminars & Corporate Events"], ["svc_team_offsites", "Team Offsites & Corporate Retreats"]] },
  { title: "International Travel Services", options: [["svc_visa_assistance", "Visa Assistance"], ["svc_travel_insurance", "Travel Insurance"], ["svc_forex_assistance", "Foreign Exchange Assistance"]] },
  { title: "Government & Institutional Travel", options: [["svc_gov_travel", "Government Travel Management"], ["svc_psu_travel", "PSU Travel Management"], ["svc_defence_travel", "Defence Travel Management"], ["svc_ltc_travel", "LTC Travel Management"]] },
  { title: "Value-Added Services", options: [["svc_dedicated_manager", "Dedicated Account Manager"], ["svc_24x7_support", "24x7 Travel Support"], ["svc_gst_billing", "GST-Compliant Billing"], ["svc_custom_solutions", "Customized Corporate Travel Solutions"]] },
];

const initialValues: FormValues = {
  company_name: "", gst_number: "", pan_number: "", cin_number: "", industry_type: "", company_website: "",
  company_address: "", city: "", state: "", country: "India", pin_code: "", contact_person_name: "", designation: "",
  department: "", official_email: "", mobile_number: "", alternate_contact_number: "", other_services_specified: "",
  travel_type: "", travel_purpose: "", from_city: "", to_city: "", departure_date: "", return_date: "",
  number_of_adults: "", number_of_children: "", number_of_infants: "", number_of_travellers: "", number_of_rooms: "",
  preferred_hotel_category: "", preferred_airline: "", number_of_vehicles: "", estimated_budget: "",
  monthly_travel_volume: "", annual_travel_budget: "", credit_facility_required: "", purchase_order_required: "",
  gst_invoice_required: "", preferred_billing_cycle: "", dedicated_account_manager_required: "", additional_requirements: "",
  ...Object.fromEntries(serviceGroups.flatMap((group) => group.options.map(([key]) => [key, false]))),
};

const steps = [
  { number: 1, title: "Company & contact", short: "Organisation details" },
  { number: 2, title: "Services", short: "Select required support" },
  { number: 3, title: "Travel & billing", short: "Planning preferences" },
  { number: 4, title: "Documents & submit", short: "Review and declaration" },
];

export default function CorporateTravelRequestForm() {
  const router = useRouter();
  const pathname = usePathname();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [step, setStep] = useState(1);
  const [consent, setConsent] = useState(false);
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const { data: service, isLoading: loadingService } = useServiceQuery("corporate-travel-desk-b2b");
  const [submitBooking, { isLoading: submitting }] = useSubmitServiceBookingMutation();
  const successChime = useSuccessChime();
  const selectedServices = useMemo(() => serviceGroups.flatMap((group) => group.options).filter(([key]) => Boolean(values[key])), [values]);
  const title = service?.name || "Corporate Travel Desk – B2B";

  const update = (name: string, value: string | boolean) => setValues((current) => ({ ...current, [name]: value }));

  const validate = (targetStep: number) => {
    setError("");
    if (targetStep === 1) {
      const required = [["company_name", "company name"], ["gst_number", "GST number"], ["contact_person_name", "authorized contact name"], ["designation", "designation"], ["official_email", "official email"], ["mobile_number", "mobile number"]];
      const missing = required.find(([key]) => !String(values[key]).trim());
      if (missing) return setError(`Please enter the ${missing[1]}.`), false;
      const website = String(values.company_website || "").trim();
      if (website) {
        try {
          const parsed = new URL(website);
          if (!(["http:", "https:"].includes(parsed.protocol))) throw new Error("Unsupported website protocol");
        } catch {
          setError("Enter a valid company website URL, including https:// (or leave it blank).");
          return false;
        }
      }
    }
    if (targetStep === 2 && selectedServices.length === 0 && !String(values.other_services_specified).trim()) {
      setError("Select at least one required service or specify another service.");
      return false;
    }
    if (targetStep === 3 && values.departure_date && values.return_date && String(values.return_date) < String(values.departure_date)) {
      setError("Return date cannot be earlier than the departure date.");
      return false;
    }
    return true;
  };

  const next = () => {
    if (validate(step)) setStep((current) => Math.min(current + 1, steps.length));
  };

  const reset = () => {
    setValues(initialValues);
    setFiles({});
    setConsent(false);
    setError("");
    setStep(1);
    const form = document.getElementById("corporate-b2b-form") as HTMLFormElement | null;
    form?.reset();
  };

  const selectFiles = (key: string, list: FileList | null) => {
    const selected = list ? Array.from(list) : [];
    if (selected.some((file) => file.size > 10_485_760)) {
      setError("Each uploaded document must be 10 MB or smaller.");
      return;
    }
    setError("");
    setFiles((current) => ({ ...current, [key]: selected }));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!validate(1) || !validate(2) || !validate(3)) return;
    if (!consent) return setError("Please accept the declaration before submitting.");
    if (!localStorage.getItem("access_token")) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!service?.id) return setError("The Corporate Travel service is not available right now. Please try again shortly.");

    const selectedServiceLabels = selectedServices.map(([, label]) => label);
    if (String(values.other_services_specified || "").trim()) selectedServiceLabels.push("Other");
    const requestData: Record<string, unknown> = {
      service: service.id,
      guests: [],
      services_required: selectedServiceLabels,
      message: "Please share a customized corporate travel quotation.",
      consent_to_contact: true,
      declaration_accepted: true,
    };
    const numberFields = new Set(["number_of_adults", "number_of_children", "number_of_infants", "number_of_travellers", "number_of_rooms", "number_of_vehicles"]);
    const booleanFields = new Set(["credit_facility_required", "purchase_order_required", "gst_invoice_required", "dedicated_account_manager_required"]);
    Object.entries(values).forEach(([key, value]) => {
      const normalizedValue = typeof value === "string" ? value.trim() : value;
      if (key.startsWith("svc_") || normalizedValue === "") return;
      requestData[key] = numberFields.has(key) ? Number(normalizedValue) : booleanFields.has(key) ? normalizedValue === "true" || normalizedValue === true : normalizedValue;
    });
    requestData.additional_requirements = String(values.additional_requirements || "");

    const hasAttachments = Object.values(files).some((selected) => selected.length > 0);
    const payload: Record<string, unknown> | FormData = hasAttachments ? new FormData() : requestData;
    if (payload instanceof FormData) {
      Object.entries(requestData).forEach(([key, value]) => {
        if (key === "guests") payload.append(key, JSON.stringify(value));
        else if (Array.isArray(value)) value.forEach((item) => payload.append(key, String(item)));
        else payload.append(key, String(value));
      });
      Object.entries(files).forEach(([key, selected]) => selected.forEach((file) => payload.append(key, file)));
    }

    successChime.arm();
    try {
      const response = await submitBooking({ serviceSlug: "corporate-travel", payload }).unwrap() as { data?: { booking?: { id?: number }; id?: number }; reference?: string };
      const id = response?.data?.booking?.id ?? response?.data?.id;
      setReference(id ? `BH${String(id).padStart(6, "0")}` : response.reference || "Submitted");
      successChime.play();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    }
  }

  if (reference) return <BookingSuccessModal reference={reference} serviceName={title} heading="Corporate request received" description="Our corporate travel team will review your requirements and prepare a customized quotation." backHref="/services" backLabel="Back to services" />;

  return (
    <div className="min-h-screen overflow-x-clip bg-[#edf5f9] pb-10 text-[#122b42]">
      <section className="relative overflow-hidden bg-[#061f3b] px-4 pb-24 pt-8 text-white sm:px-5 sm:pb-28 sm:pt-9 lg:px-8">
        <div className="absolute -right-32 -top-40 size-[32rem] rounded-full bg-[#13a5d8]/15 blur-3xl" />
        <div className="relative mx-auto max-w-[1360px]">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"><ArrowLeft className="size-4" />All services</Link>
          <p className="mt-8 text-[11px] font-extrabold uppercase tracking-[.28em] text-[#4fc3ea]">BHLI corporate travel solutions</p>
          <h1 className="mt-3 max-w-4xl font-serif text-3xl leading-tight min-[380px]:text-4xl sm:text-5xl md:text-6xl">Corporate Travel Desk – B2B Request Form</h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65">Partner with Booking Hospitality &amp; Leisure Infra LLP for seamless corporate travel management, customized quotations and dedicated travel support.</p>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-16 max-w-[1360px] px-3 sm:-mt-20 sm:px-5 lg:px-8">
        <div className="grid overflow-hidden rounded-[1.5rem] bg-white shadow-[0_28px_90px_rgba(6,31,59,.2)] sm:rounded-[2rem] lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="relative hidden bg-gradient-to-b from-[#061f3b] to-[#073d69] p-7 text-white lg:flex lg:flex-col">
            <Building2 className="size-10 text-[#4fc3ea]" />
            <h2 className="mt-6 font-serif text-3xl">Build your corporate travel programme</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">Tell us how your organisation travels. We will prepare a tailored programme and quotation.</p>
            <div className="mt-8 space-y-4 text-sm text-white/75">
              {["One request for every travel service", "GST-compliant corporate billing", "Dedicated account and travel support"].map((item) => <p key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#4fc3ea]" />{item}</p>)}
            </div>
            <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#4fc3ea]">Request summary</p>
              <p className="mt-3 flex justify-between text-xs text-white/55"><span>Step</span><b className="text-white">{step} of 4</b></p>
              <p className="mt-2 flex justify-between text-xs text-white/55"><span>Services</span><b className="text-white">{selectedServices.length} selected</b></p>
            </div>
          </aside>

          <section className="min-w-0 bg-white">
            <div className="border-b border-slate-100 bg-[#f7fbfd] px-3 py-4 sm:px-5 sm:py-5 md:px-8">
              <div className="grid grid-cols-4 gap-2">
                {steps.map((item) => {
                  const active = step === item.number;
                  const complete = step > item.number;
                  return <button key={item.number} type="button" onClick={() => item.number < step && setStep(item.number)} className={`flex min-w-0 items-center gap-2 rounded-xl p-2 text-left transition ${active ? "bg-white shadow-sm ring-1 ring-sky-200" : complete ? "cursor-pointer" : "cursor-default opacity-45"}`}><span className={`grid size-8 shrink-0 place-items-center rounded-lg text-xs font-extrabold ${complete ? "bg-emerald-500 text-white" : active ? "bg-[#087fbe] text-white" : "bg-slate-200 text-slate-500"}`}>{complete ? <Check className="size-4" /> : item.number}</span><span className="hidden min-w-0 sm:block"><b className="block truncate text-xs text-[#061f3b]">{item.title}</b><span className="block truncate text-[10px] text-slate-400">{item.short}</span></span></button>;
                })}
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-gradient-to-r from-[#0875b7] to-[#13a5d8] transition-all" style={{ width: `${step * 25}%` }} /></div>
            </div>

            <form id="corporate-b2b-form" onSubmit={submit} className="p-4 sm:p-5 md:p-8" noValidate>
              {step === 1 && <div className="space-y-9">
                <FormSection number="01" title="Company Information" description="Legal, registration and office details for your organisation.">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input name="company_name" label="Company Name" required values={values} update={update} icon={<Building2 />} />
                    <Input name="gst_number" label="GST Number" required values={values} update={update} icon={<Landmark />} />
                    <Input name="pan_number" label="PAN Number" values={values} update={update} icon={<Landmark />} />
                    <Input name="cin_number" label="CIN / Registration Number" values={values} update={update} icon={<Landmark />} />
                    <Input name="industry_type" label="Industry Type" values={values} update={update} icon={<Building2 />} />
                    <Input name="company_website" label="Company Website" type="url" placeholder="https://" values={values} update={update} icon={<Building2 />} />
                    <Input name="company_address" label="Company Address" values={values} update={update} icon={<MapPin />} />
                    <Input name="city" label="City" values={values} update={update} icon={<MapPin />} />
                    <Input name="state" label="State" values={values} update={update} icon={<MapPin />} />
                    <Input name="country" label="Country" values={values} update={update} icon={<MapPin />} />
                    <Input name="pin_code" label="PIN Code" values={values} update={update} icon={<MapPin />} />
                  </div>
                </FormSection>
                <FormSection number="02" title="Authorized Contact Person" description="Primary company representative for this enquiry.">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input name="contact_person_name" label="Full Name" required values={values} update={update} icon={<UserRound />} />
                    <Input name="designation" label="Designation" required values={values} update={update} icon={<UserRound />} />
                    <Input name="department" label="Department" values={values} update={update} icon={<Building2 />} />
                    <Input name="official_email" label="Official Email ID" type="email" required values={values} update={update} icon={<Mail />} />
                    <Input name="mobile_number" label="Mobile Number" type="tel" required values={values} update={update} icon={<Phone />} />
                    <Input name="alternate_contact_number" label="Alternate Contact Number" type="tel" values={values} update={update} icon={<Phone />} />
                  </div>
                </FormSection>
              </div>}

              {step === 2 && <FormSection number="03" title="Services Required" description="Select every service your organisation may require.">
                <div className="grid gap-4 xl:grid-cols-2">
                  {serviceGroups.map((group) => <fieldset key={group.title} className="rounded-2xl border border-slate-200 bg-[#fbfdff] p-4"><legend className="px-2 text-sm font-extrabold text-[#087fbe]">{group.title}</legend><div className="mt-1 grid gap-2">{group.options.map(([key, label]) => <label key={key} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-xs font-semibold transition ${values[key] ? "border-sky-300 bg-sky-50 text-[#061f3b]" : "border-transparent bg-white text-slate-600 hover:border-sky-200"}`}><input type="checkbox" checked={Boolean(values[key])} onChange={(event) => update(key, event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[#087fbe]" />{label}</label>)}</div></fieldset>)}
                </div>
                <div className="mt-4"><Input name="other_services_specified" label="Other service (please specify)" values={values} update={update} /></div>
              </FormSection>}

              {step === 3 && <div className="space-y-9">
                <FormSection number="04" title="Travel Requirements" description="Share anticipated routes, travellers and preferences.">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Select name="travel_type" label="Travel Type" values={values} update={update} options={[["domestic", "Domestic"], ["international", "International"]]} />
                    <Input name="travel_purpose" label="Purpose of Travel" values={values} update={update} />
                    <Input name="from_city" label="Departure City" values={values} update={update} icon={<MapPin />} />
                    <Input name="to_city" label="Destination City / Country" values={values} update={update} icon={<MapPin />} />
                    <Input name="departure_date" label="Departure Date" type="date" values={values} update={update} />
                    <Input name="return_date" label="Return Date" type="date" values={values} update={update} min={String(values.departure_date || "")} />
                    <Input name="number_of_adults" label="Number of Adults" type="number" min={0} values={values} update={update} />
                    <Input name="number_of_children" label="Number of Children" type="number" min={0} values={values} update={update} />
                    <Input name="number_of_infants" label="Number of Infants" type="number" min={0} values={values} update={update} />
                    <Input name="number_of_travellers" label="Total Number of Travellers" type="number" min={0} values={values} update={update} />
                    <Input name="number_of_rooms" label="Number of Rooms Required" type="number" min={0} values={values} update={update} />
                    <Input name="preferred_hotel_category" label="Preferred Hotel Category" values={values} update={update} />
                    <Input name="preferred_airline" label="Preferred Airline" values={values} update={update} />
                    <Input name="number_of_vehicles" label="Number of Vehicles Required" type="number" min={0} values={values} update={update} />
                    <Input name="estimated_budget" label="Estimated Budget" placeholder="For example: INR 250000" values={values} update={update} />
                  </div>
                </FormSection>
                <FormSection number="05" title="Corporate Requirements" description="Billing, volume and account-management preferences.">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Input name="monthly_travel_volume" label="Estimated Monthly Travel Volume" values={values} update={update} />
                    <Input name="annual_travel_budget" label="Estimated Annual Travel Budget" placeholder="For example: INR 50 Lakhs" values={values} update={update} />
                    <YesNo name="credit_facility_required" label="Credit Facility Required" values={values} update={update} />
                    <YesNo name="purchase_order_required" label="Purchase Order Required" values={values} update={update} />
                    <YesNo name="gst_invoice_required" label="GST Invoice Required" values={values} update={update} />
                    <Select name="preferred_billing_cycle" label="Preferred Billing Cycle" values={values} update={update} options={[["per_trip", "Per Trip"], ["weekly", "Weekly"], ["monthly", "Monthly"]]} />
                    <YesNo name="dedicated_account_manager_required" label="Dedicated Account Manager Required" values={values} update={update} />
                  </div>
                </FormSection>
              </div>}

              {step === 4 && <div className="space-y-9">
                <FormSection number="06" title="Upload Documents" description="Attach relevant files. Each document may be up to 10 MB.">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Upload name="gst_certificate_file" label="GST Certificate" files={files} selectFiles={selectFiles} />
                    <Upload name="company_profile_file" label="Company Profile" files={files} selectFiles={selectFiles} />
                    <Upload name="travel_itinerary_file" label="Travel Itinerary" files={files} selectFiles={selectFiles} />
                    <Upload name="purchase_order_file" label="Purchase Order (Optional)" files={files} selectFiles={selectFiles} />
                    <Upload name="other_supporting_documents_file" label="Other Supporting Document" files={files} selectFiles={selectFiles} />
                  </div>
                </FormSection>
                <FormSection number="07" title="Additional Requirements" description="Add special travel, accommodation, event or billing instructions.">
                  <textarea value={String(values.additional_requirements)} onChange={(event) => update("additional_requirements", event.target.value)} rows={5} placeholder="Share any special requirements..." className="w-full resize-y rounded-2xl border border-slate-200 p-4 text-sm leading-6 outline-none transition focus:border-[#13a5d8] focus:ring-4 focus:ring-sky-100" />
                </FormSection>
                <FormSection number="08" title="Declaration" description="Review and authorize BHLI to prepare your quotation.">
                  <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
                    <div className="mb-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2"><p>Company: <b className="text-[#061f3b]">{String(values.company_name || "Not provided")}</b></p><p>Services selected: <b className="text-[#061f3b]">{selectedServices.length}</b></p><p>Contact: <b className="text-[#061f3b]">{String(values.contact_person_name || "Not provided")}</b></p><p>Documents: <b className="text-[#061f3b]">{Object.values(files).flat().length}</b></p></div>
                    <label className="flex cursor-pointer items-start gap-3 border-t border-sky-100 pt-4 text-xs leading-5 text-slate-600"><input required type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[#087fbe]" /><span>I hereby certify that the information provided above is true and accurate. I authorize Booking Hospitality &amp; Leisure Infra LLP (BHLI) to contact me regarding this enquiry and prepare a customized corporate quotation.</span></label>
                  </div>
                </FormSection>
              </div>}

              {error && <p role="alert" className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
            </form>

            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 shadow-[0_-12px_30px_rgba(6,31,59,.05)] md:px-8">
              {step > 1 ? <button type="button" onClick={() => { setError(""); setStep((current) => current - 1); }} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600"><ChevronLeft className="size-4" />Previous</button> : <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500"><RotateCcw className="size-4" />Reset form</button>}
              {step < 4 ? <button type="button" onClick={next} className="ml-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-sky-600/20">Continue <ArrowRight className="size-4" /></button> : <div className="ml-auto flex gap-2"><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-500"><RotateCcw className="size-4" />Reset</button><button form="corporate-b2b-form" type="submit" disabled={submitting || loadingService} className="inline-flex min-w-44 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-sky-600/20 disabled:opacity-60">{loadingService ? "Loading..." : submitting ? "Submitting..." : "Submit Request"}<Send className="size-4" /></button></div>}
            </footer>
          </section>
        </div>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400"><ShieldCheck className="size-4 text-[#087fbe]" />Your company and travel information is submitted securely.</p>
      </main>
    </div>
  );
}

function FormSection({ number, title, description, children }: { number: string; title: string; description: string; children: ReactNode }) {
  return <section><div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e4f5fb] text-[10px] font-extrabold text-[#087fbe]">{number}</span><div><h2 className="font-serif text-xl font-semibold text-[#061f3b]">{title}</h2><p className="mt-0.5 text-[11px] text-slate-400">{description}</p></div></div>{children}</section>;
}

function Input({ name, label, values, update, type = "text", required, placeholder, icon, min }: InputProps) {
  return <label className="block text-xs font-bold text-[#456078]"><span>{label}{required && <b className="text-red-500"> *</b>}</span><span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-[#087fbe] transition focus-within:border-[#13a5d8] focus-within:ring-4 focus-within:ring-sky-100">{icon}<input required={required} name={name} type={type} min={min} value={String(values[name] || "")} onChange={(event) => update(name, event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#122b42] outline-none" /></span></label>;
}

function Select({ name, label, values, update, options }: { name: string; label: string; values: FormValues; update: InputProps["update"]; options: readonly (readonly [string, string])[] }) {
  return <label className="block text-xs font-bold text-[#456078]"><span>{label}</span><select value={String(values[name] || "")} onChange={(event) => update(name, event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#122b42] outline-none transition focus:border-[#13a5d8] focus:ring-4 focus:ring-sky-100"><option value="">Select {label.toLowerCase()}</option>{options.map(([value, optionLabel]) => <option key={value} value={value}>{optionLabel}</option>)}</select></label>;
}

function YesNo(props: Omit<Parameters<typeof Select>[0], "options">) {
  return <Select {...props} options={[["true", "Yes"], ["false", "No"]]} />;
}

function Upload({ name, label, files, selectFiles, multiple = false }: { name: string; label: string; files: Record<string, File[]>; selectFiles: (key: string, list: FileList | null) => void; multiple?: boolean }) {
  const selected = files[name] || [];
  return <label className="group cursor-pointer rounded-2xl border border-dashed border-sky-200 bg-[#f8fcfe] p-4 transition hover:border-[#13a5d8] hover:bg-sky-50"><span className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-white text-[#087fbe] shadow-sm"><FileUp className="size-5" /></span><span className="min-w-0"><b className="block text-xs text-[#173852]">{label}</b><span className="mt-1 block truncate text-[10px] text-slate-400">{selected.length ? selected.map((file) => file.name).join(", ") : "PDF, DOC, XLS or image"}</span></span></span><input type="file" multiple={multiple} accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp" onChange={(event) => selectFiles(name, event.target.files)} className="sr-only" /></label>;
}
