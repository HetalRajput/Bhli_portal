"use client";

import { AlertTriangle, CircleAlert, WifiOff, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { API_ERROR_EVENT, type ApiErrorEventDetail } from "@/lib/api/client";

type AlertItem = ApiErrorEventDetail & { id: number };

const DISPLAY_TIME = 5500;

export default function ApiErrorAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, number>());
  const lastAlert = useRef({ message: "", time: 0 });

  const dismiss = (id: number) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setAlerts((current) => current.filter((alert) => alert.id !== id));
  };

  useEffect(() => {
    const activeTimers = timers.current;
    const handleApiError = (event: Event) => {
      const detail = (event as CustomEvent<ApiErrorEventDetail>).detail;
      if (!detail?.message) return;

      const now = Date.now();
      if (lastAlert.current.message === detail.message && now - lastAlert.current.time < 1200) return;
      lastAlert.current = { message: detail.message, time: now };

      const id = ++nextId.current;
      setAlerts((current) => [...current.slice(-2), { ...detail, id }]);
      activeTimers.set(id, window.setTimeout(() => dismiss(id), DISPLAY_TIME));
    };

    window.addEventListener(API_ERROR_EVENT, handleApiError);
    return () => {
      window.removeEventListener(API_ERROR_EVENT, handleApiError);
      activeTimers.forEach((timer) => window.clearTimeout(timer));
      activeTimers.clear();
    };
  }, []);

  if (!alerts.length) return null;

  return (
    <div aria-live="assertive" aria-atomic="true" className="pointer-events-none fixed inset-x-4 top-4 z-[250] flex flex-col items-end gap-3 sm:left-auto sm:right-6 sm:top-6 sm:w-[min(27rem,calc(100vw-3rem))]">
      {alerts.map((alert) => {
        const Icon = alert.status === 0 ? WifiOff : alert.status >= 500 ? AlertTriangle : CircleAlert;
        return (
          <article key={alert.id} role="alert" className="api-error-alert pointer-events-auto relative w-full overflow-hidden rounded-[1.35rem] border border-rose-200/80 bg-white/95 shadow-[0_24px_70px_rgba(80,12,28,.24)] backdrop-blur-xl">
            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-rose-500 via-red-500 to-orange-400" />
            <div className="flex items-start gap-3.5 p-4 pl-5 sm:p-5 sm:pl-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-50 to-red-100 text-rose-600 ring-1 ring-rose-200/70">
                <Icon className="size-5.5" strokeWidth={2.2} />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-extrabold text-[#30101a]">{alert.title}</h2>
                  {alert.status > 0 && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[.12em] text-rose-600">Error {alert.status}</span>}
                </div>
                <p className="mt-1.5 max-h-24 overflow-y-auto whitespace-pre-line pr-1 text-xs font-medium leading-5 text-[#704653] sm:text-[13px]">{alert.message}</p>
              </div>
              <button type="button" onClick={() => dismiss(alert.id)} aria-label="Dismiss error message" className="grid size-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300">
                <X className="size-4" />
              </button>
            </div>
            <span className="api-error-progress absolute inset-x-0 bottom-0 h-1 origin-left bg-gradient-to-r from-rose-500 via-red-500 to-orange-400" />
          </article>
        );
      })}
      <style jsx>{`
        .api-error-alert { animation: api-alert-enter .42s cubic-bezier(.22, 1, .36, 1) both; }
        .api-error-progress { animation: api-alert-progress ${DISPLAY_TIME}ms linear forwards; }
        @keyframes api-alert-enter {
          from { opacity: 0; transform: translate3d(28px, -10px, 0) scale(.96); }
          to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes api-alert-progress { from { transform: scaleX(1); } to { transform: scaleX(0); } }
        @media (prefers-reduced-motion: reduce) {
          .api-error-alert, .api-error-progress { animation: none; }
        }
      `}</style>
    </div>
  );
}
