'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { InvitationData } from '../../types';
import { RSVPForm } from '../../shared/features/RSVPForm';
import { MusicPlayer } from '../../shared/features/MusicPlayer';
import { ScratchReveal } from '../../shared/features/ScratchReveal';

interface TemplateProps {
  data: InvitationData;
  mode?: 'preview' | 'live';
  slug?: string;
}

export default function RoyalEleganceRoyalTemplate({ data, mode, slug }: TemplateProps) {
  const partnerOne = data.coupleNames.partnerOne;
  const partnerTwo = data.coupleNames.partnerTwo;
  const weddingDate = new Date(data.weddingDateTimeISO);

  const [started, setStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Custom RSVP state hooks
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState('');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Lock scrolling on live mode until the visitor opens the invitation with a tap/click
  useEffect(() => {
    if (!started && mode === 'live') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [started, mode]);

  const handleStart = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => console.log('Video play error:', err));
    }
    setStarted(true);

    // Play music if configured and loaded
    const musicBtn = document.querySelector('[data-music-play-btn="true"]') as HTMLButtonElement | null;
    if (musicBtn) {
      musicBtn.click();
    }
  };

  // Gallery slideshow state & auto-play rotation
  const [galleryIdx, setGalleryIdx] = useState(0);
  const galleryImages = data.gallery && data.gallery.length > 0 ? data.gallery : [
    { url: '/slide-images/slide-1.jpg', alt: 'Wedding Couple' },
    { url: '/slide-images/slide-2.jpg', alt: 'Decorations' },
    { url: '/slide-images/slide-3.jpg', alt: 'Celebration' },
    { url: '/slide-images/slide-4.jpg', alt: 'Moments' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setGalleryIdx((prev) => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  // Countdown timer state
  const getTimeLeft = () => {
    const diff = Math.max(weddingDate.getTime() - Date.now(), 0);
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff / 3_600_000) % 24),
      minutes: Math.floor((diff / 60_000) % 60),
      seconds: Math.floor((diff / 1_000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [data.weddingDateTimeISO]);

  // Global fonts configuration
  const globalTypographyVars = {
    '--font-script': 'var(--font-alex-brush), var(--font-great-vibes), cursive',
    '--font-serif': 'var(--font-cormorant), var(--font-playfair), serif',
    '--font-sans': 'var(--font-jost), var(--font-inter), sans-serif',
  } as React.CSSProperties;

  const lightBgColor = 'hsl(38, 48%, 90%)';
  const slightDarkBgColor = 'rgb(237, 227, 212)';
  const navyTextColor = 'rgb(165, 120, 29)'; // Brass/dark gold headings
  const topSectionTextColor = 'rgb(212, 175, 55)'; // Pure gold names
  const topSectionTextSoft = 'rgba(212, 175, 55, 0.1)';
  const topSectionTextMuted = 'rgba(212, 175, 55, 0.3)';
  const topSectionTextGlow = 'rgba(212, 175, 55, 0.5)';
  const inputBorderColor = 'rgba(165, 120, 29, 0.18)';

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'live' && slug) {
      try {
        const res = await fetch(`http://localhost:4000/api/invitations/${slug}/rsvp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestName: rsvpName,
            response: rsvpAttending === 'yes' ? 'ATTENDING' : 'NOT_ATTENDING',
            guestCount: rsvpAttending === 'yes' ? 1 : 0,
            message: rsvpMessage,
          }),
        });
        const resData = await res.json();
        if (resData.status !== 'success') {
          alert(resData.message || 'Submission failed.');
          return;
        }
      } catch (err) {
        console.error(err);
        alert('Failed to connect to API server.');
        return;
      }
    } else {
      console.log('Sandbox/Preview RSVP Submitted:', { rsvpName, rsvpEmail, rsvpAttending, rsvpMessage });
    }
    setRsvpSubmitted(true);
  };

  return (
    <div style={{ ...globalTypographyVars, minHeight: '100vh', scrollBehavior: 'smooth', background: lightBgColor }}>
      {data.sections.musicPlayer && <MusicPlayer trackUrl={data.musicTrackUrl} />}

      {/* Entry curtain/gate cover (Before click) */}
      {!started && (
        <div
          onClick={handleStart}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            backgroundImage: 'url("/italian-lake-villa.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer',
            padding: '2rem',
          }}
        >
          {/* Dark Navy desaturated overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(12, 18, 38, 0.55)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          {/* Gate Card */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '480px',
              padding: '3rem 2rem',
              borderRadius: '24px',
              background: 'rgba(15, 18, 28, 0.45)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              transform: 'scale(1)',
              animation: 'scale-up 1.5s cubic-bezier(.16,1,.3,1)',
            }}
          >
            <div style={{ opacity: 0.9, marginBottom: '1rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1rem',
                color: '#F5F3ED',
                marginBottom: '1rem',
                letterSpacing: '0.05em',
              }}
            >
              You are cordially invited to check the invitation of
            </p>

            <h1
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: 'clamp(2.5rem, 8vw, 3.8rem)',
                color: '#D4AF37',
                margin: '0.4rem 0',
                lineHeight: 1.2,
                fontWeight: 'normal',
              }}
            >
              {partnerOne} &amp; {partnerTwo}
            </h1>

            {/* Play Button Indicator */}
            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  border: `1.5px solid ${topSectionTextColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: topSectionTextSoft,
                  boxShadow: `0 0 15px ${topSectionTextMuted}`,
                  animation: 'pulse-ring 2s ease-in-out infinite',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <polygon points="8,5 19,12 8,19" fill={topSectionTextColor} />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: topSectionTextColor,
                  fontWeight: 600,
                  marginTop: '0.5rem',
                }}
              >
                Open Invitation
              </span>
            </div>
          </div>

          <style>{`
            @keyframes pulse-ring {
              0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 15px ${topSectionTextMuted}; }
              50% { transform: scale(1.08); opacity: 0.8; box-shadow: 0 0 25px ${topSectionTextGlow}; }
            }
            @keyframes scale-up {
              0% { transform: scale(0.92); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* SECTION 1 — Hero ("We're getting married" - Cinematic Video Hero) */}
      <section
        id="hero-section"
        style={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2.5rem 1.5rem',
          boxSizing: 'border-box',
          overflow: 'hidden',
          ['--section-accent' as any]: topSectionTextColor, // Gold accent
        }}
      >
        {/* Background Video */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          poster="/italian-lake-villa.png"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src="/royal-videos/royal-elegance-royal.mp4" type="video/mp4" />
        </video>

        {/* Dark Navy desaturated overlay (approx 38-42% opacity) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(12, 18, 38, 0.42)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Top fold content (Fades in once started) */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '640px',
            textAlign: 'center',
            marginTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: started ? 1 : 0,
            transform: started ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1.2s ease 0.2s, transform 1.2s ease 0.2s',
          }}
        >
          {/* Heart icon at top */}
          <div style={{ marginBottom: '1rem', opacity: 0.9 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5F3ED" strokeWidth="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
              color: '#F5F3ED',
              margin: '0 0 0.5rem',
              fontWeight: 'normal',
            }}
          >
            We're getting married
          </h2>

          <SectionDivider color={topSectionTextColor} />

          {/* Groom details */}
          <h1
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(3.8rem, 11vw, 5.5rem)',
              color: topSectionTextColor,
              margin: '0.8rem 0 0.4rem',
              fontWeight: 'normal',
              lineHeight: 1.0,
            }}
          >
            {partnerOne}
          </h1>

          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '0.85rem',
              color: '#F5F3ED',
              lineHeight: 1.4,
              marginBottom: '0.6rem',
            }}
          >
            <div>Son of Mr. &amp; Mrs. Rajendra Sharma</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.88 }}>M.Tech, IIT Bombay</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.88 }}>Senior Software Engineer</div>
          </div>

          {/* Ampersand */}
          <div
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(2.4rem, 7vw, 3.5rem)',
              color: topSectionTextColor,
              margin: '0.6rem 0',
              lineHeight: 1,
            }}
          >
            &amp;
          </div>

          {/* Bride Name */}
          <h1
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(3.8rem, 11vw, 5.5rem)',
              color: topSectionTextColor,
              margin: '0.4rem 0 0.8rem',
              fontWeight: 'normal',
              lineHeight: 1.0,
            }}
          >
            {partnerTwo}
          </h1>

          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '0.85rem',
              color: '#F5F3ED',
              lineHeight: 1.4,
              marginBottom: '1rem',
            }}
          >
            <div>Daughter of Mr. &amp; Mrs. Nasser Ahmed</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.88 }}>MBBS, M.D</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.88 }}>Pediatrician</div>
          </div>
        </div>

        {/* SCROLL Indicator at bottom of first fold */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            marginBottom: '1rem',
            cursor: 'pointer',
            opacity: started ? 0.85 : 0,
            transition: 'opacity 1.2s ease 0.6s',
          }}
          onClick={() => {
            if (started) {
              document.getElementById('welcome-intro-section')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: '#F5F3ED',
            }}
          >
            Scroll
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F3ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </section>

      {/* SECTION 2 — Welcoming Introduction Card (Matching User Screenshot exactly) */}
      <section
        id="welcome-intro-section"
        style={{
          background: `linear-gradient(180deg, #9E8F85 0%, ${lightBgColor} 100%)`, // Seamless transition bottom
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 2rem',
          boxSizing: 'border-box',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Header Heart */}
          <div style={{ marginBottom: '2.5rem', opacity: 0.9 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#D4AF37">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>

          {/* Welcoming Text */}
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.5rem, 3.8vw, 2.3rem)',
              color: '#FFF9EB',
              lineHeight: '1.65',
              fontWeight: 'normal',
              letterSpacing: '0.02em',
              textShadow: '0 2px 8px rgba(0,0,0,0.18)',
              margin: '0 0 2.5rem',
            }}
          >
            We are honored to welcome you to the Wedding ceremony of{' '}
            <span style={{ color: '#FFEBB5', fontFamily: 'var(--font-serif)' }}>
              {partnerOne} &amp; {partnerTwo}
            </span>{' '}
            As they begin their journey together in faith and love, we thank you for being part of this blessed occasion 🤍
          </h2>

          {/* Divider */}
          <div style={{ marginTop: '1rem', width: '200px' }}>
            <SectionDivider color="#FFF9EB" />
          </div>
        </div>
      </section>

      {/* SECTION 3 — "Our forever begins" (scratch-to-reveal date card) */}
      <section
        id="date-scratch-section"
        style={{
          background: lightBgColor, // Light Background
          padding: '6rem 1.5rem 5rem',
          textAlign: 'center',
          boxSizing: 'border-box',
          ['--section-accent' as any]: navyTextColor, // Thematic accent
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(2.5rem, 7vw, 3.8rem)',
              color: navyTextColor,
              margin: '0 0 1rem',
              fontWeight: 'normal',
            }}
          >
            Our forever begins
          </h2>

          <SectionDivider color={navyTextColor} />

          {/* Large Heart scratch card */}
          <div style={{ margin: '3rem auto' }}>
            <ScratchReveal gradientFrom={topSectionTextColor} gradientTo={navyTextColor} label="SCRATCH TO REVEAL">
              <span
                style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
                  color: navyTextColor,
                  marginBottom: '0.4rem',
                }}
              >
                You're Invited!
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 'bold',
                  fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
                  color: '#1A1B1F',
                  margin: '0.4rem 0',
                  lineHeight: 1.2,
                }}
              >
                {weddingDate.toLocaleDateString('en-IN', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1rem',
                  color: '#5A6072',
                  marginTop: '0.2rem',
                }}
              >
                {weddingDate.toLocaleDateString('en-IN', { weekday: 'long' })}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1rem',
                  color: '#5A6072',
                  marginTop: '0.2rem',
                }}
              >
                10:30 AM
              </span>
            </ScratchReveal>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Slider Gallery Section (As requested: directly below scratch section) */}
      {data.sections.gallery && (
        <section
          id="gallery-section"
          style={{
            background: slightDarkBgColor, // Slight Dark Background
            padding: '5rem 1.5rem 4rem',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Small Heart on top */}
            <div style={{ marginBottom: '2rem', opacity: 0.8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={navyTextColor}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>

            {/* Carousel Container */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 10',
                maxHeight: '380px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
                border: '1px solid rgba(46,58,95,0.08)',
              }}
            >
              {galleryImages.map((img, i) => (
                <img
                  key={img.url}
                  src={img.url}
                  alt={img.alt ?? ''}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: galleryIdx === i ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                  }}
                />
              ))}
            </div>

            {/* Slider Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '1.5rem' }}>
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(i)}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: galleryIdx === i ? navyTextColor : 'rgba(46,58,95,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'background-color 0.3s',
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5 — Countdown Section */}
      {data.sections.countdown && (
        <section
          id="countdown-section"
          style={{
            background: lightBgColor, // Light Background
            padding: '4rem 1.5rem',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: 'clamp(2.5rem, 6vw, 3.4rem)',
                color: navyTextColor,
                margin: '0 0 0.5rem',
                fontWeight: 'normal',
                fontStyle: 'italic',
              }}
            >
              Counting Down to Forever
            </h2>

            {/* Small Heart divider */}
            <div style={{ margin: '0.8rem 0 2rem', opacity: 0.8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={navyTextColor}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>

            {/* Styled Countdown Cards */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', width: '100%', flexWrap: 'wrap' }}>
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Minutes', val: timeLeft.minutes },
                { label: 'Seconds', val: timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '76px',
                  }}
                >
                  {/* Number Box with rounded edges and soft border */}
                  <div
                    style={{
                      background: 'rgba(46, 58, 95, 0.07)',
                      border: '1px solid rgba(46, 58, 95, 0.12)',
                      borderRadius: '12px',
                      width: '74px',
                      height: '74px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 'bold',
                      fontSize: '1.8rem',
                      color: navyTextColor,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                    }}
                  >
                    {String(item.val).padStart(2, '0')}
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: navyTextColor,
                      opacity: 0.8,
                      marginTop: '0.6rem',
                      fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6 — Timeline Section */}
      <section
        id="timeline-section"
        style={{
          background: slightDarkBgColor, // Slight Dark Background
          padding: '4rem 1.5rem 5rem',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Clock icon */}
          <div style={{ marginBottom: '0.6rem', opacity: 0.9 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={navyTextColor} strokeWidth="1.75">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(2.5rem, 6vw, 3.4rem)',
              color: navyTextColor,
              margin: '0 0 0.5rem',
              fontWeight: 'normal',
              fontStyle: 'italic',
            }}
          >
            Program Timeline
          </h2>

          {/* Small Heart divider */}
          <div style={{ margin: '0.8rem 0 3rem', opacity: 0.8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={navyTextColor}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>

          {/* Vertical customized timeline */}
          <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto', paddingLeft: '1rem' }}>
            {data.events.map((evt, idx) => {
              return (
                <div key={idx} style={{ display: 'flex', gap: '1.5rem', position: 'relative', paddingBottom: '2.5rem' }}>
                  {/* Line element linking items */}
                  {idx < data.events.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '7px',
                        top: '16px',
                        bottom: 0,
                        width: '2px',
                        backgroundColor: '#B7C1D6',
                      }}
                    />
                  )}
                  {/* Timeline round dot */}
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: navyTextColor,
                      boxShadow: '0 0 0 4px rgba(46,58,95,0.15)',
                      marginTop: '4px',
                      zIndex: 1,
                    }}
                  />
                  {/* Event content */}
                  <div style={{ textAlign: 'left' }}>
                    <h4
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        color: navyTextColor,
                        margin: 0,
                      }}
                    >
                      {evt.label}
                    </h4>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.85rem',
                        color: '#5A6072',
                        margin: '0.3rem 0',
                        fontWeight: 500,
                      }}
                    >
                      {evt.time}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.85rem',
                        color: '#70778B',
                      }}
                    >
                      {evt.address || evt.venueName || 'We request the pleasure of your presence.'} 💙
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7 — Venue Section */}
      <section
        id="venue-section"
        style={{
          background: lightBgColor, // Light Background
          padding: '4rem 1.5rem 5rem',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Map Pin icon */}
          <div style={{ marginBottom: '0.6rem', opacity: 0.9 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={navyTextColor} strokeWidth="1.75">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(2.5rem, 6vw, 3.4rem)',
              color: navyTextColor,
              margin: '0 0 0.5rem',
              fontWeight: 'normal',
              fontStyle: 'italic',
            }}
          >
            Venue
          </h2>

          {/* Small Heart divider */}
          <div style={{ margin: '0.8rem 0 2rem', opacity: 0.8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={navyTextColor}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>

          {/* Venue Name & details */}
          <h3
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              color: navyTextColor,
              margin: '0 0 0.2rem',
            }}
          >
            {data.events[0]?.venueName || 'Grand Palace Hall'}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              color: '#5A6072',
              margin: '0 0 2rem',
            }}
          >
            {data.events[0]?.address || 'City centre, London'}
          </p>

          {/* Interactive Google Map Frame with float action badge */}
          {data.sections.map && (
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '320px',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 12px 35px rgba(0,0,0,0.06)',
                border: '1px solid rgba(46,58,95,0.08)',
              }}
            >
              <iframe
                title="Venue Map Location"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  data.events[0]?.address || data.events[0]?.venueName || 'Grand Palace Hall, London'
                )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />

              {/* Float badge floating above layout */}
              <a
                href={data.events[0]?.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(
                  data.events[0]?.address || data.events[0]?.venueName || 'Grand Palace Hall, London'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: '#FFF',
                  border: '1px solid rgba(46,58,95,0.12)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  color: navyTextColor,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Open in Maps</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 8 — Accommodation Section */}
      <section
        id="accommodation-section"
        style={{
          background: lightBgColor, // Light Background
          padding: '4.5rem 1.5rem 1.5rem',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Hotel building icon */}
          <div style={{ marginBottom: '0.4rem', opacity: 0.9 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={navyTextColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
            </svg>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(2.5rem, 6.5vw, 3.5rem)',
              color: navyTextColor,
              margin: '0.2rem 0',
              fontWeight: 'normal',
              fontStyle: 'italic',
            }}
          >
            Accommodation
          </h2>
          <SectionDivider color={navyTextColor} />
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.92rem',
              color: '#5A6072',
              margin: '1.2rem 0 0',
              lineHeight: 1.6,
              maxWidth: '460px',
              fontWeight: 500,
            }}
          >
            Special rates at The Grand Palace Hotel (5 min from venue).<br />
            Use code WEDDING2026 when booking.
          </p>
        </div>
      </section>

      {/* SECTION 9 — Gifts Section */}
      <section
        id="gifts-section"
        style={{
          background: slightDarkBgColor, // Slight Dark Background
          padding: '4.5rem 1.5rem 4.5rem',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Gift box icon */}
          <div style={{ marginBottom: '0.4rem', opacity: 0.9 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={navyTextColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(2.5rem, 6.5vw, 3.5rem)',
              color: navyTextColor,
              margin: '0.2rem 0',
              fontWeight: 'normal',
              fontStyle: 'italic',
            }}
          >
            Gifts
          </h2>
          <SectionDivider color={navyTextColor} />
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.92rem',
              color: '#5A6072',
              margin: '1.2rem 0 0',
              lineHeight: 1.6,
              maxWidth: '460px',
              fontWeight: 500,
            }}
          >
            Your love, blessings, and presence are the greatest gifts we could ever ask for.
          </p>
        </div>
      </section>

      {/* SECTION 10 — RSVP Section */}
      {data.sections.rsvp && (
        <section
          id="rsvp-section"
          style={{
            background: lightBgColor, // Light Background
            padding: '5rem 1.5rem 5rem',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '0.4rem', opacity: 0.9 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={navyTextColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: 'clamp(2.8rem, 7vw, 3.8rem)',
                color: navyTextColor,
                margin: '0.2rem 0',
                fontWeight: 'normal',
                fontStyle: 'italic',
                letterSpacing: '0.04em',
              }}
            >
              RSVP
            </h2>
            <SectionDivider color={navyTextColor} />

            {rsvpSubmitted ? (
              <p
                style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: 'clamp(1.8rem, 4.5vw, 2.3rem)',
                  color: navyTextColor,
                  margin: '2.5rem 0',
                  lineHeight: 1.4,
                }}
              >
                {rsvpAttending === 'yes'
                  ? `Thank you, ${rsvpName} — we can't wait to celebrate with you!`
                  : `Thank you, ${rsvpName} — you'll be with us in spirit.`}
              </p>
            ) : (
              <form onSubmit={handleRsvpSubmit} style={{ width: '100%', marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', textAlign: 'left' }}>
                  <label
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      color: navyTextColor,
                      letterSpacing: '0.02em',
                    }}
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    required
                    style={{
                      padding: '0.7rem 0.9rem',
                      borderRadius: '5px',
                      border: `1px solid ${inputBorderColor}`,
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-sans)',
                      background: '#FFF',
                      outline: 'none',
                      color: '#1A1B1C',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', textAlign: 'left' }}>
                  <label
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      color: navyTextColor,
                      letterSpacing: '0.02em',
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={rsvpEmail}
                    onChange={(e) => setRsvpEmail(e.target.value)}
                    required
                    style={{
                      padding: '0.7rem 0.9rem',
                      borderRadius: '5px',
                      border: `1px solid ${inputBorderColor}`,
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-sans)',
                      background: '#FFF',
                      outline: 'none',
                      color: '#1A1B1C',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', textAlign: 'left' }}>
                  <label
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      color: navyTextColor,
                      letterSpacing: '0.02em',
                    }}
                  >
                    Will you be attending?
                  </label>
                  <select
                    value={rsvpAttending}
                    onChange={(e) => setRsvpAttending(e.target.value)}
                    required
                    style={{
                      padding: '0.7rem 0.9rem',
                      borderRadius: '5px',
                      border: `1px solid ${inputBorderColor}`,
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-sans)',
                      background: '#FFF',
                      outline: 'none',
                      color: '#1A1B1C',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="" disabled>Select...</option>
                    <option value="yes">Yes, I will attend</option>
                    <option value="no">No, I cannot attend</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', textAlign: 'left' }}>
                  <label
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      color: navyTextColor,
                      letterSpacing: '0.02em',
                    }}
                  >
                    Your Message
                  </label>
                  <textarea
                    placeholder="Write your wishes..."
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    rows={4}
                    style={{
                      padding: '0.7rem 0.9rem',
                      borderRadius: '5px',
                      border: `1px solid ${inputBorderColor}`,
                      fontSize: '0.88rem',
                      fontFamily: 'var(--font-sans)',
                      background: '#FFF',
                      outline: 'none',
                      color: '#1A1B1C',
                      resize: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '1rem',
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: navyTextColor,
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '5px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* SECTION 11 — Celebrate Footer Section */}
      <section
        id="celebrate-footer-section"
        style={{
          background: slightDarkBgColor, // Slight Dark Background
          padding: '6rem 1.5rem',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Top wavy decoration lines */}
          <svg width="220" height="12" viewBox="0 0 240 12" fill="none" stroke={navyTextColor} strokeWidth="1.2" opacity="0.32" style={{ marginBottom: '2rem' }}>
            <path d="M0,6 C30,12 30,0 60,6 C90,12 90,0 120,6 C150,12 150,0 180,6 C210,12 210,0 240,6" />
          </svg>

          <h2
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(2.4rem, 6vw, 3.2rem)',
              color: navyTextColor,
              margin: '0',
              fontWeight: 'normal',
              fontStyle: 'italic',
              lineHeight: 1.3,
            }}
          >
            We can&apos;t wait to celebrate<br />
            with you!
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
              color: navyTextColor,
              margin: '1.2rem 0 0',
              fontStyle: 'italic',
            }}
          >
            {partnerOne} &amp; {partnerTwo}
          </p>

          {/* Bottom wavy decoration lines */}
          <svg width="220" height="12" viewBox="0 0 240 12" fill="none" stroke={navyTextColor} strokeWidth="1.2" opacity="0.32" style={{ marginTop: '2.5rem' }}>
            <path d="M0,6 C30,12 30,0 60,6 C90,12 90,0 120,6 C150,12 150,0 180,6 C210,12 210,0 240,6" />
          </svg>
        </div>
      </section>
    </div>
  );
}

// Reusable Section Divider matching the layout
function SectionDivider({ color }: { color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        justifyContent: 'center',
        margin: '1rem auto',
        width: '160px',
      }}
    >
      <div style={{ height: '1.2px', width: '60px', background: color, opacity: 0.5 }} />
      <svg width="12" height="12" viewBox="0 0 24 24" fill={color} style={{ display: 'block', opacity: 0.9 }}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <div style={{ height: '1.2px', width: '60px', background: color, opacity: 0.5 }} />
    </div>
  );
}
