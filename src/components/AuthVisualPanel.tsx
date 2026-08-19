"use client";

import { useEffect, useState } from "react";
import { Building2, Car, ChevronLeft, ChevronRight, Plane } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    title: "Premium Hotel Stays",
    copy: "Handpicked comfort for every journey.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
    icon: Building2,
  },
  {
    title: "Flights Made Simple",
    copy: "Smooth bookings to destinations worldwide.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85",
    icon: Plane,
  },
  {
    title: "Reliable Taxi Service",
    copy: "Comfortable rides whenever you need them.",
    image: "https://images.unsplash.com/photo-1638933807150-93e93292dbf0?auto=format&fit=crop&w=1200&q=85",
    icon: Car,
  },
];

export default function AuthVisualPanel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const move = (amount: number) => setActive((current) => (current + amount + slides.length) % slides.length);
  const Icon = slides[active].icon;

  return <aside className="auth-visual" aria-label="Travel services carousel">
    {slides.map((slide, index) => <div key={slide.title} className={`auth-travel-slide ${index === active ? "is-active" : ""}`} style={{ backgroundImage: `url("${slide.image}")` }} aria-hidden={index !== active} />)}
    <div className="auth-travel-overlay" />
    <div className="auth-travel-glow auth-travel-glow-one" />
    <div className="auth-travel-glow auth-travel-glow-two" />
    <div className="auth-travel-brand">
      <Image src="/booking-hospitality-logo-transparent.png" alt="Booking Hospitality" width={220} height={42} priority />
    </div>
    <div className="auth-travel-copy" key={active}>
      <div className="auth-travel-icon"><Icon size={24} /></div>
      <p>Explore with confidence</p>
      <h2>{slides[active].title}</h2>
      <span>{slides[active].copy}</span>
    </div>
    <div className="auth-carousel-controls">
      <button type="button" onClick={() => move(-1)} aria-label="Previous slide"><ChevronLeft size={18} /></button>
      <div className="auth-carousel-dots">{slides.map((slide, index) => <button key={slide.title} type="button" className={index === active ? "is-active" : ""} onClick={() => setActive(index)} aria-label={`Show ${slide.title}`} />)}</div>
      <button type="button" onClick={() => move(1)} aria-label="Next slide"><ChevronRight size={18} /></button>
    </div>
  </aside>;
}
