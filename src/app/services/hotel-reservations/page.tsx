"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import HotelCard from "@/components/HotelCard";
import { 
  MapPin, 
  Star, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Sparkles,
  X
} from "lucide-react";
import { cmsService } from "@/lib/api/cms";

interface HotelItem {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  city?: string;
  location?: string;
  rating?: string;
  image?: string | null;
  price?: string | null;
  metadata?: any;
}

const fallbackHotels: HotelItem[] = [
  {
    id: 1,
    title: "Taj Palace, New Delhi",
    slug: "taj-palace-delhi",
    short_description: "Iconic luxury hospitality celebrating rich Indian heritage and world-class service.",
    city: "Delhi",
    location: "Chanakyapuri, New Delhi",
    rating: "5 Star Luxury",
    image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "8500.00"
  },
  {
    id: 2,
    title: "The Leela Palace, Bengaluru",
    slug: "leela-palace-bengaluru",
    short_description: "Nestled in lush gardens, experience palace-style living with modern amenities.",
    city: "Bengaluru",
    location: "HAL Old Airport Road, Bengaluru",
    rating: "5 Star Palace",
    image: "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "9500.00"
  },
  {
    id: 3,
    title: "Lemon Tree Premier, Delhi Airport",
    slug: "lemon-tree-aerocity",
    short_description: "A fresh and vibrant midscale stay offering contemporary comfort near the transit hub.",
    city: "Delhi",
    location: "Aerocity, New Delhi",
    rating: "4 Star Premier",
    image: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: "4500.00"
  }
];

const fallbackHotelImages = [
  "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=600"
];

function HotelCardSkeleton() {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-2 shadow-sm animate-pulse">
      <div>
        <div className="h-56 rounded-[2.2rem] bg-slate-200/80" />
        <div className="px-5 py-6 space-y-4">
          <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
          <div className="h-4 w-1/2 bg-slate-100 rounded-lg" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-5/6 bg-slate-100 rounded" />
          </div>
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
          </div>
        </div>
      </div>
      <div className="px-5 pb-5 pt-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-[2.3rem]">
        <div className="h-8 w-28 bg-slate-200 rounded-xl" />
        <div className="h-10 w-24 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  );
}

