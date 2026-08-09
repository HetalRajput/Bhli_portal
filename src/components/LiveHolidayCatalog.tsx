"use client";

import { useEffect, useState } from "react";
import { ArrowRight, LoaderCircle, MapPin, X } from "lucide-react";
import { portalService, type HolidayCategory, type HolidayDestination, type HolidayPackage } from "@/lib/api/portal";

export default function LiveHolidayCatalog({ collection }: { collection: "domestic" | "international" }) {
  const [categories, setCategories] = useState<HolidayCategory[]>([]);
  const [destinations, setDestinations] = useState<HolidayDestination[]>([]);
  const [packages, setPackages] = useState<HolidayPackage[]>([]);
  const [category, setCategory] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<HolidayDestination | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<HolidayPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      portalService.holidayCategories(collection),
      portalService.holidayDestinations({ collection, category: category || undefined }),
      portalService.holidayPackages({ collection, category: category || undefined }),
    ]).then(([categoryRows, destinationRows, packageRows]) => {
      if (!active) return;
      setCategories(categoryRows); setDestinations(destinationRows); setPackages(packageRows);
    }).catch(() => { if (active) { setDestinations([]); setPackages([]); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [category, collection]);

  async function openDestination(slug: string) { try { setSelectedDestination(await portalService.holidayDestination(slug)); } catch { /* card data remains available */ } }
  async function openPackage(slug: string) { try { setSelectedPackage(await portalService.holidayPackage(slug)); } catch { /* card data remains available */ } }

  if (!loading && !destinations.length && !packages.length) return null;
  return <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#087fbe]">Live package catalogue</p><h2 className="mt-3 font-serif text-4xl">Available destinations and packages</h2></div>{categories.length > 0 && <label className="text-xs font-bold text-slate-500">Category<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 block h-11 min-w-64 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="">All categories</option>{categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label>}</div>{loading ? <p className="mt-10 flex items-center justify-center gap-2 text-slate-500"><LoaderCircle className="size-5 animate-spin" />Loading current packages...</p> : <><div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{destinations.map((item) => <button key={item.id} onClick={() => void openDestination(item.slug)} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm"><div className="relative h-44 overflow-hidden">{item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover transition group-hover:scale-105" /> : <div className="h-full bg-gradient-to-br from-[#07345d] to-[#13a5d8]" />}</div><div className="p-5"><p className="flex items-center gap-2 text-xs font-bold text-[#087fbe]"><MapPin className="size-3.5" />{item.city || item.state || item.country}</p><h3 className="mt-2 font-serif text-3xl">{item.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{item.short_description}</p>{item.starting_price && <p className="mt-4 text-sm font-extrabold text-[#087fbe]">From ₹{Number(item.starting_price).toLocaleString("en-IN")}</p>}</div></button>)}</div>{packages.length > 0 && <div className="mt-12"><h3 className="font-serif text-3xl">Bookable packages</h3><div className="mt-5 grid gap-4 md:grid-cols-2">{packages.map((item) => <button key={item.id} onClick={() => void openPackage(item.slug)} className="flex items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#087fbe]">{item.nights} nights · {item.days} days</p><h4 className="mt-2 font-serif text-2xl">{item.name}</h4>{item.starting_price && <p className="mt-2 text-sm font-bold text-slate-500">From ₹{Number(item.starting_price).toLocaleString("en-IN")}</p>}</div><ArrowRight className="size-5 shrink-0 text-[#087fbe]" /></button>)}</div></div>}</>}{(selectedDestination || selectedPackage) && <div className="fixed inset-0 z-[90] grid place-items-center bg-[#061f3b]/70 p-4 backdrop-blur-sm"><article className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl sm:p-9"><button onClick={() => { setSelectedDestination(null); setSelectedPackage(null); }} className="ml-auto grid size-10 place-items-center rounded-full bg-slate-100"><X className="size-5" /></button>{selectedDestination && <><p className="text-xs font-bold uppercase tracking-[.2em] text-[#087fbe]">Destination detail</p><h2 className="mt-2 font-serif text-4xl">{selectedDestination.name}</h2><p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{selectedDestination.description || selectedDestination.short_description}</p></>}{selectedPackage && <><p className="text-xs font-bold uppercase tracking-[.2em] text-[#087fbe]">Package detail</p><h2 className="mt-2 font-serif text-4xl">{selectedPackage.name}</h2><p className="mt-4 text-sm leading-7 text-slate-600">{selectedPackage.description || selectedPackage.short_description}</p><div className="mt-6 grid gap-3">{selectedPackage.variants?.map((variant) => <div key={variant.id} className="rounded-2xl bg-[#f3f8fb] p-5"><div className="flex justify-between gap-4"><div><h3 className="font-bold">{variant.title}</h3><p className="mt-1 text-xs text-slate-500">{variant.hotel_category} · {variant.comfort_level}</p></div><b className="text-[#087fbe]">₹{Number(variant.price).toLocaleString("en-IN")}</b></div><p className="mt-3 text-xs text-slate-500">{variant.inclusions.map((item) => item.name).join(" · ")}</p></div>)}</div></>}</article></div>}</section>;
}
