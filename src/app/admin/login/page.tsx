"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { crmService, CRM_ACCESS_TOKEN_KEY, CRM_REFRESH_TOKEN_KEY } from "@/lib/api/crm";
import { getErrorMessage } from "@/lib/api/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    try {
      const response = await crmService.login(String(form.get("username") || "").trim(), String(form.get("password") || ""));
      window.localStorage.setItem(CRM_ACCESS_TOKEN_KEY, response.data.access);
      window.localStorage.setItem(CRM_REFRESH_TOKEN_KEY, response.data.refresh);
      window.localStorage.setItem("crm_user", JSON.stringify(response.data.user));
      router.replace("/admin/dashboard");
    } catch (loginError) {
      setError(getErrorMessage(loginError));
    } finally {
      setLoading(false);
    }
  }

  return <main className="grid min-h-[calc(100vh-5rem)] place-items-center bg-[#edf5f9] px-5 py-16"><form onSubmit={submit} className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_90px_rgba(6,31,59,.18)]"><div className="bg-[#061f3b] p-8 text-white"><span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-[#13a5d8]"><ShieldCheck /></span><p className="mt-6 text-xs font-bold uppercase tracking-[.22em] text-[#13a5d8]">CRM access</p><h1 className="mt-2 font-serif text-4xl">Admin sign in</h1><p className="mt-3 text-sm leading-6 text-white/55">Use your CRM team-member credentials.</p></div><div className="p-8"><label className="block text-xs font-bold text-slate-600">Username or email<input name="username" type="text" required autoComplete="username" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#13a5d8]" /></label><label className="mt-4 block text-xs font-bold text-slate-600">Password<input name="password" type="password" required autoComplete="current-password" className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#13a5d8]" /></label>{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">{error}</p>}<button disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#087fbe] px-6 py-3.5 text-sm font-bold text-white disabled:opacity-50"><LockKeyhole className="size-4" />{loading ? "Signing in..." : "Sign in to CRM"}</button></div></form></main>;
}
