'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Template } from '@/types/template';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChevronRight, ChevronLeft, Sparkles, Plus, Trash2, Calendar, LayoutGrid, Music, HelpCircle, Lock } from 'lucide-react';


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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground justify-center items-center">
        <div className="w-10 h-10 border-4 border-gold-warm border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wider text-maroon-deep uppercase animate-pulse">Initializing Builder Workspace...</p>
      </div>
    );
  }

  if (errorText || !template) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground items-center justify-center py-20 px-4">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-xl max-w-sm">
          <span className="text-red-600 block text-lg font-bold mb-2">Builder Error</span>
          <span className="text-sm text-gray-500">{errorText || 'Template missing.'}</span>
          <Link href="/browse" className="block mt-6 text-xs bg-maroon-deep text-ivory py-2 px-4 rounded font-bold uppercase">Return to browse</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
        {/* Step Indicator Header */}
        <div className="mb-10 text-center">
          <span className="text-[10px] bg-gold-warm text-maroon-deep font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
            {template.name}
          </span>
          <h1 className="text-serif text-3xl font-bold text-maroon-deep mt-4">INVITATION BUILDER</h1>
          
          <div className="flex justify-between items-center max-w-md mx-auto mt-6 relative select-none">
            <div className="absolute left-0 right-0 h-[2px] bg-gold-warm/25 top-1/2 -translate-y-1/2 z-0" />
            <div
              className="absolute left-0 h-[2px] bg-gold-warm top-1/2 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
            {[1, 2, 3, 4].map(s => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold z-10 transition-all cursor-pointer ${
                  step >= s
                    ? 'bg-gold-warm text-maroon-deep border-gold-warm'
                    : 'bg-background text-foreground/45 border-gold-warm/30'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex justify-between max-w-md mx-auto text-[10px] font-bold uppercase tracking-widest text-[#B58D3D] mt-2 px-1">
            <span>Names</span>
            <span>Events</span>
            <span>Music</span>
            <span>Review</span>
          </div>
        </div>

        {/* Builder Steps Container */}
        <div className="bg-maroon-deep text-ivory border border-gold-warm/25 rounded-xl shadow-2xl p-6 md:p-8 relative">
          <div className="absolute top-2 right-2 text-gold-warm text-lg opacity-35">𑁍</div>

          {/* STEP 1: Couple Names */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-serif text-xl font-bold text-gold-warm border-b border-gold-warm/25 pb-2 mb-2 flex items-center gap-2">
                <LayoutGrid size={18} /> Couple &amp; Parents Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gold-warm/80 text-xs uppercase mb-1 font-semibold">Groom's Name</label>
                  <input
                    type="text"
                    value={groomName}
                    onChange={e => setGroomName(e.target.value)}
                    required
                    className="w-full bg-maroon-deep/50 border border-gold-warm/30 rounded py-2 px-3 focus:outline-none focus:border-gold-warm text-gold-warm"
                  />
                </div>
                <div>
                  <label className="block text-gold-warm/80 text-xs uppercase mb-1 font-semibold">Bride's Name</label>
                  <input
                    type="text"
                    value={brideName}
                    onChange={e => setBrideName(e.target.value)}
                    required
                    className="w-full bg-maroon-deep/50 border border-gold-warm/30 rounded py-2 px-3 focus:outline-none focus:border-gold-warm text-gold-warm"
                  />
                </div>
                <div>
                  <label className="block text-gold-warm/70 text-xs uppercase mb-1 font-semibold">Groom's Parents (Optional)</label>
                  <input
                    type="text"
                    value={groomParents}
                    onChange={e => setGroomParents(e.target.value)}
                    placeholder="e.g. Mr. & Mrs. Sharma"
                    className="w-full bg-maroon-deep/50 border border-gold-warm/30 rounded py-2 px-3 focus:outline-none focus:border-gold-warm text-gold-warm"
                  />
                </div>
                <div>
                  <label className="block text-gold-warm/70 text-xs uppercase mb-1 font-semibold">Bride's Parents (Optional)</label>
                  <input
                    type="text"
                    value={brideParents}
                    onChange={e => setBrideParents(e.target.value)}
                    placeholder="e.g. Mr. & Mrs. Patel"
                    className="w-full bg-maroon-deep/50 border border-gold-warm/30 rounded py-2 px-3 focus:outline-none focus:border-gold-warm text-gold-warm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gold-warm/80 text-xs uppercase mb-1 font-semibold">Card Welcome Quote</label>
                  <textarea
                    rows={2}
                    value={welcomeQuote}
                    onChange={e => setWelcomeQuote(e.target.value)}
                    required
                    className="w-full bg-maroon-deep/50 border border-gold-warm/30 rounded py-2 px-3 focus:outline-none focus:border-gold-warm text-gold-warm text-sm leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Event timelines */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-gold-warm/25 pb-2 mb-2">
                <h2 className="text-serif text-xl font-bold text-gold-warm flex items-center gap-2">
                  <Calendar size={18} /> Timeline Ceremonies
                </h2>
                <button
                  type="button"
                  onClick={addEvent}
                  className="bg-gold-warm/15 hover:bg-gold-warm/25 border border-gold-warm/40 text-gold-warm text-xs font-bold py-1.5 px-3 rounded flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus size={14} /> Add Event
                </button>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-10 bg-maroon-deep/30 border border-gold-warm/15 rounded-lg text-gold-warm/60 text-xs">
                  No events added. Click "Add Event" to record a ceremony.
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {events.map((ev, index) => (
                    <div
                      key={ev.id}
                      className="border border-gold-warm/20 rounded-lg p-5 bg-maroon-deep/45 relative flex flex-col gap-4"
                    >
                      <button
                        type="button"
                        onClick={() => removeEvent(ev.id)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-500 cursor-pointer p-1.5 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete Ceremony"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="text-[10px] uppercase font-bold text-gold-warm/60">
                        Ceremony #{index + 1}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-0.5">
                        <div className="md:col-span-3">
                          <label className="block text-gold-warm/75 text-[10px] uppercase mb-1 font-semibold">Event Name</label>
                          <input
                            type="text"
                            required
                            value={ev.name}
                            onChange={e => updateEventValue(ev.id, 'name', e.target.value)}
                            className="w-full bg-maroon-deep/50 border border-gold-warm/30 rounded py-1.5 px-3 focus:outline-none focus:border-gold-warm text-gold-warm text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-gold-warm/75 text-[10px] uppercase mb-1 font-semibold">Date</label>
                          <input
                            type="date"
                            required
                            value={ev.date}
                            onChange={e => updateEventValue(ev.id, 'date', e.target.value)}
                            className="w-full bg-maroon-deep/50 border border-gold-warm/30 rounded py-1.5 px-3 focus:outline-none focus:border-gold-warm text-gold-warm text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-gold-warm/75 text-[10px] uppercase mb-1 font-semibold">Time</label>
                          <input
                            type="text"
                            required
                            value={ev.time}
                            onChange={e => updateEventValue(ev.id, 'time', e.target.value)}
                            placeholder="e.g. 05:00 PM onwards"
                            className="w-full bg-maroon-deep/50 border border-gold-warm/30 rounded py-1.5 px-3 focus:outline-none focus:border-gold-warm text-gold-warm text-xs"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-gold-warm/75 text-[10px] uppercase mb-1 font-semibold">Venue Name</label>
                          <input
                            type="text"
                            required
                            value={ev.venue}
                            onChange={e => updateEventValue(ev.id, 'venue', e.target.value)}
                            className="w-full bg-maroon-deep/50 border border-gold-warm/30 rounded py-1.5 px-3 focus:outline-none focus:border-gold-warm text-gold-warm text-xs"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-gold-warm/75 text-[10px] uppercase mb-1 font-semibold">Address Details</label>
                          <input
                            type="text"
                            required
                            value={ev.address}
                            onChange={e => updateEventValue(ev.id, 'address', e.target.value)}
                            className="w-full bg-maroon-deep/50 border border-gold-warm/30 rounded py-1.5 px-3 focus:outline-none focus:border-gold-warm text-gold-warm text-xs"
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
              <h2 className="text-serif text-xl font-bold text-gold-warm border-b border-gold-warm/25 pb-2 mb-2 flex items-center gap-2">
                <Music size={18} /> Background Soundtrack
              </h2>
              <div>
                <label className="block text-gold-warm/80 text-xs uppercase mb-2 font-semibold">Select Invitation Audio Track</label>
                <div className="flex flex-col gap-3 max-w-md">
                  {template.schemaJson.fields.find((f: any) => f.name === 'musicUrl')?.options?.map((opt: any) => (
                    <label
                      key={opt.value}
                      className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer transition-all ${
                        musicUrl === opt.value
                          ? 'border-gold-warm bg-gold-warm/10'
                          : 'border-gold-warm/20 hover:border-gold-warm/40 bg-maroon-deep/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="music"
                          checked={musicUrl === opt.value}
                          onChange={() => setMusicUrl(opt.value)}
                          className="text-gold-warm accent-gold-warm"
                        />
                        <span className="text-sm font-semibold">{opt.label}</span>
                      </div>
                      <Music size={14} className="text-gold-warm/50" />
                    </label>
                  ))}
                  <label
                    className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer transition-all ${
                      musicUrl === ''
                        ? 'border-gold-warm bg-gold-warm/10'
                        : 'border-gold-warm/20 hover:border-gold-warm/40 bg-maroon-deep/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="music"
                        checked={musicUrl === ''}
                        onChange={() => setMusicUrl('')}
                        className="text-gold-warm accent-gold-warm"
                      />
                      <span className="text-sm font-semibold">No Audio (Silent)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review and Generate */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-serif text-xl font-bold text-gold-warm border-b border-gold-warm/25 pb-2 mb-2 flex items-center gap-2">
                <Sparkles size={18} /> Form Summary Review
              </h2>
              <div className="bg-maroon-deep/50 border border-gold-warm/20 rounded-lg p-5 flex flex-col gap-4 text-xs md:text-sm text-gold-warm/90">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase text-gold-warm/50 block font-semibold">Groom &amp; Bride</span>
                    <strong className="text-gold-warm text-sm">{groomName} &amp; {brideName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-gold-warm/50 block font-semibold">Parents Names</span>
                    <span>{groomParents || '(Not set)'} &amp; {brideParents || '(Not set)'}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-[10px] uppercase text-gold-warm/50 block font-semibold">Welcome Quote</span>
                    <span className="italic">"{welcomeQuote}"</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-gold-warm/50 block font-semibold">Total Ceremonies Added</span>
                    <strong>{events.length} events scheduled</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-gold-warm/50 block font-semibold">Selected Audio</span>
                    <strong>{musicUrl ? 'Custom Background Music Enabled' : 'Silent Card (No music)'}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col items-center">
                <p className="text-xs text-gold-warm/75 text-center max-w-sm mb-4 leading-relaxed">
                  Proceeding will generate a time-limited 30-minute watermarked preview. You can review all details and unlock via payment.
                </p>
              </div>
            </div>
          )}

          {/* Stepper Buttons Control panel */}
          <div className="flex justify-between items-center border-t border-gold-warm/20 mt-8 pt-6 select-none">
            <button
              type="button"
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
              className="bg-gold-warm/10 hover:bg-gold-warm/15 text-gold-warm hover:text-gold-warm/90 border border-gold-warm/30 disabled:opacity-30 disabled:pointer-events-none rounded py-2 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-gold-warm text-maroon-deep hover:bg-gold-warm/95 rounded py-2 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-lg hover:scale-103 active:scale-97 transition-all"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGeneratePreviewTrigger}
                disabled={submitting}
                className="bg-gold-warm text-maroon-deep hover:bg-gold-warm/95 rounded py-2.5 px-6 text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer shadow-xl hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-50"
              >
                {submitting ? 'Generating...' : 'Generate Preview'}
                <Sparkles size={14} />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Authentication Gate Modal (Overlay) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-maroon-deep text-ivory border border-gold-warm/35 rounded-xl p-8 relative shadow-2xl">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-3 right-3 text-gold-warm/50 hover:text-gold-warm p-1 hover:bg-gold-warm/10 rounded cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-10 h-10 rounded-full border border-gold-warm/40 flex items-center justify-center text-gold-warm bg-maroon-deep mb-2.5">
                <Lock size={18} />
              </div>
              <h3 className="text-serif text-lg font-bold text-gold-warm">PREVIEW ACCESS GATE</h3>
              <p className="text-[10px] text-gold-warm/60 uppercase font-semibold tracking-wider text-center mt-1 px-4">
                Verify account before spawning transient previews
              </p>
            </div>

            {authError && (
              <div className="p-2.5 bg-red-950/65 border border-red-500/30 text-red-100 rounded text-[11px] text-center mb-4">
                {authError}
              </div>
            )}

            {authStage === 'INPUT' ? (
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4 text-xs">
                <div className="flex justify-center gap-2 bg-maroon-deep/30 border border-gold-warm/15 p-1 rounded-md mb-2">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('phone')}
                    className={`flex-1 py-1 rounded-[4px] text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                      authMethod === 'phone'
                        ? 'bg-gold-warm text-maroon-deep'
                        : 'text-gold-warm/60'
                    }`}
                  >
                    Phone
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('email')}
                    className={`flex-1 py-1 rounded-[4px] text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                      authMethod === 'email'
                        ? 'bg-gold-warm text-maroon-deep'
                        : 'text-gold-warm/60'
                    }`}
                  >
                    Email
                  </button>
                </div>

                {authMethod === 'phone' ? (
                  <div>
                    <label className="block text-gold-warm/75 text-[10px] uppercase mb-1 font-semibold">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-maroon-deep/45 border border-gold-warm/30 rounded py-2 px-3 focus:outline-none focus:border-gold-warm text-gold-warm text-xs"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-gold-warm/75 text-[10px] uppercase mb-1 font-semibold">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-maroon-deep/45 border border-gold-warm/30 rounded py-2 px-3 focus:outline-none focus:border-gold-warm text-gold-warm text-xs"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gold-warm text-maroon-deep font-sans font-bold hover:scale-102 active:scale-98 transition-transform py-2.5 rounded shadow-lg mt-2 cursor-pointer"
                >
                  {authLoading ? 'Sending...' : 'Send OTP Verification'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleAuthVerify} className="flex flex-col gap-4 text-xs">
                <div>
                  <label className="block text-gold-warm/75 text-[10px] uppercase mb-1 font-semibold text-center">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    placeholder="6-digit PIN"
                    className="w-full bg-maroon-deep/45 border border-gold-warm/30 rounded py-2.5 text-center tracking-[0.3em] font-mono text-gold-warm text-sm"
                  />
                  <p className="text-[10px] text-gold-warm/40 text-center mt-2">
                    Check your backend terminal console log printout!
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-gold-warm text-maroon-deep font-sans font-bold hover:scale-102 active:scale-98 transition-transform py-2.5 rounded shadow-lg cursor-pointer"
                  >
                    {authLoading ? 'Verifying...' : 'Verify & Generate Preview'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthStage('INPUT')}
                    className="text-center text-[9px] uppercase font-bold text-gold-warm/65 hover:text-gold-warm py-1.5 transition-colors cursor-pointer"
                  >
                    Click to go Back
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
