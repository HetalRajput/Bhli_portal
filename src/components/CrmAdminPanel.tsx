"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle, LogOut, RefreshCw, Search, ShieldCheck, Trash2, X } from "lucide-react";
import { getErrorMessage } from "@/lib/api/client";
import { crmService, CRM_ACCESS_TOKEN_KEY, CRM_REFRESH_TOKEN_KEY, type CrmComplaint, type CrmFlightBooking, type CrmOnboarding, type CrmTeamMember, type CrmTypedBooking } from "@/lib/api/crm";
import type { ServiceRating } from "@/lib/api/portal";

export type CrmPanelMode = "team" | "bookings" | "flights" | "complaints" | "onboarding" | "ratings";
type Row = CrmTeamMember | CrmTypedBooking | CrmFlightBooking | CrmComplaint | CrmOnboarding | ServiceRating;

const typedBookingSlugs = ["bus-ticket-booking", "catering-services", "corporate-travel", "cruise-booking", "currency-exchange", "event-management", "flight-booking", "group-tour", "holiday-packages", "honeymoon-packages", "hotel-consultancy", "hotel-reservations", "international-tours", "self-drive-car-rentals", "taxi-services", "train-ticket-booking", "travel-insurance", "visa-assistance"];
const navigation: [string, string][] = [["Dashboard", "/admin/dashboard"], ["Team", "/admin/users-and-roles"], ["Bookings", "/admin/bookings"], ["Flights", "/admin/flights"], ["Complaints", "/admin/complaints"], ["Onboarding", "/admin/onboarding"], ["Ratings", "/admin/ratings"]];

const rowId = (row: Row) => String(row.id);
const value = (row: Row, key: string) => (row as unknown as Record<string, unknown>)[key];
const bookingBase = (row: Row) => value(row, "booking") as Record<string, unknown> | undefined;

