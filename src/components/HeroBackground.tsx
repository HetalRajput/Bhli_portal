'use client';

import { useEffect, useState } from 'react';
import type { Banner } from '@/lib/api/cms';

export default function HeroBackground({ banners = [] }: { banners?: Banner[] }) {
  const slides = banners.map((banner) => ({ src: banner.image, alt: banner.title || 'BHLI travel banner' }));
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return <div className='absolute inset-0 -z-20 overflow-hidden bg-[#061f3b]' aria-label='Banner content unavailable'>
      <div className='absolute inset-0 animate-pulse bg-gradient-to-r from-[#041b33] via-[#0a4166] to-[#061f3b]' />
      <div className='absolute right-[8%] top-[16%] size-72 animate-pulse rounded-full bg-[#13a5d8]/10 blur-3xl' />
    </div>;
  }

  return <div className='absolute inset-0 -z-20 overflow-hidden bg-[#061f3b]'>
    {slides.map((slide, index) => <img key={`${slide.src}-${index}`} src={slide.src} alt={slide.alt} aria-hidden={index !== active} className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1400ms] ease-out ${index === active ? 'scale-105 opacity-45' : 'scale-100 opacity-0'}`} />)}
    <div className='absolute inset-0 bg-gradient-to-r from-[#041b33] via-[#041b33]/85 to-[#041b33]/15' />
    <div className='absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#061f3b]/45 to-transparent' />
    {slides.length > 1 && <div className='absolute bottom-8 right-8 hidden gap-2 md:flex'>
      {slides.map((_, index) => <button type='button' key={index} onClick={() => setActive(index)} aria-label={`Show banner ${index + 1}`} aria-current={index === active ? 'true' : undefined} className={`h-1 rounded-full transition-all duration-500 ${index === active ? 'w-8 bg-[#13a5d8]' : 'w-3 bg-white/35'}`} />)}
    </div>}
  </div>;
}
