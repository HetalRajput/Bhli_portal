"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, ArrowRight, Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const EMAIL_REGEX = /^[^\s@]+@gmail\.com$/i;

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedSession = window.localStorage.getItem('bhli-auth');
    if (savedSession) {
      setIsAuthenticated(true);
      setStep(3);
      setStatusMessage('You are already signed in.');
    }
  }, []);

  const heading = useMemo(() => {
    if (step === 3) return 'Authenticated';
    return step === 1 ? 'Welcome Back' : 'Verify Gmail';
  }, [step]);

  const description = useMemo(() => {
    if (step === 1) {
      return 'Enter your Gmail address to receive a secure OTP.';
    }

    if (step === 2) {
      return `We sent a 6-digit code to ${email}`;
    }

    return 'Your session is now active.';
  }, [email, step]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!EMAIL_REGEX.test(email)) {
      setStatusMessage('Please enter a valid Gmail address.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to send OTP.');
      }

      setStep(2);
      setStatusMessage(data.message);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setStatusMessage('Please enter the full 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'OTP verification failed.');
      }

      window.localStorage.setItem('bhli-auth', JSON.stringify({ email, authenticatedAt: new Date().toISOString() }));
      setIsAuthenticated(true);
      setStep(3);
      setStatusMessage(data.message);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#061f3b] via-[#073b64] to-[#087fbe] relative overflow-hidden p-4">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] opacity-[0.08] blur-[100px] bg-[#13a5d8]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#13a5d8]/10 border border-[#13a5d8]/30 rounded-full flex items-center justify-center mb-4">
            {step === 3 ? <CheckCircle2 className="w-6 h-6 text-[#13a5d8]" /> : <ShieldCheck className="w-6 h-6 text-[#13a5d8]" />}
          </div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">{heading}</h1>
          <p className="text-white/60 mt-2 text-sm text-center">{description}</p>
        </div>

        {step === 1 ? (
          <form className="space-y-6" onSubmit={handleSendOtp}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 ml-1">Gmail Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#8dcfe9]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#031a30]/35 border border-white/15 rounded-xl pl-12 pr-4 py-3.5 text-white outline-none focus:border-[#13a5d8]/50 transition-colors placeholder:text-white/30 font-medium"
                  placeholder="yourname@gmail.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#13a5d8] to-[#087fbe] hover:from-[#087fbe] hover:to-[#075f99] text-white font-semibold rounded-xl px-4 py-3.5 transition-all shadow-[0_0_20px_rgba(19,165,216,0.25)] hover:shadow-[0_0_25px_rgba(19,165,216,0.45)] flex items-center justify-center group disabled:opacity-70"
            >
              {isLoading ? 'Sending OTP...' : 'Get OTP'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        ) : step === 2 ? (
          <form className="space-y-8" onSubmit={handleVerifyOtp}>
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/80 ml-1 flex items-center justify-center gap-2">
                <KeyRound className="w-4 h-4 text-[#13a5d8]" />
                Enter 6-digit OTP
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && index > 0) {
                        const prevInput = document.getElementById(`otp-${index - 1}`);
                        prevInput?.focus();
                      }
                    }}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center bg-[#031a30]/35 border border-white/15 rounded-xl text-xl text-white outline-none focus:border-[#13a5d8]/50 transition-colors focus:bg-[#031a30]/55 font-semibold"
                    required
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#13a5d8] to-[#087fbe] hover:from-[#087fbe] hover:to-[#075f99] text-white font-semibold rounded-xl px-4 py-3.5 transition-all shadow-[0_0_20px_rgba(19,165,216,0.25)] hover:shadow-[0_0_25px_rgba(19,165,216,0.45)] flex items-center justify-center group disabled:opacity-70"
              >
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Change Gmail Address
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-white/80">You are now signed in with {email}.</p>
            <Link href="/" className="inline-flex items-center justify-center text-[#13a5d8] hover:underline font-medium">
              Go to homepage
            </Link>
          </div>
        )}

        {statusMessage ? (
          <p className="mt-6 text-center text-sm text-white/80">{statusMessage}</p>
        ) : null}

        <p className="mt-8 text-center text-sm text-white/60">
          Don't have an account? <Link href="/register" className="text-[#13a5d8] hover:underline font-medium">Create one now</Link>
        </p>
      </div>
    </div>
  );
}

