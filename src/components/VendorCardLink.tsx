"use client";

import type { ReactNode } from "react";
import { apiClient } from "@/lib/api/client";

export default function VendorCardLink({ trackingUrl, className, children }: { trackingUrl: string; className: string; children: ReactNode }) {
  async function openVendor() {
    const tab = window.open("about:blank", "_blank");
    try {
      const response = await apiClient.get(trackingUrl);
      const url = response.data?.data?.url || response.data?.url;
      if (!url) throw new Error("Vendor URL was not returned");
      if (tab && !tab.closed) tab.location.href = url;
      else window.location.href = url;
    } catch {
      if (tab && !tab.closed) tab.close();
    }
  }
  return <button type="button" onClick={() => void openVendor()} className={`${className} w-full text-left`}>{children}</button>;
}
