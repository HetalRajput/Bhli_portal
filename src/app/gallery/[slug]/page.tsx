import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { notFound } from "next/navigation";
import { cmsService, type GalleryAlbum } from "@/lib/api/cms";

type GalleryDetailProps = { params: Promise<{ slug: string }> };

export default async function GalleryDetail({ params }: GalleryDetailProps) {
  const { slug } = await params;
  let album: GalleryAlbum | null = null;

  try {
    album = await cmsService.getGalleryAlbum(slug);
  } catch (error) {
    console.error(`Failed to fetch gallery album ${slug}:`, error);
  }

  if (!album || !album.is_active) notFound();

  const images = (Array.isArray(album.images) ? album.images : [])
    .filter((image) => image.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="min-h-screen bg-[#051b33] text-white">
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-8">
        <Link href="/gallery" className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"><ArrowLeft className="size-4" />Back to gallery</Link>
        <div className="mt-10 max-w-4xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]"><Camera className="size-4" />{album.category_name}</p>
          <h1 className="mt-5 font-serif text-4xl md:text-6xl">{album.title}</h1>
          {(album.subtitle || album.description) && <p className="mt-5 max-w-3xl text-base leading-8 text-white/60">{album.subtitle || album.description}</p>}
          <p className="mt-5 text-sm text-white/40">{images.length} {images.length === 1 ? "photograph" : "photographs"}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl auto-rows-[280px] grid-cols-1 gap-4 px-5 pb-24 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {images.map((image, index) => (
          <figure key={image.id} className={`group relative overflow-hidden rounded-3xl ${index === 0 && images.length > 3 ? "sm:row-span-2 lg:col-span-2" : ""}`}>
            <img src={image.image} alt={image.alt_text || image.title || album.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6">
              <small className="uppercase tracking-widest text-[#13a5d8]">{image.category_label || album.category_name}</small>
              <h2 className="mt-1 font-serif text-2xl">{image.title}</h2>
              {(image.caption || image.description) && <p className="mt-2 text-sm leading-6 text-white/65">{image.caption || image.description}</p>}
            </figcaption>
          </figure>
        ))}
        {images.length === 0 && <p className="col-span-full rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/55">This album does not have any images yet.</p>}
      </section>
    </div>
  );
}