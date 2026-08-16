'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, MapPin, Calendar, Users, Music, Globe, Sparkles, Heart } from 'lucide-react';
import { WatermarkOverlay } from '@/components/ui/WatermarkOverlay';

// Translations Dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: "Under the Grace of Almighty Allah, we invite you to celebrate the wedding of",
    and: "and",
    sonOf: "Son of",
    daughterOf: "Daughter of",
    countdownTitle: "Counting Down to Forever",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    timelineTitle: "Wedding Program Ceremony",
    scratchPrompt: "Scratch to Reveal Date",
    scratchSuccess: "Sparkling Celebration Awaits!",
    dressCodeTitle: "Dress Code & Attire Guidelines",
    dressDescription: "Groom's Family: Classic Royal / Tuxedo\nBride's Family: Elegant Pastel Traditional",
    accommodationTitle: "Accommodation & Stay Details",
    accommodationDesc: "Special rates secured at the Grand Palms Resort. Discount Code: WEDROYAL26",
    rsvpTitle: "RSVP Attendance & Guest Book",
    rsvpDone: "Jazakallah! Thank you for confirming.",
    rsvpNameLabel: "Your Good Name",
    rsvpNamePlaceholder: "Enter your name",
    rsvpAttendLabel: "Will you attend?",
    rsvpYes: "Joyfully Attending",
    rsvpNo: "Cannot Attend",
    rsvpGuestCount: "Number of Attendants",
    rsvpMessageLabel: "Wishes & Prayers",
    rsvpMessagePlaceholder: "Send your blessings",
    rsvpSubmit: "Register RSVP",
    rsvpLoading: "Registering...",
    musicOn: "Play Music",
    musicOff: "Mute",
    envelopeTap: "Tap to Open Envelope",
    envelopeFrom: "Invitation from the families",
  },
  ur: {
    welcome: "اللہ تعالیٰ کے فضل و کرم سے، ہم آپ کو شادی میں شرکت کی دعوت دیتے ہیں",
    and: "اور",
    sonOf: "فرزندِ ارجمند",
    daughterOf: "نورِ چشم",
    countdownTitle: "ہماری شادی کی الٹی گنتی",
    days: "دن",
    hours: "گھنٹے",
    minutes: "منٹ",
    seconds: "سیکنڈ",
    timelineTitle: "پروگرام کی تاریخ و وقت",
    scratchPrompt: "تاریخ دیکھنے کے لیے سکریچ کریں",
    scratchSuccess: "خوبصورت تقریب کا انتظار ہے!",
    dressCodeTitle: "لباس کی ہدایات",
    dressDescription: "شیروانی، سوٹ، یا روایتی خوبصورت لباس کو ترجیح دیں۔",
    accommodationTitle: "رہائش اور قیام کی تفصیلات",
    accommodationDesc: "مہمانوں کے لیے خصوصی ہوٹل پیکجز دستیاب ہیں۔ ڈسکاؤنٹ کوڈ: WEDROYAL26",
    rsvpTitle: "آر ایس وی پی (شرکت کی تصدیق)",
    rsvpDone: "جزاک اللہ! شرکت کی تصدیق کرنے کے لیے شکریہ۔",
    rsvpNameLabel: "آپ کا نام",
    rsvpNamePlaceholder: "اپنا نام لکھیں",
    rsvpAttendLabel: "کیا آپ تشریف لائیں گے؟",
    rsvpYes: "جی ہاں، ضرور آئیں گے",
    rsvpNo: "معذرت، شرکت سے قاصر ہیں",
    rsvpGuestCount: "مہمانوں کی تعداد",
    rsvpMessageLabel: "دعائیں اور نیک خواہشات",
    rsvpMessagePlaceholder: "اپنے پیغامات لکھیں",
    rsvpSubmit: "تصدیق بھیجیں",
    rsvpLoading: "بھجوا رہے ہیں...",
    musicOn: "موسیقی چلائیں",
    musicOff: "میوٹ کریں",
    envelopeTap: "لفافہ کھولنے کے لیے کلک کریں",
    envelopeFrom: "خاندانوں کی طرف سے دعوت نامہ",
  }
};

