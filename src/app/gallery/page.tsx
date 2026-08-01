import { Camera } from "lucide-react";
import GalleryBrowser from "@/components/GalleryBrowser";
import { cmsService, type GalleryAlbum, type GalleryCategory } from "@/lib/api/cms";

export default async function Gallery() {
  let albums: GalleryAlbum[] = [];
  let categories: GalleryCategory[] = [];

  try {
    [albums, categories] = await Promise.all([cmsService.getGallery(), cmsService.getGalleryCategories()]);
  } catch (error) {
    console.error("Failed to fetch gallery:", error);
  }

  const activeAlbums = albums.filter((album) => album.is_active).sort((a, b) => a.display_order - b.display_order);
  const activeCategories = categories.filter((category) => category.is_active !== false).sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-[#051b33] text-white">
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-20 lg:px-8">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]"><Camera className="size-4" />Our gallery</p>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl md:text-5xl lg:text-7xl">A glimpse of where great journeys can lead.</h1>
          </div>
          <p className="max-w-sm leading-7 text-white/50">Select a category, then choose an album to explore its photographs and highlights.</p>
        </div>
        <GalleryBrowser albums={activeAlbums} categories={activeCategories} />
      </section>
    </div>
  );
}