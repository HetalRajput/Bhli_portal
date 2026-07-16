"use client";

import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Smartphone, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length >= 10) {
      setStep(2);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    console.log('Registering with OTP:', otp.join(''));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`reg-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a170f] relative overflow-hidden p-4 pt-24 pb-12">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] opacity-[0.08] blur-[100px] bg-[#cda653]" />
      </div>
      
      <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#cda653]/10 border border-[#cda653]/30 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-[#cda653]" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
            {step === 1 ? 'Create Account' : 'Verify Mobile'}
          </h1>
          <p className="text-gray-400 mt-2 text-sm text-center">
            {step === 1 
              ? 'Register with your mobile number to unlock exclusive travel entitlements.'
              : `We've sent a 6-digit code to +91 ${mobile}`}
          </p>
        </div>

        {step === 1 ? (
          <form className="space-y-5" onSubmit={handleSendOtp}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300 ml-1">First Name</label>
                <input 
                  type="text" 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cda653]/50 transition-colors placeholder:text-gray-600"
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300 ml-1">Last Name</label>
                <input 
                  type="text" 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cda653]/50 transition-colors placeholder:text-gray-600"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-gray-500" />
                </div>
                <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-medium">+91</span>
                </div>
                <input 
                  type="tel" 
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-black/20 border border-white/10 rounded-xl pl-24 pr-4 py-3 text-white outline-none focus:border-[#cda653]/50 transition-colors placeholder:text-gray-600 font-medium tracking-wide"
                  placeholder="9999999999"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Service Number (Optional)</label>
              <input 
                type="text" 
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#cda653]/50 transition-colors placeholder:text-gray-600"
                placeholder="E.g., IC-XXXXX"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full mt-8 bg-gradient-to-r from-[#cda653] to-[#b38b3c] hover:from-[#b38b3c] hover:to-[#96722d] text-[#0a170f] font-semibold rounded-xl px-4 py-3.5 transition-all shadow-[0_0_20px_rgba(205,166,83,0.2)] hover:shadow-[0_0_25px_rgba(205,166,83,0.4)] flex items-center justify-center group"
            >
              Get OTP
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        ) : (
          <form className="space-y-8" onSubmit={handleVerifyOtp}>
            <div className="space-y-4 mt-4">
              <label className="text-sm font-medium text-gray-300 ml-1 flex items-center justify-center gap-2">
                <KeyRound className="w-4 h-4 text-[#cda653]" />
                Enter 6-digit OTP
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`reg-otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && index > 0) {
                        const prevInput = document.getElementById(`reg-otp-${index - 1}`);
                        prevInput?.focus();
                      }
                    }}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center bg-black/20 border border-white/10 rounded-xl text-xl text-white outline-none focus:border-[#cda653]/50 transition-colors focus:bg-black/40 font-semibold"
                    required
                  />
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#cda653] to-[#b38b3c] hover:from-[#b38b3c] hover:to-[#96722d] text-[#0a170f] font-semibold rounded-xl px-4 py-3.5 transition-all shadow-[0_0_20px_rgba(205,166,83,0.2)] hover:shadow-[0_0_25px_rgba(205,166,83,0.4)] flex items-center justify-center group"
              >
                Verify & Create Account
              </button>
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Back to Details
              </button>
            </div>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account? <Link href="/login" className="text-[#cda653] hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
