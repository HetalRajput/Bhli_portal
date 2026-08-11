"use client";

import { ChevronDown, XCircle } from "lucide-react";
import { useState } from "react";
import { useCruiseDestinationsQuery, useCruisePortsQuery } from "@/store/websiteApi";

type CruiseField = "destination" | "port" | "month" | "nights";
type CruiseSearchPanelProps = {
  destination: string;
  departurePort: string;
  travelMonth: string;
  nights: number | null;
  onDestinationChange: (value: string) => void;
  onDeparturePortChange: (value: string) => void;
  onTravelMonthChange: (value: string) => void;
  onNightsChange: (value: number | null) => void;
  onSearch: () => void;
};

const initialDestinations = [
  { name: "India", options: ["Goa", "Mumbai", "Lakshadweep", "Chennai", "Kochi", "Puducherry", "Visakhapatnam"] },
  { name: "Indian Ocean", options: ["Hambantota", "Jaffna", "Trincomalee", "Colombo", "Malé"] },
  { name: "Southeast Asia", options: ["Phuket", "Langkawi", "Kuala Lumpur", "Singapore"] },
  { name: "Middle East", options: ["Dubai", "Abu Dhabi", "Doha", "Muscat"] },
  { name: "Australia & Oceania", options: ["Sydney", "Brisbane", "Auckland"] },
];

const initialPorts = [
  { name: "India", options: ["Goa", "Mumbai", "Chennai", "Kochi", "Visakhapatnam"] },
  { name: "Southeast Asia", options: ["Singapore", "Phuket", "Port Klang"] },
  { name: "Middle East", options: ["Dubai", "Abu Dhabi", "Doha"] },
  { name: "Australia & Oceania", options: ["Sydney", "Brisbane", "Auckland"] },
];

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const nightOptions = [2, 3, 4, 5, 6, 7, 34];

const monthLabel = (value: string) => {
  if (!/^\d{4}-\d{2}$/.test(value)) return "";
  const [year, month] = value.split("-").map(Number);
  return `${monthNames[month - 1]} ${year}`;
};

