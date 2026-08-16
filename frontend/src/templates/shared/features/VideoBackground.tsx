'use client';

import { useRef, useState, type ReactNode } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  posterSrc?: string;
  partnerOne: string;
  partnerTwo: string;
  tagline?: string;
  children?: ReactNode;
}

/**
 * Royal-tier cinematic hero section.
 *
 * Flow:
 * 1. Full-screen overlay with couple names + "Tap to Begin"
 * 2. On tap → video starts playing in the hero, overlay fades out
 * 3. Couple names appear over the video
 * 4. Content below scrolls normally on the themed background
 */
export function VideoBackground({
  videoSrc,
  posterSrc,
  partnerOne,
  partnerTwo,
  tagline,
  children,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    setStarted(true);
  };

  return (
    <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Video layer — contained within the hero section */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        poster={posterSrc}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Dark gradient overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.75) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Tap-to-begin overlay */}
      <div
        onClick={!started ? handleStart : undefined}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: started ? -1 : 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '1.5rem',
          padding: '2rem',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: started ? 'none' : 'blur(8px)',
          opacity: started ? 0 : 1,
          transition: 'opacity 1.2s cubic-bezier(.4,0,.2,1)',
          pointerEvents: started ? 'none' : 'auto',
          cursor: started ? 'default' : 'pointer',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: '0.72rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            margin: 0,
          }}
        >
          Together with their families
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(2.8rem, 9vw, 5rem)',
            color: 'var(--ink)',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {partnerOne}{' '}
          <span style={{ color: 'var(--accent)' }}>&amp;</span>{' '}
          {partnerTwo}
        </h1>

        {tagline && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--ink-muted)',
              maxWidth: '32ch',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {tagline}
          </p>
        )}

        {/* Animated tap hint */}
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: '1.5px solid var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse-ring 2s ease-in-out infinite',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <polygon points="8,5 19,12 8,19" fill="var(--accent)" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.68rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              opacity: 0.8,
            }}
          >
            Tap to Begin
          </span>
        </div>

        <style>{`
          @keyframes pulse-ring {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.12); opacity: 0.7; }
          }
        `}</style>
      </div>

      {/* Content that shows over the video after tapping (couple names etc.) */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '1rem',
          padding: '2rem',
          opacity: started ? 1 : 0,
          transform: started ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 1s ease 0.5s, transform 1s ease 0.5s',
        }}
      >
        <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--accent)', margin: 0 }}>
          Together with their families
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2.8rem, 9vw, 5rem)', color: 'var(--ink)', margin: 0, lineHeight: 1.1 }}>
          {partnerOne} <span style={{ color: 'var(--accent)' }}>&amp;</span> {partnerTwo}
        </h1>
        {tagline && (
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-muted)', maxWidth: '32ch', lineHeight: 1.6, margin: 0 }}>{tagline}</p>
        )}
        {children}
      </div>
    </section>
  );
}
