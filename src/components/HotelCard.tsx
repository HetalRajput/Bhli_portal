"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Sparkles, Star } from "lucide-react";

export interface HotelCardProps {
  id: string | number;
  title: string;
  subtitle?: string;
  location?: string;
  city?: string;
  description: string;
  image: string;
  fallbackImage?: string;
  ratingText: string;
  features: string[];
  price?: number | null;
  priceLabel?: string;
  buttonHref: string;
  buttonText?: string;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function HotelCard({
  title,
  subtitle,
  location,
  city,
  description,
  image,
  fallbackImage,
  ratingText,
  features,
  price,
  priceLabel,
  buttonHref,
  buttonText = "Book Now",
}: HotelCardProps) {
  const router = useRouter();
  const displayLocation = location || subtitle;
  const starMatch = ratingText.match(/\b([1-5])\s*(?:star)?\b/i);
  const starRating = starMatch ? Number(starMatch[1]) : null;
  const showCityLine = city
    ? !displayLocation?.toLowerCase().includes(city.toLowerCase())
    : false;

  // Preload image into browser cache eagerly
  useEffect(() => {
    if (typeof window !== "undefined" && image) {
      const img = new Image();
      img.src = image;
    }
  }, [image]);

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#061f3b]/8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div>
        <div className="relative h-56 overflow-hidden rounded-[2.2rem] bg-slate-100">
          <img
            src={image}
            alt={title}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(event) => {
              if (fallbackImage && event.currentTarget.src !== fallbackImage) {
                event.currentTarget.src = fallbackImage;
              }
            }}
          />
          {starRating ? (
            <span aria-label={`${starRating} star hotel`} className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-amber-700 shadow-sm backdrop-blur">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              {starRating} Star
            </span>
          ) : (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-white/95 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-indigo-900 shadow-sm backdrop-blur">
              <Sparkles className="size-2.5 fill-indigo-500 text-indigo-500" />
              {ratingText}
            </span>
          )}
        </div>

        <div className="px-5 py-6 space-y-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#062b50] line-clamp-1 group-hover:text-[#087dbd] transition duration-300">
              {title}
            </h3>

            {displayLocation && (
              <div className="mt-1.5 space-y-0.5">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                  <MapPin className="size-3 text-zinc-400 shrink-0" />
                  {displayLocation}
                </p>
                {showCityLine && (
                  <p className="text-[10px] font-bold text-[#087dbd] ml-5 uppercase tracking-wide">
                    City: {city}
                  </p>
                )}
              </div>
            )}
          </div>

          <p className="text-xs leading-relaxed text-black/60 font-medium line-clamp-3">
            {description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-[#f1f7fc] px-2.5 py-1 text-[10px] font-bold text-[#2e5069] border border-[#e2ecf5]"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-[2.3rem]">
        <div>
          <p className="text-[9px] uppercase font-bold tracking-wider text-black/40">Tariff starts from</p>
          <p className="text-xl font-extrabold text-[#062b50] tracking-tight">
            {priceLabel ? (
              <>{priceLabel}</>
            ) : price != null ? (
              <>
                {formatPrice(price)}
                <span className="text-[10px] text-black/45 font-semibold"> / night</span>
              </>
            ) : (
              "MoU Entitlement"
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const bookingHref = buttonHref;
            const authData = typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null;
            if (!authData) {
              router.push(`/login?redirect=${encodeURIComponent(bookingHref)}`);
              return;
            }
            router.push(bookingHref);
          }}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-[#061f3b] hover:bg-[#087dbd] text-white px-5 py-3.5 font-bold text-xs shadow-md shadow-[#061f3b]/10 hover:shadow-[#087dbd]/25 hover:-translate-y-0.5 transition-all duration-300"
        >
          {buttonText}
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
