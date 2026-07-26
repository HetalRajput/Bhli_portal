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
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (hotel.title || "").toLowerCase().includes(term) ||
      (hotel.city || "").toLowerCase().includes(term) ||
      (hotel.location || "").toLowerCase().includes(term) ||
      (hotel.rating || "").toLowerCase().includes(term)
    );
  });

  const isApiData = totalCount > 0;
  const totalItems = isApiData ? totalCount : filteredHotels.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginatedHotels = isApiData
    ? hotels
    : filteredHotels.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    if (loading || !totalPages || currentPage >= totalPages || (totalCount > 0 && totalItems <= currentPage * pageSize)) return;
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
      <section className="relative h-[380px] flex items-center overflow-hidden bg-[#061f3b] text-white px-5 lg:px-8">
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
      <section className="mx-auto max-w-7xl px-5 pt-12 lg:px-8">
        <div className="bg-white border border-black/8 p-5 rounded-3xl shadow-sm flex flex-col lg:flex-row items-center gap-4 justify-between">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setSearchTerm(searchInput.trim());
              setCurrentPage(1);
            }}
            className="flex w-full lg:max-w-xl items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by hotel name, city, location or rating..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
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
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0875b7] to-[#08a9da] hover:from-[#0983cc] hover:to-[#09b6e8] px-6 py-3.5 font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Search className="size-4" />
              <span>Search</span>
            </button>
          </form>
          
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
      <section ref={gridRef} className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
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
                  buttonHref={`/contact-us?enquiry=hotel&property=${encodeURIComponent(hotel.title)}&location=${encodeURIComponent(hotel.location || hotel.city || "")}`}
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
