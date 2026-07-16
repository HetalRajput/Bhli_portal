"use client";

import React, { useState, useEffect } from 'react';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide if scrolling down and scrolled past header height
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-serif font-bold text-xl tracking-tight text-primary flex items-center gap-3">
          <img 
            src="/emblem.svg" 
            alt="Ashoka Emblem" 
            className="h-10 w-auto drop-shadow-sm dark:invert" 
          />
          BHLI LLP
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <a href="/" className="hover:text-foreground transition-colors">Home</a>
          <a href="/services" className="hover:text-foreground transition-colors">Services</a>
          <a href="/defence-help-desk" className="hover:text-foreground transition-colors">Defence Desk</a>
          <a href="/about-us" className="hover:text-foreground transition-colors">About</a>
          <a href="/contact-us" className="hover:text-foreground transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="/login" className="text-sm font-medium hover:text-[#cda653] transition-colors">
            Log In
          </a>
          <a href="/register" className="text-sm font-medium bg-[#cda653] text-[#0a170f] px-5 py-2 rounded-full hover:bg-[#b38b3c] transition-colors shadow-sm">
            Register
          </a>
        </div>
      </div>
    </header>
  );
}
