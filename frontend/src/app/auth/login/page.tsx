'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { KeyRound, Smartphone, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  // Stages: "INPUT" -> "OTP"
  const [stage, setStage] = useState<'INPUT' | 'OTP'>('INPUT');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payloadPhone = authMethod === 'phone' ? phone : undefined;
      const payloadEmail = authMethod === 'email' ? email : undefined;

      const res = await api.sendOtp(payloadPhone, payloadEmail);
      if (res.status === 'success') {
        setSuccessMsg(res.message);
        setStage('OTP');
      } else {
        setErrorMsg(res.message || 'Failed to send OTP. Please check input.');
      }
    } catch (err) {
      setErrorMsg('Cannot connect to Authenticator.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const payloadPhone = authMethod === 'phone' ? phone : null;
      const payloadEmail = authMethod === 'email' ? email : null;

      const res = await api.verifyOtp(payloadPhone, payloadEmail, otpCode);
      if (res.status === 'success') {
        router.push('/browse');
        router.refresh();
      } else {
        setErrorMsg(res.message || 'Incorrect OTP code.');
      }
    } catch (err) {
      setErrorMsg('Authentication verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-maroon-deep text-ivory border border-gold-warm/30 rounded-xl p-8 shadow-2xl relative">
          <div className="absolute top-2 right-2 text-gold-warm text-lg opacity-35">𑁍</div>
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-full border border-gold-warm/40 flex items-center justify-center text-gold-warm bg-maroon-deep mb-3">
              <KeyRound size={20} />
            </div>
            <h1 className="text-serif text-2xl font-bold tracking-widest text-gold-warm">MANDAP PORTAL</h1>
            <p className="text-xs text-gold-warm/60 mt-1 uppercase font-semibold tracking-wider">
              {stage === 'INPUT' ? 'Send OTP verification code' : 'Verify login credentials'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-900/60 border border-red-500/40 text-red-100 rounded text-xs text-center font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-3 bg-gold-warm/15 border border-gold-warm/40 text-gold-warm rounded text-xs text-center">
              {successMsg}
            </div>
          )}

          {stage === 'INPUT' ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-5 text-sm">
              <div className="flex justify-center gap-4 bg-maroon-deep/50 border border-gold-warm/15 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                    authMethod === 'phone'
                      ? 'bg-gold-warm text-maroon-deep'
                      : 'text-gold-warm/75 hover:bg-gold-warm/5'
                  }`}
                >
                  Phone
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                    authMethod === 'email'
                      ? 'bg-gold-warm text-maroon-deep'
                      : 'text-gold-warm/75 hover:bg-gold-warm/5'
                  }`}
                >
                  Email
                </button>
              </div>

              {authMethod === 'phone' ? (
                <div>
                  <label className="block text-gold-warm/75 text-xs uppercase mb-1 font-semibold">Phone Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gold-warm/60">
                      <Smartphone size={16} />
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-maroon-deep/40 border border-gold-warm/30 rounded py-2 px-9 focus:outline-none focus:border-gold-warm text-gold-warm placeholder-gold-warm/30"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-gold-warm/75 text-xs uppercase mb-1 font-semibold">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gold-warm/60">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-maroon-deep/40 border border-gold-warm/30 rounded py-2 px-9 focus:outline-none focus:border-gold-warm text-gold-warm placeholder-gold-warm/30"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold-warm text-maroon-deep font-sans font-bold hover:scale-102 active:scale-98 transition-transform py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer shadow-lg"
              >
                {loading ? 'Sending...' : 'Get OTP Code'}
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6 text-sm">
              <div>
                <label className="block text-gold-warm/75 text-xs uppercase mb-1 font-semibold text-center">
                  Verification Code (OTP)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gold-warm/60">
                    <ShieldCheck size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-maroon-deep/40 border border-gold-warm/30 rounded py-2.5 px-9 focus:outline-none focus:border-gold-warm text-center tracking-[0.3em] font-mono text-lg text-gold-warm placeholder-gold-warm/20"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold-warm text-maroon-deep font-sans font-bold hover:scale-102 active:scale-98 transition-transform py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStage('INPUT')}
                  className="text-center text-xs text-gold-warm/60 hover:text-gold-warm transition-colors py-1 cursor-pointer font-semibold uppercase tracking-wider"
                >
                  Change Account Method
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
