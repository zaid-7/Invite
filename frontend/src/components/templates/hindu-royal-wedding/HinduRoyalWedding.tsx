'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, MapPin, Calendar, Users, Music } from 'lucide-react';
import { WatermarkOverlay } from '@/components/ui/WatermarkOverlay';
import { ScratchReveal } from '../../../templates/shared/features/ScratchReveal';

interface HinduRoyalWeddingProps {
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
  onRsvpSuccess?: () => void;
  slug?: string;
}

export default function HinduRoyalWedding({ data, mode, slug }: HinduRoyalWeddingProps) {
  const {
    groomName = 'Arjun',
    brideName = 'Pooja',
    groomParents = 'Mr. & Mrs. Sharma',
    brideParents = 'Mr. & Mrs. Patel',
    welcomeQuote = 'Seeking the blessings of Lord Ganesha, we invite you to join us in celebrating our wedding.',
    events = [],
    musicUrl = '/music/shehnai.mp3',
  } = data;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  // RSVP Form state for live page
  const [guestName, setGuestName] = useState('');
  const [rsvpOption, setRsvpOption] = useState('ATTENDING');
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.log('Audio autoplay blocked by browser sandbox:', err));
      setIsPlaying(true);
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
          guestCount,
          message,
        }),
      });
      const resData = await res.json();
      if (resData.status === 'success') {
        setRsvpDone(true);
      } else {
        alert(resData.message || 'RSVP submission failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to Server.');
    } finally {
      setRsvpLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-maroon-deep text-ivory font-serif flex flex-col items-center justify-start overflow-hidden px-4 py-8">
      {/* Background Mandala details */}
      <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] border-[1px] border-gold-warm/20 rounded-full flex items-center justify-center animate-spin-slow opacity-20 pointer-events-none">
        <div className="w-[300px] h-[300px] border-[1px] border-dashed border-gold-warm/20 rounded-full" />
      </div>
      <div className="absolute bottom-[-150px] right-[-100px] w-[450px] h-[450px] border-[1px] border-gold-warm/20 rounded-full flex items-center justify-center animate-spin-slow opacity-20 pointer-events-none">
        <div className="w-[380px] h-[380px] border-[1px] border-dashed border-gold-warm/20 rounded-full" />
      </div>

      {mode === 'preview' && <WatermarkOverlay />}

      {/* Floating Music Button */}
      {musicUrl && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-40 bg-gold-warm p-4 rounded-full text-maroon-deep shadow-2xl hover:scale-110 active:scale-95 transition-all outline-none"
        >
          {isPlaying ? <Square size={20} fill="#5B1A1A" /> : <Play size={20} fill="#5B1A1A" />}
        </button>
      )}

      {/* Main card view */}
      <div className="relative w-full max-w-xl border-[4px] border-gold-warm/40 bg-maroon-deep/90 py-12 px-6 md:px-10 rounded-lg shadow-2xl z-10 flex flex-col items-center">
        {/* Gold Accent corner templates */}
        <div className="absolute top-2 left-2 text-gold-warm text-2xl opacity-40">𑁍</div>
        <div className="absolute top-2 right-2 text-gold-warm text-2xl opacity-40">𑁍</div>
        <div className="absolute bottom-2 left-2 text-gold-warm text-2xl opacity-40">𑁍</div>
        <div className="absolute bottom-2 right-2 text-gold-warm text-2xl opacity-40">𑁍</div>

        {/* Lord Ganesha Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-16 h-16 border-2 border-gold-warm rounded-full flex items-center justify-center mb-3">
            <span className="text-3xl text-gold-warm">🕉</span>
          </div>
          <span className="text-gold-warm uppercase tracking-widest text-xs font-semibold">Shree Ganeshaya Namah</span>
        </motion.div>

        {/* Welcome Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center px-4 md:px-6 italic text-gold-warm/80 leading-relaxed max-w-md text-sm md:text-base border-b border-gold-warm/20 pb-8 mb-8"
        >
          "{welcomeQuote}"
        </motion.p>

        {/* Couple Invitation Section */}
        <div className="text-center w-full mb-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="w-full"
          >
            <h2 className="text-gold-warm font-sans text-xs uppercase tracking-[0.25em] mb-2">We request the pleasure of your company for the wedding of</h2>
            <div className="text-4xl md:text-5xl font-extrabold text-serif text-gold-warm drop-shadow-md py-4 font-bold flex flex-col items-center gap-1">
              <span>{groomName}</span>
              <span className="text-2xl text-gold-warm/60 my-2 font-normal">&amp;</span>
              <span>{brideName}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-6 flex flex-col gap-3 text-sm text-gold-warm/90 px-6 max-w-sm"
          >
            <div>
              <span className="text-xs uppercase text-gold-warm/50 block tracking-wider">Son of</span>
              <span className="font-semibold">{groomParents}</span>
            </div>
            <div className="w-6 h-[1px] bg-gold-warm/20 self-center" />
            <div>
              <span className="text-xs uppercase text-gold-warm/50 block tracking-wider">Daughter of</span>
              <span className="font-semibold">{brideParents}</span>
            </div>
          </motion.div>
        </div>

        {/* Scratch Reveal Card */}
        <div className="w-full flex flex-col items-center justify-center mb-10">
          <span className="text-gold-warm uppercase tracking-widest text-[10px] mb-3 font-semibold">Scratch to Reveal Date</span>
          <ScratchReveal>
            <p style={{ fontFamily: 'sans-serif', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5B1A1A', fontWeight: 'bold' }}>
              Wedding Ceremony
            </p>
            <p style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.8rem', margin: '0.4rem 0', color: '#5B1A1A' }}>
              {events && events[0] ? events[0].date : 'TBD'}
            </p>
          </ScratchReveal>
        </div>

        {/* Timeline Events */}
        <div className="w-full flex flex-col gap-6 mt-6">
          <h3 className="text-center text-gold-warm uppercase tracking-widest text-sm border-b border-gold-warm/20 pb-2 mb-2">Ceremonies</h3>
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="border border-gold-warm/20 rounded-md p-5 bg-maroon-deep/30 flex flex-col items-start w-full relative"
            >
              <div className="absolute right-4 top-4 text-gold-warm/5 border border-gold-warm/15 rounded-full p-2"><Calendar size={18} /></div>
              <h4 className="text-gold-warm font-bold text-lg md:text-xl border-b border-gold-warm/10 pb-1 mb-3 w-full pr-12">{event.name}</h4>
              <div className="flex flex-col gap-2 text-xs md:text-sm text-gold-warm/90">
                <span className="flex items-center gap-2"><Calendar size={14} className="text-gold-warm" /> {event.date}</span>
                <span className="flex items-center gap-2"><Play size={10} className="text-gold-warm fill-gold-warm rotate-90" /> {event.time}</span>
                <span className="flex items-start gap-2 mt-1">
                  <MapPin size={14} className="text-gold-warm shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gold-warm">{event.venue}</strong>
                    <span className="text-gold-warm/75 text-xs">{event.address}</span>
                  </div>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Guest RSVP Box on live page */}
        {mode === 'live' && (
          <div className="w-full border-t border-gold-warm/20 mt-12 pt-10">
            <h3 className="text-center text-gold-warm uppercase tracking-widest text-sm mb-6 flex items-center justify-center gap-2">
              <Users size={16} /> Will You Attend? RSVP
            </h3>
            {rsvpDone ? (
              <div className="bg-gold-warm/10 border border-gold-warm/35 rounded-md p-6 text-center text-gold-warm">
                <span className="block text-xl font-bold mb-1">Dhanyavaad! (Thank you)</span>
                <span>Your RSVP has been registered successfully.</span>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-4 text-sm">
                <div>
                  <label className="block text-gold-warm/70 text-xs uppercase mb-1 font-semibold">Your Name</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-maroon-deep/50 border border-gold-warm/30 rounded py-2 px-3 focus:outline-none focus:border-gold-warm text-gold-warm"
                  />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-gold-warm/90">
                    <input
                      type="radio"
                      name="rsvp"
                      checked={rsvpOption === 'ATTENDING'}
                      onChange={() => setRsvpOption('ATTENDING')}
                    /> Attending
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gold-warm/90">
                    <input
                      type="radio"
                      name="rsvp"
                      checked={rsvpOption === 'NOT_ATTENDING'}
                      onChange={() => setRsvpOption('NOT_ATTENDING')}
                    /> Cannot Attend
                  </label>
                </div>
                {rsvpOption === 'ATTENDING' && (
                  <div>
                    <label className="block text-gold-warm/70 text-xs uppercase mb-1 font-semibold">Number of Guests</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={12}
                      value={guestCount}
                      onChange={e => setGuestCount(parseInt(e.target.value, 10))}
                      className="w-full bg-maroon-deep/50 border border-gold-warm/30 rounded py-2 px-3 focus:outline-none focus:border-gold-warm text-gold-warm"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-gold-warm/70 text-xs uppercase mb-1 font-semibold">Message (Optional)</label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Add a loving message/blessing"
                    className="w-full bg-maroon-deep/50 border border-gold-warm/30 rounded py-2 px-3 focus:outline-none focus:border-gold-warm text-gold-warm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={rsvpLoading}
                  className="bg-gold-warm text-maroon-deep hover:bg-gold-warm/95 font-sans font-semibold py-2.5 rounded shadow-lg transition-transform active:scale-95 disabled:opacity-50 mt-2"
                >
                  {rsvpLoading ? 'Registering...' : 'Submit RSVP'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Gifts Blessings Section */}
        <div className="w-full border-t border-gold-warm/20 mt-10 pt-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 border border-gold-warm/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-gold-warm text-xl">🎁</span>
          </div>
          <h3 className="text-gold-warm uppercase tracking-widest text-sm mb-3">Gifts</h3>
          <p className="text-center text-gold-warm/80 text-xs md:text-sm leading-relaxed max-w-sm">
            Your love, blessings, and presence are the greatest gifts we could ever ask for.
          </p>
        </div>

        {/* Celebrate Section */}
        <div className="w-full border-t border-gold-warm/20 mt-10 pt-8 flex flex-col items-center text-center gap-2">
          <h3 className="text-gold-warm font-serif italic text-2xl md:text-3xl font-normal leading-normal">
            We can&apos;t wait to celebrate with you!
          </h3>
          <p className="text-gold-warm/60 uppercase font-sans tracking-[0.2em] text-[10px] mt-2">
            {groomName} &amp; {brideName}
          </p>
        </div>
      </div>
    </div>
  );
}
