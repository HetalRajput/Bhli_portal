"use client";

import React, { useState, useEffect, Suspense } from "react";
import BookingSearch from "@/components/BookingSearch";
import HotelCard from "@/components/HotelCard";
import { formatPrice, searchData, searchTypes, type SearchType } from "@/lib/search-data";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Filter,
  Info,
  MapPin,
  SlidersHorizontal,
  Star,
  Building2,
  Sparkles,
  Plane,
  Train,
  Bus,
  Car
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { cmsService } from "@/lib/api/cms";

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();
  const raw = params.get("type") || "hotels";
  const type = (searchTypes.includes(raw as SearchType) ? raw : "hotels") as SearchType;
  const destination = params.get("destination") || "";
  const title = type.charAt(0).toUpperCase() + type.slice(1);

  const [apiHotels, setApiHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  // Keep search bar inputs in local state for editing
  const [searchVal, setSearchVal] = useState(destination);
  const [searchType, setSearchType] = useState<SearchType>(type);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sync state with URL parameter updates (e.g. back/forward buttons)
  useEffect(() => {
    setSearchVal(destination);
    setSearchType(type);
  }, [destination, type]);

  useEffect(() => {
    if (type === "hotels" && destination) {
      const fetchHotels = async () => {
        setLoading(true);
        try {
          const res = await cmsService.searchServiceItems("hotel-reservations", destination);
          console.log("Hotels search results API response:", res);
          if (res && res.success && Array.isArray(res.data)) {
            setApiHotels(res.data);
          } else if (res && Array.isArray(res)) {
            setApiHotels(res);
          } else {
            setApiHotels([]);
          }
        } catch (err: any) {
          console.warn("Failed to search hotels from API", err);
          setApiHotels([]);
          if (err.response?.status === 401) {
            router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchHotels();
    } else {
      setApiHotels([]);
    }
  }, [type, destination, router]);

  const fallbackHotelImages = [
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=600"
  ];

  const mapApiHotelToUi = (hotel: any) => {
    let numericRating = 4.5;
    if (hotel.rating) {
      const parsed = parseFloat(hotel.rating);
      if (!isNaN(parsed)) {
        numericRating = parsed;
      } else if (hotel.rating.toLowerCase().includes("5")) {
        numericRating = 5.0;
      } else if (hotel.rating.toLowerCase().includes("4")) {
        numericRating = 4.0;
      } else if (hotel.rating.toLowerCase().includes("budget")) {
        numericRating = 3.5;
      }
    }

    return {
      id: hotel.id,
      name: hotel.title || hotel.name,
      subtitle: hotel.location || hotel.city || "MoU Approved Stays",
      image: hotel.image || fallbackHotelImages[hotel.id % fallbackHotelImages.length],
      rating: numericRating,
      reviews: Math.floor(Math.random() * 80) + 15,
      features: hotel.metadata?.features || ["MoU Entitlement", "Free Wifi", "Air Conditioning"],
      basePrice: hotel.price ? parseFloat(hotel.price) : null,
      rawRatingText: hotel.rating || "MoU Approved",
      city: hotel.city,
      location: hotel.location,
      description: hotel.short_description || hotel.description || "Premium stay aligned to official travel entitlements & MoU policy."
    };
  };

  const filterHotel = (hotel: any) => {
    if (selectedRatings.length > 0) {
      const ratingLower = (hotel.rawRatingText || "").toLowerCase();
      const matchesRating = selectedRatings.some((r) => {
        if (r === "5 Star") return ratingLower.includes("5 star") || ratingLower.includes("palace") || hotel.rating >= 5;
        if (r === "Budget") return ratingLower.includes("budget") || hotel.rating < 4;
        return false;
      });
      if (!matchesRating) return false;
    }

    if (selectedPrices.length > 0) {
      const price = hotel.basePrice;
      const matchesPrice = selectedPrices.some((p) => {
        if (p === "under-2000") return price !== null && price < 2000;
        if (p === "2000-5000") return price !== null && price >= 2000 && price <= 5000;
        if (p === "over-5000") return price !== null && price > 5000;
        if (p === "mou-entitlement") return price === null;
        return false;
      });
      if (!matchesPrice) return false;
    }

    return true;
  };

  const hotelResults = type === "hotels"
    ? (apiHotels.length > 0 ? apiHotels.map(mapApiHotelToUi) : (destination ? [] : searchData.hotels))
    : [];

  const filteredHotelResults = hotelResults.filter(filterHotel);

  const displayResults = type === "hotels"
    ? filteredHotelResults
    : searchData[type];

  if (!destination) {
    // Centered Initial State (Google search style)
    return (
      <div className="min-h-screen bg-[#061f3b] text-white flex flex-col justify-center px-5 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(215,181,109,.15),transparent_35%)] pointer-events-none" />
        <div className="mx-auto max-w-3xl w-full text-center space-y-6">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]">
            Search & discover
          </p>
          <h1 className="font-serif text-4xl md:text-6xl leading-tight">
            Find your next journey
          </h1>
          <p className="max-w-xl mx-auto text-sm text-white/60 leading-relaxed">
            Instantly search verified hotels, flights, trains, buses and taxis aligned to official MoU rates and corporate policy.
          </p>
          
          <div className="mt-8 relative z-10 text-left">
            <BookingSearch initialType={type} initialDestination={destination} />
          </div>

          <div
            className="mt-8 mx-auto max-w-2xl flex gap-3 rounded-2xl border border-amber-300/40 bg-amber-50/10 p-4 text-amber-250 text-left text-xs leading-relaxed"
            role="alert"
          >
            <AlertTriangle className="size-5 shrink-0 text-amber-450 mt-0.5" />
            <div>
              <span className="font-bold block text-amber-300">Important advisory</span>
              Government/Defence rates apply exclusively to bookings made through BHLI. Direct bookings with hotels are not eligible for entitlements.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Searched State (Compact header + Immediate results)
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#122b42] pb-16">
      {/* Sleek Compact Header */}
      <section className="bg-gradient-to-r from-[#05162e] via-[#06203f] to-[#05162e] px-5 py-4 text-white shadow-md border-b border-white/5 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Logo / Title Area */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-serif text-lg font-extrabold tracking-wide text-white group-hover:text-[#11a3d7] transition">
              BHLI <span className="text-[#11a3d7] group-hover:text-white transition">Portal</span>
            </span>
            <span className="h-4 w-px bg-white/20 hidden lg:block" />
            <span className="text-[10px] text-white/50 hidden lg:block uppercase tracking-widest font-bold">
              Travel Desk
            </span>
          </Link>

          {/* Sleek Inline Search Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchVal.trim()) {
                router.push(`/search?type=${searchType}&destination=${encodeURIComponent(searchVal.trim())}`);
              }
            }}
            className="flex flex-1 max-w-3xl items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-[#11a3d7]/50 focus-within:ring-2 focus-within:ring-[#11a3d7]/20 rounded-2xl p-1.5 transition-all duration-300"
          >
            {/* Custom Stateful Category Selector */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-[#11a3d7] hover:text-white uppercase tracking-wider transition rounded-xl bg-white/5 border border-white/5 hover:bg-white/10"
              >
                {searchType === "hotels" && <Building2 className="size-3.5" />}
                {searchType === "flights" && <Plane className="size-3.5" />}
                {searchType === "trains" && <Train className="size-3.5" />}
                {searchType === "buses" && <Bus className="size-3.5" />}
                {searchType === "taxis" && <Car className="size-3.5" />}
                <span>{searchType}</span>
                <span className="text-[9px] text-white/50">▼</span>
              </button>

              {/* Custom Dropdown Menu */}
              {dropdownOpen && (
                <>
                  {/* Click outside overlay */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setDropdownOpen(false)} 
                  />
                  
                  <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white text-slate-800 shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {[
                      { value: "hotels", label: "Hotels", icon: Building2 },
                      { value: "flights", label: "Flights", icon: Plane },
                      { value: "trains", label: "Trains", icon: Train },
                      { value: "buses", label: "Buses", icon: Bus },
                      { value: "taxis", label: "Taxis", icon: Car }
                    ].map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSearchType(opt.value as SearchType);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-left transition first:rounded-t-xl last:rounded-b-xl ${
                            searchType === opt.value
                              ? "bg-indigo-50 text-indigo-700 font-extrabold"
                              : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Icon className={`size-4 ${searchType === opt.value ? "text-indigo-600" : "text-slate-400"}`} />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="h-5 w-px bg-white/10" />

            {/* Input Field */}
            <div className="flex flex-1 items-center gap-2 px-2 min-w-0">
              <MapPin className="size-4 text-[#11a3d7] shrink-0" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder={
                  searchType === "hotels"
                    ? "Try Pune, Goa or hotel name..."
                    : "Enter city, airport or station..."
                }
                className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-white/40 text-white"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0875b7] to-[#08a9da] hover:from-[#0983cc] hover:to-[#09b6e8] px-4 py-2 font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all active:scale-95 shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Results Section */}
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        
        {/* Premium Results Header Card */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Enhanced Entitlement Aligned section */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-100/60 shadow-sm">
                <CheckCircle2 className="size-3 text-emerald-500 fill-emerald-100" />
                Entitlement Aligned
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider border border-indigo-100/60">
                <Sparkles className="size-3 text-indigo-500 fill-indigo-100" />
                MoU Cleared
              </span>
            </div>
            
            <div className="space-y-1">
              <p className="text-[9px] uppercase font-bold tracking-widest text-black/35">
                Official Travel Desk Search
              </p>
              <h2 className="font-serif text-3xl font-extrabold text-[#062b50] leading-tight">
                Stays in <span className="text-[#087dbd] capitalize">{destination}</span>
              </h2>
              <p className="text-xs text-black/50 font-medium flex items-center gap-1.5">
                <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                We found <span className="font-bold text-[#062b50]">{displayResults.length} properties</span> matching your travel grade & entitlements.
              </p>
            </div>
          </div>

          {/* MoU Agreement Rates Warning Box */}
          <div className="bg-amber-50/40 border border-amber-200/50 rounded-2xl p-5 max-w-md text-xs text-amber-950 flex gap-3.5 shadow-sm hover:shadow-md transition duration-300">
            <div className="grid size-9 place-items-center rounded-xl bg-amber-100 text-amber-600 shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <span className="font-bold block text-amber-900 mb-0.5 text-sm">MoU Agreement Rates</span>
              Government, Defence, and Corporate pre-negotiated rates apply exclusively. Direct hotel requests do not carry these privileges.
            </div>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="flex h-64 items-center justify-center bg-white border border-black/5 rounded-[2rem] shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0879b7] border-t-transparent" />
                <p className="text-sm font-semibold text-[#062b50]">Searching hotels...</p>
              </div>
            </div>
          ) : type === "hotels" ? (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {displayResults.map((item) => (
                <HotelCard
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  subtitle={item.subtitle}
                  location={(item as any).location}
                  city={(item as any).city}
                  description={(item as any).description || "Premium stay aligned to official travel entitlements & MoU policy."}
                  image={item.image}
                  fallbackImage={item.image}
                  ratingText={(item as any).rawRatingText || `${item.rating} Star`}
                  features={item.features}
                  price={item.basePrice ?? null}
                  buttonHref={`/contact-us?enquiry=hotel&property=${encodeURIComponent(item.name)}&location=${encodeURIComponent((item as any).location || (item as any).city || item.subtitle || "")}`}
                />
              ))}
            </div>
          ) : (
            // Horizontal List Layout for Flights, Trains, Buses, and Taxis
            <div className="space-y-5">
              {displayResults.map((item) => (
                <article
                  key={item.id}
                  className="group grid overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-350 hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[250px_1fr]"
                >
                  <div className="relative min-h-52 overflow-hidden bg-slate-55">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-xs font-bold text-[#087fbe] shadow-md border border-black/5">
                      {title}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between gap-6 p-6">
                    <div className="flex flex-col justify-between gap-5 md:flex-row">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#087fbe]">
                          <Star className="size-4 fill-[#0aa5d8] text-[#0aa5d8]" />
                          {item.rating}{" "}
                          <span className="font-normal text-black/40">
                            ({item.reviews} reviews)
                          </span>
                        </div>
                        <h3 className="mt-2 font-serif text-2xl font-bold text-[#062b50] group-hover:text-[#087dbd] transition duration-300">
                          {item.name}
                        </h3>
                        <p className="mt-2 flex items-center gap-2 text-sm text-black/50">
                          <MapPin className="size-4 text-[#087fbe] shrink-0" />
                          {destination} - {item.subtitle}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.features.slice(0, 3).map((x: string) => (
                            <span
                              key={x}
                              className="rounded-full bg-[#f1f7fc] px-3 py-1.5 text-xs font-semibold text-[#2e5069] border border-[#e2ecf5]"
                            >
                              {x}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0 md:text-right">
                        <small className="text-black/40 uppercase font-bold tracking-wider text-[9px]">Starting from</small>
                        <p className="mt-0.5 text-2xl font-extrabold text-[#062b50]">
                          {formatPrice(item.basePrice ?? 0)}
                        </p>
                        <small className="text-black/40 font-semibold text-[10px]">+ taxes & fees</small>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/5 pt-5">
                      <p className="flex items-center gap-2 text-xs text-green-700 font-medium">
                        <CheckCircle2 className="size-4 text-green-600" /> Detailed price breakdown available
                      </p>
                      <Link
                        href={`/search/${type}/${item.id}?destination=${encodeURIComponent(
                          destination
                        )}`}
                        className="flex items-center gap-2 rounded-2xl bg-[#061f3b] hover:bg-[#087dbd] px-5 py-3 text-xs font-bold text-white transition-all hover:shadow-md active:scale-95"
                      >
                        View details <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f9fc]" />}>
      <SearchContent />
    </Suspense>
  );
}
