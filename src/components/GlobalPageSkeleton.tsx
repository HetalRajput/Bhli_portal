function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 motion-reduce:animate-none ${className}`} />;
}

export default function GlobalPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f9fc] text-[#102d45]" role="status" aria-label="Loading page" aria-busy="true">
      <span className="sr-only">Loading page content...</span>

      <section className="relative overflow-hidden bg-[#062b50] px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(19,165,216,.16),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl">
          <SkeletonBlock className="h-3 w-28 bg-[#13a5d8]/30" />
          <SkeletonBlock className="mt-6 h-12 w-[min(42rem,90%)] bg-white/15 sm:h-16" />
          <SkeletonBlock className="mt-3 h-12 w-[min(31rem,72%)] bg-white/15 sm:h-16" />
          <div className="mt-7 max-w-2xl space-y-3">
            <SkeletonBlock className="h-4 w-full bg-white/10" />
            <SkeletonBlock className="h-4 w-4/5 bg-white/10" />
          </div>
          <div className="mt-8 flex gap-3">
            <SkeletonBlock className="h-11 w-36 rounded-full bg-white/15" />
            <SkeletonBlock className="h-11 w-28 rounded-full bg-white/10" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div className="w-full max-w-xl space-y-3">
            <SkeletonBlock className="h-7 w-52" />
            <SkeletonBlock className="h-4 w-full bg-slate-100" />
          </div>
          <SkeletonBlock className="hidden h-10 w-28 rounded-full sm:block" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((card) => (
            <article key={card} className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(6,31,59,.05)]">
              <SkeletonBlock className="h-44 w-full rounded-none bg-slate-200" />
              <div className="space-y-3 p-6">
                <SkeletonBlock className="h-6 w-2/3" />
                <SkeletonBlock className="h-4 w-full bg-slate-100" />
                <SkeletonBlock className="h-4 w-5/6 bg-slate-100" />
                <SkeletonBlock className="mt-5 h-10 w-32 rounded-full bg-sky-100" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