export default function CruiseSearchPanel({
  destination,
  departurePort,
  travelMonth,
  nights,
  onDestinationChange,
  onDeparturePortChange,
  onTravelMonthChange,
  onNightsChange,
  onSearch,
}: CruiseSearchPanelProps) {
  const [openField, setOpenField] = useState<CruiseField | null>("destination");
  const [selectionError, setSelectionError] = useState("");
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const years = [currentYear, currentYear + 1, currentYear + 2];

  const { data: destinationResponse } = useCruiseDestinationsQuery();
  const { data: portResponse } = useCruisePortsQuery();
  const destinationGroups = destinationResponse?.success && Array.isArray(destinationResponse.data)
    ? destinationResponse.data.map((region) => ({ name: region.region_name, options: region.destinations.map((item) => item.name) })).filter((region) => region.options.length)
    : initialDestinations;
  const portGroups = portResponse?.success && Array.isArray(portResponse.data)
    ? portResponse.data.map((region) => ({ name: region.region_name, options: region.ports.map((item) => item.name) })).filter((region) => region.options.length)
    : initialPorts;

  const fields: Array<{ key: CruiseField; eyebrow: string; placeholder: string; value: string }> = [
    { key: "destination", eyebrow: "Select Destination", placeholder: "Where to?", value: destination },
    { key: "port", eyebrow: "Select Ports", placeholder: "Departure Port?", value: departurePort },
    { key: "month", eyebrow: "Select Months", placeholder: "Travel month?", value: monthLabel(travelMonth) },
    { key: "nights", eyebrow: "Select Nights", placeholder: "Nights?", value: nights ? `${nights} Nights` : "" },
  ];

  const resetCurrent = () => {
    if (openField === "destination") onDestinationChange("");
    if (openField === "port") onDeparturePortChange("");
    if (openField === "month") onTravelMonthChange("");
    if (openField === "nights") onNightsChange(null);
    setSelectionError("");
  };

  const runSearch = () => {
    const firstMissing: CruiseField | null = !destination
      ? "destination"
      : !departurePort
        ? "port"
        : !travelMonth
          ? "month"
          : !nights
            ? "nights"
            : null;
    if (firstMissing) {
      setOpenField(firstMissing);
      setSelectionError("Select all four cruise preferences before continuing.");
      return;
    }
    setSelectionError("");
    setOpenField(null);
    onSearch();
  };

  return (
    <section aria-label="Cruise search" className="relative">
      <div className="rounded-[24px] bg-gradient-to-r from-[#061f3b] via-[#087fbe] to-[#13a5d8] p-[2px] shadow-[0_20px_55px_rgba(6,31,59,.18)]">
        <div className="grid overflow-hidden rounded-[22px] bg-white sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_112px]">
          {fields.map((field) => {
            const active = openField === field.key;
            return (
              <button
                key={field.key}
                type="button"
                aria-expanded={active}
                onClick={() => { setOpenField(active ? null : field.key); setSelectionError(""); }}
                className={`flex min-h-[102px] min-w-0 items-center justify-between gap-3 border-b border-slate-200 px-6 text-left transition hover:bg-[#f2f9fc] sm:border-r lg:border-b-0 ${active ? "bg-[#edf9fd]" : "bg-white"}`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-400">{field.eyebrow}</span>
                  <span className={`mt-2 block truncate text-base font-extrabold sm:text-lg ${field.value ? "text-[#087fbe]" : "text-[#121212]"}`}>{field.value || field.placeholder}</span>
                </span>
                <ChevronDown className={`size-5 shrink-0 text-black transition-transform ${active ? "rotate-180" : ""}`} />
              </button>
            );
          })}
          <div className="col-span-2 flex items-center justify-center bg-white sm:col-span-2 lg:col-span-1 lg:min-h-[102px] px-4">
            <button type="button" onClick={runSearch} aria-label="Continue with selected cruise preferences" className="w-full py-3 px-4 rounded-xl bg-gradient-to-br from-[#0875b7] to-[#13a5d8] text-white text-xs font-bold shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
              Search
            </button>
          </div>
        </div>
      </div>

      {selectionError && !openField && <p role="alert" className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700"><XCircle className="size-4" />{selectionError}</p>}

      {openField && (
        <div className="mt-5 overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-[0_22px_60px_rgba(32,25,42,.13)]">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4 sm:px-9">
            <h2 className="font-serif text-2xl font-bold text-black sm:text-3xl">
              {openField === "destination" && <>Select <em className="bg-gradient-to-r from-[#0875b7] to-[#13a5d8] bg-clip-text text-transparent">Destinations</em></>}
              {openField === "port" && <>Select <em className="bg-gradient-to-r from-[#0875b7] to-[#13a5d8] bg-clip-text text-transparent">Departure Ports</em></>}
              {openField === "month" && <>Cruising <em className="bg-gradient-to-r from-[#0875b7] to-[#13a5d8] bg-clip-text text-transparent">Months</em></>}
              {openField === "nights" && <>Number of <em className="bg-gradient-to-r from-[#0875b7] to-[#13a5d8] bg-clip-text text-transparent">Nights</em></>}
            </h2>
            <div className="flex items-center gap-4">
              <button type="button" onClick={resetCurrent} className="text-sm font-extrabold text-[#087fbe] underline underline-offset-2">Reset</button>
              <button type="button" onClick={() => setOpenField(null)} className="rounded-full bg-gradient-to-r from-[#0875b7] to-[#13a5d8] px-7 py-3 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 sm:px-9 sm:py-4">Apply</button>
            </div>
          </header>

          <div className="max-h-[400px] overflow-y-auto px-6 py-5 sm:px-9">
            {openField === "destination" && <OptionGroups groups={destinationGroups} selected={destination} onSelect={onDestinationChange} />}
            {openField === "port" && <OptionGroups groups={portGroups} selected={departurePort} onSelect={onDeparturePortChange} />}
            {openField === "month" && (
              <div className="grid gap-8 md:grid-cols-3">
                {years.map((year) => <div key={year}><h3 className="text-center text-lg font-extrabold text-black">{year}</h3><div className="mt-4 grid grid-cols-3 gap-2">{monthNames.map((name, index) => {
                  const value = `${year}-${String(index + 1).padStart(2, "0")}`;
                  const unavailable = year === currentYear && index < currentMonth;
                  const selected = travelMonth === value;
                  return <button key={value} type="button" disabled={unavailable} onClick={() => onTravelMonthChange(value)} className={`rounded-full px-3 py-2.5 text-sm font-bold transition ${selected ? "bg-gradient-to-r from-[#0875b7] to-[#13a5d8] text-white shadow-md" : "bg-slate-100 text-black hover:bg-[#e3f5fb]"} disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-slate-100`}>{name}</button>;
                })}</div></div>)}
              </div>
            )}
            {openField === "nights" && <div className="flex flex-wrap gap-3">{nightOptions.map((option) => <Pill key={option} selected={nights === option} onClick={() => onNightsChange(option)}>{option} Nights</Pill>)}</div>}
          </div>
          {selectionError && <p role="alert" className="border-t border-rose-100 bg-rose-50 px-6 py-3 text-xs font-bold text-rose-700 sm:px-9">{selectionError}</p>}
        </div>
      )}
    </section>
  );
}

function OptionGroups({ groups, selected, onSelect }: { groups: Array<{ name: string; options: string[] }>; selected: string; onSelect: (value: string) => void }) {
  return <div>{groups.map((group) => <section key={group.name} className="border-b border-slate-200 py-5 first:pt-0 last:border-b-0 last:pb-0"><h3 className="text-base font-extrabold text-black sm:text-lg">{group.name}</h3><div className="mt-4 flex flex-wrap gap-2.5">{group.options.map((option) => <Pill key={option} selected={selected === option} onClick={() => onSelect(option)}>{option}</Pill>)}</div></section>)}</div>;
}

function Pill({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-pressed={selected} onClick={onClick} className={`rounded-full border px-4 py-2 text-sm font-bold transition ${selected ? "border-transparent bg-gradient-to-r from-[#0875b7] to-[#13a5d8] text-white shadow-md" : "border-slate-300 bg-white text-[#161616] hover:border-[#13a5d8] hover:bg-[#f2f9fc]"}`}>{children}</button>;
}
