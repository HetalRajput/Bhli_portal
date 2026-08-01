"use client";

import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import { useMemo, useState } from "react";
import type { GalleryAlbum, GalleryCategory } from "@/lib/api/cms";

type GalleryBrowserProps = {
  albums: GalleryAlbum[];
  categories: GalleryCategory[];
};

const tabClass = "rounded-full border px-6 py-2.5 text-sm font-semibold transition ";

export default function GalleryBrowser({ albums, categories }: GalleryBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const filteredAlbums = useMemo(() => selectedCategory === "all" ? albums : albums.filter((album) => album.category_slug === selectedCategory), [albums, selectedCategory]);

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Gallery categories">
        <button type="button" role="tab" aria-selected={selectedCategory === "all"} onClick={() => setSelectedCategory("all")} className={tabClass + (selectedCategory === "all" ? "border-[#13a5d8] bg-[#13a5d8] text-[#061f3b]" : "border-white/15 text-white/60 hover:border-[#13a5d8]/60 hover:text-white")}>All</button>
        {categories.map((category) => {
          const isActive = selectedCategory === category.slug;
          return <button key={category.id} type="button" role="tab" aria-selected={isActive} onClick={() => setSelectedCategory(category.slug)} className={tabClass + (isActive ? "border-[#13a5d8] bg-[#13a5d8] text-[#061f3b]" : "border-white/15 text-white/60 hover:border-[#13a5d8]/60 hover:text-white")}>{category.name}</button>;
        })}
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAlbums.map((album) => {
          const activeImages = (Array.isArray(album.images) ? album.images : []).filter((image) => image.is_active);
          const cover = activeImages.find((image) => image.is_cover) || activeImages[0];
          return (
            <Link key={album.id} href={"/gallery/" + encodeURIComponent(album.slug)} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-[#13a5d8]/50 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-[#13a5d8]/25">
              <div className="relative h-72 overflow-hidden bg-white/5">
                {cover ? <img src={cover.image} alt={cover.alt_text || album.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="grid h-full place-items-center"><Images className="size-12 text-white/20" /></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-[#051b33] via-transparent to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full bg-[#13a5d8] px-3 py-1 text-xs font-bold text-[#061f3b]">{activeImages.length} {activeImages.length === 1 ? "photo" : "photos"}</span>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-[#13a5d8]">{album.category_name}</p>
                <div className="mt-3 flex items-start justify-between gap-4"><h2 className="font-serif text-2xl">{album.title}</h2><ArrowRight className="mt-1 size-5 shrink-0 transition-transform group-hover:translate-x-1" /></div>
                {(album.subtitle || album.description) && <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">{album.subtitle || album.description}</p>}
              </div>
            </Link>
          );
        })}
        {filteredAlbums.length === 0 && <p className="col-span-full rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/55">No gallery albums are available in this category yet.</p>}
      </div>
    </>
  );
}