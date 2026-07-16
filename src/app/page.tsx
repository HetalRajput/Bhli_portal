"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2, ShieldCheck, Plane, Map, ChevronRight, Anchor, Crosshair, Star } from 'lucide-react';
import Image from 'next/image';
import DefenceLoader from '@/components/DefenceLoader';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 3.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <>
      <DefenceLoader />
      
      <div className="flex flex-col flex-1 w-full relative overflow-hidden bg-[#0a170f] selection:bg-[#cda653]/30">
        
        {/* Cinematic Abstract Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          
          {/* Sweeping Diagonal Flag Gradients */}
          <div className="absolute top-[-20%] right-[-10%] w-[120%] h-[120%] opacity-[0.12] transform -rotate-[15deg] blur-[120px] flex flex-col justify-center gap-12">
            <div className="h-40 w-full bg-[#f97316] mix-blend-screen" />
            <div className="h-40 w-full bg-[#ffffff] mix-blend-screen" />
            <div className="h-40 w-full bg-[#22c55e] mix-blend-screen" />
          </div>

          {/* Premium Glowing Ashoka Chakra (Bottom Left) */}
          <svg className="absolute -left-40 -bottom-40 w-[600px] h-[600px] opacity-40 text-[#cda653] animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
             <defs>
               <radialGradient id="chakraGlow" cx="50%" cy="50%" r="50%">
                 <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                 <stop offset="50%" stopColor="#cda653" stopOpacity="0.2" />
                 <stop offset="100%" stopColor="#0a170f" stopOpacity="0" />
               </radialGradient>
             </defs>
             <circle cx="50" cy="50" r="45" strokeOpacity="0.8" />
             <circle cx="50" cy="50" r="14" fill="url(#chakraGlow)" stroke="none" />
             <circle cx="50" cy="50" r="4" fill="#f59e0b" stroke="none" />
             {Array.from({ length: 24 }).map((_, i) => (
               <line key={i} x1="50" y1="50" x2={Number((50 + 45 * Math.cos((i * 15 * Math.PI) / 180)).toFixed(4))} y2={Number((50 + 45 * Math.sin((i * 15 * Math.PI) / 180)).toFixed(4))} strokeOpacity="0.6" />
             ))}
          </svg>

          {/* Animated Floating Particles */}
          {mounted && Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: "100vh", opacity: 0, x: `${Math.random() * 100}vw` }}
              animate={{ 
                y: "-20vh", 
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 15 + Math.random() * 20,
                repeat: Infinity,
                delay: Math.random() * 15,
                ease: "linear"
              }}
              className="absolute w-1.5 h-1.5 bg-[#cda653] rounded-full blur-[1px]"
            />
          ))}
        </div>
        
        {/* Ultra-Premium Hero Section */}
        <section className="relative z-10 w-full min-h-screen flex items-center justify-center pt-20 pb-16 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            
            {/* Left Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex flex-col items-start text-left lg:col-span-7 pt-12 lg:pt-0"
            >
              {/* Premium Pill Badge */}
              <motion.div variants={itemVariants} className="inline-flex items-center rounded-full border border-[#cda653]/60 bg-[#cda653]/10 px-5 py-2 text-xs tracking-[0.2em] font-semibold uppercase text-[#cda653] mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(205,166,83,0.3)] animate-pulse">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Exclusively For Armed Forces
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-6xl lg:text-[4.5rem] font-serif font-bold tracking-tight text-white leading-[1.15]"
              >
                Elite Hospitality for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cda653] via-[#ebd397] to-[#cda653]">Those Who Serve.</span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="mt-8 max-w-xl text-base md:text-lg text-gray-300 leading-relaxed font-sans font-light border-l-2 border-[#cda653]/60 pl-6"
              >
                Curated premium stays across India, rigorously aligned to your rank and entitlement. Experience seamless end-to-end coordination handled with the highest honour.
              </motion.p>
              
              {/* Premium Glass Search Bar */}
              <motion.div variants={itemVariants} className="mt-12 w-full max-w-2xl relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#cda653]/20 to-transparent rounded-2xl blur-md" />
                <div className="relative bg-[#ffffff]/5 border border-white/10 backdrop-blur-2xl rounded-2xl p-2 flex items-center shadow-2xl transition-all focus-within:bg-[#ffffff]/10 focus-within:border-[#cda653]/50">
                  <div className="pl-5 pr-3 text-[#cda653]">
                    <Search className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search city, hotel, or military station..." 
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-400 text-sm md:text-base py-3"
                  />
                  <button className="bg-gradient-to-r from-[#cda653] to-[#b38b3c] hover:from-[#b38b3c] hover:to-[#96722d] text-[#0a170f] font-semibold text-sm md:text-base rounded-xl px-8 py-3 transition-all shadow-[0_0_20px_rgba(205,166,83,0.3)] hover:shadow-[0_0_25px_rgba(205,166,83,0.5)] tracking-wide">
                    Book Now
                  </button>
                </div>

                {/* Service Branch Badges */}
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Serving:</span>
                  
                  <div className="flex items-center gap-2 text-gray-300 hover:text-[#cda653] transition-colors cursor-pointer group">
                    <Crosshair className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                    <span className="text-sm font-medium">Army</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 hover:text-[#cda653] transition-colors cursor-pointer group">
                    <Anchor className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                    <span className="text-sm font-medium">Navy</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 hover:text-[#cda653] transition-colors cursor-pointer group">
                    <Plane className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                    <span className="text-sm font-medium">Air Force</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Stately Image Collage */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 3.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full min-h-[500px] lg:col-span-5 hidden lg:block"
            >
              {/* Main Premium Image */}
              <div className="absolute right-0 top-0 w-4/5 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-20">
                <div className="absolute inset-0 bg-[#cda653]/10 mix-blend-overlay z-10" />
                <img 
                  src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                  alt="Premium Luxury Hotel"
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* Overlapping Secondary Image */}
              <div className="absolute left-0 bottom-12 w-3/5 aspect-square rounded-2xl overflow-hidden shadow-2xl border border-[#cda653]/40 z-30">
                <img 
                  src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Exquisite Resort"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <Star className="w-5 h-5 text-[#cda653] mb-2 fill-[#cda653]" />
                  <p className="text-white text-sm font-medium">Rank-Aligned Entitlements</p>
                </div>
              </div>
              
              {/* Decorative Accent */}
              <div className="absolute -right-8 -top-8 w-32 h-32 border border-[#cda653]/20 rounded-full z-10 animate-[spin_30s_linear_infinite]" />
              <div className="absolute -left-12 top-1/3 w-24 h-24 border border-[#cda653]/20 rounded-full z-10 animate-[spin_20s_linear_infinite]" />
            </motion.div>

          </div>
        </section>

        {/* Services Section */}
        <section className="relative z-10 w-full bg-[#f8f9fa] text-gray-900 py-24 px-4 md:px-8 lg:px-16 border-t border-[#cda653]/20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-4 text-[#0a170f]">Uncompromising Travel Standards</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">Curated specifically for government and defence personnel, ensuring dignity, absolute compliance, and unmatched comfort.</p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { title: "Hotel Reservations", icon: Building2, desc: "Premium stays aligned with your entitlement.", href: "/services/hotel-reservations" },
                { title: "Flight Bookings", icon: Plane, desc: "Seamless domestic & international travel.", href: "/services/flight-bookings" },
                { title: "Defence LTC", icon: ShieldCheck, desc: "Exclusive LTC & MoU benefits.", href: "/defence-help-desk/ltc-travel-packages" },
                { title: "Holiday Packages", icon: Map, desc: "Curated experiences for your getaway.", href: "/services/holiday-packages" },
              ].map((service, i) => (
                <motion.a 
                  href={service.href}
                  key={i} 
                  variants={itemVariants}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[#cda653]/50"
                >
                  <div>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#0a170f]/5 text-[#0a170f] group-hover:bg-[#0a170f] group-hover:text-[#cda653] transition-colors">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{service.desc}</p>
                  </div>
                  <div className="mt-6 flex items-center text-sm font-semibold text-[#cda653]">
                    Explore <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
