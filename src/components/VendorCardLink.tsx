"use client";

import type { ReactNode } from "react";
import { apiClient, isTrustedApiUrl } from "@/lib/api/client";
import { safeExternalUrl } from "@/lib/safe-url";

export default function VendorCardLink({ trackingUrl, className, children }: { trackingUrl: string; className: string; children: ReactNode }) {
  async function openVendor() {
    const tab = window.open("about:blank", "_blank");
    if (tab) tab.opener = null;
    try {
      let target = safeExternalUrl(trackingUrl);
      if (isTrustedApiUrl(trackingUrl)) {
        const response = await apiClient.get(trackingUrl);
        target = safeExternalUrl(response.data?.data?.url || response.data?.url);
      }
      if (!target) throw new Error("A secure vendor URL was not returned");
      if (tab && !tab.closed) tab.location.href = target;
      else window.location.assign(target);
    } catch {
      if (tab && !tab.closed) tab.close();
    }
  }
  return <button type="button" onClick={() => void openVendor()} className={`${className} w-full text-left`}>{children}</button>;
}
