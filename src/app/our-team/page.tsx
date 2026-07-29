"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Mail, Phone, Users, Search, UserCheck } from "lucide-react";
import { cmsService } from "@/lib/api/cms";
import TeamAvatar from "@/components/TeamAvatar";

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface TeamMember {
  id: number;
  name: string;
  slug: string;
  designation: string;
  subtitle?: string;
  bio?: string;
  photo?: string | null;
  email?: string;
  phone_number?: string;
  linkedin_url?: string;
}

const fallbackTeam: TeamMember[] = [
  {
    id: 1,
    name: "Mazher Ul Huq",
    slug: "mazher-ul-huq",
    designation: "CEO & Founder",
    subtitle: "Leadership",
    bio: "Driving the strategic direction and operations of BHLI with hospitality excellence.",
    email: "mazher@bookinghospitality.com",
    photo: null
  },
  {
    id: 2,
    name: "Waseem Ahmed",
    slug: "waseem-ahmed",
    designation: "Chief Finance Officer",
    subtitle: "Leadership",
    email: "waseem@bookinghospitality.com",
    photo: null
  },
  {
    id: 6,
    name: "Javed Rashid",
    slug: "javed-rashid",
    designation: "Director of Technology",
    subtitle: "Technology",
    photo: "https://bhli-project-images.s3.eu-north-1.amazonaws.com/bhli-main-folder/team/javed-rashid-90d00aaff17641298cff87c4d1a94f5e.jpeg"
  },
  {
    id: 16,
    name: "Devender Singh",
    slug: "devender-singh",
    designation: "Advisor",
    subtitle: "Advisory",
    photo: "https://bhli-project-images.s3.eu-north-1.amazonaws.com/bhli-main-folder/team/devinder-singh-7f416d0937554466b679265ab002b53e.jpeg"
  }
];

