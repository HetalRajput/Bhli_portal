"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Sparkles
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

// Curated high-quality fallbacks for hotel card images based on hotel index
const fallbackHotelImages = [
  "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=600"
];

export default function HotelReservationsPage() {
  const [serviceData, setServiceData] = useState<any>(null);
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const res = await cmsService.getServiceDetail("hotel-reservations");
        console.log("Hotel Reservations API Response:", res);
        if (res && res.success && res.data) {
          setServiceData(res.data);
          setHotels(res.data.items || []);
        } else {
          setHotels(fallbackHotels);
        }
      } catch (err) {
        console.warn("Failed to fetch hotel reservations details", err);
        setHotels(fallbackHotels);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceData();
  }, []);

  // Filter hotels based on search term (checks title, city, location, and rating)
  const filteredHotels = hotels.filter((hotel) => {
    const term = searchTerm.toLowerCase();
    return (
      (hotel.title || "").toLowerCase().includes(term) ||
      (hotel.city || "").toLowerCase().includes(term) ||
      (hotel.location || "").toLowerCase().includes(term) ||
      (hotel.rating || "").toLowerCase().includes(term)
    );
  });

  // Calculate pagination boundaries
  const totalItems = filteredHotels.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  
  // Adjust current page if out of bounds after filtering
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [searchTerm, totalPages]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedHotels = filteredHotels.slice(startIndex, startIndex + pageSize);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f9fc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0879b7] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#062b50]">Loading hotel listings...</p>
        </div>
      </div>
    );
  }

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
        <div className="bg-white border border-black/8 p-4 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by hotel name, city, location or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-black/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#087dbd]/10 focus:border-[#087dbd] bg-[#f8fafc] text-black font-semibold"
            />
          </div>
          
          <div className="text-xs font-bold text-zinc-500 uppercase shrink-0">
            Showing {startIndex + 1} - {Math.min(startIndex + pageSize, totalItems)} of {totalItems} properties
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {paginatedHotels.length > 0 ? (
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
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-black/8 bg-white hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                  onClick={() => setCurrentPage(pageNum)}
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-black/8 bg-white hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="size-5 text-[#062b50]" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
