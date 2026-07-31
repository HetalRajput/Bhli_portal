"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, FileCheck2, ShieldCheck } from "lucide-react";

type PortalTargets = {
  footer: HTMLElement | null;
  authForm: HTMLElement | null;
  aboutPage: HTMLElement | null;
};

const emptyTargets: PortalTargets = { footer: null, authForm: null, aboutPage: null };

export default function LegalLinksInjector() {
  const pathname = usePathname();
  const [targets, setTargets] = useState<PortalTargets>(emptyTargets);

  useEffect(() => {
    let frame = 0;

    const locateTargets = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const nextTargets: PortalTargets = {
          footer: document.querySelector("body > footer"),
          authForm: pathname === "/login" || pathname === "/register"
            ? document.querySelector("#signup-form, .auth-form")
            : null,
          aboutPage: pathname === "/about-us" ? document.querySelector("main > div") : null,
        };

        setTargets((current) =>
          current.footer === nextTargets.footer &&
          current.authForm === nextTargets.authForm &&
          current.aboutPage === nextTargets.aboutPage
            ? current
            : nextTargets,
        );
      });
    };

    locateTargets();
    const observer = new MutationObserver(locateTargets);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  const action = pathname === "/register" ? "creating an account" : "signing in";

  return (
    <>
      {targets.authForm && createPortal(
        <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
          By {action}, you agree to our{" "}
          <Link href="/terms-and-conditions" className="font-semibold text-[#087dbd] hover:underline">Terms &amp; Conditions</Link>
          {" "}and acknowledge our{" "}
          <Link href="/privacy-policy" className="font-semibold text-[#087dbd] hover:underline">Privacy Policy</Link>.
        </p>,
        targets.authForm,
      )}

      {targets.aboutPage && createPortal(
        <section className="bg-white px-5 py-16 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-[2rem] border border-[#087fbe]/15 bg-[#f2f9fc] p-7 md:grid-cols-[1fr_auto] md:p-10">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#dff2fa] text-[#087fbe]"><ShieldCheck className="size-6" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.2em] text-[#087fbe]">Trust and transparency</p>
                <h2 className="mt-2 font-serif text-3xl text-[#062b50]">Know how we serve and protect you.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-black/55">Review the terms that govern BHLI services and the choices available for your personal information.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/terms-and-conditions" className="inline-flex items-center gap-2 rounded-full bg-[#061f3b] px-5 py-3 text-sm font-bold text-white">Terms <ArrowRight className="size-4" /></Link>
              <Link href="/privacy-policy" className="inline-flex items-center gap-2 rounded-full border border-[#087fbe]/25 bg-white px-5 py-3 text-sm font-bold text-[#087fbe]">Privacy <ArrowRight className="size-4" /></Link>
            </div>
          </div>
        </section>,
        targets.aboutPage,
      )}

      {targets.footer && createPortal(
        <div className="border-t border-black/5 px-5 py-5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#344a5c]/60 lg:justify-between">
            <span className="inline-flex items-center gap-2 font-semibold text-[#122b42]/65"><FileCheck2 className="size-4 text-[#087dbd]" /> Legal &amp; privacy</span>
            <nav aria-label="Legal links" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              <Link href="/terms-and-conditions" className="transition hover:text-[#087dbd]">Terms &amp; Conditions</Link>
              <Link href="/privacy-policy" className="transition hover:text-[#087dbd]">Privacy Policy</Link>
              <Link href="/cancellation-and-refund" className="transition hover:text-[#087dbd]">Cancellation &amp; Refund</Link>
            </nav>
          </div>
        </div>,
        targets.footer,
      )}
    </>
  );
}
