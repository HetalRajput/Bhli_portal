"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  Bookmark,
  ArrowLeft,
  Building,
  Calendar,
  Award,
  Sparkles,
  Wifi,
  QrCode,
  X,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Hash,
  Ticket,
  Camera,
  UploadCloud,
  Trash2,
} from "lucide-react";
import { bookingService, type BookingRequest } from "@/lib/api/bookings";
import { flightService } from "@/lib/api/flights";
import { authService } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/client";
import { baseService } from "@/lib/api/base";
import BookingHistoryPanel from "@/components/BookingHistoryPanel";

type LookupItem = { id: number; name: string };

const formatBookingLabel = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatBookingValue = (value: unknown) => {
  if (value === true || value === "check") return "Yes";
  if (value === false || value === "notcheck") return "No";
  return value === null || value === undefined || value === "" ? "Not provided" : String(value);
};

const formatBookingDate = (value: unknown, includeTime = false) => {
  if (!value) return "Not provided";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", includeTime
    ? { dateStyle: "medium", timeStyle: "short" }
    : { dateStyle: "medium" });
};

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [serviceNumber, setServiceNumber] = useState<string>("");
  const [officerRank, setOfficerRank] = useState<string>("");
  const [officerRankId, setOfficerRankId] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<string>("");
  const [ranks, setRanks] = useState<LookupItem[]>([]);
  const [departments, setDepartments] = useState<LookupItem[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string>("");
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(true);
  const [bookingsError, setBookingsError] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [loadingBookingDetail, setLoadingBookingDetail] = useState<number | null>(null);
  const [bookingDetailError, setBookingDetailError] = useState<string>("");
  const [activeProfileSection, setActiveProfileSection] = useState<"profile" | "bookings" | "membership" | "support">("profile");

  // New Interactive states
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showBenefits, setShowBenefits] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const requestedSection = new URLSearchParams(window.location.search).get("section");
      if (["profile", "bookings", "membership", "support"].includes(requestedSection || "")) {
        queueMicrotask(() => setActiveProfileSection(requestedSection as typeof activeProfileSection));
      }
      const authData = localStorage.getItem("bhli-auth");
      const token = localStorage.getItem("access_token");

      if (!authData && !token) {
        router.push("/login");
        return;
      }

      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          if (parsed.email) setEmail(parsed.email);
        } catch (e) {
          console.error("Error parsing session data", e);
        }
      }

      const savedProfile = localStorage.getItem("bhli-profile-details");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.name) setName(parsed.name);
          if (parsed.phone || parsed.mobile) setPhone(parsed.phone || parsed.mobile);
          if (parsed.profileImage) setProfileImage(parsed.profileImage);
        } catch (e) {
          console.error("Error parsing profile details", e);
        }
      }

      const fetchProfile = async () => {
        try {
          const profile = await authService.getProfile();
          const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(String.fromCharCode(32)).trim();
          if (fullName) setName(fullName);
          if (profile.email) setEmail(profile.email);
          if (profile.mobile_number) setPhone(profile.mobile_number);
          if (profile.image) setProfileImage(profile.image);
          setServiceNumber(profile.service_number || "");
          setOfficerRank(profile.officer_rank_name || "");
          setOfficerRankId(profile.officer_rank ? String(profile.officer_rank) : "");
          setEmployeeId(profile.employee_id || "");
          setDepartment(profile.department_name || "");
          setDepartmentId(profile.department ? String(profile.department) : "");
        } catch (error) {
          setProfileError(getErrorMessage(error));
        } finally {
          setIsLoading(false);
        }
      };

      const fetchLookups = async () => {
        try {
          const [rankResponse, departmentResponse] = await Promise.all([
            baseService.getOfficerRanks(),
            baseService.getDepartments(),
          ]);
          setRanks(Array.isArray(rankResponse?.data) ? rankResponse.data : rankResponse || []);
          setDepartments(Array.isArray(departmentResponse?.data) ? departmentResponse.data : departmentResponse || []);
        } catch (error) {
          console.warn("Failed to load profile lookup options", error);
        }
      };

      const fetchBookingsList = async () => {
        setBookingsError("");
        try {
          const [bookingResponse, flightHistoryResponse] = await Promise.all([
            bookingService.listBookings(),
            flightService.history().catch(() => null),
          ]);
          const commonBookings = bookingResponse?.success && Array.isArray(bookingResponse.data)
            ? bookingResponse.data
            : [];
          const flightHistory = flightHistoryResponse && Array.isArray(flightHistoryResponse.data)
            ? flightHistoryResponse.data.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
            : [];
          const flightsByCommonBooking = new Map(
            flightHistory.map((flight) => [Number(flight.booking), flight]),
          );
          setBookings(commonBookings.map((booking) => {
            const flight = flightsByCommonBooking.get(Number(booking.id));
            if (!flight) return booking;
            const flightStatus = String(flight.status || flight.booking_status || booking.status);
            return {
              ...booking,
              status: flightStatus,
              booking_status: flight.booking_status,
              flight_booking_id: flight.id,
              flight_id: flight.flight_id,
              ref_id: flight.ref_id,
              pnr: flight.pnr,
              ticket_number: flight.ticket_number,
              provider_status: flight.provider_status,
              flight_passengers: Array.isArray(flight.passengers) ? flight.passengers : [],
            };
          }));
        } catch (requestError) {
          setBookings([]);
          setBookingsError(getErrorMessage(requestError));
        } finally {
          setLoadingBookings(false);
        }
      };
      if (token) {
        fetchProfile();
        fetchLookups();
        fetchBookingsList();
      } else {
        setLoadingBookings(false);
        setIsLoading(false);
      }
    }
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    try {
      const nameParts = name.trim().split(/\s+/);
      const updated = await authService.updateProfile({
        first_name: nameParts.shift() || "",
        last_name: nameParts.join(" "),
        email: email.trim().toLowerCase(),
        mobile_number: phone.trim(),
        service_number: serviceNumber.trim(),
        employee_id: employeeId.trim(),
        ...(officerRankId && { officer_rank: Number(officerRankId) }),
        ...(departmentId && { department: Number(departmentId) }),
      });
      setName([updated.first_name, updated.last_name].filter(Boolean).join(" "));
      setPhone(updated.mobile_number || phone);
      setEmail(updated.email || email);
      setOfficerRank(updated.officer_rank_name || officerRank);
      setDepartment(updated.department_name || department);
      localStorage.setItem(
        "bhli-profile-details",
        JSON.stringify({ name, phone, serviceNumber, employeeId, profileImage })
      );
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      setProfileError(getErrorMessage(error));
    }
  };

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          await authService.logout(refresh);
        } catch (error) {
          console.warn("Server logout failed; clearing the local session.", error);
        }
      }
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("bhli-auth");
      window.dispatchEvent(new Event("storage"));
      router.push("/login");
    }
  };

  const handleViewBooking = async (id: number) => {
    setLoadingBookingDetail(id);
    setBookingDetailError("");
    try {
      const response = await bookingService.getBookingById(id);
      setSelectedBooking(response);
    } catch (error) {
      setBookingDetailError(getErrorMessage(error));
    } finally {
      setLoadingBookingDetail(null);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1500000) {
        alert("Image size should be less than 1.5MB to optimize profile storage.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setProfileImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
      try {
        setProfileError("");
        const updated = await authService.updateProfileImage(file);
        if (updated.image) {
          setProfileImage(updated.image);
          const cached = JSON.parse(localStorage.getItem("bhli-profile-details") || "{}");
          localStorage.setItem("bhli-profile-details", JSON.stringify({ ...cached, profileImage: updated.image }));
          window.dispatchEvent(new Event("storage"));
        }
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } catch (error) {
        setProfileError(getErrorMessage(error));
      }
    }
  };

  const handleImageRemove = async () => {
    try {
      setProfileError("");
      await authService.updateProfileImage(null);
      setProfileImage("");
      const cached = JSON.parse(localStorage.getItem("bhli-profile-details") || "{}");
      localStorage.setItem("bhli-profile-details", JSON.stringify({ ...cached, profileImage: "" }));
      window.dispatchEvent(new Event("storage"));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      setProfileError(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div id="profile-workspace" className="min-h-screen bg-gradient-to-b from-[#f3f9fc] via-white to-[#edf7fc] lg:h-[calc(100dvh-5rem)] lg:min-h-0 lg:overflow-hidden">
        <div className="mx-auto flex w-full max-w-7xl animate-pulse flex-col gap-3 lg:h-full lg:border-x lg:border-[#0a79bf]/10" aria-label="Loading profile">
          <div className="shrink-0 border-y border-[#1b3d64]/50 bg-gradient-to-r from-[#071c35] to-[#155d91] px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="size-16 shrink-0 rounded-full bg-white/20 ring-2 ring-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-44 rounded bg-white/25" />
                <div className="h-3 w-56 max-w-full rounded bg-white/15" />
                <div className="h-2.5 w-36 rounded bg-white/10" />
              </div>
            </div>
          </div>

          <div className="grid min-h-0 w-full items-start border-t border-[#0a79bf]/10 lg:flex-1 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-stretch lg:overflow-hidden">
            <aside className="flex h-fit flex-col border-b border-r border-[#0a79bf]/10 bg-white p-2 lg:h-full lg:border-b-0">
              <div className="border-b border-slate-100 px-2 pb-3 pt-2">
                <div className="h-2.5 w-24 rounded bg-sky-200" />
                <div className="mt-2 h-4 w-36 rounded bg-slate-200" />
                <div className="mt-3 h-8 rounded-lg bg-sky-50" />
              </div>
              <div className="mt-2 divide-y divide-slate-100">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 px-2.5 py-2.5">
                    <div className="size-9 shrink-0 rounded-lg bg-sky-50" />
                    <div className="flex-1 space-y-1.5"><div className="h-2.5 w-24 rounded bg-slate-200" /><div className="h-2 w-28 max-w-full rounded bg-slate-100" /></div>
                  </div>
                ))}
              </div>
              <div className="mt-auto space-y-2 border-t border-slate-100 p-2 pt-3"><div className="h-9 rounded-lg bg-slate-800" /><div className="h-9 rounded-lg bg-rose-100" /></div>
            </aside>

            <div className="min-w-0 lg:h-full lg:overflow-hidden">
              <div className="overflow-hidden rounded-2xl border border-[#0a79bf]/10 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-4 sm:px-5"><div className="h-5 w-40 rounded bg-slate-200" /><div className="mt-2 h-2.5 w-72 max-w-full rounded bg-slate-100" /></div>
                <div className="divide-y divide-slate-100 px-4 sm:px-5">
                  <div className="flex items-center gap-4 py-3"><div className="size-16 rounded-full bg-sky-50" /><div className="space-y-2"><div className="h-3 w-24 rounded bg-slate-200" /><div className="h-2.5 w-48 rounded bg-slate-100" /><div className="h-7 w-24 rounded-lg bg-sky-100" /></div></div>
                  <div className="py-3"><div className="mb-2 h-2.5 w-20 rounded bg-slate-200" /><div className="h-10 rounded-lg bg-slate-100" /></div>
                  {[1, 2, 3].map((row) => <div key={row} className="grid gap-3 py-3 sm:grid-cols-2"><div className="h-10 rounded-lg bg-slate-100" /><div className="h-10 rounded-lg bg-slate-100" /></div>)}
                  <div className="flex items-center justify-between py-3"><div className="h-9 w-32 rounded-lg bg-sky-200" /><div className="h-3 w-24 rounded bg-slate-100" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const initial = email ? email.charAt(0).toUpperCase() : "U";
  const memberId = email 
    ? `BHLI-${email.split("@")[0].substring(0, 5).toUpperCase()}-${phone ? phone.slice(-4) : "2026"}`
    : "BHLI-GUEST-2026";

  return (
    <div id="profile-workspace" className="min-h-screen bg-gradient-to-b from-[#f3f9fc] via-white to-[#edf7fc] lg:h-[calc(100dvh-5rem)] lg:min-h-0 lg:overflow-hidden">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 lg:h-full lg:border-x lg:border-[#0a79bf]/10 lg:shadow-[0_0_45px_rgba(6,31,59,.06)]">
        
        {/* Profile Header Banner */}
        <div 
          className="relative shrink-0 overflow-hidden border-y border-[#1b3d64]/50 bg-gradient-to-br from-[#06182c] via-[#0b2b4d] to-[#12538b] px-4 py-3 text-white shadow-md sm:px-6 lg:px-8"
          style={{ 
            backgroundImage: `radial-gradient(circle at 100% 0%, rgba(19, 165, 216, 0.2) 0%, transparent 60%), radial-gradient(circle at 0% 100%, rgba(8, 121, 183, 0.2) 0%, transparent 60%), linear-gradient(135deg, #06182c 0%, #0b2b4d 60%, #12538b 100%)` 
          }}
        >
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center gap-3 text-left sm:flex-nowrap">

            
            {/* Interactive Banner Avatar with Camera Upload */}
            <div className="relative shrink-0 group/avatar">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#13a5d8] to-[#00aeef] blur-md opacity-70 animate-pulse" />
              <div className="relative flex size-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-[#13a5d8] to-[#00aeef] text-xl font-bold text-white shadow-md ring-2 ring-white/20">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  initial
                )}
                {/* Hover Camera Overlay */}
                <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1.5 text-[10px] font-bold text-white/90 opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-4 h-4" />
                  Change Photo
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <span title="Verified Profile" aria-label="Verified Profile" className="absolute -bottom-1 -right-1 z-20 grid size-6 place-items-center rounded-full border-2 border-[#0b2b4d] bg-emerald-500 text-white shadow-md">
                <ShieldCheck className="size-3.5 stroke-[2.5]" />
              </span>
            </div>

            <div className="min-w-[160px] flex-1 space-y-1">
              <div className="flex items-center">
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {name || "Valued Guest"}
                </h1>
              </div>
              <p className="flex items-center justify-center gap-2 text-xs text-white/75 md:justify-start">
                <Mail className="w-4 h-4 text-[#8dcfe9]" />
                {email || "user@gmail.com"}
              </p>
            </div>

          </div>
        </div>

        {profileError && (
          <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-medium text-amber-800">
            We could not refresh your profile details. Showing the last saved information. {profileError}
          </div>
        )}

        {/* Content Grid */}
        <div className="grid min-h-0 w-full items-start border-t border-[#0a79bf]/10 lg:flex-1 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-stretch lg:overflow-hidden">
          <aside className="flex h-fit flex-col overflow-y-auto overscroll-contain border-b border-r border-[#0a79bf]/10 bg-white p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:h-full lg:border-b-0">
            <div className="border-b border-slate-100 px-2 pb-3 pt-2">
              <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#0879b7]">Account centre</p>
              <h2 className="mt-1 text-base font-bold text-[#07152d]">Manage your journey</h2>
              <Link href="/" className="mt-3 flex items-center gap-2 rounded-lg border border-[#0a79bf]/10 bg-[#edf8fd] px-3 py-2 text-[11px] font-bold text-[#0879b7] transition hover:bg-[#dff3fb]">
                <ArrowLeft className="size-3.5 stroke-[2.5]" />Back to Home
              </Link>
            </div>
            <nav aria-label="Profile sections" className="mt-2 divide-y divide-slate-100">
              {[
                ["profile", "Personal details", "Contact and service profile", User],
                ["bookings", "Booking requests", `${bookings.length} total request${bookings.length === 1 ? "" : "s"}`, Ticket],
                ["membership", "Membership pass", "Benefits and digital card", Award],
                ["support", "Travel support", "Quick links and assistance", ShieldCheck],
              ].map(([section, label, description, Icon]) => {
                const isActive = activeProfileSection === section;
                const NavIcon = Icon as React.ComponentType<{ className?: string }>;
                return <button key={String(section)} type="button" onClick={() => setActiveProfileSection(section as typeof activeProfileSection)} className={`group flex w-full items-center gap-2.5 px-2.5 py-2.5 text-left transition first:rounded-t-xl last:rounded-b-xl ${isActive ? "bg-gradient-to-r from-[#0879b7] to-[#13a5d8] text-white shadow-md shadow-[#0879b7]/20" : "text-[#344a5c] hover:bg-[#edf8fd]"}`}>
                  <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${isActive ? "bg-white/15" : "bg-[#edf8fd] text-[#0879b7] group-hover:bg-white"}`}><NavIcon className="size-4" /></span>
                  <span className="min-w-0"><span className="block text-xs font-bold">{String(label)}</span><span className={`mt-0.5 block truncate text-[9px] font-semibold ${isActive ? "text-white/70" : "text-slate-400"}`}>{String(description)}</span></span>
                </button>;
              })}
            </nav>
            <div className="mt-auto space-y-2 border-t border-slate-100 p-2 pt-3">
              <Link href="/services" className="flex items-center justify-center gap-2 rounded-lg bg-[#07152d] px-3 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#0b2b4d]"><Building className="size-3.5" />Explore services</Link>
              <button type="button" onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-[11px] font-bold text-rose-700 transition hover:bg-rose-100">
                <LogOut className="size-3.5" />Sign Out
              </button>
            </div>
          </aside>

          <div className="min-w-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:h-full lg:overflow-y-auto lg:overscroll-contain">
          
          {/* Left Column: Personal Information Form & Booking Requests */}
          <div className="min-w-0">
            
            {/* Personal Details Form */}
            <div className={`${activeProfileSection === "profile" ? "block" : "hidden"} overflow-hidden rounded-2xl border border-[#0a79bf]/10 bg-white shadow-sm`}>
              <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                <h2 className="flex items-center gap-2 text-lg font-bold text-[#07152d]">
                  <User className="w-5 h-5 text-[#0879b7]" />
                  Personal Details
                </h2>
                <p className="text-xs text-[#526a7e] mt-1">
                  Manage your account contact information for faster hotel & service bookings.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="divide-y divide-slate-100 px-4 sm:px-5 [&>div]:py-3">
                
                {/* Profile Photo Upload Control */}
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#0a79bf]/20 bg-[#f0f8fc] text-xl font-bold text-[#0879b7] shadow-inner">
                    {profileImage ? (
                      <img src={profileImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      initial
                    )}
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="text-sm font-bold text-[#07152d]">Profile Photo</div>
                    <p className="text-[11px] font-semibold text-gray-400">
                      Personalize your account. JPG, PNG or WEBP format. Max 1.5MB.
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#edf8fd] hover:bg-[#dff3fb] text-[#0879b7] font-bold text-xs cursor-pointer transition-colors border border-[#0a86c8]/10">
                        <UploadCloud className="w-4 h-4" />
                        Upload Image
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      {profileImage && (
                        <button
                          type="button"
                          onClick={handleImageRemove}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors border border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#344a5c] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-gray-200 bg-[#f8fafc] py-2.5 pl-10 pr-4 text-sm font-semibold text-[#07152d] outline-none transition-all focus:border-[#0879b7] focus:bg-white focus:ring-4 focus:ring-[#0879b7]/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#344a5c] mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full rounded-lg border border-gray-200 bg-[#f8fafc] py-2.5 pl-10 pr-4 text-sm font-semibold text-[#07152d] outline-none transition-all focus:border-[#0879b7] focus:bg-white focus:ring-4 focus:ring-[#0879b7]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#344a5c] mb-1.5">
                      Department
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="hidden"
                        value={departmentId}
                        readOnly
                      />
                      <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-[#f8fafc] py-2.5 pl-10 pr-4 text-sm font-semibold text-[#07152d] outline-none focus:border-[#0879b7]">
                        <option value="">{department || "Select department"}</option>
                        {departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-[#344a5c]">
                    Service Number
                    <input type="text" value={serviceNumber} onChange={(e) => setServiceNumber(e.target.value)} placeholder="Enter service number" className="mt-1.5 w-full rounded-lg border border-gray-200 bg-[#f8fafc] px-4 py-2.5 text-sm font-semibold text-[#07152d] outline-none focus:border-[#0879b7]" />
                  </label>
                  <label className="block text-xs font-semibold text-[#344a5c]">
                    Employee ID
                    <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="Enter employee ID" className="mt-1.5 w-full rounded-lg border border-gray-200 bg-[#f8fafc] px-4 py-2.5 text-sm font-semibold text-[#07152d] outline-none focus:border-[#0879b7]" />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-[#344a5c]">
                    Officer Rank
                    <select value={officerRankId} onChange={(e) => setOfficerRankId(e.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-200 bg-[#f8fafc] px-4 py-2.5 text-sm font-semibold text-[#07152d] outline-none focus:border-[#0879b7]">
                      <option value="">{officerRank || "Select rank"}</option>
                      {ranks.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                  </label>
                  <div>
                    <label className="block text-xs font-semibold text-[#344a5c] mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-[#f8fafc] py-2.5 pl-10 pr-4 text-sm font-semibold text-[#07152d] outline-none focus:border-[#0879b7]" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#168dcc] to-[#0871b2] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#003b70]/15 transition-all hover:-translate-y-0.5 hover:from-[#13a5d8] hover:to-[#0879b7] hover:shadow-lg hover:shadow-[#003b70]/20 active:translate-y-0"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>

                  {isSaved && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> Saved successfully!
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* My Bookings Section (Boarding Pass Restyle) */}
            <div className={`${activeProfileSection === "bookings" ? "block" : "hidden"} space-y-4 rounded-2xl border border-[#0a79bf]/10 bg-white p-4 shadow-sm sm:p-5`}>
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-[#07152d]">
                  <Ticket className="w-5 h-5 text-[#0879b7]" />
                  My Booking Requests
                </h2>
                <p className="text-xs text-[#526a7e] mt-1">
                  Track the status of your hospitality and travel reservation requests in boarding-pass style.
                </p>
              </div>
              <BookingHistoryPanel
                bookings={bookings}
                loading={loadingBookings}
                error={bookingsError}
                onBookingUpdated={(updated) => setBookings((current) => current.map((booking) => booking.id === updated.id ? updated : booking))}
              />
              <div className="hidden">

              {loadingBookings ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-3 border-[#0879b7] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  <p className="text-sm font-semibold text-gray-500">No booking requests submitted yet.</p>
                  <Link
                    href="/services"
                    className="inline-block mt-3 text-xs font-bold text-[#0879b7] hover:underline"
                  >
                    Submit your first request &rarr;
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {bookings.map((booking: any) => {
                    const dateStr = booking.created ? new Date(booking.created).toLocaleDateString() : "N/A";
                    
                    // Status style maps
                    let statusColor = "bg-amber-500";
                    let statusBg = "bg-amber-50 text-amber-700 border-amber-200";
                    let pulseColor = "bg-amber-500";
                    
                    if (booking.status === "new") {
                      statusColor = "bg-[#0879b7]";
                      statusBg = "bg-blue-50 text-[#0879b7] border-blue-200";
                      pulseColor = "bg-blue-500";
                    } else if (booking.status === "confirmed") {
                      statusColor = "bg-emerald-500";
                      statusBg = "bg-emerald-50 text-emerald-700 border-emerald-200";
                      pulseColor = "bg-emerald-500";
                    } else if (booking.status === "cancelled") {
                      statusColor = "bg-rose-500";
                      statusBg = "bg-rose-50 text-rose-700 border-rose-200";
                      pulseColor = "bg-rose-500";
                    }

                    return (
                      <div 
                        key={booking.id} 
                        className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-stretch group"
                      >
                        {/* Status Left Accent Bar */}
                        <div className={`w-3 md:w-3 shrink-0 ${statusColor} transition-colors duration-300`} />
                        
                        {/* Main Details Section */}
                        <div className="flex-1 p-5 space-y-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0879b7] bg-[#0879b7]/5 px-2.5 py-1 rounded-md border border-[#0879b7]/10">
                              {booking.service_type}
                            </span>
                            <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              Ref: #{booking.id}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-[#07152d]">{booking.guest_name}</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>Dest: {booking.destination_city || booking.to_city || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>Requested: {dateStr}</span>
                            </div>
                          </div>
                        </div>

                        {/* Dashed Separator (Boarding Pass Ticket Stub look) */}
                        <div className="relative w-auto md:w-px h-px md:h-auto border-t-2 md:border-t-0 md:border-l-2 border-dashed border-slate-150 self-stretch my-0 mx-5 md:mx-0">
                          {/* Round notches on top and bottom of dashed line (hidden on mobile, visible on desktop) */}
                          <div className="absolute top-0 -left-2 w-4 h-4 bg-[#f3f9fc] rounded-full translate-y-[-50%] z-10 hidden md:block" />
                          <div className="absolute bottom-0 -left-2 w-4 h-4 bg-[#f3f9fc] rounded-full translate-y-[50%] z-10 hidden md:block" />
                        </div>

                        {/* Ticket Stub Status */}
                        <div className="p-5 flex flex-col items-center justify-center gap-3 bg-slate-50/40 md:w-44 shrink-0">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold tracking-wide border uppercase ${statusBg}`}>
                            {booking.status === "new" || booking.status === "confirmed" ? (
                              <span className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pulseColor} opacity-75`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${pulseColor}`}></span>
                              </span>
                            ) : (
                              <span className={`h-2 w-2 rounded-full ${statusColor}`} />
                            )}
                            {booking.status || "new"}
                          </span>
                          <button type="button" onClick={() => handleViewBooking(Number(booking.id))} disabled={loadingBookingDetail === Number(booking.id)} className="rounded-lg border border-[#0879b7]/20 bg-white px-3 py-2 text-[11px] font-bold text-[#0879b7] transition hover:border-[#0879b7]/40 hover:bg-[#edf8fd] disabled:opacity-60">
                            {loadingBookingDetail === Number(booking.id) ? "Loading..." : "View details"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {bookingDetailError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{bookingDetailError}</p>}
              </div>
            </div>

          </div>

          {/* Right Column: Membership Card, Quick Links & Support */}
          <div className="space-y-6">
            
            {/* Membership section */}
            <div className={`${activeProfileSection === "membership" ? "block" : "hidden"} space-y-4 rounded-2xl border border-[#0a79bf]/10 bg-white p-4 shadow-sm sm:p-5`}>
              <h3 className="text-base font-bold text-[#07152d] flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Digital Membership Pass
              </h3>

              {/* 3D-effect Membership Card */}
              <div className="group relative mx-auto w-full max-w-[320px] perspective-1000">
                {/* Outer Glow Backing */}
                <div className="absolute -inset-1 bg-gradient-to-tr from-amber-500/20 via-sky-500/10 to-emerald-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* The Graphic Card */}
                <div 
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#06182c] via-[#0b2b4d] to-[#12538b] p-5 text-white border border-[#1b3d64]/60 shadow-lg aspect-[1.58/1] flex flex-col justify-between transform transition-all duration-700 ease-out preserve-3d group-hover:scale-[1.03] group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:border-amber-500/30"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, #051120 0%, #0d2847 60%, #104c7c 100%)`
                  }}
                >
                  {/* Sheen effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                  
                  {/* Subtle dots pattern overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

                  {/* Top Row: Title & Tier */}
                  <div className="flex justify-between items-start z-10">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 bg-clip-text text-transparent">BHLI CLUB</span>
                      <h4 className="text-sm font-bold tracking-tight text-white/95 leading-none">PRIVILEGE</h4>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider bg-gradient-to-r from-amber-400/20 via-amber-300/20 to-amber-500/20 border border-amber-400/30 text-amber-200 shadow-inner">
                      PLATINUM ELITE
                    </span>
                  </div>

                  {/* Mid Row: Chip & Contactless */}
                  <div className="flex justify-between items-center z-10 py-1">
                    {/* Golden smart chip */}
                    <div className="w-8 h-6 rounded bg-gradient-to-br from-[#ffe07d] via-[#f5af19] to-[#e65c00] relative overflow-hidden border border-[#f5af19]/30 flex flex-col justify-between p-0.5 shadow-inner">
                      <div className="w-full h-px bg-black/10" />
                      <div className="flex justify-between w-full h-full">
                        <div className="w-px h-full bg-black/10" />
                        <div className="w-px h-full bg-black/10" />
                        <div className="w-px h-full bg-black/10" />
                      </div>
                      <div className="w-full h-px bg-black/10" />
                    </div>

                    {/* Contactless waves */}
                    <Wifi className="w-4 h-4 text-white/35 rotate-90" />
                  </div>

                  <div className="z-10 flex items-center gap-2 text-[7px] font-extrabold uppercase tracking-[.14em] text-sky-100/75">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">15% member rates</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">24/7 travel desk</span>
                  </div>

                  {/* Bottom Row: Details */}
                  <div className="space-y-2.5 z-10">
                    {/* Card Number */}
                    <div className="text-sm font-mono tracking-widest text-white/90">
                      4815  ••••  ••••  {phone ? phone.slice(-4) : "1947"}
                    </div>

                    {/* Cardholder name & Validity */}
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <div className="text-[8px] uppercase tracking-wider text-white/40 font-bold">CARDHOLDER</div>
                        <div className="text-[11px] font-bold tracking-wide uppercase truncate max-w-[130px]">
                          {name || "VALUED GUEST"}
                        </div>
                      </div>
                      <div className="space-y-0.5 text-center">
                        <div className="text-[8px] font-bold uppercase tracking-wider text-white/40">Member since</div>
                        <div className="text-[10px] font-bold tracking-wide">JUL 2026</div>
                      </div>
                      <div className="text-right space-y-0.5">
                        <div className="text-[8px] uppercase tracking-wider text-white/40 font-bold">VALID THRU</div>
                        <div className="text-[10px] font-bold tracking-wide font-mono">12/31</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Membership quick stats under card */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-0.5">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Member ID</div>
                  <div className="text-xs font-bold text-[#07152d] truncate">{memberId}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-0.5">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Club Points
                  </div>
                  <div className="text-xs font-bold text-[#07152d]">4,850 Pts</div>
                </div>
              </div>

              {/* Show QR code action */}
              <button 
                type="button"
                onClick={() => setShowQrModal(true)}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#edf8fd] hover:bg-[#dff3fb] text-[#0879b7] font-bold text-xs tracking-wide transition-all border border-[#0a86c8]/15 shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <QrCode className="w-4 h-4 stroke-[2.5]" />
                View Digital Pass QR
              </button>

              {/* Privileges Accordion */}
              <div className="border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBenefits(!showBenefits)}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-500 hover:text-gray-700 py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                    Exclusive Club Benefits
                  </span>
                  {showBenefits ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showBenefits && (
                  <ul className="mt-2 space-y-1.5 pl-5 list-disc text-[11px] font-semibold text-gray-600 animate-fadeIn">
                    <li><strong className="text-[#07152d]">Priority Help Desk:</strong> Direct queue for Defence Desk bookings.</li>
                    <li><strong className="text-[#07152d]">Member Rates:</strong> Special 15% discount on partner rates.</li>
                    <li><strong className="text-[#07152d]">Dedicated Support:</strong> 24/7 journey planners & support assistance.</li>
                    <li><strong className="text-[#07152d]">Flexible Stays:</strong> Zero cancellation fees up to 24 hours prior.</li>
                  </ul>
                )}
              </div>
            </div>

            {/* Quick Dashboard */}
            <div className={`${activeProfileSection === "support" ? "block" : "hidden"} space-y-3 rounded-2xl border border-[#0a79bf]/10 bg-white p-4 shadow-sm sm:p-5`}>
              <h3 className="text-base font-bold text-[#07152d] flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#0879b7]" />
                Quick Dashboard
              </h3>

              <div className="space-y-2.5">
                <Link
                  href="/defence-help-desk"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#edf8fd] hover:bg-[#dff3fb] text-[#0879b7] font-semibold text-sm transition-all border border-[#0a86c8]/20 hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Defence Desk Access
                  </span>
                  <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full text-[#0879b7] border border-[#0a86c8]/10 shadow-sm">
                    Active
                  </span>
                </Link>

                <Link
                  href="/services"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-[#344a5c] font-semibold text-sm transition-all border border-gray-200 hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#0879b7]" />
                    Explore Hospitality Services
                  </span>
                </Link>

                <Link
                  href="/contact-us"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-[#344a5c] font-semibold text-sm transition-all border border-gray-200 hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0879b7]" />
                    Submit Journey Enquiry
                  </span>
                </Link>
              </div>
            </div>

            {/* Assistance Card */}
            <div className={`${activeProfileSection === "support" ? "block" : "hidden"} space-y-2 rounded-2xl border border-[#bae6fd] bg-gradient-to-br from-[#e0f2fe] to-[#f0f9ff] p-4`}>
              <h4 className="text-sm font-bold text-[#0369a1] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Need Assistance?
              </h4>
              <p className="text-xs text-[#0c4a6e] font-medium leading-relaxed">
                If you have questions about your bookings or profile credentials, contact our 24/7 help desk.
              </p>
              <Link
                href="/contact-us"
                className="inline-block text-xs font-bold text-[#0284c7] hover:underline"
              >
                Contact Support &rarr;
              </Link>
            </div>

          </div>

        </div>

        </div>

      </div>

      {/* QR DIGITAL PASS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[#061f3b]/70 p-4 backdrop-blur-sm" onClick={() => setSelectedBooking(null)}>
          <section role="dialog" aria-modal="true" aria-label="Booking request details" onClick={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#0879b7]">Booking request #{selectedBooking.id}</p><h2 className="mt-2 font-serif text-3xl font-semibold text-[#07152d]">{selectedBooking.service_item_title || selectedBooking.service_type || "Request details"}</h2></div>
              <button type="button" onClick={() => setSelectedBooking(null)} aria-label="Close booking details" className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"><X className="size-5" /></button>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#e7f7fd] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#0879b7]">{formatBookingLabel(selectedBooking.service_type || "service")}</span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-700">{formatBookingLabel(selectedBooking.status || "new")}</span>
              <span className="text-xs font-semibold text-slate-400">Submitted {formatBookingDate(selectedBooking.created, true)}</span>
            </div>
            {[
              { title: "Stay details", fields: [["Hotel", selectedBooking.service_item_title], ["Hotel ID", selectedBooking.service_item], ["City", selectedBooking.service_item_city], ["Location", selectedBooking.service_item_location], ["Destination", selectedBooking.destination_city], ["Check-in", formatBookingDate(selectedBooking.check_in_date)], ["Check-out", formatBookingDate(selectedBooking.check_out_date)], ["Rooms", selectedBooking.number_of_rooms], ["Number of guests", selectedBooking.number_of_guests]] },
              { title: "Traveller information", fields: [["Guest name", selectedBooking.guest_name], ["Traveller category", selectedBooking.traveller_category], ["Designation / rank", selectedBooking.designation_or_rank], ["Pay level", selectedBooking.pay_level], ["Employee ID", selectedBooking.employee_id], ["Department", selectedBooking.department], ["Mobile number", selectedBooking.mobile_number], ["Email", selectedBooking.email], ["Spouse included", formatBookingValue(selectedBooking.spouse_included)], ["Children ages", selectedBooking.children_ages]] },
              { title: "Travel & pickup information", fields: [["From city", selectedBooking.from_city], ["To city", selectedBooking.to_city], ["Preferred location", selectedBooking.preferred_location], ["Landmark", selectedBooking.landmark], ["Travel date", selectedBooking.travel_date ? formatBookingDate(selectedBooking.travel_date) : ""], ["Return date", selectedBooking.return_date ? formatBookingDate(selectedBooking.return_date) : ""], ["Arrival time", selectedBooking.arrival_time], ["Departure time", selectedBooking.departure_time], ["Flight / train number", selectedBooking.flight_or_train_number], ["Pickup address", selectedBooking.pickup_address], ["Drop address", selectedBooking.drop_address]] },
            ].map((section) => {
              const fields = section.fields.filter(([, value]) => value !== undefined && value !== null && value !== "");
              if (!fields.length) return null;
              return <div key={section.title} className="mt-7"><h3 className="text-sm font-extrabold text-[#07152d]">{section.title}</h3><div className="mt-3 grid gap-3 sm:grid-cols-2">{fields.map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{String(label)}</p><p className="mt-1 break-words text-sm font-bold text-[#07152d]">{formatBookingValue(value)}</p></div>)}</div></div>;
            })}
            {selectedBooking.details && Object.keys(selectedBooking.details).length > 0 && <div className="mt-7"><h3 className="text-sm font-extrabold text-[#07152d]">Preferences & budget</h3><div className="mt-3 grid gap-3 sm:grid-cols-2">{Object.entries(selectedBooking.details).map(([key, value]) => <div key={key} className="rounded-2xl border border-[#0879b7]/10 bg-[#f5fbfe] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-[#0879b7]/70">{formatBookingLabel(key)}</p><p className="mt-1 text-sm font-bold text-[#07152d]">{formatBookingValue(value)}</p></div>)}</div></div>}
            {Array.isArray(selectedBooking.guests) && selectedBooking.guests.length > 0 && <div className="mt-6"><h3 className="text-sm font-bold text-[#07152d]">Guests</h3><div className="mt-3 space-y-2">{selectedBooking.guests.map((guest: any, index: number) => <div key={guest.id || index} className="flex flex-wrap justify-between gap-2 rounded-xl border border-slate-100 px-4 py-3 text-sm"><b>{guest.name}</b><span className="capitalize text-slate-500">Age {guest.age} · {guest.gender}</span></div>)}</div></div>}
            {selectedBooking.special_request && <div className="mt-6 rounded-2xl bg-[#edf8fd] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-[#0879b7]">Special request</p><p className="mt-2 text-sm leading-6 text-[#344a5c]">{selectedBooking.special_request}</p></div>}
            <div className="mt-7 grid gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500 sm:grid-cols-2"><p><b className="text-slate-700">Consent to contact:</b> {formatBookingValue(selectedBooking.consent_to_contact)}</p><p><b className="text-slate-700">Last updated:</b> {formatBookingDate(selectedBooking.updated, true)}</p></div>
          </section>
        </div>
      )}

      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          {/* Modal clickaway backdrop */}
          <div className="absolute inset-0" onClick={() => setShowQrModal(false)} />
          
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full border border-slate-100 flex flex-col items-center text-center space-y-5 animate-scaleUp z-10">
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>

            {/* Modal Header */}
            <div>
              <h3 className="text-lg font-bold text-[#07152d] tracking-tight">Privilege Pass QR</h3>
              <p className="text-[11px] font-bold text-amber-500 uppercase tracking-widest mt-0.5">BHLI CLUB ELITE</p>
            </div>

            {/* SVG QR Code */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner">
              <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* QR Code Background */}
                <rect width="100" height="100" rx="12" fill="#f8fafc"/>
                
                {/* Finder patterns */}
                <rect x="10" y="10" width="24" height="24" rx="4" fill="#07152d" />
                <rect x="14" y="14" width="16" height="16" rx="2" fill="#f8fafc" />
                <rect x="18" y="18" width="8" height="8" rx="1" fill="#0879b7" />
                
                <rect x="66" y="10" width="24" height="24" rx="4" fill="#07152d" />
                <rect x="70" y="14" width="16" height="16" rx="2" fill="#f8fafc" />
                <rect x="74" y="18" width="8" height="8" rx="1" fill="#0879b7" />
                
                <rect x="10" y="66" width="24" height="24" rx="4" fill="#07152d" />
                <rect x="14" y="70" width="16" height="16" rx="2" fill="#f8fafc" />
                <rect x="18" y="74" width="8" height="8" rx="1" fill="#0879b7" />

                {/* Alignment pattern bottom right */}
                <rect x="70" y="70" width="8" height="8" rx="2" fill="#07152d" />
                <rect x="72" y="72" width="4" height="4" rx="1" fill="#f8fafc" />
                <rect x="73" y="73" width="2" height="2" rx="0.5" fill="#0879b7" />

                {/* Simulated QR bits */}
                <rect x="40" y="10" width="4" height="8" rx="1" fill="#07152d" />
                <rect x="48" y="10" width="8" height="4" rx="1" fill="#0879b7" />
                <rect x="58" y="10" width="4" height="4" rx="1" fill="#07152d" />
                
                <rect x="40" y="20" width="8" height="4" rx="1" fill="#0879b7" />
                <rect x="52" y="20" width="4" height="8" rx="1" fill="#07152d" />
                <rect x="58" y="22" width="4" height="4" rx="1" fill="#07152d" />

                <rect x="10" y="40" width="8" height="4" rx="1" fill="#0879b7" />
                <rect x="10" y="48" width="4" height="8" rx="1" fill="#07152d" />
                <rect x="22" y="40" width="4" height="4" rx="1" fill="#07152d" />
                <rect x="20" y="48" width="8" height="4" rx="1" fill="#0879b7" />
                
                <rect x="32" y="32" width="12" height="4" rx="1" fill="#07152d" />
                <rect x="36" y="40" width="4" height="12" rx="1" fill="#0879b7" />
                <rect x="44" y="44" width="8" height="4" rx="1" fill="#07152d" />
                
                <rect x="56" y="36" width="8" height="8" rx="2" fill="#07152d" />
                <rect x="68" y="40" width="4" height="8" rx="1" fill="#0879b7" />
                <rect x="76" y="36" width="12" height="4" rx="1" fill="#07152d" />
                <rect x="80" y="44" width="4" height="8" rx="1" fill="#07152d" />
                
                <rect x="40" y="58" width="8" height="4" rx="1" fill="#0879b7" />
                <rect x="52" y="56" width="4" height="8" rx="1" fill="#07152d" />
                <rect x="60" y="58" width="8" height="4" rx="1" fill="#0879b7" />
                
                <rect x="40" y="66" width="4" height="8" rx="1" fill="#07152d" />
                <rect x="48" y="70" width="8" height="4" rx="1" fill="#0879b7" />
                <rect x="58" y="68" width="4" height="12" rx="1" fill="#07152d" />
                
                <rect x="32" y="80" width="8" height="4" rx="1" fill="#0879b7" />
                <rect x="44" y="80" width="4" height="8" rx="1" fill="#07152d" />
                <rect x="52" y="84" width="8" height="4" rx="1" fill="#0879b7" />

                <rect x="66" y="80" width="12" height="4" rx="1" fill="#07152d" />
                <rect x="80" y="80" width="4" height="8" rx="1" fill="#0879b7" />
                
                {/* Centered logo container */}
                <rect x="40" y="40" width="20" height="20" rx="5" fill="#f8fafc" stroke="#0879b7" strokeWidth="2" />
                {/* Stylized 'B' in center */}
                <path d="M47 46H51C52.1 46 53 46.9 53 48C53 49.1 52.1 50 51 50H47V46Z" fill="#07152d" />
                <path d="M47 50H51.5C52.6 50 53.5 50.9 53.5 52C53.5 53.1 52.6 54 51.5 54H47V50Z" fill="#07152d" />
                <rect x="45.5" y="45.5" width="2" height="9" fill="#0879b7" />
              </svg>
            </div>

            {/* User Pass Metadata details */}
            <div className="w-full space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Cardholder</span>
                <span className="text-xs font-bold text-[#07152d] uppercase">{name || "Valued Guest"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Member ID</span>
                <span className="text-xs font-mono font-bold text-[#07152d]">{memberId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Valid Thru</span>
                <span className="text-xs font-mono font-bold text-[#07152d]">12/31</span>
              </div>
            </div>

            {/* Wallet add links */}
            <div className="w-full space-y-2 pt-1">
              {/* Apple Wallet */}
              <button 
                type="button"
                onClick={() => alert("Digital pass added to Apple Wallet.")}
                className="w-full bg-black text-white hover:bg-slate-900 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94 1.07.08 2.16-.52 2.81-1.33" />
                </svg>
                Add to Apple Wallet
              </button>

              {/* Google Wallet */}
              <button 
                type="button"
                onClick={() => alert("Digital pass added to Google Wallet.")}
                className="w-full bg-slate-950 text-white hover:bg-slate-900 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Add to Google Wallet
              </button>
            </div>
            
            <p className="text-[10px] font-semibold text-gray-400">Scan at check-in desks to verify privileges.</p>
          </div>
        </div>
      )}
    </div>
  );
}
