const impactStats = [
  { value: "7,500+", label: "Hotels" },
  { value: "250+", label: "Destinations" },
  { value: "5 Lac+", label: "Holiday Nights" },
  { value: "25,000+", label: "Happy Families" },
  { value: "4.9", label: "Star Rating" },
  { value: "20+", label: "Defence Organisations" },
] as const;

export default function TravelImpactSlider({ className = "" }: { className?: string }) {
  return (
    <section className={`bg-[#10284a] text-white ${className}`} aria-label="BHLI travel network highlights">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 py-7 sm:grid-cols-3 lg:grid-cols-6 lg:px-8">
        {impactStats.map(({ value, label }, index) => (
          <div key={label} className={`flex min-h-20 flex-col items-center justify-center px-3 py-2 text-center ${index % 2 !== 0 ? "border-l border-white/20" : ""} ${index >= 2 ? "border-t border-white/15 sm:border-t-0" : ""} sm:border-l sm:first:border-l-0 lg:min-h-16`}>
            <p className="font-serif text-2xl font-bold text-[#f3c94f] sm:text-3xl">{value}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase text-white/60 sm:text-[11px]">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
