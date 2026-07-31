"use client";

import { AlertCircle, ArrowLeft, Ban, CalendarDays, Clock3, Hash, LoaderCircle, MapPin, RefreshCw, ShieldCheck, Ticket, UsersRound } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { bookingService, type BookingRequest } from "@/lib/api/bookings";
import { getErrorMessage } from "@/lib/api/client";

type BookingHistoryPanelProps = {
  bookings: BookingRequest[];
  loading: boolean;
  error?: string;
  onBookingUpdated: (booking: BookingRequest) => void;
};

const formatLabel = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const formatValue = (value: unknown) => {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined || value === "") return "Not provided";
  return String(value);
};
const formatDate = (value: unknown, includeTime = false) => {
  if (!value) return "Not provided";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-IN", includeTime
    ? { dateStyle: "medium", timeStyle: "short" }
    : { dateStyle: "medium" }).format(date);
};

const statusDesign: Record<string, { label: string; chip: string; dot: string }> = {
  new: { label: "New", chip: "border-blue-200 bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  pending: { label: "Pending", chip: "border-amber-200 bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  processing: { label: "In review", chip: "border-violet-200 bg-violet-50 text-violet-700", dot: "bg-violet-500" },
  confirmed: { label: "Confirmed", chip: "border-emerald-200 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  completed: { label: "Completed", chip: "border-teal-200 bg-teal-50 text-teal-700", dot: "bg-teal-500" },
  cancelled: { label: "Cancelled", chip: "border-rose-200 bg-rose-50 text-rose-700", dot: "bg-rose-500" },
  rejected: { label: "Rejected", chip: "border-red-200 bg-red-50 text-red-700", dot: "bg-red-500" },
  closed: { label: "Closed", chip: "border-slate-200 bg-slate-50 text-slate-700", dot: "bg-slate-500" },
};

function getStatus(status?: string) {
  const normalized = String(status || "new").toLowerCase();
  return statusDesign[normalized] || { label: formatLabel(normalized), chip: "border-slate-200 bg-slate-50 text-slate-700", dot: "bg-slate-500" };
}

function unwrapBooking(response: unknown): BookingRequest {
  const value = response as { data?: BookingRequest | { booking?: BookingRequest } };
  if (value?.data && "booking" in value.data) {
    const booking = (value.data as { booking?: BookingRequest }).booking;
    if (booking) return booking;
  }
  return (value?.data || response) as BookingRequest;
}

export default function BookingHistoryPanel({ bookings, loading, error, onBookingUpdated }: BookingHistoryPanelProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<number | null>(null);
  const [detailError, setDetailError] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const sortedBookings = useMemo(() => [...bookings].sort((first, second) => new Date(second.created || 0).getTime() - new Date(first.created || 0).getTime()), [bookings]);
  const activeCount = bookings.filter((booking) => !["cancelled", "rejected", "completed", "closed"].includes(String(booking.status).toLowerCase())).length;
  const cancelledCount = bookings.filter((booking) => String(booking.status).toLowerCase() === "cancelled").length;

  async function viewBooking(id: number) {
    setLoadingDetail(id);
    setDetailError("");
    setShowCancelForm(false);
    setCancelReason("");
    try {
      const response = await bookingService.getBookingById(id);
      setSelectedBooking(unwrapBooking(response));
    } catch (requestError) {
      setDetailError(getErrorMessage(requestError));
    } finally {
      setLoadingDetail(null);
    }
  }

  async function cancelBooking() {
    if (!selectedBooking) return;
    if (cancelReason.trim().length < 3) {
      setCancelError("Please briefly explain why you want to cancel this request.");
      return;
    }
    setCancelError("");
    setCancelling(true);
    try {
      const response = await bookingService.cancelBooking(selectedBooking.id, cancelReason);
      const responseData = response?.data || response;
      const updated = { ...selectedBooking, ...responseData, status: responseData?.status || "cancelled", remarks: responseData?.remarks || cancelReason.trim() } as BookingRequest;
      setSelectedBooking(updated);
      onBookingUpdated(updated);
      setShowCancelForm(false);
    } catch (requestError) {
      setCancelError(getErrorMessage(requestError));
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return (
    <div className="space-y-4" aria-label="Loading booking history">
      {[1, 2, 3].map((item) => <div key={item} className="h-40 animate-pulse rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100" />)}
    </div>
  );

  if (selectedBooking) return (
    <BookingDetailPanel
      booking={selectedBooking}
      showCancelForm={showCancelForm}
      cancelReason={cancelReason}
      cancelError={cancelError}
      cancelling={cancelling}
      setCancelReason={setCancelReason}
      setShowCancelForm={setShowCancelForm}
      cancelBooking={cancelBooking}
      close={() => setSelectedBooking(null)}
    />
  );

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-3">
        {[{ label: "Total requests", value: bookings.length, icon: Ticket, color: "text-[#0879b7] bg-[#edf8fd]" }, { label: "In progress", value: activeCount, icon: Clock3, color: "text-amber-700 bg-amber-50" }, { label: "Cancelled", value: cancelledCount, icon: Ban, color: "text-rose-700 bg-rose-50" }].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-3 shadow-sm"><span className={`grid size-9 place-items-center rounded-lg ${color}`}><Icon className="size-4" /></span><span><b className="block text-base leading-5 text-[#07152d]">{value}</b><span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</span></span></div>
        ))}
      </div>

      {error && <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="mt-0.5 size-5 shrink-0" /><div><b>Booking history could not be loaded.</b><p className="mt-1 text-xs leading-5">{error}</p><button type="button" onClick={() => window.location.reload()} className="mt-3 inline-flex items-center gap-2 text-xs font-bold"><RefreshCw className="size-3.5" />Try again</button></div></div>}

      {!error && sortedBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#0879b7]/25 bg-gradient-to-br from-[#f7fcff] to-white p-7 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#edf8fd] text-[#0879b7]"><Ticket className="size-7" /></span>
          <h3 className="mt-5 font-serif text-2xl text-[#07152d]">No booking requests yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Once you submit a travel or hospitality request, its latest status will appear here.</p>
          <Link href="/services" className="mt-6 inline-flex items-center rounded-xl bg-[#07152d] px-5 py-3 text-xs font-bold text-white">Explore booking services</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBookings.map((booking) => {
            const status = getStatus(booking.status);
            const primaryGuest = booking.guests?.[0]?.name;
            const location = [booking.service_item_city, booking.service_item_location].filter(Boolean).join(" · ");
            const reference = `BH${String(booking.id).padStart(6, "0")}`;
            return (
              <article key={booking.id} className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:border-[#0879b7]/20 hover:shadow-[0_12px_35px_rgba(6,70,110,.09)]">
                <div className="flex flex-col md:flex-row">
                  <div className={`h-1.5 md:h-auto md:w-1.5 ${status.dot}`} />
                  <div className="min-w-0 flex-1 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-[#0879b7]/10 bg-[#0879b7]/5 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#0879b7]">{booking.service_name || formatLabel(booking.service_slug || "Booking service")}</span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-400"><Hash className="size-3" />{reference}</span>
                    </div>
                    <h3 className="mt-2 truncate text-sm font-bold text-[#07152d]">{booking.service_item_title || primaryGuest || booking.service_name || "Booking request"}</h3>
                    <div className="mt-2.5 grid gap-2 text-[11px] font-semibold text-slate-500 sm:grid-cols-3">
                      <span className="flex items-center gap-2"><CalendarDays className="size-4 text-slate-400" />{formatDate(booking.created)}</span>
                      <span className="flex items-center gap-2"><UsersRound className="size-4 text-slate-400" />{booking.number_of_guests ?? booking.guests?.length ?? 0} guest(s)</span>
                      <span className="flex min-w-0 items-center gap-2"><MapPin className="size-4 shrink-0 text-slate-400" /><span className="truncate">{location || "Location in request details"}</span></span>
                    </div>
                    {booking.message && <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">{booking.message}</p>}
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-dashed border-slate-200 bg-slate-50/60 p-4 md:w-44 md:flex-col md:justify-center md:border-l md:border-t-0">
                    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider ${status.chip}`}><span className={`size-2 rounded-full ${status.dot}`} />{status.label}</span>
                    <button type="button" onClick={() => viewBooking(booking.id)} disabled={loadingDetail === booking.id} className="inline-flex min-w-28 items-center justify-center rounded-xl border border-[#0879b7]/20 bg-white px-3 py-2 text-[11px] font-bold text-[#0879b7] transition hover:bg-[#edf8fd] disabled:opacity-60">{loadingDetail === booking.id ? <LoaderCircle className="size-4 animate-spin" /> : "View details"}</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {detailError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{detailError}</p>}

    </>
  );
}

function BookingDetailPanel({ booking, showCancelForm, cancelReason, cancelError, cancelling, setCancelReason, setShowCancelForm, cancelBooking, close }: { booking: BookingRequest; showCancelForm: boolean; cancelReason: string; cancelError: string; cancelling: boolean; setCancelReason: (value: string) => void; setShowCancelForm: (value: boolean) => void; cancelBooking: () => void; close: () => void }) {
  const status = getStatus(booking.status);
  const canCancel = ["new", "pending", "processing"].includes(String(booking.status).toLowerCase());
  const excludedKeys = new Set(["id", "user", "service", "service_name", "service_slug", "service_item", "service_item_title", "service_item_city", "service_item_location", "number_of_guests", "message", "consent_to_contact", "status", "remarks", "admin_notes", "guests", "created", "updated", "details"]);
  const serviceFields = Object.entries(booking).filter(([key, value]) => !excludedKeys.has(key) && value !== null && value !== undefined && value !== "" && typeof value !== "object");
  const backToHistory = () => { setShowCancelForm(false); close(); };

  return (
    <section aria-labelledby="booking-detail-title" className="overflow-hidden rounded-xl border border-[#0a79bf]/10 bg-[#f4f9fc] shadow-sm">
      <header className="relative overflow-hidden bg-[linear-gradient(125deg,#061a32_0%,#0a3155_58%,#0879b7_140%)] px-4 py-5 sm:px-5">
        <button type="button" onClick={backToHistory} className="relative z-[1] inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white/85 transition hover:bg-white/20 hover:text-white"><ArrowLeft className="size-3.5" />Back to booking history</button>
        <div className="relative z-[1] mt-4 min-w-0"><p className="text-[9px] font-extrabold uppercase tracking-[.22em] text-[#2ac2f1]">Booking request · BH{String(booking.id).padStart(6, "0")}</p><h2 id="booking-detail-title" className="mt-1.5 font-serif text-xl font-semibold text-white sm:text-2xl">{booking.service_item_title || booking.service_name || "Request details"}</h2><p className="mt-1.5 text-[11px] font-semibold text-white/55">Review your request details and latest reservation status.</p></div>
      </header>

      <div className="p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#0879b7]/10 bg-white p-3 shadow-[0_8px_24px_rgba(14,72,105,.05)]"><span className="rounded-full border border-[#0879b7]/15 bg-[#e7f7fd] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[#0879b7]">{booking.service_name || formatLabel(booking.service_slug)}</span><span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider ${status.chip}`}><span className={`size-2 rounded-full ${status.dot}`} />{status.label}</span><span className="w-full text-[11px] font-semibold text-slate-400 sm:ml-auto sm:w-auto">Submitted {formatDate(booking.created, true)}</span></div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[['Selected item', booking.service_item_title], ['City', booking.service_item_city], ['Location', booking.service_item_location], ['Number of guests', booking.number_of_guests ?? booking.guests?.length], ['Consent to contact', booking.consent_to_contact], ['Last updated', formatDate(booking.updated, true)]].filter(([, value]) => value !== undefined && value !== null && value !== "").map(([label, value]) => <DetailValue key={String(label)} label={String(label)} value={value} />)}
          </div>

          {serviceFields.length > 0 && <section className="mt-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"><h3 className="flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#07152d]"><span className="size-2 rounded-full bg-[#14a6d8]" />Service details</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">{serviceFields.map(([key, value]) => <DetailValue key={key} label={formatLabel(key)} value={key.includes("date") ? formatDate(value) : value} />)}</div></section>}
          {booking.details && Object.keys(booking.details).length > 0 && <section className="mt-4 rounded-xl border border-[#0879b7]/10 bg-white p-4 shadow-sm"><h3 className="flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#07152d]"><span className="size-2 rounded-full bg-[#0879b7]" />Preferences and budget</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">{Object.entries(booking.details).map(([key, value]) => <DetailValue key={key} label={formatLabel(key)} value={value} accent />)}</div></section>}
          {booking.guests?.length > 0 && <section className="mt-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"><h3 className="flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#07152d]"><span className="size-2 rounded-full bg-emerald-500" />Guests</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">{booking.guests.map((guest, index) => <div key={guest.id || `${guest.name}-${index}`} className="flex items-center justify-between gap-2.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-xs"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-white font-extrabold text-[#0879b7] shadow-sm">{index + 1}</span><b className="min-w-0 flex-1 truncate text-[#07152d]">{guest.name}</b><span className="shrink-0 capitalize text-[11px] text-slate-500">{guest.age} yrs · {guest.gender}</span></div>)}</div></section>}
          {booking.message && <section className="mt-4 rounded-xl border border-[#0879b7]/10 bg-gradient-to-br from-[#eaf8fe] to-white p-4 shadow-sm"><p className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[#0879b7]">Your message</p><p className="mt-1.5 whitespace-pre-line text-xs leading-5 text-[#344a5c]">{booking.message}</p></section>}
          {(booking.remarks || booking.admin_notes) && <section className="mt-5 grid gap-3 sm:grid-cols-2">{booking.remarks && <DetailValue label="Remarks" value={booking.remarks} accent />}{booking.admin_notes && <DetailValue label="Reservation desk notes" value={booking.admin_notes} accent />}</section>}

          {canCancel && <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-4">
            {!showCancelForm ? <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold text-[#07152d]">Need to change your plans?</p><p className="mt-1 text-xs leading-5 text-slate-500">You can cancel while the reservation team is still reviewing this request.</p></div><button type="button" onClick={() => setShowCancelForm(true)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100"><Ban className="size-4" />Cancel request</button></div> : <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 sm:p-5"><p className="flex items-center gap-2 text-sm font-bold text-rose-800"><AlertCircle className="size-4" />Confirm cancellation</p><p className="mt-2 text-xs leading-5 text-rose-700/75">The reservation team will be notified and this request cannot be restored from the website.</p><textarea value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} rows={3} maxLength={500} placeholder="Tell us why you are cancelling" className="mt-4 w-full resize-none rounded-xl border border-rose-200 bg-white p-3 text-sm outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100" />{cancelError && <p role="alert" className="mt-2 text-xs font-semibold text-rose-700">{cancelError}</p>}<div className="mt-4 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={cancelBooking} disabled={cancelling} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60">{cancelling ? <LoaderCircle className="size-4 animate-spin" /> : <Ban className="size-4" />}Confirm cancellation</button><button type="button" onClick={() => setShowCancelForm(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50">Keep request</button></div></div>}
          </div>}

          {!canCancel && <p className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-[11px] font-semibold text-slate-500 shadow-sm"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#edf8fd]"><ShieldCheck className="size-3.5 text-[#0879b7]" /></span>This request is {status.label.toLowerCase()} and can no longer be cancelled online.</p>}
      </div>
    </section>
  );
}

function DetailValue({ label, value, accent = false }: { label: string; value: unknown; accent?: boolean }) {
  return <div className={`rounded-lg border p-3 transition hover:-translate-y-0.5 hover:shadow-sm ${accent ? "border-[#0879b7]/10 bg-[#f2faff]" : "border-slate-100 bg-white"}`}><p className={`text-[8px] font-extrabold uppercase tracking-[.14em] ${accent ? "text-[#0879b7]/75" : "text-slate-400"}`}>{label}</p><p className="mt-1 break-words text-xs font-bold leading-5 text-[#07152d]">{formatValue(value)}</p></div>;
}
