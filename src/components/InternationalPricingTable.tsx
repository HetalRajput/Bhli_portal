import { Wallet, Gem, Crown, Plane, Bed, Award, HeadphonesIcon, Briefcase, MapPin } from "lucide-react";
import Link from "next/link";

export default function InternationalPricingTable() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      {/* Outer Container with Dark Blue Background */}
      <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-gradient-to-b from-[#02132b] to-[#061f40] p-6 sm:p-10 relative isolate">
        
        {/* Header section */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 right-0 hidden md:block">
            <div className="bg-[#0a1f3d] border border-[#d4b055] text-[#d4b055] p-3 text-center">
              <span className="block text-2xl font-bold">07</span>
              <span className="block text-xs uppercase tracking-widest">Slide</span>
            </div>
          </div>
          <h2 className="font-sans text-4xl md:text-5xl font-black text-white uppercase tracking-wider mb-2 drop-shadow-lg">
            Our Travel <span className="text-[#f5d76e]">Packages</span>
          </h2>
          <div className="flex items-center justify-center gap-3 text-white/90 text-sm md:text-base">
            <span className="text-[#d4b055]">✦</span>
            <span>Handpicked Destinations</span>
            <span className="text-[#d4b055]">•</span>
            <span>Best Prices</span>
            <span className="text-[#d4b055]">•</span>
            <span>Unforgettable Experiences</span>
            <span className="text-[#d4b055]">✦</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          
          {/* BUDGET ROW */}
          <div className="flex flex-col lg:flex-row rounded-xl overflow-hidden border-2 border-[#3c6b41] bg-black/20">
            {/* Left Badge */}
            <div className="bg-gradient-to-br from-[#1d4221] to-[#2c5430] w-full lg:w-64 p-5 flex flex-col justify-center border-r border-[#3c6b41]/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/10 p-2 rounded-full border border-white/20">
                  <Wallet className="size-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold uppercase leading-tight">Budget</h3>
                  <p className="text-[#a4d4a8] font-semibold uppercase text-sm">Packages</p>
                </div>
              </div>
              <div className="bg-[#427a47] rounded text-center py-2 shadow-inner border border-[#55945a]">
                <span className="text-white font-bold text-lg md:text-xl">₹50K – ₹90K</span>
              </div>
            </div>
            
            {/* Right Images */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 bg-white/5">
              {[
                { name: "Nepal", src: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=400" },
                { name: "Vietnam", src: "https://images.pexels.com/photos/3058827/pexels-photo-3058827.jpeg?auto=compress&cs=tinysrgb&w=400" },
                { name: "Thailand", src: "https://images.pexels.com/photos/1682748/pexels-photo-1682748.jpeg?auto=compress&cs=tinysrgb&w=400" },
                { name: "Sri Lanka", src: "https://images.pexels.com/photos/4038869/pexels-photo-4038869.jpeg?auto=compress&cs=tinysrgb&w=400" }
              ].map(img => (
                <div key={img.name} className="flex flex-col bg-white rounded-lg overflow-hidden h-full">
                  <div className="flex-1 relative min-h-[100px]">
                    <img src={img.src} alt={img.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="py-1 px-2 flex items-center gap-1 bg-white">
                    <MapPin className="size-3 text-green-700 shrink-0" />
                    <span className="text-[10px] sm:text-xs font-bold text-slate-800 uppercase truncate">{img.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MID-RANGE ROW */}
          <div className="flex flex-col lg:flex-row rounded-xl overflow-hidden border-2 border-[#2b54a3] bg-black/20">
            {/* Left Badge */}
            <div className="bg-gradient-to-br from-[#122e6e] to-[#1c3f8f] w-full lg:w-64 p-5 flex flex-col justify-center border-r border-[#2b54a3]/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/10 p-2 rounded-full border border-white/20">
                  <Gem className="size-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold uppercase leading-tight">Mid-Range</h3>
                  <p className="text-[#a4c2f5] font-semibold uppercase text-sm">Packages</p>
                </div>
              </div>
              <div className="bg-[#2a55a8] rounded text-center py-2 shadow-inner border border-[#406fc4]">
                <span className="text-white font-bold text-lg md:text-xl">₹90K – ₹1.5L</span>
              </div>
            </div>
            
            {/* Right Images */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 bg-white/5">
              {[
                { name: "Singapore", src: "https://images.pexels.com/photos/3152124/pexels-photo-3152124.jpeg?auto=compress&cs=tinysrgb&w=600" },
                { name: "Dubai", src: "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=600" },
                { name: "Bali", src: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=600" },
              ].map(img => (
                <div key={img.name} className="flex flex-col bg-white rounded-lg overflow-hidden h-full">
                  <div className="flex-1 relative min-h-[120px]">
                    <img src={img.src} alt={img.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="py-1.5 px-2 flex items-center gap-1 bg-white">
                    <MapPin className="size-3.5 text-blue-800 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase truncate">{img.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PREMIUM ROW */}
          <div className="flex flex-col lg:flex-row rounded-xl overflow-hidden border-2 border-[#542d82] bg-black/20">
            {/* Left Badge */}
            <div className="bg-gradient-to-br from-[#2a0e4a] to-[#40196e] w-full lg:w-64 p-5 flex flex-col justify-center border-r border-[#542d82]/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#d4b055]/20 p-2 rounded-full border border-[#d4b055]/50">
                  <Crown className="size-8 text-[#f5d76e]" />
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold uppercase leading-tight">Premium</h3>
                  <p className="text-[#d4b055] font-semibold uppercase text-sm">Packages</p>
                </div>
              </div>
              <div className="bg-[#5c249e] rounded text-center py-2 shadow-inner border border-[#763dc2]">
                <span className="text-white font-bold text-lg md:text-xl">₹2L – ₹5L+</span>
              </div>
            </div>
            
            {/* Right Images */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 bg-white/5">
              {[
                { name: "Maldives", src: "https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg?auto=compress&cs=tinysrgb&w=600" },
                { name: "Europe (France)", src: "https://images.pexels.com/photos/1125212/pexels-photo-1125212.jpeg?auto=compress&cs=tinysrgb&w=600" },
                { name: "Europe (Switzerland)", src: "https://images.pexels.com/photos/700871/pexels-photo-700871.jpeg?auto=compress&cs=tinysrgb&w=600" },
              ].map(img => (
                <div key={img.name} className="flex flex-col bg-white rounded-lg overflow-hidden h-full">
                  <div className="flex-1 relative min-h-[120px]">
                    <img src={img.src} alt={img.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="py-1.5 px-2 flex items-center gap-1 bg-white">
                    <MapPin className="size-3.5 text-purple-900 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase truncate">{img.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Features & CTA */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col xl:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4 md:gap-8">
            {[
              { icon: Plane, title: "Best Flights", subtitle: "Great Airlines" },
              { icon: Bed, title: "Handpicked Hotels", subtitle: "Comfortable Stays" },
              { icon: Award, title: "Best Price Guarantee", subtitle: "Value for Every Rupee" },
              { icon: HeadphonesIcon, title: "24/7 Customer Support", subtitle: "We're Here to Help" },
              { icon: Briefcase, title: "Customized Plans", subtitle: "Made Just for You" },
            ].map(feature => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="rounded-full border border-[#d4b055] p-2 text-[#d4b055]">
                  <feature.icon className="size-5" />
                </div>
                <div>
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider">{feature.title}</h4>
                  <p className="text-white/60 text-[10px]">{feature.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/services/holiday-packages?type=international&step=enquire" className="shrink-0 bg-gradient-to-r from-[#e3b844] to-[#f5d76e] text-black px-8 py-3.5 rounded-l-full rounded-tr-md flex items-center gap-3 hover:scale-105 transition shadow-[0_0_20px_rgba(245,215,110,0.3)]">
            <div className="text-right">
              <span className="block text-[11px] uppercase tracking-wider font-semibold">Let's Plan Your</span>
              <span className="block font-black text-xl">DREAM VACATION!</span>
            </div>
            <Plane className="size-6 rotate-45" />
          </Link>
          
        </div>
      </div>
    </section>
  );
}