export default function OurTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await cmsService.getTeam();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setTeam(res.data);
        } else if (res && Array.isArray(res) && res.length > 0) {
          setTeam(res);
        } else {
          setTeam(fallbackTeam);
        }
      } catch (err) {
        console.warn("Failed to fetch team members, loading fallback data", err);
        setTeam(fallbackTeam);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const categories = ["All", "Leadership", "Operations", "Technology", "Hospitality"];

  const filteredTeam = useMemo(() => {
    return team.filter((member) => {
      const matchesSearch =
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedFilter === "All") return matchesSearch;
      const designationLower = (member.designation || "").toLowerCase();
      const subtitleLower = (member.subtitle || "").toLowerCase();

      if (selectedFilter === "Leadership") {
        return matchesSearch && (designationLower.includes("ceo") || designationLower.includes("director") || designationLower.includes("head") || designationLower.includes("officer") || subtitleLower.includes("leadership"));
      }
      if (selectedFilter === "Operations") {
        return matchesSearch && (designationLower.includes("operation") || designationLower.includes("reservation") || designationLower.includes("admin") || designationLower.includes("sales") || subtitleLower.includes("operation"));
      }
      if (selectedFilter === "Technology") {
        return matchesSearch && (designationLower.includes("technology") || designationLower.includes("it") || designationLower.includes("developer") || designationLower.includes("ota"));
      }
      if (selectedFilter === "Hospitality") {
        return matchesSearch && (designationLower.includes("chef") || designationLower.includes("f&b") || designationLower.includes("events") || designationLower.includes("mc"));
      }
      return matchesSearch;
    });
  }, [team, searchQuery, selectedFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f9fc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#0879b7] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#062b50]">Loading leadership & team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f9fc] text-[#122b42] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#061f3b] px-5 pb-24 pt-20 text-white lg:px-8 lg:pb-28 lg:pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(19,165,216,0.18),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]">
              <Users className="size-4 text-[#13a5d8]" /> Leadership & Operations
            </p>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] md:text-6xl">
              The people behind every seamless journey.
            </h1>
            <p className="mt-3 text-base leading-7 text-white/70">
              Dedicated professionals serving our Defence, Government, and corporate accounts round the clock with unmatched hospitality, logistics, and technology expertise.
            </p>
          </div>

          {/* Quick Stats Counter Row */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-[#13a5d8]">{team.length}+</span>
              <span className="text-[11px] text-white/60 uppercase tracking-wider font-semibold mt-0.5">Team Experts</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-[#13a5d8]">24/7</span>
              <span className="text-[11px] text-white/60 uppercase tracking-wider font-semibold mt-0.5">Desk Support</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-[#13a5d8]">7,500+</span>
              <span className="text-[11px] text-white/60 uppercase tracking-wider font-semibold mt-0.5">Network Stays</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-[#13a5d8]">100%</span>
              <span className="text-[11px] text-white/60 uppercase tracking-wider font-semibold mt-0.5">Policy Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Controls & Filtering Section */}
      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-5 lg:px-8">
        <div className="rounded-2xl border border-[#dce8ef] bg-white p-4 shadow-[0_16px_50px_rgba(6,31,59,.10)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-black/40" />
              <input
                type="text"
                placeholder="Search team member or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-transparent bg-[#f3f7fa] py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#13a5d8]/40 focus:bg-white focus:ring-4 focus:ring-[#13a5d8]/10"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                    selectedFilter === cat
                      ? "bg-[#062b50] text-white shadow-md"
                      : "bg-[#f0f6fa] text-[#062b50] hover:bg-[#e1eff8]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Member Grid */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[#087fbe]">Our specialists</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-[#062b50]">Meet the team</h2>
          </div>
          <p className="hidden text-sm text-[#607789] sm:block">{filteredTeam.length} {filteredTeam.length === 1 ? "profile" : "profiles"}</p>
        </div>
        {filteredTeam.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-black/5 p-8">
            <Users className="mx-auto size-12 text-[#087dbd]/40 mb-3" />
            <h3 className="font-serif text-2xl font-bold text-[#062b50]">No team members found</h3>
            <p className="text-sm text-black/55 mt-2">Try adjusting your search criteria or category filter.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("All");
              }}
              className="mt-5 rounded-full bg-[#087dbd] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#062b50]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTeam.map((member) => (
              <div
                key={member.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-[#dce8ef] bg-white p-7 shadow-[0_8px_30px_rgba(6,31,59,.05)] transition duration-300 hover:-translate-y-1 hover:border-[#13a5d8]/40 hover:shadow-[0_22px_55px_rgba(6,31,59,.12)]"
              >
                {/* Decorative Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#062b50] via-[#087dbd] to-[#13a5d8] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Photo Container */}
                  <div className="relative mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#edf7fb] to-[#e1eef5] py-6">
                    <div className="relative">
                      <TeamAvatar
                        photo={member.photo}
                        name={member.name}
                        className="h-32 w-32 rounded-full border-4 border-white object-cover object-top shadow-[0_10px_25px_rgba(6,31,59,.15)] transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute bottom-0 right-0 bg-[#087dbd] text-white p-1.5 rounded-full shadow-md">
                        <UserCheck className="size-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Header */}
                  <div className="text-center">
                    {member.subtitle && (
                      <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-[#087dbd] bg-[#087dbd]/8 px-3 py-1 rounded-full mb-2">
                        {member.subtitle}
                      </span>
                    )}
                    <h3 className="font-serif text-2xl font-bold text-[#062b50] group-hover:text-[#087dbd] transition-colors">
                      {member.name}
                    </h3>
                    <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-[#087dbd]">
                      {member.designation}
                    </p>
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <p className="mt-5 text-sm leading-relaxed text-black/60 text-center font-medium line-clamp-3">
                      {member.bio}
                    </p>
                  )}
                </div>

                {/* Contact Links & Actions */}
                <div className="mt-8 border-t border-black/5 pt-5 flex items-center justify-center gap-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2.5 rounded-full bg-[#f0f6fa] hover:bg-[#087dbd] hover:text-white text-[#087dbd] transition-all shadow-sm"
                      title={`Email ${member.name}`}
                    >
                      <Mail className="size-4" />
                    </a>
                  )}
                  {member.phone_number && (
                    <a
                      href={`tel:${member.phone_number.replace(/\s/g, "")}`}
                      className="p-2.5 rounded-full bg-[#f0f6fa] hover:bg-[#087dbd] hover:text-white text-[#087dbd] transition-all shadow-sm"
                      title={`Call ${member.name}`}
                    >
                      <Phone className="size-4" />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-[#f0f6fa] hover:bg-[#087dbd] hover:text-white text-[#087dbd] transition-all shadow-sm"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="size-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
