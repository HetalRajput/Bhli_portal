import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import GalleryBrowser from "@/components/GalleryBrowser";
import { cmsService } from "@/lib/api/cms";

export default async function AboutGalleryCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [albums, categories] = await Promise.all([cmsService.getGallery(), cmsService.getGalleryCategories()]);
  const category = categories.find(item => item.slug === slug);
  const filtered = albums.filter(album => album.is_active && album.category_slug === slug).sort((a,b)=>a.display_order-b.display_order);
  return <div className="min-h-screen bg-[#051b33] text-white"><section className="mx-auto max-w-7xl px-5 pb-24 pt-16 lg:px-8"><Link href="/about-us" className="inline-flex items-center gap-2 text-sm font-bold text-[#13a5d8] hover:text-white"><ArrowLeft className="size-4"/>Back to About Us</Link><p className="mt-10 flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-[#13a5d8]"><Camera className="size-4"/>About Us · Gallery category</p><h1 className="mt-5 font-serif text-5xl md:text-7xl">{category?.name||"Gallery"}</h1><p className="mt-4 max-w-2xl text-white/50">Choose an album to open its photographs and complete details.</p><GalleryBrowser albums={filtered} categories={[]}/></section></div>;
}