function HotelReservationsContent() {
  const searchParams = useSearchParams();
  const initialDestination = searchParams ? (searchParams.get("destination") || searchParams.get("search") || "") : "";

  const gridRef = useRef<HTMLDivElement>(null);
  const [serviceData, setServiceData] = useState<any>(null);
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // Search & Pagination State
  const [searchInput, setSearchInput] = useState(initialDestination);
  const [searchTerm, setSearchTerm] = useState(initialDestination);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationFilter, setLocationFilter] = useState("All");
  const [starFilter, setStarFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (initialDestination) {
      setSearchInput(initialDestination);
      setSearchTerm(initialDestination);
      setCurrentPage(1);
    }
  }, [initialDestination]);

  // Debounce typing to trigger search automatically after 400ms pause
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed !== searchTerm) {
        setSearchTerm(trimmed);
        setCurrentPage(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, searchTerm]);

  // Load service metadata once on mount
  useEffect(() => {
    cmsService.getServiceDetail("hotel-reservations").then((detail) => {
      if (detail?.success && detail?.data && !Array.isArray(detail.data)) {
        setServiceData(detail.data);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    const fetchHotels = async () => {
      setLoading(true);
      try {
        let items: HotelItem[] = [];
        let count = 0;

        if (searchTerm.trim()) {
          // ── SEARCH PATH ─────────────────────────────────────────────────
          // GET /api/base/services/hotel-reservations/search/?q=...&page=...&page_size=...
          const res = await cmsService.searchServiceItems("hotel-reservations", searchTerm.trim(), currentPage, pageSize);

          if (res && res.success !== false) {
            // search endpoint returns: { success, count, total_pages, data: [ ...hotel items... ] }
            if (Array.isArray(res.data)) {
              items = res.data;
            } else if (res.data?.items && Array.isArray(res.data.items)) {
              items = res.data.items;
            } else if (res.results && Array.isArray(res.results)) {
              items = res.results;
            }
            count = res.count || res.total || (res.total_pages ? res.total_pages * pageSize : items.length);
          }
        } else {
          // ── DEFAULT LIST PATH ────────────────────────────────────────────
          // GET /api/base/services/hotel-reservations/?page=...&page_size=...
          const res = await cmsService.searchServiceItems("hotel-reservations", "", currentPage, pageSize);

          if (res && res.success !== false) {
            // default endpoint returns: { success, count, total_pages, data: { ...service info..., items: [...] } }
            if (res.data && !Array.isArray(res.data) && res.data.items && Array.isArray(res.data.items)) {
              items = res.data.items;
            } else if (Array.isArray(res.data)) {
              items = res.data;
            } else if (res.items && Array.isArray(res.items)) {
              items = res.items;
            } else if (res.results && Array.isArray(res.results)) {
              items = res.results;
            }
            count = res.count || res.total || (res.total_pages ? res.total_pages * pageSize : items.length);
          }
        }

        if (!active) return;

        if (items.length > 0) {
          setHotels(items);
          setTotalCount(count);
        } else {
          setHotels(fallbackHotels);
          setTotalCount(fallbackHotels.length);
        }
      } catch (err) {
        if (active) {
          setHotels(fallbackHotels);
          setTotalCount(fallbackHotels.length);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchHotels();
    return () => {
      active = false;
    };
  }, [searchTerm, currentPage]);

  // Client side fallback filtering if API returned unpaginated list
  const filteredHotels = hotels.filter((hotel) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      (hotel.title || "").toLowerCase().includes(term) ||
      (hotel.city || "").toLowerCase().includes(term) ||
      (hotel.location || "").toLowerCase().includes(term) ||
      (hotel.rating || "").toLowerCase().includes(term)
    );
    const hotelLocation = hotel.city || hotel.location || "Other";
    const matchesLocation = locationFilter === "All" || hotelLocation === locationFilter;
    const stars = Number((hotel.rating || "").match(/[1-5]/)?.[0] || 0);
    const matchesStars = starFilter === "All" || stars === Number(starFilter);
    return matchesSearch && matchesLocation && matchesStars;
  });

  const locations = Array.from(new Set(hotels.map((hotel) => hotel.city || hotel.location || "Other"))).sort();
  const suggestions = hotels
    .filter((hotel) => {
      const term = searchInput.trim().toLowerCase();
      if (!term) return true;
      return [hotel.title, hotel.city, hotel.location].some((value) =>
        (value || "").toLowerCase().includes(term)
      );
    })
    .slice(0, 6);
  const hasClientFilters = locationFilter !== "All" || starFilter !== "All";
  const isApiData = totalCount > 0;
  const totalItems = hasClientFilters ? filteredHotels.length : (isApiData ? totalCount : filteredHotels.length);
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedHotels = hasClientFilters
    ? filteredHotels
    : isApiData
      ? hotels
      : filteredHotels.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportHotels = () => {
    const rows = filteredHotels.map((hotel) => [
      hotel.title,
      hotel.city || "",
      hotel.location || "",
      hotel.rating || "",
      hotel.price || "",
      hotel.short_description || hotel.description || ""
    ]);
    const escapeCell = (value: string) => `"${String(value).replace(/"/g, '""')}"`;
    const csv = [["Hotel", "City", "Location", "Star Rating", "Price", "Description"], ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hotel-reservations-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const startIndex = (currentPage - 1) * pageSize;

  const getPageNumbers = () => {
    const range: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  };

  // Prefetch & Preload Next Page Data & Images in background
  useEffect(() => {
    if (searchTerm || loading || !totalPages || currentPage >= totalPages || (totalCount > 0 && totalItems <= currentPage * pageSize)) return;
    const nextPage = currentPage + 1;
    const prefetchNextPage = async () => {
      try {
        const res = await cmsService.searchServiceItems("hotel-reservations", searchTerm, nextPage, pageSize);
        if (res && res.success !== false) {
          const nextItems = res?.results || res?.data || res?.items || (Array.isArray(res) ? res : []);
          if (Array.isArray(nextItems)) {
            nextItems.forEach((item: any) => {
              if (item?.image && typeof window !== "undefined") {
                const img = new Image();
                img.src = item.image;
              }
            });
          }
        }
      } catch {
        // silent prefetch error ignore
      }
    };
    prefetchNextPage();
  }, [searchTerm, currentPage, totalPages, totalCount, totalItems, pageSize, loading]);

  const displayName = serviceData?.name || "Hotel Reservations";
  const displayDesc = serviceData?.description || serviceData?.short_description || "Handpicked stays aligned to comfort, policy and official entitlement rates.";
  const displayBanner = serviceData?.banner_image || "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1600";

  return (
    <div className="bg-[#f5f9fc] text-[#122b42] min-h-screen">
      {/* Hero Header */}
      <section className="relative h-[280px] md:h-[300px] flex items-center overflow-hidden bg-[#061f3b] text-white px-5 lg:px-8">
        <div className="absolute inset-0 z-0">
          <img 
            src={displayBanner} 
            alt={displayName} 
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061f3b]/90 via-[#061f3b]/60 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]">
            <Building2 className="size-4" /> Hospitality Desk
          </p>
          <h1 className="mt-5 font-serif text-5xl md:text-6xl max-w-3xl leading-tight">
            {displayName}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            {displayDesc}
          </p>
        </div>
      </section>

      {/* Advisory Bar */}
      <section className="bg-[#e3f2f9] border-y border-[#087fbe]/20 py-4 px-5">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-semibold text-[#062b50]">
          <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#087dbd]">
            <ShieldCheck className="size-5 shrink-0" />
            Official MoU partners
          </span>
          <span>Entitlement rates & flexible cancellation policies are applied to all reservations.</span>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="relative z-20 mx-auto max-w-7xl px-5 pt-12 lg:px-8">
        <div className="bg-white border border-black/8 p-5 rounded-3xl shadow-sm flex flex-col lg:flex-row lg:flex-wrap items-center gap-4 justify-between">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setSearchTerm(searchInput.trim());
              setCurrentPage(1);
              setShowSuggestions(false);
            }}
            className="flex w-full lg:max-w-lg items-center gap-2"
          >
            <div className="relative z-30 flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by hotel name, city, location or rating..."
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
                autoComplete="off"
                role="combobox"
                aria-expanded={showSuggestions}
                aria-controls="hotel-search-suggestions"
                className="w-full pl-11 pr-10 py-3.5 border border-black/10 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#087dbd]/20 focus:border-[#087dbd] bg-[#f8fafc] text-black font-semibold placeholder:text-zinc-400 transition"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition cursor-pointer"
                  title="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
              {showSuggestions && (
                <div id="hotel-search-suggestions" role="listbox" className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-96 overflow-y-auto rounded-2xl border border-[#dce8ef] bg-white p-2 shadow-[0_18px_45px_rgba(6,31,59,.16)]">
                  <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[.18em] text-[#8295a4]">
                    {searchInput.trim() ? "Suggested matches" : "Popular properties"}
                  </p>
                  {suggestions.length > 0 ? suggestions.map((hotel) => (
                    <button
                      key={hotel.id}
                      type="button"
                      role="option"
                      aria-selected={false}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setSearchInput(hotel.title);
                        setSearchTerm(hotel.title);
                        setCurrentPage(1);
                        setShowSuggestions(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[#edf8fd] focus:bg-[#edf8fd] focus:outline-none"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e5f5fc] text-[#087dbd]"><Building2 className="size-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-[#122b42]">{hotel.title}</span>
                        <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-[#607789]"><MapPin className="size-3 shrink-0" />{hotel.location || hotel.city || "Location available on request"}</span>
                      </span>
                      {hotel.rating && <span className="shrink-0 text-[10px] font-bold text-[#087dbd]">{hotel.rating}</span>}
                    </button>
                  )) : <p className="px-3 py-4 text-sm text-[#607789]">No matching hotel suggestions.</p>}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0875b7] to-[#08a9da] hover:from-[#0983cc] hover:to-[#09b6e8] px-6 py-3.5 font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Search className="size-4" />
              <span>Search</span>
            </button>
          </form>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto">
            <label className="relative">
              <span className="sr-only">Filter by location</span>
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#087dbd]" />
              <select
                value={locationFilter}
                onChange={(event) => { setLocationFilter(event.target.value); setCurrentPage(1); }}
                className="h-12 min-w-44 appearance-none rounded-2xl border border-black/10 bg-[#f8fafc] pl-10 pr-8 text-sm font-semibold text-[#344a5c] outline-none focus:border-[#087dbd] focus:ring-2 focus:ring-[#087dbd]/20"
              >
                <option value="All">All locations</option>
                {locations.map((location) => <option key={location} value={location}>{location}</option>)}
              </select>
            </label>
            <label className="relative">
              <span className="sr-only">Filter by star rating</span>
              <Star className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 fill-[#e7ad35] text-[#e7ad35]" />
              <select
                value={starFilter}
                onChange={(event) => { setStarFilter(event.target.value); setCurrentPage(1); }}
                className="h-12 min-w-40 appearance-none rounded-2xl border border-black/10 bg-[#f8fafc] pl-10 pr-8 text-sm font-semibold text-[#344a5c] outline-none focus:border-[#087dbd] focus:ring-2 focus:ring-[#087dbd]/20"
              >
                <option value="All">All star ratings</option>
                {[5, 4, 3, 2, 1].map((stars) => <option key={stars} value={stars}>{stars} star</option>)}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={exportHotels}
            disabled={filteredHotels.length === 0}
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl border border-[#087dbd]/20 bg-[#edf8fd] px-5 text-xs font-bold uppercase tracking-wider text-[#087dbd] transition hover:border-[#087dbd]/40 hover:bg-[#dff3fb] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="size-4" />
            Export Excel
          </button>
          
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-zinc-500 uppercase shrink-0">
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-sky-50 text-[#087dbd] border border-sky-100 font-extrabold shadow-sm">
                Active filter: "{searchTerm}"
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="hover:text-red-600 transition cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            )}
            <span>
              Showing {startIndex + 1} - {Math.min(startIndex + pageSize, totalItems)} of {totalItems} properties
            </span>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section ref={gridRef} className="relative z-0 mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <HotelCardSkeleton key={idx} />
            ))}
          </div>
        ) : paginatedHotels.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paginatedHotels.map((hotel, index) => {
              const defaultImage = fallbackHotelImages[index % fallbackHotelImages.length];
              const hotelImage = hotel.image || defaultImage;
              
              // Handle empty short description or description gracefully
              const hotelDesc = hotel.short_description || hotel.description || "Premium stay aligned to official travel entitlements & MoU policy.";
              const features = hotel.metadata?.features || ["MoU Entitlement", "Free Wifi", "Air Conditioning"];
              const ratingText = hotel.rating || "MoU Certified";

              return (
                <HotelCard
                  key={hotel.id}
                  id={hotel.id}
                  title={hotel.title}
                  subtitle={hotel.location || hotel.city}
                  location={hotel.location}
                  city={hotel.city}
                  description={hotelDesc}
                  image={hotelImage}
                  fallbackImage={defaultImage}
                  ratingText={ratingText}
                  features={features}
                  price={hotel.price ? Number(hotel.price) : null}
                  buttonHref={`/hotel-booking?id=${encodeURIComponent(String(hotel.id))}&name=${encodeURIComponent(hotel.title)}&location=${encodeURIComponent(hotel.location || hotel.city || "")}&city=${encodeURIComponent(hotel.city || hotel.location || "")}&image=${encodeURIComponent(hotelImage)}&description=${encodeURIComponent(hotelDesc)}&price=${encodeURIComponent(String(hotel.price || ""))}`}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-black/8 rounded-[2.5rem] shadow-sm">
            <Building2 className="mx-auto size-12 text-zinc-300 mb-4" />
            <h3 className="text-xl font-serif font-bold text-[#062b50]">No Stays Found</h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-md mx-auto">
              We couldn't find any hotel properties matching "{searchTerm}". Try refining your search query.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-black/8 bg-white hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="size-5 text-[#062b50]" />
            </button>

            {getPageNumbers().map((num, idx) => {
              if (num === "...") {
                return (
                  <span key={`dots-${idx}`} className="px-3.5 py-2 text-sm text-zinc-400 font-bold select-none">
                    ...
                  </span>
                );
              }
              const pageNum = num as number;
              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 text-sm font-bold rounded-xl transition cursor-pointer border ${
                    currentPage === pageNum
                      ? "bg-[#062b50] text-white border-[#062b50] shadow"
                      : "bg-white text-[#062b50] border-black/8 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-black/8 bg-white hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="size-5 text-[#062b50]" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function HotelReservationsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f9fc]" />}>
      <HotelReservationsContent />
    </Suspense>
  );
}
