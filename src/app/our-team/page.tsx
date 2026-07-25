"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, Users, ShieldAlert } from "lucide-react";
import { cmsService } from "@/lib/api/cms";

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
    name: "Asha Sharma",
    slug: "asha-sharma",
    designation: "Managing Director",
    subtitle: "Leadership Team",
    bio: "Driving the strategic direction and operations of BHLI with 15+ years of hospitality excellence.",
    email: "asha@bookinghospitality.com",
    phone_number: "+91 99163 56691",
    linkedin_url: "https://linkedin.com",
    photo: null
  },
  {
    id: 2,
    name: "Col. Sanjeev Kumar (Retd.)",
    slug: "col-sanjeev-kumar",
    designation: "Head of Defence Desk Operations",
    subtitle: "Operations Management",
    bio: "Ex-IAF operations command leader, specializing in military travel protocols and official MoU compliances.",
    email: "sanjeev@bookinghospitality.com",
    phone_number: "+91 97407 56691",
    linkedin_url: "https://linkedin.com",
    photo: null
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    slug: "vikram-malhotra",
    designation: "Director of Corporate Partnerships",
    subtitle: "Partnerships Desk",
    bio: "Liaison for Government departments and luxury corporate accounts, ensuring best-in-market rates.",
    email: "vikram@bookinghospitality.com",
    phone_number: "+91 72045 18641",
    linkedin_url: "https://linkedin.com",
    photo: null
  }
];

export default function OurTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await cmsService.getTeam();
        console.log("Team Members API Response:", res);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f9fc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0879b7] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#062b50]">Loading leadership team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f9fc] text-[#122b42] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#062b50] px-5 py-20 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(215,181,109,.15),transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl text-center md:text-left">
          <p className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]">
            <Users className="size-4 text-[#13a5d8]" /> Meet the Experts
          </p>
          <h1 className="mt-5 font-serif text-5xl md:text-6xl">
            Our Leadership & Operations Team
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Dedicated professionals serving our Defence, Government and corporate accounts round the clock with unmatched hospitality and logistics expertise.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => {
            const initial = member.name ? member.name.charAt(0).toUpperCase() : "B";
            return (
              <div
                key={member.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-black/8 bg-white p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative mb-6 flex items-center justify-center">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-28 w-28 rounded-full object-cover border-4 border-[#087dbd]/10 group-hover:border-[#087dbd]/30 transition-colors"
                      />
                    ) : (
                      <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-[#062b50] to-[#087dbd] flex items-center justify-center text-3xl font-extrabold text-white shadow-md ring-4 ring-[#087dbd]/10 group-hover:ring-[#087dbd]/30 transition-all">
                        {initial}
                      </div>
                    )}
                  </div>

                  {/* Header */}
                  <div className="text-center">
                    {member.subtitle && (
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#087dbd] bg-[#087dbd]/8 px-2.5 py-1 rounded-full">
                        {member.subtitle}
                      </span>
                    )}
                    <h3 className="mt-3 font-serif text-2xl font-bold text-[#062b50]">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-black/55">
                      {member.designation}
                    </p>
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <p className="mt-5 text-sm leading-relaxed text-black/60 text-center font-medium">
                      {member.bio}
                    </p>
                  )}
                </div>

                {/* Contact & Links */}
                <div className="mt-8 border-t border-black/5 pt-5 flex items-center justify-center gap-6">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 rounded-full bg-[#f0f6fa] hover:bg-[#087dbd]/10 text-[#087dbd] transition-colors"
                      title="Send Email"
                    >
                      <Mail className="size-5" />
                    </a>
                  )}
                  {member.phone_number && (
                    <a
                      href={`tel:${member.phone_number.replace(/\s/g, "")}`}
                      className="p-2 rounded-full bg-[#f0f6fa] hover:bg-[#087dbd]/10 text-[#087dbd] transition-colors"
                      title="Call"
                    >
                      <Phone className="size-5" />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-[#f0f6fa] hover:bg-[#087dbd]/10 text-[#087dbd] transition-colors"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="size-5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
