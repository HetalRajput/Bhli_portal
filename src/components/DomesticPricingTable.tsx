import Link from "next/link";
import { Check, Users, Hotel, Bed, MapPin, Briefcase, ArrowRight } from "lucide-react";

export default function DomesticPricingTable() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      {/* Outer Container with Gradient Background */}
      <div className="overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl shadow-[#061f3b]/10 bg-gradient-to-br from-[#d4e6fa] via-[#e5ecfb] to-[#d6c7eb] p-6 sm:p-10 relative isolate">
        
        <h2 className="text-center font-serif text-3xl font-bold text-[#061f3b] mb-8 md:text-4xl">
          India Domestic Package
        </h2>

        {/* Pricing Table Grid */}
        <div className="bg-white/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/50 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/60">
            
            {/* Headers */}
            <div className="hidden md:block bg-[#b0d2f0]/50 p-4 font-bold text-[#061f3b] text-center text-lg">Details</div>
            <Link href="/services/holiday-packages/domestic/silver" className="group bg-[#b3cdf0] p-4 text-center transition hover:bg-[#9fc3ea] focus:outline-none focus:ring-4 focus:ring-inset focus:ring-white/60">
              <h3 className="font-bold text-[#061f3b] text-lg">Silver Package</h3>
              <p className="text-sm text-[#061f3b]/70">(Budget Hotel & Resort)</p>
              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#061f3b]/55">View hotels <ArrowRight className="size-3" /></span>
            </Link>
            <Link href="/services/holiday-packages/domestic/gold" className="group bg-[#f0d075] p-4 text-center transition hover:bg-[#e9c451] focus:outline-none focus:ring-4 focus:ring-inset focus:ring-white/60">
              <h3 className="font-bold text-[#061f3b] text-lg">Gold Package</h3>
              <p className="text-sm text-[#061f3b]/70">3-Star Hotel & Resort</p>
              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#061f3b]/55">View hotels <ArrowRight className="size-3" /></span>
            </Link>
            <Link href="/services/holiday-packages/domestic/platinum" className="group bg-[#2a4185] p-4 text-center text-white transition hover:bg-[#213672] focus:outline-none focus:ring-4 focus:ring-inset focus:ring-white/60">
              <h3 className="font-bold text-lg">Platinum Package</h3>
              <p className="text-sm text-white/70">4/5-Star Luxury Hotel & Resorts</p>
              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/60">View hotels <ArrowRight className="size-3" /></span>
            </Link>

            {/* Row 1: Guests */}
            <div className="hidden md:flex items-center gap-2 p-3 font-semibold text-[#061f3b] bg-white/30"><Users className="size-4" /> Guests</div>
            <div className="p-3 text-center text-sm font-medium text-[#061f3b] bg-[#c3daf2]/40">Couple + 1 Child <br/><span className="font-normal text-xs">(Below 6 Years)</span></div>
            <div className="p-3 text-center text-sm font-medium text-[#061f3b] bg-[#f2df9d]/40">Couple + 1 Child <br/><span className="font-normal text-xs">(Below 6 Years)</span></div>
            <div className="p-3 text-center text-sm font-medium text-[#061f3b] bg-[#c3daf2]/40">Couple + 1 Child <br/><span className="font-normal text-xs">(Below 6 Years)</span></div>

            {/* Row 2: Hotel Category */}
            <div className="hidden md:flex items-center gap-2 p-3 font-semibold text-[#061f3b] bg-white/20"><Hotel className="size-4" /> Hotel Category</div>
            <div className="p-3 text-center text-sm font-medium text-[#061f3b] bg-[#c3daf2]/30">Budget Hotels/Resorts</div>
            <div className="p-3 text-center text-sm font-medium text-[#061f3b] bg-[#f2df9d]/30">3-Star Hotels/Resorts</div>
            <div className="p-3 text-center text-sm font-medium text-[#061f3b] bg-[#c3daf2]/30">4/5-Star Luxury Hotels/Resorts</div>

            {/* Row 3: Comfort Level */}
            <div className="hidden md:flex items-center gap-2 p-3 font-semibold text-[#061f3b] bg-white/30"><Bed className="size-4" /> Comfort Level</div>
            <div className="p-3 flex justify-center bg-[#c3daf2]/40">
              <span className="bg-[#dcb96a] px-4 py-1 rounded-full text-xs font-bold text-white shadow-sm">Economy</span>
            </div>
            <div className="p-3 flex justify-center bg-[#f2df9d]/40">
              <span className="bg-[#785b2e] px-4 py-1 rounded-full text-xs font-bold text-white shadow-sm">Standard Comfort</span>
            </div>
            <div className="p-3 flex justify-center bg-[#c3daf2]/40">
              <span className="bg-[#1b2c61] px-4 py-1 rounded-full text-xs font-bold text-white shadow-sm">Premium Luxury</span>
            </div>

            {/* Row 4: 3N/4D Breakfast Only Header */}
            <div className="col-span-1 md:col-span-4 h-[1px] bg-white/80"></div>
            <div className="hidden md:flex items-center gap-2 p-3 font-bold text-white bg-[#5e77a6]"><Hotel className="size-4" /> 3N/4D - Breakfast Only</div>
            <div className="p-3 flex justify-center bg-[#89a1c9]">
              <span className="bg-[#122b5e] px-4 py-1 rounded-full text-sm font-bold text-white shadow-md">₹9,999 + Taxes</span>
            </div>
            <div className="p-3 flex justify-center bg-[#d1a338]">
              <span className="bg-[#6b501c] px-4 py-1 rounded-full text-sm font-bold text-white shadow-md">₹13,999 + Taxes</span>
            </div>
            <div className="p-3 flex justify-center bg-[#1e3475]">
              <span className="bg-[#0b1738] px-4 py-1 rounded-full text-sm font-bold text-white shadow-md">₹24,999 + Taxes</span>
            </div>

            {/* Row 5: Stay + Breakfast */}
            <div className="hidden md:flex items-center gap-2 p-3 font-semibold text-[#061f3b] bg-white/20"><Check className="size-4 text-green-600" /> Hotel Stay + Breakfast</div>
            <div className="p-3 text-center text-sm font-medium text-[#061f3b] bg-[#c3daf2]/30">Hotel Stay + Breakfast</div>
            <div className="p-3 text-center text-sm font-medium text-[#061f3b] bg-[#f2df9d]/30">Hotel Stay + Breakfast</div>
            <div className="p-3 text-center text-sm font-medium text-[#061f3b] bg-[#c3daf2]/30">Hotel Stay + Breakfast</div>

            {/* Row 6: 3N/4D Extended Header */}
            <div className="col-span-1 md:col-span-4 h-[1px] bg-white/80"></div>
            <div className="hidden md:flex items-center gap-2 p-3 font-bold text-white bg-[#5e77a6] text-[11px] lg:text-xs leading-tight"><Briefcase className="size-4 shrink-0" /> 3N/4D - Breakfast With Dinner + Transfers + Sightseeing</div>
            <div className="p-3 flex justify-center bg-[#89a1c9]">
              <span className="bg-[#122b5e] px-4 py-1 rounded-full text-sm font-bold text-white shadow-md">₹24,999 + Taxes</span>
            </div>
            <div className="p-3 flex justify-center bg-[#d1a338]">
              <span className="bg-[#6b501c] px-4 py-1 rounded-full text-sm font-bold text-white shadow-md">₹29,999 + Taxes</span>
            </div>
            <div className="p-3 flex justify-center bg-[#1e3475]">
              <span className="bg-[#0b1738] px-4 py-1 rounded-full text-sm font-bold text-white shadow-md">₹39,999 + Taxes</span>
            </div>

            {/* Row 7: Extended Includes */}
            <div className="hidden md:flex items-start gap-2 p-3 font-semibold text-[#061f3b] bg-white/30"><Check className="size-4 text-green-600 mt-1" /> Includes (Standard Plan)</div>
            <div className="p-3 text-xs xl:text-sm text-[#061f3b] bg-[#c3daf2]/40">
              <ul className="space-y-1">
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Breakfast + Dinner +</li>
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Airport/Railway Pickup &</li>
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Sightseeing</li>
              </ul>
            </div>
            <div className="p-3 text-xs xl:text-sm text-[#061f3b] bg-[#f2df9d]/40">
              <ul className="space-y-1">
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Breakfast + Dinner +</li>
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Airport/Railway Pickup & Drop</li>
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Sightseeing</li>
              </ul>
            </div>
            <div className="p-3 text-xs xl:text-sm text-[#061f3b] bg-[#c3daf2]/40">
              <ul className="space-y-1">
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Breakfast + Dinner +</li>
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Airport/Railway Pickup & Drop</li>
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Driver as Local Guide</li>
              </ul>
            </div>

            {/* Row 8: 7N/8D Header */}
            <div className="col-span-1 md:col-span-4 h-[1px] bg-white/80"></div>
            <div className="hidden md:flex items-center gap-2 p-3 font-bold text-white bg-[#5e77a6]"><MapPin className="size-4 shrink-0" /> 7N/8D Full Package</div>
            <div className="p-3 flex justify-center bg-[#89a1c9]">
              <span className="bg-[#122b5e] px-4 py-1 rounded-full text-sm font-bold text-white shadow-md">₹49,999 + Taxes</span>
            </div>
            <div className="p-3 flex justify-center bg-[#d1a338]">
              <span className="bg-[#6b501c] px-4 py-1 rounded-full text-sm font-bold text-white shadow-md">₹59,999 + Taxes</span>
            </div>
            <div className="p-3 flex justify-center bg-[#1e3475]">
              <span className="bg-[#0b1738] px-4 py-1 rounded-full text-sm font-bold text-white shadow-md">₹99,999 + Taxes</span>
            </div>

            {/* Row 9: 7N/8D Includes */}
            <div className="hidden md:flex items-start gap-2 p-3 font-semibold text-[#061f3b] bg-white/20"><Check className="size-4 text-green-600 mt-1" /> Includes (Extended Plan)</div>
            <div className="p-3 text-xs xl:text-sm text-[#061f3b] bg-[#c3daf2]/30">
              <ul className="space-y-1">
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Breakfast + Dinner +</li>
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Transfers + Sightseeing</li>
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Driver as Local Guide</li>
              </ul>
            </div>
            <div className="p-3 text-xs xl:text-sm text-[#061f3b] bg-[#f2df9d]/30">
              <ul className="space-y-1">
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Breakfast + Dinner +</li>
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Transfers + Sightseeing</li>
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Driver as Local Guide</li>
              </ul>
            </div>
            <div className="p-3 text-xs xl:text-sm text-[#061f3b] bg-[#c3daf2]/30">
              <ul className="space-y-1">
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Breakfast + Dinner +</li>
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Transfers + Sightseeing</li>
                <li className="flex gap-1.5 items-start"><Check className="size-4 shrink-0 text-blue-600 mt-0.5"/> Driver as Local Guide</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Footer Destination Message */}
        <div className="mt-8 text-center text-[#061f3b]">
          <p className="font-serif text-xl font-bold">Choose your preferred destination anywhere in India.</p>
          <p className="text-sm font-medium">Book today and enjoy a memorable holiday with your family.</p>
        </div>

        {/* Bottom Image Strip */}
        <div className="mt-5 flex h-24 sm:h-36 w-full gap-1 p-1 bg-white/40 rounded-xl overflow-hidden shadow-inner border border-white/60">
          <img src="https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Taj Mahal" className="h-full w-1/5 object-cover rounded-md" />
          <img src="https://images.pexels.com/photos/13106198/pexels-photo-13106198.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Hawa Mahal" className="h-full w-1/5 object-cover rounded-md" />
          <img src="https://images.pexels.com/photos/18244976/pexels-photo-18244976/free-photo-of-people-at-sunset-over-varanasi-india.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Varanasi" className="h-full w-1/5 object-cover rounded-md" />
          <img src="https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Kerala Backwaters" className="h-full w-1/5 object-cover rounded-md" />
          <img src="https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Gateway of India" className="h-full w-1/5 object-cover rounded-md" />
        </div>
      </div>
    </section>
  );
}
