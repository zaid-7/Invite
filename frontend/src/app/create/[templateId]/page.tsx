'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Template } from '@/types/template';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChevronRight, ChevronLeft, Sparkles, Plus, Trash2, Calendar, LayoutGrid, Music, HelpCircle, Lock, Smartphone, Mail, ShieldCheck } from 'lucide-react';


export default function BuilderPage({ params }: { params: Promise<{ templateId: string }> }) {
  const router = useRouter();
  const { templateId } = use(params);

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  // Steps: 1 = Names, 2 = Events, 3 = Music, 4 = Review & Generate
  const [step, setStep] = useState(1);

  // Form State
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [groomParents, setGroomParents] = useState('');
  const [brideParents, setBrideParents] = useState('');
  const [welcomeQuote, setWelcomeQuote] = useState('');
  const [events, setEvents] = useState<{ id: number; name: string; date: string; time: string; venue: string; address: string }[]>([]);
  const [musicUrl, setMusicUrl] = useState('');

  // Auth gate modal triggers
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [authStage, setAuthStage] = useState<'INPUT' | 'OTP'>('INPUT');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Submission indicator
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadTemplate() {
      try {
        const res = await api.getTemplate(templateId);
        if (res.status === 'success') {
          setTemplate(res.template);
          
          // Seed defaults from schema
          const fields = res.template.schemaJson.fields;
          const groom = fields.find((f: any) => f.name === 'groomName')?.defaultValue || '';
          const bride = fields.find((f: any) => f.name === 'brideName')?.defaultValue || '';
          const gParents = fields.find((f: any) => f.name === 'groomParents')?.defaultValue || '';
          const bParents = fields.find((f: any) => f.name === 'brideParents')?.defaultValue || '';
          const welcome = fields.find((f: any) => f.name === 'welcomeQuote')?.defaultValue || '';
          
          const defaultEvents = fields.find((f: any) => f.name === 'events')?.defaultValue || [];
          const music = fields.find((f: any) => f.name === 'musicUrl')?.defaultValue || '';

          setGroomName(groom);
          setBrideName(bride);
          setGroomParents(gParents);
          setBrideParents(bParents);
          setWelcomeQuote(welcome);
          setEvents(defaultEvents.map((ev: any, i: number) => ({ id: i, ...ev })));
          setMusicUrl(music);
        } else {
          setErrorText('Template scheme could not be decoded.');
        }
      } catch (err) {
        setErrorText('Failed to pull template schemas.');
      } finally {
        setLoading(false);
      }
    }
    loadTemplate();
  }, [templateId]);

  const addEvent = () => {
    setEvents([
      ...events,
      {
        id: Date.now(),
        name: 'New Ceremony',
        date: new Date().toISOString().split('T')[0],
        time: '07:00 PM',
        venue: 'Grand Banquet Hall',
        address: '100 Road, City',
      },
    ]);
  };

  const removeEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const updateEventValue = (id: number, key: string, val: string) => {
    setEvents(
      events.map(ev => {
        if (ev.id === id) {
          return { ...ev, [key]: val };
        }
        return ev;
      })
    );
  };

  const handleGeneratePreviewTrigger = async () => {
    // Check auth first
    const token = localStorage.getItem('mandap_token');
    if (!token) {
      setAuthStage('INPUT');
      setAuthError('');
      setPhone('');
      setEmail('');
      setOtpCode('');
      setShowAuthModal(true);
      return;
    }

    // Auth matches, run generation
    await submitPreview();
  };

  const submitPreview = async () => {
    setSubmitting(true);
    try {
      const formData = {
        groomName,
        brideName,
        groomParents,
        brideParents,
        welcomeQuote,
        events: events.map(({ id, ...rest }) => rest), // chop local react ID
        musicUrl,
      };

      const res = await api.createPreview(templateId, formData);
      if (res.status === 'success') {
        router.push(`/preview/${res.preview.token}`);
      } else if (res.code === 'USER_NOT_FOUND') {
        api.logout();
        alert('Your login session is invalid or has expired. Please verify your phone or email to continue.');
        setAuthStage('INPUT');
        setAuthError('');
        setPhone('');
        setEmail('');
        setOtpCode('');
        setShowAuthModal(true);
      } else {
        alert(res.message || 'Problems generating preview.');
      }
    } catch (err) {
      alert('Error connecting to Server API.');
    } finally {
      setSubmitting(false);
    }
  };

  // Auth helper modal actions
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const payloadPhone = authMethod === 'phone' ? phone : undefined;
      const payloadEmail = authMethod === 'email' ? email : undefined;

      const res = await api.sendOtp(payloadPhone, payloadEmail);
      if (res.status === 'success') {
        setAuthStage('OTP');
      } else {
        setAuthError(res.message);
      }
    } catch (err) {
      setAuthError('Connection failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const payloadPhone = authMethod === 'phone' ? phone : null;
      const payloadEmail = authMethod === 'email' ? email : null;

      const res = await api.verifyOtp(payloadPhone, payloadEmail, otpCode);
      if (res.status === 'success') {
        setShowAuthModal(false);
        // Continue processing
        await submitPreview();
      } else {
        setAuthError(res.message || 'Verification code is invalid.');
      }
    } catch (err) {
      setAuthError('Handshake failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const stepLabels = ['Names', 'Events', 'Music', 'Review'];

  /* ─── Shared input style ─── */
  const inputCls = "w-full bg-white border border-hairline py-2.5 px-3.5 text-ink placeholder-muted-soft focus:outline-none focus:border-ink focus:border-2 text-sm";
  const inputStyle = { borderRadius: 8, height: 44 };
  const labelCls = "block text-sm font-medium text-ink mb-1.5";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-muted animate-pulse">Initializing Builder Workspace...</p>
      </div>
    );
  }

  if (errorText || !template) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground items-center justify-center py-20 px-4">
        <div className="text-center p-8 bg-red-50 border border-red-200 max-w-sm" style={{ borderRadius: 14 }}>
          <span className="text-error block text-lg font-semibold mb-2">Builder Error</span>
          <span className="text-sm text-muted" style={{ fontWeight: 400 }}>{errorText || 'Template missing.'}</span>
          <Link href="/browse" className="block mt-6 text-sm bg-primary text-on-primary py-2.5 px-5 font-medium" style={{ borderRadius: 8 }}>Return to browse</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-soft text-foreground">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
        {/* Step Indicator Header */}
        <div className="mb-10 text-center">
          <span
            className="inline-block text-xs bg-primary text-on-primary font-medium px-4 py-1.5 mb-4"
            style={{ borderRadius: 9999 }}
          >
            {template.name}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-ink">Invitation Builder</h1>
          
          <div className="flex justify-between items-center max-w-md mx-auto mt-8 relative select-none">
            <div className="absolute left-0 right-0 h-[2px] bg-hairline top-1/2 -translate-y-1/2 z-0" />
            <div
              className="absolute left-0 h-[2px] bg-primary top-1/2 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
            {[1, 2, 3, 4].map(s => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-semibold z-10 transition-all cursor-pointer ${
                  step >= s
                    ? 'bg-primary text-on-primary border-primary'
                    : 'bg-white text-muted border-hairline'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto text-xs font-medium text-muted mt-2.5 px-1">
            {stepLabels.map(l => <span key={l}>{l}</span>)}
          </div>
        </div>

        {/* Builder Steps Container */}
        <div
          className="bg-white border border-hairline p-6 md:p-8 relative"
          style={{ borderRadius: 14 }}
        >
          {/* STEP 1: Couple Names */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-ink border-b border-hairline pb-3 mb-1 flex items-center gap-2">
                <LayoutGrid size={18} className="text-primary" /> Couple &amp; Parents Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Groom&apos;s Name</label>
                  <input
                    type="text"
                    value={groomName}
                    onChange={e => setGroomName(e.target.value)}
                    required
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelCls}>Bride&apos;s Name</label>
                  <input
                    type="text"
                    value={brideName}
                    onChange={e => setBrideName(e.target.value)}
                    required
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelCls}>Groom&apos;s Parents <span className="text-muted font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    value={groomParents}
                    onChange={e => setGroomParents(e.target.value)}
                    placeholder="e.g. Mr. & Mrs. Sharma"
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelCls}>Bride&apos;s Parents <span className="text-muted font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    value={brideParents}
                    onChange={e => setBrideParents(e.target.value)}
                    placeholder="e.g. Mr. & Mrs. Patel"
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Card Welcome Quote</label>
                  <textarea
                    rows={2}
                    value={welcomeQuote}
                    onChange={e => setWelcomeQuote(e.target.value)}
                    required
                    className="w-full bg-white border border-hairline py-2.5 px-3.5 text-ink placeholder-muted-soft focus:outline-none focus:border-ink focus:border-2 text-sm leading-relaxed"
                    style={{ borderRadius: 8 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Event timelines */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-hairline pb-3 mb-1">
                <h2 className="text-xl font-semibold text-ink flex items-center gap-2">
                  <Calendar size={18} className="text-primary" /> Timeline Ceremonies
                </h2>
                <button
                  type="button"
                  onClick={addEvent}
                  className="bg-surface-soft hover:bg-surface-strong border border-hairline text-ink text-sm font-medium py-2 px-4 flex items-center gap-1.5 cursor-pointer transition-colors"
                  style={{ borderRadius: 8 }}
                >
                  <Plus size={15} /> Add Event
                </button>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-12 bg-surface-soft border border-hairline text-muted text-sm" style={{ borderRadius: 14, fontWeight: 400 }}>
                  No events added. Click &quot;Add Event&quot; to record a ceremony.
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {events.map((ev, index) => (
                    <div
                      key={ev.id}
                      className="border border-hairline p-5 bg-white relative flex flex-col gap-4"
                      style={{ borderRadius: 14 }}
                    >
                      <button
                        type="button"
                        onClick={() => removeEvent(ev.id)}
                        className="absolute top-4 right-4 text-error hover:text-error/80 cursor-pointer p-1.5 hover:bg-red-50 transition-colors"
                        title="Delete Ceremony"
                        style={{ borderRadius: 8 }}
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="text-xs font-semibold text-muted uppercase tracking-wider">
                        Ceremony #{index + 1}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-0.5">
                        <div className="md:col-span-3">
                          <label className={labelCls}>Event Name</label>
                          <input
                            type="text"
                            required
                            value={ev.name}
                            onChange={e => updateEventValue(ev.id, 'name', e.target.value)}
                            className={inputCls}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Date</label>
                          <input
                            type="date"
                            required
                            value={ev.date}
                            onChange={e => updateEventValue(ev.id, 'date', e.target.value)}
                            className={inputCls}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Time</label>
                          <input
                            type="text"
                            required
                            value={ev.time}
                            onChange={e => updateEventValue(ev.id, 'time', e.target.value)}
                            placeholder="e.g. 05:00 PM onwards"
                            className={inputCls}
                            style={inputStyle}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className={labelCls}>Venue Name</label>
                          <input
                            type="text"
                            required
                            value={ev.venue}
                            onChange={e => updateEventValue(ev.id, 'venue', e.target.value)}
                            className={inputCls}
                            style={inputStyle}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className={labelCls}>Address Details</label>
                          <input
                            type="text"
                            required
                            value={ev.address}
                            onChange={e => updateEventValue(ev.id, 'address', e.target.value)}
                            className={inputCls}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Music Selection */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-ink border-b border-hairline pb-3 mb-1 flex items-center gap-2">
                <Music size={18} className="text-primary" /> Background Soundtrack
              </h2>
              <div>
                <label className={labelCls}>Select Invitation Audio Track</label>
                <div className="flex flex-col gap-3 max-w-md">
                  {template.schemaJson.fields.find((f: any) => f.name === 'musicUrl')?.options?.map((opt: any) => (
                    <label
                      key={opt.value}
                      className={`flex items-center justify-between border p-4 cursor-pointer transition-all ${
                        musicUrl === opt.value
                          ? 'border-ink bg-surface-soft'
                          : 'border-hairline hover:border-border-strong bg-white'
                      }`}
                      style={{ borderRadius: 14 }}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="music"
                          checked={musicUrl === opt.value}
                          onChange={() => setMusicUrl(opt.value)}
                          className="accent-primary"
                        />
                        <span className="text-sm font-medium text-ink">{opt.label}</span>
                      </div>
                      <Music size={14} className="text-muted-soft" />
                    </label>
                  ))}
                  <label
                    className={`flex items-center justify-between border p-4 cursor-pointer transition-all ${
                      musicUrl === ''
                        ? 'border-ink bg-surface-soft'
                        : 'border-hairline hover:border-border-strong bg-white'
                    }`}
                    style={{ borderRadius: 14 }}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="music"
                        checked={musicUrl === ''}
                        onChange={() => setMusicUrl('')}
                        className="accent-primary"
                      />
                      <span className="text-sm font-medium text-ink">No Audio (Silent)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review and Generate */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-ink border-b border-hairline pb-3 mb-1 flex items-center gap-2">
                <Sparkles size={18} className="text-primary" /> Form Summary Review
              </h2>
              <div className="bg-surface-soft border border-hairline p-5 flex flex-col gap-4 text-sm text-body-text" style={{ borderRadius: 14 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted block font-medium mb-0.5">Groom &amp; Bride</span>
                    <strong className="text-ink text-base">{groomName} &amp; {brideName}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-muted block font-medium mb-0.5">Parents Names</span>
                    <span>{groomParents || '(Not set)'} &amp; {brideParents || '(Not set)'}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-xs text-muted block font-medium mb-0.5">Welcome Quote</span>
                    <span className="italic">&quot;{welcomeQuote}&quot;</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted block font-medium mb-0.5">Total Ceremonies Added</span>
                    <strong>{events.length} events scheduled</strong>
                  </div>
                  <div>
                    <span className="text-xs text-muted block font-medium mb-0.5">Selected Audio</span>
                    <strong>{musicUrl ? 'Custom Background Music Enabled' : 'Silent Card (No music)'}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex flex-col items-center">
                <p className="text-sm text-muted text-center max-w-sm mb-2 leading-relaxed" style={{ fontWeight: 400 }}>
                  Proceeding will generate a time-limited 30-minute watermarked preview. You can review all details and unlock via payment.
                </p>
              </div>
            </div>
          )}

          {/* Stepper Buttons Control panel */}
          <div className="flex justify-between items-center border-t border-hairline mt-8 pt-6 select-none">
            <button
              type="button"
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
              className="bg-white hover:bg-surface-soft text-ink border border-hairline disabled:opacity-30 disabled:pointer-events-none py-2.5 px-5 text-sm font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              style={{ borderRadius: 8 }}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-primary text-on-primary hover:bg-primary-active py-2.5 px-5 text-sm font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                style={{ borderRadius: 8 }}
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGeneratePreviewTrigger}
                disabled={submitting}
                className="bg-primary text-on-primary hover:bg-primary-active py-3 px-6 text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                style={{ borderRadius: 8 }}
              >
                {submitting ? 'Generating...' : 'Generate Preview'}
                <Sparkles size={15} />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Authentication Gate Modal (Overlay) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div
            className="w-full max-w-sm bg-white border border-hairline p-8 relative"
            style={{ borderRadius: 14, boxShadow: 'var(--shadow-card)' }}
          >
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-muted hover:text-ink p-1.5 hover:bg-surface-soft cursor-pointer transition-colors"
              style={{ borderRadius: 8 }}
            >
              ✕
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Lock size={20} />
              </div>
              <h3 className="text-lg font-bold text-ink">Preview Access</h3>
              <p className="text-sm text-muted text-center mt-1" style={{ fontWeight: 400 }}>
                Verify your account before generating previews
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-error text-sm text-center mb-4" style={{ borderRadius: 8 }}>
                {authError}
              </div>
            )}

            {authStage === 'INPUT' ? (
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                <div className="flex bg-surface-soft border border-hairline p-1" style={{ borderRadius: 8 }}>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('phone')}
                    className={`flex-1 py-2 text-sm font-medium transition-all cursor-pointer ${
                      authMethod === 'phone'
                        ? 'bg-white text-ink shadow-sm'
                        : 'text-muted'
                    }`}
                    style={{ borderRadius: 6 }}
                  >
                    Phone
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('email')}
                    className={`flex-1 py-2 text-sm font-medium transition-all cursor-pointer ${
                      authMethod === 'email'
                        ? 'bg-white text-ink shadow-sm'
                        : 'text-muted'
                    }`}
                    style={{ borderRadius: 6 }}
                  >
                    Email
                  </button>
                </div>

                {authMethod === 'phone' ? (
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                ) : (
                  <div>
                    <label className={labelCls}>Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-primary text-on-primary font-medium hover:bg-primary-active transition-colors py-3 mt-1 cursor-pointer disabled:opacity-50"
                  style={{ borderRadius: 8, height: 48 }}
                >
                  {authLoading ? 'Sending...' : 'Send OTP Verification'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleAuthVerify} className="flex flex-col gap-4">
                <div>
                  <label className={`${labelCls} text-center`}>
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    placeholder="6-digit PIN"
                    className="w-full bg-white border border-hairline py-3 text-center tracking-[0.3em] font-mono text-ink text-lg placeholder-muted-soft focus:outline-none focus:border-ink focus:border-2"
                    style={{ borderRadius: 8, height: 56 }}
                  />
                  <p className="text-xs text-muted text-center mt-2" style={{ fontWeight: 400 }}>
                    Check your backend terminal console log printout!
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-primary text-on-primary font-medium hover:bg-primary-active transition-colors py-3 cursor-pointer disabled:opacity-50"
                    style={{ borderRadius: 8, height: 48 }}
                  >
                    {authLoading ? 'Verifying...' : 'Verify & Generate Preview'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthStage('INPUT')}
                    className="text-center text-sm text-muted hover:text-ink py-2 transition-colors cursor-pointer font-medium"
                  >
                    Go Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