interface RoyalPrestigeProps {
  data: {
    groomName?: string;
    brideName?: string;
    groomParents?: string;
    brideParents?: string;
    welcomeQuote?: string;
    events?: { name: string; date: string; time: string; venue: string; address: string }[];
    musicUrl?: string;
  };
  mode: 'preview' | 'live';
  slug?: string;
}

export default function RoyalPrestige({ data, mode, slug }: RoyalPrestigeProps) {
  const {
    groomName = 'Veer',
    brideName = 'Zara',
    groomParents = 'Mr. & Mrs. Sharma',
    brideParents = 'Mr. & Mrs. Patel',
    welcomeQuote = 'Seeking the blessings of Lord Ganesha, we invite you to join us in celebrating our wedding.',
    events = [],
    musicUrl = '/music/shehnai.mp3',
  } = data;

  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scratchedComplete, setScratchedComplete] = useState(false);

  // Time remaining states
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // RSVP Form States
  const [guestName, setGuestName] = useState('');
  const [rsvpOption, setRsvpOption] = useState<'ATTENDING' | 'NOT_ATTENDING'>('ATTENDING');
  const [guestCount, setGuestCount] = useState(1);
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const t = translations[language];

  // Target event date: Sept 30, 2026
  useEffect(() => {
    setMounted(true);
    const targetDate = new Date('2026-09-30T10:00:00');

    const updateTimer = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(interval);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Set up Scratch Card Canvas
  useEffect(() => {
    if (!envelopeOpened || !mounted || scratchedComplete) return;

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill Gold Foil Background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#C9A84C');
      gradient.addColorStop(0.5, '#E5C060');
      gradient.addColorStop(1, '#B09038');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add elegant divider lines on gold foil
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Draw instructions
      ctx.fillStyle = '#5B1A1A';
      ctx.font = language === 'ur' ? 'bold 15px serif' : 'bold 14px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(t.scratchPrompt, canvas.width / 2, canvas.height / 2);
    }, 100);

    return () => clearTimeout(timer);
  }, [envelopeOpened, language, mounted, scratchedComplete]);

  // Audio trigger
  const handleStartMusic = () => {
    if (!audioRef.current && musicUrl) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
    }
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Audio playback blocked by user gestures:', err));
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      handleStartMusic();
    }
  };

  // Envelope Open trigger
  const handleOpenEnvelope = () => {
    setEnvelopeOpened(true);
    handleStartMusic();
  };

  // Canvas scratching logic
  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || scratchedComplete) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Check completion threshold
    checkScratchPercentage(canvas, ctx);
  };

  const checkScratchPercentage = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    const total = imgData.data.length / 4;

    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] === 0) {
        transparent++;
      }
    }

    const percent = (transparent / total) * 100;
    if (percent >= 45) {
      setScratchedComplete(true);
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    setRsvpLoading(true);

    try {
      const res = await fetch(`http://localhost:4000/api/invitations/${slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName,
          response: rsvpOption,
          guestCount: rsvpOption === 'ATTENDING' ? guestCount : 0,
          message: rsvpMessage,
        }),
      });

      const resData = await res.json();
      if (resData.status === 'success') {
        setRsvpDone(true);
      } else {
        alert(resData.message || 'Submission failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend api server.');
    } finally {
      setRsvpLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div 
      className={`min-h-screen bg-[#FDF8F7] relative flex flex-col items-center justify-start overflow-hidden px-4 md:px-6 py-8 ${
        language === 'ur' ? 'text-right' : 'text-left'
      }`}
      style={{
        backgroundImage: 'radial-gradient(rgba(201, 168, 76, 0.15) 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
      }}
      dir={language === 'ur' ? 'rtl' : 'ltr'}
    >
      {mode === 'preview' && <WatermarkOverlay />}

      {/* Persistent Controls Area */}
      <div className="fixed top-6 right-6 z-40 flex items-center gap-3">
        {/* Playback Control */}
        {envelopeOpened && (
          <button
            onClick={toggleMusic}
            className="p-3 bg-white/90 rounded-full border border-gold-warm/40 text-maroon-deep shadow-lg hover:scale-105 transition-all outline-none"
            aria-label="Toggle background music"
          >
            {isPlaying ? (
              <span className="flex items-center justify-center relative">
                <Square size={16} fill="var(--maroon-deep)" />
                <span className="absolute animate-ping w-full h-full rounded-full bg-gold-warm/25" />
              </span>
            ) : (
              <Play size={16} fill="var(--maroon-deep)" />
            )}
          </button>
        )}

        {/* Translation Switcher */}
        <button
          onClick={() => setLanguage(prev => prev === 'en' ? 'ur' : 'en')}
          className="px-4 py-2 bg-white/90 rounded-full border border-gold-warm/40 text-maroon-deep shadow-lg font-sans text-xs font-semibold hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Globe size={14} className="text-gold-warm" />
          <span>{language === 'en' ? 'اردو' : 'English'}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!envelopeOpened ? (
          /* ENVELOPE ENTRY VIEW */
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -200, scale: 0.9, transition: { duration: 0.8 } }}
            className="fixed inset-0 z-50 bg-[#FDF8F7] flex flex-col items-center justify-center p-6"
            style={{
              backgroundImage: 'radial-gradient(rgba(201, 168, 76, 0.15) 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px'
            }}
          >
            <div className="relative w-full max-w-lg aspect-[5/4] bg-white border-2 border-gold-warm/30 rounded-lg shadow-2xl flex flex-col items-center justify-center p-8 overflow-hidden select-none">
              
              {/* Envelope Flap Overlay Shadows */}
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-[#F2EAE4] to-transparent opacity-30 pointer-events-none" />
              
              {/* Top border decoration */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gold-warm/10 via-gold-warm/90 to-gold-warm/10" />

              <div className="text-center z-10 flex flex-col items-center gap-4">
                <Heart className="text-gold-warm animate-pulse w-8 h-8 fill-gold-warm/20" />
                <h3 className="font-sans text-[11px] uppercase tracking-[0.2em] text-maroon-deep/70 font-bold">
                  {t.envelopeFrom}
                </h3>
                <h1 className="font-script text-5xl md:text-6xl text-maroon-deep py-2">
                  {groomName} & {brideName}
                </h1>
                
                {/* Wax Seal Opener Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenEnvelope}
                  className="mt-6 w-20 h-20 rounded-full relative flex items-center justify-center cursor-pointer shadow-lg outline-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, #E5C365 0%, #C9A84C 60%, #9F7E24 100%)',
                    border: '3px solid rgba(255,255,255,0.2)'
                  }}
                >
                  {/* Decorative seal rings */}
                  <span className="absolute inset-2 border border-white/20 rounded-full" />
                  <span className="absolute inset-4 border border-dashed border-white/10 rounded-full" />
                  
                  {/* Outer glow aura */}
                  <span className="absolute inset-0 rounded-full animate-ping opacity-15 bg-gold-warm" />
                  
                  <span className="text-white font-serif font-bold text-lg select-none">V&Z</span>
                </motion.button>

                <p className="mt-4 font-sans text-xs text-maroon-deep/60 italic tracking-wider">
                  {t.envelopeTap}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* MAIN INVITATION CARD CONTENT */
          <motion.div
            key="main-card"
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 60 }}
            className="w-full max-w-xl bg-white border border-gold-warm/20 rounded-2xl shadow-xl overflow-hidden flex flex-col items-center relative z-25"
          >
            {/* Header / Hero starry theme */}
            <div className="w-full h-80 relative overflow-hidden bg-gradient-to-br from-[#0F1C2A] via-midnight-blue to-[#0E1520] flex flex-col items-center justify-center p-6 text-center select-none shrink-0 border-b border-gold-warm/25">
              
              {/* Starry shimmer nodes overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,168,76,0.15)_0%,transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(232,180,184,0.1)_0%,transparent_40%)]" />

              <div className="absolute top-12 left-10 w-1.5 h-1.5 rounded-full bg-gold-warm animate-ping" />
              <div className="absolute top-24 right-16 w-1 h-1 rounded-full bg-white opacity-40 animate-pulse" />
              <div className="absolute bottom-16 left-28 w-1 h-1 rounded-full bg-gold-warm opacity-30 animate-pulse" />

              {/* Calligraphy Monogram */}
              <div className="w-16 h-16 rounded-full border border-gold-warm/25 flex items-center justify-center mb-4 relative z-10 glass-dark">
                <span className="text-gold-warm font-serif text-lg tracking-widest pl-1 font-bold">V&Z</span>
              </div>

              {/* Romantic script couple names */}
              <h1 className="font-script text-6xl md:text-7xl text-gold-warm z-10 drop-shadow-md">
                {groomName} & {brideName}
              </h1>

              {/* Elegant scroll indicator decoration */}
              <div className="absolute bottom-4 flex justify-center w-full z-10 opacity-70">
                <span className="w-0.5 h-4 bg-gold-warm/40 animate-bounce rounded-full" />
              </div>
            </div>

            {/* Content Details Body packaging */}
            <div className="w-full py-12 px-6 md:px-10 flex flex-col items-center text-center gap-10">
              
              {/* Welcome text */}
              <div className="max-w-[400px]">
                <p className={`text-md italic text-serif text-maroon-deep ${
                  language === 'ur' ? 'font-urdu text-lg leading-relaxed' : 'leading-relaxed'
                }`}>
                  "{welcomeQuote}"
                </p>
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-warm/45 to-transparent mx-auto mt-6" />
              </div>

              {/* Parent Invitation Text */}
              <div className="flex flex-col gap-5 px-4">
                <p className={`text-xs uppercase tracking-[0.2em] font-sans font-semibold text-gray-500`}>
                  {t.welcome}
                </p>
                
                <div className="flex flex-col md:flex-row gap-6 items-center justify-center font-serif py-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] uppercase tracking-widest text-gold-warm/75 mb-1">{t.sonOf}</span>
                    <span className="font-semibold text-maroon-deep text-lg">{groomParents}</span>
                  </div>
                  
                  <span className="hidden md:block w-px h-8 bg-gold-warm/30" />
                  
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] uppercase tracking-widest text-gold-warm/75 mb-1">{t.daughterOf}</span>
                    <span className="font-semibold text-maroon-deep text-lg">{brideParents}</span>
                  </div>
                </div>

                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-warm/45 to-transparent mx-auto mt-3" />
              </div>

              {/* Gamified Scratch Card reveal of date */}
              <div className="flex flex-col items-center gap-4">
                <h4 className="font-serif text-maroon-deep text-md font-bold uppercase tracking-wider flex items-center gap-1.5 justify-center">
                  <Sparkles size={16} className="text-gold-warm" />
                  {t.countdownTitle}
                </h4>

                <div className="relative w-72 h-44 rounded-lg overflow-hidden border border-gold-warm/35 shadow-lg select-none bg-[#FCFAFA] flex flex-col justify-center items-center">
                  
                  {/* Revealed Content underneath */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="text-[10px] uppercase font-sans text-gold-warm font-semibold tracking-[0.2em] mb-1">
                      Save The Date
                    </span>
                    <div className="text-2xl font-bold font-serif text-maroon-deep border-y border-gold-warm/20 py-2 w-5/6">
                      September 30, 2026
                    </div>
                    <span className="text-[11px] text-gray-500 font-sans mt-2 italic tracking-wide">
                      {t.scratchSuccess}
                    </span>
                  </div>

                  {/* Foil canvas layer */}
                  {!scratchedComplete && (
                    <canvas
                      ref={canvasRef}
                      width={288}
                      height={176}
                      onMouseDown={(e) => { e.preventDefault(); handleScratch(e); }}
                      onMouseMove={(e) => { e.preventDefault(); handleScratch(e); }}
                      onTouchStart={(e) => { e.preventDefault(); handleScratch(e); }}
                      onTouchMove={(e) => { e.preventDefault(); handleScratch(e); }}
                      className="absolute inset-0 cursor-pointer touch-none z-10"
                    />
                  )}
                </div>
              </div>

              {/* Countdown Tickers box */}
              <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-sm w-full font-serif select-none mt-2">
                {[
                  { value: timeLeft.days, label: t.days },
                  { value: timeLeft.hours, label: t.hours },
                  { value: timeLeft.minutes, label: t.minutes },
                  { value: timeLeft.seconds, label: t.seconds }
                ].map((col, idx) => (
                  <div key={idx} className="bg-[#FAF3F0] rounded-xl py-3 border border-gold-warm/15 flex flex-col items-center shadow-inner">
                    <span className="text-2xl md:text-3xl font-extrabold text-maroon-deep tabular-nums">
                      {String(col.value).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-semibold text-gold-warm/95 tracking-wide uppercase mt-1">
                      {col.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-warm/20 to-transparent my-4" />

              {/* Timeline Sequence & Venue */}
              <div className="w-full flex flex-col items-center">
                <h4 className="font-serif text-maroon-deep text-lg font-bold uppercase tracking-wider mb-8 flex items-center justify-center gap-1.5">
                  <Calendar size={18} className="text-gold-warm" />
                  {t.timelineTitle}
                </h4>

                <div className="flex flex-col w-full text-left gap-8 pl-4 relative border-l border-dashed border-gold-warm/40 max-w-md">
                  {events.map((ev, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 * i }}
                      className="relative pl-6 pb-2"
                    >
                      {/* Timeline Bullets indicator dot */}
                      <span className="absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-gold-warm border-2 border-white shadow-md flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-maroon-deep inline-block" />
                      </span>

                      <div className="flex justify-between items-start gap-4">
                        <h5 className="font-serif font-bold text-md text-maroon-deep">
                          {ev.name}
                        </h5>
                        <span className="text-[10px] font-bold font-sans bg-gold-warm/10 text-gold-warm border border-gold-warm/15 px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 mt-0.5">
                          {ev.date}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 font-sans tracking-wide mt-1.5 flex items-center gap-1">
                        <span className="font-semibold text-maroon-deep/75">{ev.time}</span>
                      </div>

                      <div className="mt-2.5 p-3 rounded-lg bg-[#FAF6F0] border border-gold-warm/10 flex flex-col gap-1.5">
                        <span className="font-serif text-xs font-bold text-maroon-deep flex items-start gap-1">
                          <MapPin size={12} className="text-gold-warm shrink-0 mt-0.5" />
                          <span>{ev.venue}</span>
                        </span>
                        <span className="text-[11px] text-gray-500 pl-4">{ev.address}</span>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(ev.venue + ' ' + ev.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-gold-warm font-sans font-bold hover:underline pl-4 mt-1 flex items-center gap-1 select-none cursor-pointer"
                        >
                          View on Google Maps →
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-warm/20 to-transparent my-4" />

              {/* Guidelines Grid panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-center">
                
                {/* Dress code */}
                <div className="border border-gold-warm/20 rounded-xl p-5 bg-[#FAF6F0] flex flex-col items-center">
                  <h5 className="font-serif font-bold text-xs uppercase tracking-widest text-[#B09038] mb-3 flex items-center gap-1">
                    <Heart size={14} className="text-gold-warm shrink-0" />
                    {t.dressCodeTitle}
                  </h5>
                  <p className="text-xs text-gray-600 leading-relaxed font-sans whitespace-pre-line">
                    {t.dressDescription}
                  </p>
                </div>

                {/* Logistics / Accommodations */}
                <div className="border border-gold-warm/20 rounded-xl p-5 bg-[#FAF6F0] flex flex-col items-center">
                  <h5 className="font-serif font-bold text-xs uppercase tracking-widest text-[#B09038] mb-3 flex items-center gap-1">
                    <Users size={14} className="text-gold-warm shrink-0" />
                    {t.accommodationTitle}
                  </h5>
                  <p className="text-xs text-gray-600 leading-relaxed font-sans">
                    {t.accommodationDesc}
                  </p>
                </div>

              </div>

              {/* Interactive RSVP Form container */}
              {mode === 'live' && (
                <div className="w-full border-t border-gold-warm/25 pt-10 mt-4 text-left" dir="ltr">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Users className="text-gold-warm w-5 h-5" />
                    <h4 className="font-serif font-bold text-lg text-maroon-deep uppercase tracking-wider text-center">
                      {t.rsvpTitle}
                    </h4>
                  </div>

                  {rsvpDone ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-gold-warm/10 border border-gold-warm/30 rounded-xl p-6 text-center text-maroon-deep font-serif"
                    >
                      <span className="block font-bold text-lg mb-1">{t.rsvpDone}</span>
                      <span className="text-xs text-gray-500 font-sans">We look forward to celebrating with you!</span>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-4 text-xs md:text-sm font-sans text-gray-600">
                      <div>
                        <label className="block text-maroon-deep font-bold mb-1.5 uppercase text-[11px] tracking-wide">
                          {t.rsvpNameLabel}
                        </label>
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder={t.rsvpNamePlaceholder}
                          className="w-full bg-[#FCFAFA] border border-gold-warm/25 rounded-lg py-2.5 px-3 focus:outline-none focus:border-gold-warm text-maroon-deep font-serif italic text-sm placeholder:text-gray-400"
                        />
                      </div>

                      <div className="flex flex-col gap-2 mt-2">
                        <label className="block text-maroon-deep font-bold uppercase text-[11px] tracking-wide">
                          {t.rsvpAttendLabel}
                        </label>
                        <div className="flex gap-6 mt-1">
                          <label className="flex items-center gap-2 cursor-pointer font-medium font-serif text-sm text-maroon-deep">
                            <input
                              type="radio"
                              name="rsvp-choice"
                              checked={rsvpOption === 'ATTENDING'}
                              onChange={() => setRsvpOption('ATTENDING')}
                              className="accent-maroon-deep"
                            />
                            <span>{t.rsvpYes}</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer font-medium font-serif text-sm text-maroon-deep">
                            <input
                              type="radio"
                              name="rsvp-choice"
                              checked={rsvpOption === 'NOT_ATTENDING'}
                              onChange={() => setRsvpOption('NOT_ATTENDING')}
                              className="accent-maroon-deep"
                            />
                            <span>{t.rsvpNo}</span>
                          </label>
                        </div>
                      </div>

                      {rsvpOption === 'ATTENDING' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-1"
                        >
                          <label className="block text-maroon-deep font-bold mb-1.5 uppercase text-[11px] tracking-wide">
                            {t.rsvpGuestCount}
                          </label>
                          <input
                            type="number"
                            required
                            min={1}
                            max={10}
                            value={guestCount}
                            onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                            className="w-full bg-[#FCFAFA] border border-gold-warm/25 rounded-lg py-2 px-3 focus:outline-none focus:border-gold-warm text-maroon-deep font-semibold"
                          />
                        </motion.div>
                      )}

                      <div className="mt-1">
                        <label className="block text-maroon-deep font-bold mb-1.5 uppercase text-[11px] tracking-wide">
                          {t.rsvpMessageLabel}
                        </label>
                        <textarea
                          rows={3}
                          value={rsvpMessage}
                          onChange={(e) => setRsvpMessage(e.target.value)}
                          placeholder={t.rsvpMessagePlaceholder}
                          className="w-full bg-[#FCFAFA] border border-gold-warm/25 rounded-lg py-2.5 px-3 focus:outline-none focus:border-gold-warm text-maroon-deep placeholder:text-gray-400 font-serif italic text-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={rsvpLoading}
                        className="w-full bg-gradient-to-r from-gold-warm to-[#B09038] text-white hover:opacity-95 font-sans font-bold py-3 mt-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 select-none cursor-pointer"
                      >
                        {rsvpLoading ? t.rsvpLoading : t.rsvpSubmit}
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
