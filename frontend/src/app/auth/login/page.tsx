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
    <div className="min-h-screen flex flex-col bg-surface-soft text-foreground">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div
          className="w-full max-w-md bg-white border border-hairline p-8 relative"
          style={{ borderRadius: 14, boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <KeyRound size={24} />
            </div>
            <h1 className="text-2xl font-bold text-ink">Welcome to Mandap</h1>
            <p className="text-sm text-muted mt-1.5" style={{ fontWeight: 400 }}>
              {stage === 'INPUT' ? 'Sign in to create your invitation' : 'Enter the verification code'}
            </p>
          </div>

          {errorMsg && (
            <div
              className="mb-6 p-3 bg-red-50 border border-red-200 text-error text-sm text-center font-medium"
              style={{ borderRadius: 8 }}
            >
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div
              className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-sm text-center"
              style={{ borderRadius: 8, fontWeight: 400 }}
            >
              {successMsg}
            </div>
          )}

          {stage === 'INPUT' ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
              {/* Phone/Email toggle */}
              <div className="flex bg-surface-soft border border-hairline p-1" style={{ borderRadius: 8 }}>
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                    authMethod === 'phone'
                      ? 'bg-white text-ink shadow-sm'
                      : 'text-muted hover:text-ink'
                  }`}
                  style={{ borderRadius: 6 }}
                >
                  Phone
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                    authMethod === 'email'
                      ? 'bg-white text-ink shadow-sm'
                      : 'text-muted hover:text-ink'
                  }`}
                  style={{ borderRadius: 6 }}
                >
                  Email
                </button>
              </div>

              {authMethod === 'phone' ? (
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Phone Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-soft">
                      <Smartphone size={18} />
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-white border border-hairline py-3 px-10 text-ink placeholder-muted-soft focus:outline-none focus:border-ink focus:border-2"
                      style={{ borderRadius: 8, height: 48 }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-soft">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white border border-hairline py-3 px-10 text-ink placeholder-muted-soft focus:outline-none focus:border-ink focus:border-2"
                      style={{ borderRadius: 8, height: 48 }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary font-medium hover:bg-primary-active transition-colors py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 mt-1 cursor-pointer"
                style={{ borderRadius: 8, height: 48 }}
              >
                {loading ? 'Sending...' : 'Get OTP Code'}
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5 text-center">
                  Verification Code (OTP)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-soft">
                    <ShieldCheck size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-white border border-hairline py-3 px-10 focus:outline-none focus:border-ink focus:border-2 text-center tracking-[0.3em] font-mono text-lg text-ink placeholder-muted-soft"
                    style={{ borderRadius: 8, height: 56 }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary font-medium hover:bg-primary-active transition-colors py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  style={{ borderRadius: 8, height: 48 }}
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setStage('INPUT')}
                  className="text-center text-sm text-muted hover:text-ink transition-colors py-2 cursor-pointer font-medium"
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
