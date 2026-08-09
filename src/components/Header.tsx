"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { authService } from "@/lib/api/auth";

const links = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Events", "/events"],
  ["Clients", "/clients"],
  ["Help & opportunities", "/help-centre"],
];
const moreLinks = [["Gallery", "/gallery"], ["About us", "/about-us"], ["Channel Partners", "/channel-partners"], ["Contact", "/contact-us"]];

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const lastY = useRef(0);
  const desktopMoreRef = useRef<HTMLDivElement>(null);
  const mobileMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;

    const closeWhenOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!desktopMoreRef.current?.contains(target) && !mobileMoreRef.current?.contains(target)) {
        setMoreOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };

    document.addEventListener("pointerdown", closeWhenOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeWhenOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [moreOpen]);

  const isLinkActive = (h: string) => {
    if (!path) return false;
    return path === h || (h !== "/" && path.startsWith(h));
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== "undefined") {
        const token = window.localStorage.getItem("access_token");
        const authData = window.localStorage.getItem("bhli-auth");
        if (token || authData) {
          setIsAuthenticated(true);
          if (authData) {
            try {
              const parsed = JSON.parse(authData);
              if (parsed.email) setUserEmail(parsed.email);
            } catch {
              // Ignore JSON parse error
            }
          }
          try {
            const cached = JSON.parse(window.localStorage.getItem("bhli-profile-details") || "{}");
            if (cached.profileImage) setUserImage(cached.profileImage);
          } catch {
            setUserImage(null);
          }
          if (token) {
            try {
              const profile = await authService.getProfile();
              setUserEmail(profile.email || null);
              setUserImage(profile.image || null);
            } catch {
              // The API interceptor handles invalid sessions.
            }
          }
        } else {
          setIsAuthenticated(false);
          setUserEmail(null);
          setUserImage(null);
        }
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [path]);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 18);
      if (open || current < 80) {
        setHidden(false);
      } else if (current > lastY.current + 6) {
        setHidden(true);
      } else if (current < lastY.current - 6) {
        setHidden(false);
      }
      lastY.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[#0a79bf]/15 bg-white/95 text-[#07152d] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
        hidden && !open ? "-translate-y-[105%] opacity-95" : "translate-y-0 opacity-100"
      } ${scrolled ? "shadow-[0_12px_35px_rgba(0,45,90,.28)]" : "shadow-none"}`}
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#0a8fcf]/55 to-transparent" />
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="rounded-lg transition duration-300 hover:brightness-110"
        >
          <img
            src="/booking-hospitality-logo-transparent.png"
            alt="Booking Hospitality"
            className="h-11 w-auto max-w-[215px] object-contain"
          />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([l, h]) => (
            <Link
              key={h}
              href={h}
              className={`relative py-2 text-sm font-medium transition duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-[#078ccf] after:transition-transform ${
                isLinkActive(h)
                  ? "text-[#087dbd] after:scale-x-100"
                  : "text-[#344a5c] after:scale-x-0 hover:text-[#087dbd] hover:after:scale-x-100"
              }`}
            >
              {l}
            </Link>
          ))}
          <div ref={desktopMoreRef} className="relative">
            <button type="button" onClick={() => setMoreOpen((current) => !current)} aria-expanded={moreOpen} aria-haspopup="menu" className={`inline-flex items-center gap-1 py-2 text-sm font-medium transition ${moreLinks.some(([, href]) => isLinkActive(href)) ? "text-[#087dbd]" : "text-[#344a5c] hover:text-[#087dbd]"}`}>
              More <ChevronDown className={`size-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && <div role="menu" className="absolute left-1/2 top-[calc(100%+12px)] z-50 w-44 -translate-x-1/2 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_16px_40px_rgba(6,31,59,.16)]">
              {moreLinks.map(([label, href]) => <Link key={href} role="menuitem" href={href} onClick={() => setMoreOpen(false)} className={`block rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isLinkActive(href) ? "bg-[#e5f5fc] text-[#0879b7]" : "text-[#344a5c] hover:bg-[#f0f8fc] hover:text-[#0879b7]"}`}>{label}</Link>)}
            </div>}
          </div>
          <Link
            href="/defence-help-desk"
            className="rounded-full border border-[#0a86c8]/30 bg-[#edf8fd] px-4 py-2 text-sm text-[#0879b7] backdrop-blur transition hover:bg-[#dff3fb]"
          >
            Defence desk
          </Link>
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          {isAuthenticated ? (
            <Link
              href="/profile"
              title={userEmail ? `Profile (${userEmail})` : "Profile"}
              className="flex items-center gap-2 rounded-full border border-[#0a86c8]/30 bg-[#edf8fd] px-3.5 py-1.5 text-sm font-semibold text-[#0879b7] backdrop-blur transition hover:bg-[#087dbd] hover:text-white group"
            >
              {userImage ? (
                <img src={userImage} alt="Profile" className="h-7 w-7 rounded-full object-cover ring-1 ring-[#0a86c8]/30" />
              ) : (
                <User className="h-4 w-4 text-[#0879b7] group-hover:text-white transition-colors" />
              )}
              <span className="max-w-[110px] truncate text-xs font-semibold">
                {userEmail ? userEmail.split("@")[0] : "Profile"}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-[#3c5263] transition hover:text-[#087dbd]"
            >
              Log in
            </Link>
          )}
          <Link
            href="/contact-us"
            className="rounded-full bg-gradient-to-r from-[#168dcc] to-[#0871b2] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#003b70]/20 transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Plan a journey
          </Link>
        </div>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="grid size-10 place-items-center rounded-full border border-[#0a86c8]/25 bg-[#edf8fd] text-[#0879b7] transition hover:bg-[#dff3fb] lg:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[#0a86c8]/15 bg-white/98 px-5 py-5 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map(([l, h]) => (
              <Link
                key={h}
                href={h}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 ${
                  isLinkActive(h) ? "bg-[#e5f5fc] text-[#0879b7]" : "text-[#344a5c] hover:bg-[#f0f8fc]"
                }`}
              >
                {l}
              </Link>
            ))}
            <div ref={mobileMoreRef} className="pt-1">
              <button type="button" onClick={() => setMoreOpen((current) => !current)} aria-expanded={moreOpen} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[#344a5c] hover:bg-[#f0f8fc]">
                More links <ChevronDown className={`size-4 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              {moreOpen && <div className="ml-3 mt-1 border-l border-[#0a86c8]/20 pl-2">{moreLinks.map(([label, href]) => <Link key={href} href={href} onClick={() => { setOpen(false); setMoreOpen(false); }} className={`block rounded-xl px-4 py-2.5 text-sm ${isLinkActive(href) ? "bg-[#e5f5fc] font-semibold text-[#0879b7]" : "text-[#344a5c] hover:bg-[#f0f8fc]"}`}>{label}</Link>)}</div>}
            </div>
            <Link
              href="/defence-help-desk"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-[#0879b7]"
            >
              Defence help desk
            </Link>
            {isAuthenticated ? (
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 bg-[#e5f5fc] text-[#0879b7] font-semibold"
              >
                {userImage ? (
                  <img src={userImage} alt="Profile" className="h-8 w-8 rounded-full object-cover ring-1 ring-[#0a86c8]/30" />
                ) : (
                  <User className="h-5 w-5" />
                )}
                Profile ({userEmail || "User"})
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-[#344a5c] hover:bg-[#f0f8fc]"
              >
                Log in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
