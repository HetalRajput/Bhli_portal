function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 motion-reduce:animate-none ${className}`} />;
}

function CardSkeleton({ external = false }: { external?: boolean }) {
  return (
    <article className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_36px_rgba(6,31,59,.06)] ${external ? "min-h-[390px]" : ""}`}>
      <Skeleton className="h-44 w-full rounded-none bg-slate-200" />
      <div className="p-6">
        <Skeleton className="h-3 w-24 bg-sky-100" />
        <Skeleton className="mt-4 h-7 w-3/4" />
        <Skeleton className="mt-4 h-3 w-full bg-slate-100" />
        <Skeleton className="mt-2 h-3 w-4/5 bg-slate-100" />
        <Skeleton className={`${external ? "mt-16" : "mt-6"} h-9 w-32 rounded-full bg-sky-100`} />
      </div>
    </article>
  );
}

export default function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f9fc] text-[#122b42]" role="status" aria-label="Loading home page" aria-busy="true">
      <span className="sr-only">Loading home page content...</span>

      <section className="relative isolate min-h-[760px] overflow-hidden bg-[#061f3b] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(19,165,216,.18),transparent_35%)]" />
        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8">
          <div className="max-w-3xl">
            <Skeleton className="h-4 w-72 bg-[#7bd5f1]/20" />
            <Skeleton className="mt-7 h-14 w-[min(44rem,95%)] bg-white/15 sm:h-16" />
            <Skeleton className="mt-3 h-14 w-[min(38rem,82%)] bg-white/15 sm:h-16" />
            <div className="mt-8 max-w-2xl space-y-3">
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-11/12 bg-white/10" />
            </div>
            <div className="mt-9 flex gap-3">
              <Skeleton className="h-12 w-44 rounded-full bg-[#13a5d8]/30" />
              <Skeleton className="h-12 w-36 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="hidden justify-center lg:flex lg:justify-end">
            <div className="h-[530px] w-full max-w-[400px] rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <Skeleton className="h-64 w-full rounded-2xl bg-white/10" />
              <Skeleton className="mt-6 h-3 w-28 bg-sky-300/20" />
              <Skeleton className="mt-4 h-8 w-4/5 bg-white/15" />
              <Skeleton className="mt-4 h-4 w-full bg-white/10" />
              <Skeleton className="mt-2 h-4 w-3/4 bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-16 w-full max-w-7xl px-5 lg:px-8">
        <div className="rounded-[1.7rem] border border-sky-100 bg-white p-5 shadow-2xl shadow-[#061f3b]/15 sm:p-7">
          <div className="flex items-center justify-between">
            <div><Skeleton className="h-3 w-28 bg-sky-100" /><Skeleton className="mt-3 h-7 w-64" /></div>
            <Skeleton className="hidden h-8 w-36 rounded-full bg-sky-50 sm:block" />
          </div>
          <div className="mt-5 flex gap-2 overflow-hidden">
            {[0, 1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-11 w-24 shrink-0 rounded-xl bg-slate-100" />)}
          </div>
          <div className="mt-4 grid gap-2 rounded-[1.35rem] border border-sky-100 bg-sky-50/50 p-2 sm:grid-cols-[1fr_10rem]">
            <Skeleton className="h-16 w-full bg-white" />
            <Skeleton className="h-16 w-full bg-sky-200" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Skeleton className="h-3 w-40 bg-sky-100" />
        <div className="mt-4 flex items-end justify-between gap-5">
          <Skeleton className="h-12 w-[min(34rem,72%)]" />
          <Skeleton className="hidden h-5 w-32 sm:block" />
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((card) => <CardSkeleton key={card} />)}
        </div>
      </section>

      <section className="overflow-hidden border-y border-slate-200 bg-gradient-to-b from-white to-[#edf5f9] pb-16 pt-10 sm:pb-20 sm:pt-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Skeleton className="h-3 w-48 bg-sky-100" />
          <div className="mt-4 flex items-end justify-between gap-5">
            <div className="w-full max-w-2xl"><Skeleton className="h-12 w-4/5" /><Skeleton className="mt-4 h-4 w-3/4 bg-slate-100" /></div>
            <Skeleton className="hidden h-10 w-56 rounded-full sm:block" />
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((card) => <CardSkeleton key={card} external />)}
          </div>
        </div>
      </section>

      <section className="bg-[#07345d] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8">
          <div><Skeleton className="h-3 w-36 bg-sky-300/20" /><Skeleton className="mt-5 h-12 w-4/5 bg-white/15" /><Skeleton className="mt-3 h-12 w-2/3 bg-white/15" /><div className="mt-7 space-y-3">{[0, 1, 2].map((line) => <Skeleton key={line} className="h-4 w-3/4 bg-white/10" />)}</div><Skeleton className="mt-8 h-12 w-44 rounded-full bg-sky-300/20" /></div>
          <Skeleton className="h-[440px] w-full rounded-[2rem] bg-white/10" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="text-center"><Skeleton className="mx-auto h-3 w-24 bg-sky-100" /><Skeleton className="mx-auto mt-4 h-10 w-72" /></div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((item) => <div key={item} className="rounded-3xl border border-sky-100 bg-white p-6"><Skeleton className="size-10 rounded-full bg-sky-100" /><Skeleton className="mt-5 h-7 w-2/3" /><Skeleton className="mt-4 h-4 w-full bg-slate-100" /><Skeleton className="mt-2 h-4 w-4/5 bg-slate-100" /></div>)}
        </div>
      </section>
    </div>
  );
}