export default function CrmAdminPanel({ mode }: { mode: CrmPanelMode }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [bookingSlug, setBookingSlug] = useState("hotel-reservations");

  const load = useCallback(async () => {
    if (!window.localStorage.getItem(CRM_ACCESS_TOKEN_KEY)) return router.replace("/admin/login");
    setLoading(true); setError("");
    try {
      const params = search.trim() ? { search: search.trim(), page_size: 50 } : { page_size: 50 };
      const response = mode === "team" ? await crmService.teamMembers(params)
        : mode === "bookings" ? await crmService.typedBookings(bookingSlug, params)
        : mode === "flights" ? await crmService.flightBookings(params)
        : mode === "complaints" ? await crmService.complaints(params)
        : mode === "onboarding" ? await crmService.onboarding(params)
        : await crmService.ratings(params);
      setRows(response.data as Row[]);
    } catch (requestError) { setError(getErrorMessage(requestError)); }
    finally { setLoading(false); }
  }, [bookingSlug, mode, router, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function createTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setBusy("create"); setError("");
    try { await crmService.createTeamMember({ name: String(form.get("name") || ""), email: String(form.get("email") || ""), password: String(form.get("password") || ""), crm_access_active: true, is_active: true }); event.currentTarget.reset(); await load(); }
    catch (requestError) { setError(getErrorMessage(requestError)); } finally { setBusy(""); }
  }

  async function perform(action: string, row: Row) {
    const id = rowId(row); setBusy(`${action}-${id}`); setError("");
    try {
      if (mode === "team") {
        if (action === "delete") await crmService.deleteTeamMember(Number(id));
        else if (action === "password") { const password = window.prompt("Enter the new CRM password"); if (!password) return; await crmService.setTeamMemberPassword(Number(id), password); }
        else await crmService.updateTeamMember(Number(id), { crm_access_active: !Boolean(value(row, "crm_access_active")) });
      } else if (mode === "bookings") {
        if (action === "delete") await crmService.deleteTypedBooking(bookingSlug, Number(id));
        else await crmService.updateTypedBooking(bookingSlug, Number(id), { booking: { status: action, admin_notes: `Updated to ${action} from CRM portal.` } });
      } else if (mode === "flights") {
        if (action === "delete") await crmService.deleteFlight(Number(id));
        else if (action === "cancel") await crmService.cancelFlight(Number(id));
        else await crmService.refreshFlightStatus(Number(id));
      } else if (mode === "complaints") {
        if (action === "delete") await crmService.deleteComplaint(id);
        else await crmService.updateComplaint(id, { status: action, status_note: `Updated to ${action} from CRM portal.` });
      } else if (mode === "onboarding") {
        if (action === "delete") await crmService.deleteOnboarding(Number(id));
        else await crmService.updateOnboarding(Number(id), { status: action, admin_notes: `Updated to ${action} from CRM portal.` });
      } else {
        if (action === "delete") await crmService.deleteRating(Number(id));
        else await crmService.updateRating(Number(id), { is_approved: action === "approve" });
      }
      await load();
    } catch (requestError) { setError(getErrorMessage(requestError)); }
    finally { setBusy(""); }
  }

  async function logout() {
    const refresh = window.localStorage.getItem(CRM_REFRESH_TOKEN_KEY) || "";
    try { if (refresh) await crmService.logout(refresh); } catch { /* local logout remains valid */ }
    window.localStorage.removeItem(CRM_ACCESS_TOKEN_KEY); window.localStorage.removeItem(CRM_REFRESH_TOKEN_KEY); window.localStorage.removeItem("crm_user"); router.replace("/admin/login");
  }

  const title = mode === "team" ? "Team members & CRM access" : mode === "bookings" ? "Typed booking requests" : mode === "flights" ? "FTD flight bookings" : mode === "complaints" ? "Complaints & feedback" : mode === "onboarding" ? "Client and vendor onboarding" : "Service ratings";

  return <main className="min-h-screen bg-[#edf5f9] text-[#122b42]"><header className="bg-[#061f3b] px-5 py-8 text-white lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-[#13a5d8]"><ShieldCheck className="size-4" />BHLI CRM</p><h1 className="mt-2 font-serif text-4xl">{title}</h1></div><button onClick={() => void logout()} className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white/70 hover:text-white"><LogOut className="size-4" />Sign out</button></div><nav className="mx-auto mt-7 flex max-w-7xl gap-2 overflow-x-auto pb-1">{navigation.map(([label, href]) => <Link key={href} href={href} className="shrink-0 rounded-full bg-white/8 px-4 py-2 text-xs font-bold text-white/65 hover:bg-white/15 hover:text-white">{label}</Link>)}</nav></header><section className="mx-auto max-w-7xl px-5 py-10 lg:px-8"><div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-end"><label className="flex-1 text-xs font-bold text-slate-500">Search<span className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3"><Search className="size-4" /><input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void load(); }} className="min-w-0 flex-1 outline-none" placeholder="Search records" /></span></label>{mode === "bookings" && <label className="text-xs font-bold text-slate-500">Booking service<select value={bookingSlug} onChange={(event) => setBookingSlug(event.target.value)} className="mt-2 block h-11 rounded-xl border border-slate-200 px-3 text-sm">{typedBookingSlugs.map((slug) => <option key={slug}>{slug}</option>)}</select></label>}<button onClick={() => void load()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#087fbe] px-5 text-sm font-bold text-white"><RefreshCw className="size-4" />Refresh</button></div>{mode === "team" && <form onSubmit={createTeam} className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-[1fr_1fr_1fr_auto]"><input name="name" required placeholder="Full name" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" /><input name="email" type="email" required placeholder="Email" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" /><input name="password" type="password" placeholder="Initial password" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" /><button disabled={busy === "create"} className="rounded-xl bg-[#07345d] px-5 text-sm font-bold text-white">Add member</button></form>}{error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600">{error}</p>}{loading ? <p className="mt-10 flex items-center justify-center gap-2 text-slate-500"><LoaderCircle className="size-5 animate-spin" />Loading CRM data...</p> : <div className="mt-6 grid gap-4">{rows.length ? rows.map((row) => <article key={rowId(row)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#087fbe]">#{rowId(row)} · {String(value(row, "status") || bookingBase(row)?.status || value(row, "designation") || mode)}</p><h2 className="mt-2 truncate font-serif text-2xl">{String(value(row, "name") || value(row, "ticket_number") || value(row, "shop_name") || value(row, "service_name") || bookingBase(row)?.service_name || value(row, "title") || `Record ${rowId(row)}`)}</h2><p className="mt-2 text-sm text-slate-500">{String(value(row, "email") || value(row, "subject") || value(row, "ref_id") || value(row, "review") || value(row, "contact_person") || "")}</p></div><div className="flex flex-wrap gap-2">{mode === "team" && <><Action label={Boolean(value(row, "crm_access_active")) ? "Disable" : "Enable"} run={() => perform("toggle", row)} /><Action label="Set password" run={() => perform("password", row)} /></>}{mode === "bookings" && <><Action label="In progress" run={() => perform("in_progress", row)} /><Action label="Confirm" run={() => perform("confirmed", row)} /></>}{mode === "flights" && <><Action label="Refresh status" icon="refresh" run={() => perform("refresh", row)} /><Action label="Cancel" run={() => perform("cancel", row)} /></>}{mode === "complaints" && <><Action label="In progress" run={() => perform("in_progress", row)} /><Action label="Resolve" icon="check" run={() => perform("resolved", row)} /></>}{mode === "onboarding" && <><Action label="Review" run={() => perform("under_review", row)} /><Action label="Approve" icon="check" run={() => perform("approved", row)} /></>}{mode === "ratings" && <><Action label="Approve" icon="check" run={() => perform("approve", row)} /><Action label="Reject" icon="x" run={() => perform("reject", row)} /></>}<Action label="Delete" destructive run={() => { if (window.confirm("Delete this record permanently?")) void perform("delete", row); }} /></div></div>{busy.endsWith(`-${rowId(row)}`) && <p className="mt-3 flex items-center gap-2 text-xs text-[#087fbe]"><LoaderCircle className="size-3 animate-spin" />Updating...</p>}</article>) : <p className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">No records found.</p>}</div>}</section></main>;
}

function Action({ label, run, destructive = false, icon }: { label: string; run: () => void | Promise<void>; destructive?: boolean; icon?: "check" | "x" | "refresh" }) {
  const Icon = destructive ? Trash2 : icon === "check" ? Check : icon === "x" ? X : icon === "refresh" ? RefreshCw : null;
  return <button type="button" onClick={() => void run()} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${destructive ? "bg-red-50 text-red-600" : "bg-[#edf8fc] text-[#087fbe]"}`}>{Icon && <Icon className="size-3.5" />}{label}</button>;
}
