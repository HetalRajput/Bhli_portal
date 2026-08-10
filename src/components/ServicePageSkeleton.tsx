function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />;
}

export default function ServicePageSkeleton() {
  return (
    <div
      className="min-h-screen overflow-hidden bg-[#f3f8fb] text-[#102d45]"
      role="status"
      aria-label="Loading service page"
      aria-busy="true"
    >
      <span className="sr-only">Loading service details...</span>

      <section className="relative overflow-hidden bg-[#061f3b] px-5 pb-32 pt-12 lg:px-8 lg:pb-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(19,165,216,.18),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <SkeletonBlock className="h-4 w-28 bg-white/15" />
          <SkeletonBlock className="mt-10 h-3 w-36 bg-[#13a5d8]/35" />
          <SkeletonBlock className="mt-5 h-12 w-[min(38rem,88%)] bg-white/15 sm:h-16" />
          <SkeletonBlock className="mt-3 h-12 w-[min(28rem,68%)] bg-white/15 sm:h-16" />
          <div className="mt-7 max-w-2xl space-y-3">
            <SkeletonBlock className="h-4 w-full bg-white/10" />
            <SkeletonBlock className="h-4 w-4/5 bg-white/10" />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {["w-28", "w-36", "w-32"].map((width) => (
              <SkeletonBlock key={width} className={`h-9 ${width} rounded-full bg-white/10`} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto -mt-20 grid max-w-7xl gap-6 px-5 pb-20 lg:grid-cols-[minmax(0,1fr)_21rem] lg:px-8">
        <div className="space-y-5">
          {[0, 1].map((section) => (
            <div key={section} className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_14px_45px_rgba(6,31,59,.06)] sm:p-7">
              <div className="flex items-center gap-4">
                <SkeletonBlock className="size-11 shrink-0 rounded-2xl bg-sky-100" />
                <div className="w-full space-y-2">
                  <SkeletonBlock className="h-5 w-44" />
                  <SkeletonBlock className="h-3 w-64 max-w-[75%] bg-slate-100" />
                </div>
              </div>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                {[0, 1, 2, 3].map((field) => (
                  <div key={field}>
                    <SkeletonBlock className="h-3 w-24" />
                    <SkeletonBlock className="mt-2 h-12 w-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_14px_45px_rgba(6,31,59,.06)]">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="size-11 shrink-0 rounded-2xl bg-sky-100" />
            <div className="w-full space-y-2">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-3 w-20 bg-slate-100" />
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {["w-full", "w-11/12", "w-4/5"].map((width) => (
              <SkeletonBlock key={width} className={`h-4 ${width} bg-slate-100`} />
            ))}
          </div>
          <SkeletonBlock className="mt-7 h-12 w-full rounded-xl bg-sky-100" />
        </aside>
      </section>
    </div>
  );
}
