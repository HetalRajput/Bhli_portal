"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileCheck2 } from "lucide-react";

type PortalTargets = {
  footer: HTMLElement | null;
  authForm: HTMLElement | null;
};

const emptyTargets: PortalTargets = { footer: null, authForm: null };

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
        };

        setTargets((current) =>
          current.footer === nextTargets.footer &&
          current.authForm === nextTargets.authForm
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
