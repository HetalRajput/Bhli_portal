import Link from "next/link";
import { ArrowRight, Camera, Images } from "lucide-react";
import { cmsService, type GalleryAlbum } from "@/lib/api/cms";

export default async function Gallery() {
  let albums: GalleryAlbum[] = [];
  try {
    albums = await cmsService.getGallery();
  } catch (error) {
    console.error("Failed to fetch gallery:", error);
  }

  const activeAlbums = albums
    .filter((album) => album.is_active)
    .sort((a, b) => a.display_order - b.display_order);
  const categories = [...new Set(activeAlbums.map((album) => album.category_name).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#051b33] text-white">
      <section className="mx-auto max-w-7xl px-5 pb-14 pt-20 lg:px-8">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]"><Camera className="size-4" />Our gallery</p>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl md:text-5xl lg:text-7xl">A glimpse of where great journeys can lead.</h1>
          </div>
          <p className="max-w-sm leading-7 text-white/50">Select an album to explore its photographs and highlights.</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-2">
          {["All", ...categories].map((category, index) => (
            <span key={category} className={`rounded-full px-5 py-2 text-sm ${index === 0 ? "bg-[#13a5d8] font-bold text-[#061f3b]" : "border border-white/15 text-white/60"}`}>{category}</span>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {activeAlbums.map((album) => {
          const activeImages = (Array.isArray(album.images) ? album.images : []).filter((image) => image.is_active);
          const cover = activeImages.find((image) => image.is_cover) || activeImages[0];
          return (
            <Link key={album.id} href={`/gallery/${encodeURIComponent(album.slug)}`} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-[#13a5d8]/50 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-[#13a5d8]/25">
              <div className="relative h-72 overflow-hidden bg-white/5">
                {cover ? <img src={cover.image} alt={cover.alt_text || album.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="grid h-full place-items-center"><Images className="size-12 text-white/20" /></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-[#051b33] via-transparent to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full bg-[#13a5d8] px-3 py-1 text-xs font-bold text-[#061f3b]">{activeImages.length} {activeImages.length === 1 ? "photo" : "photos"}</span>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-[#13a5d8]">{album.category_name}</p>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <h2 className="font-serif text-2xl">{album.title}</h2>
                  <ArrowRight className="mt-1 size-5 shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
                {(album.subtitle || album.description) && <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">{album.subtitle || album.description}</p>}
              </div>
            </Link>
          );
        })}
        {activeAlbums.length === 0 && <p className="col-span-full rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/55">Gallery albums will appear here once they are available.</p>}
      </section>
    </div>
  );
}