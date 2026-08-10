"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";

import { useSearchParams } from "next/navigation";
import HotelCard from "@/components/HotelCard";
import {
  MapPin,
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

const commonHotelSearchTerms = ["Bengaluru", "Bangalore", "Delhi", "New Delhi", "Mumbai", "Chennai", "Hyderabad", "Kolkata", "Pune", "Goa", "Jaipur", "Gurugram", "Noida", "Aerocity"];

function editDistance(left: string, right: string) {
  const a = left.toLowerCase();
  const b = right.toLowerCase();
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
}

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
  const initialDestination = searchParams ? (searchParams.get("destination") || searchParams.get("search") || searchParams.get("q") || "") : "";
  const initialCity = searchParams?.get("city") || "";
  const initialLocation = searchParams?.get("location") || "";
  const initialRating = searchParams?.get("rating") || "";

  const gridRef = useRef<HTMLDivElement>(null);
  const [serviceData, setServiceData] = useState<any>(null);
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>(() =>
    Array.from(new Set(fallbackHotels.map((hotel) => hotel.city).filter((value): value is string => Boolean(value)))).sort(),
  );
  const [availableLocations, setAvailableLocations] = useState<string[]>(() =>
    Array.from(new Set(fallbackHotels.map((hotel) => hotel.location).filter((value): value is string => Boolean(value)))).sort(),
  );
  const [availableRatings, setAvailableRatings] = useState<string[]>(() =>
    Array.from(new Set(fallbackHotels.map((hotel) => hotel.rating).filter((value): value is string => Boolean(value)))).sort(),
  );

  // Search & Pagination State
  const [searchInput, setSearchInput] = useState(initialDestination);
  const [searchTerm, setSearchTerm] = useState(initialDestination);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [locationFilter, setLocationFilter] = useState(initialLocation);
  const [ratingFilter, setRatingFilter] = useState(initialRating);
  const pageSize = 20;

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

  // The default list response includes service metadata. Only request it
  // separately when a filtered deep link skips that endpoint.
  useEffect(() => {
    if (!initialDestination && !initialCity && !initialLocation && !initialRating) return;
    let active = true;
    cmsService.getServiceDetail("hotel-reservations").then((detail) => {
      if (active && detail?.success && detail?.data && !Array.isArray(detail.data)) {
        setServiceData(detail.data);
      }
    }).catch(() => {});
    return () => {
      active = false;
    };
  }, [initialDestination, initialCity, initialLocation, initialRating]);


  useEffect(() => {
    let active = true;
    cmsService.getHotelReservationFilters().then((filters) => {
      if (!active || !filters) return;
      setAvailableCities(Array.from(new Set(filters.cities.filter(Boolean))).sort());
      setAvailableLocations(Array.from(new Set(filters.locations.filter(Boolean))).sort());
      setAvailableRatings(Array.from(new Set(filters.ratings.filter(Boolean))).sort());
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const fetchHotels = async () => {
      setLoading(true);
      try {
        let items: HotelItem[] = [];
        let count = 0;

        if (searchTerm.trim() || cityFilter || locationFilter || ratingFilter) {
          // ── SEARCH PATH ─────────────────────────────────────────────────
          // GET /api/base/services/hotel-reservations/search/?q=...&page=...&page_size=...
          const res = await cmsService.searchServiceItems("hotel-reservations", searchTerm.trim(), currentPage, pageSize, {
            city: cityFilter,
            location: locationFilter,
            rating: ratingFilter,
          });

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
              if (active) setServiceData(res.data);
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
          setUsingFallback(false);
        } else {
          setHotels(fallbackHotels);
          setTotalCount(fallbackHotels.length);
          setUsingFallback(true);
        }
      } catch (err) {
        if (active) {
          setHotels(fallbackHotels);
          setTotalCount(fallbackHotels.length);
          setUsingFallback(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchHotels();
    return () => {
      active = false;
    };
  }, [searchTerm, cityFilter, locationFilter, ratingFilter, currentPage]);

  // Client side fallback filtering if API returned unpaginated list
  const filteredHotels = hotels.filter((hotel) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      (hotel.title || "").toLowerCase().includes(term) ||
      (hotel.city || "").toLowerCase().includes(term) ||
      (hotel.location || "").toLowerCase().includes(term) ||
      (hotel.rating || "").toLowerCase().includes(term)
    );
    const matchesCity = !cityFilter || (hotel.city || "").toLowerCase() === cityFilter.toLowerCase();
    const matchesLocation = !locationFilter || (hotel.location || "").toLowerCase().includes(locationFilter.toLowerCase());
    const matchesRating = !ratingFilter || (hotel.rating || "").toLowerCase() === ratingFilter.toLowerCase();
    return matchesSearch && matchesCity && matchesLocation && matchesRating;
  });

  const cityOptions = availableCities;
  const locationOptions = availableLocations;
  const ratingOptions = availableRatings;

  const suggestions = hotels
    .filter((hotel) => {
      const term = searchInput.trim().toLowerCase();
      if (!term) return true;
      return [hotel.title, hotel.city, hotel.location].some((value) =>
        (value || "").toLowerCase().includes(term)
      );
    })
    .slice(0, 6);
  const spellingSuggestions = useMemo(() => {
    const query = searchInput.trim().toLowerCase();
    if (query.length < 3 || suggestions.length > 0) return [];
    const values = hotels.flatMap((hotel) => [hotel.title, hotel.city, hotel.location]).filter((value): value is string => Boolean(value?.trim()));
    const candidates = Array.from(new Set([...commonHotelSearchTerms, ...values, ...values.flatMap((value) => value.split(/[\s,()-]+/))]));
    return candidates
      .map((value) => ({ value, distance: editDistance(query, value.toLowerCase()) }))
      .filter(({ value, distance }) => value.length >= 3 && value.toLowerCase() !== query && distance <= Math.max(2, Math.ceil(query.length * 0.35)))
      .sort((a, b) => a.distance - b.distance || a.value.length - b.value.length)
      .slice(0, 3)
      .map(({ value }) => value);
  }, [hotels, searchInput, suggestions.length]);
  const isApiData = !usingFallback && totalCount > 0;
  const totalItems = isApiData ? totalCount : filteredHotels.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedHotels = isApiData
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
      <section className="relative z-20 mx-auto max-w-6xl px-5 pt-8 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,45,65,.06)] sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#102f47]">Search hotels</h2>
              <p className="mt-0.5 text-xs text-slate-500">Search and refine available properties</p>
            </div>
            <p className="rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-500">
              <span className="font-bold text-[#087dbd]">{totalItems.toLocaleString("en-IN")}</span>{" "}
              {totalItems === 1 ? "property" : "properties"}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-12 lg:items-end">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSearchTerm(searchInput.trim());
                setCurrentPage(1);
                setShowSuggestions(false);
              }}
              className="min-w-0 md:col-span-2 lg:col-span-4"
            >
              <label htmlFor="hotel-search" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">
                Hotel or destination
              </label>
              <div className="relative z-30">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="hotel-search"
                  type="search"
                  placeholder="Search hotel, city or destination"
                  value={searchInput}
                  onChange={(event) => {
                    setSearchInput(event.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
                  autoComplete="off"
                  spellCheck="true"
                  autoCorrect="on"
                  role="combobox"
                  aria-expanded={showSuggestions}
                  aria-controls="hotel-search-suggestions"
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-9 text-sm font-medium text-[#122b42] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#087dbd] focus:ring-3 focus:ring-[#087dbd]/10"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    aria-label="Clear hotel search"
                    className="absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="size-3.5" />
                  </button>
                )}

                {showSuggestions && (
                  <div id="hotel-search-suggestions" role="listbox" className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,45,65,.14)]">
                    {spellingSuggestions.length > 0 && (
                      <div className="mb-1 rounded-lg bg-amber-50 p-1.5">
                        <p className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700">Did you mean?</p>
                        {spellingSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            role="option"
                            aria-selected={false}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                              setSearchInput(suggestion);
                              setSearchTerm(suggestion);
                              setCurrentPage(1);
                              setShowSuggestions(false);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-semibold text-amber-900 hover:bg-white"
                          >
                            <Sparkles className="size-3.5 text-amber-500" />
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
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
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                      >
                        <Building2 className="size-4 shrink-0 text-[#087dbd]" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-[#122b42]">{hotel.title}</span>
                          <span className="block truncate text-[11px] text-slate-500">{hotel.location || hotel.city || "Location available on request"}</span>
                        </span>
                        {hotel.rating && <span className="shrink-0 text-[10px] font-semibold text-slate-500">{hotel.rating}</span>}
                      </button>
                    )) : spellingSuggestions.length === 0 ? (
                      <p className="px-3 py-4 text-center text-xs text-slate-500">No matching hotels found</p>
                    ) : null}
                  </div>
                )}
              </div>
            </form>

            <label className="block min-w-0 lg:col-span-2">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">City</span>
              <select
                value={cityFilter}
                onChange={(event) => {
                  setCityFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-[#122b42] outline-none transition hover:border-slate-300 focus:border-[#087dbd] focus:ring-3 focus:ring-[#087dbd]/10"
              >
                <option value="">All cities</option>
                {cityFilter && !cityOptions.includes(cityFilter) && <option value={cityFilter}>{cityFilter}</option>}
                {cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            </label>

            <label className="block min-w-0 lg:col-span-2">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">Location</span>
              <select
                value={locationFilter}
                onChange={(event) => {
                  setLocationFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-[#122b42] outline-none transition hover:border-slate-300 focus:border-[#087dbd] focus:ring-3 focus:ring-[#087dbd]/10"
              >
                <option value="">All locations</option>
                {locationFilter && !locationOptions.includes(locationFilter) && <option value={locationFilter}>{locationFilter}</option>}
                {locationOptions.map((location) => <option key={location} value={location}>{location}</option>)}
              </select>
            </label>

            <label className="block min-w-0 lg:col-span-2">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">Rating</span>
              <select
                value={ratingFilter}
                onChange={(event) => {
                  setRatingFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-[#122b42] outline-none transition hover:border-slate-300 focus:border-[#087dbd] focus:ring-3 focus:ring-[#087dbd]/10"
              >
                <option value="">All ratings</option>
                {ratingFilter && !ratingOptions.includes(ratingFilter) && <option value={ratingFilter}>{ratingFilter}</option>}
                {ratingOptions.map((rating) => <option key={rating} value={rating}>{rating}</option>)}
              </select>
            </label>

            <button
              type="button"
              onClick={exportHotels}
              disabled={filteredHotels.length === 0}
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#087dbd] transition hover:border-[#087dbd]/30 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40 md:col-span-2 lg:col-span-2"
            >
              <Download className="size-3.5" />
              Export
            </button>
          </div>

          <div className="mt-3 flex min-h-7 flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-[#087dbd]">
                “{searchTerm}”
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  aria-label="Remove search filter"
                  className="hover:text-rose-600"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}
            {cityFilter && <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{cityFilter}</span>}
            {locationFilter && <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{locationFilter}</span>}
            {ratingFilter && <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{ratingFilter}</span>}
            {(searchTerm || cityFilter || locationFilter || ratingFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearchTerm("");
                  setCityFilter("");
                  setLocationFilter("");
                  setRatingFilter("");
                  setCurrentPage(1);
                }}
                className="text-[11px] font-semibold text-rose-600 transition hover:text-rose-700"
              >
                Clear all
              </button>
            )}
            <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {totalItems ? startIndex + 1 : 0}–{Math.min(startIndex + pageSize, totalItems)} of {totalItems.toLocaleString("en-IN")}
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
                  buttonHref={`/hotel-booking?service=${encodeURIComponent(String(serviceData?.id || ""))}&id=${encodeURIComponent(String(hotel.id))}&name=${encodeURIComponent(hotel.title)}&location=${encodeURIComponent(hotel.location || hotel.city || "")}&city=${encodeURIComponent(hotel.city || hotel.location || "")}&image=${encodeURIComponent(hotelImage)}&description=${encodeURIComponent(hotelDesc)}&price=${encodeURIComponent(String(hotel.price || ""))}`}
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
