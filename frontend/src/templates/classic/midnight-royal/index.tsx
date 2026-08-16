'use client';

import type { InvitationData } from '../../types';
import { midnightRoyalTheme, themeToCssVars } from '../../theme';
import { CountdownTimer } from '../../shared/features/CountdownTimer';
import { ScratchReveal } from '../../shared/features/ScratchReveal';
import { DoorReveal3D } from '../../shared/features/DoorReveal3D';
import { EventDetails } from '../../shared/features/MapEmbed';
import { PhotoSlideshow } from '../../shared/features/PhotoSlideshow';
import { RSVPForm } from '../../shared/features/RSVPForm';
import { MusicPlayer } from '../../shared/features/MusicPlayer';

interface TemplateProps {
  data: InvitationData;
  mode?: 'preview' | 'live';
  slug?: string;
}

const CelestialHeader = () => (
  <svg width="68" height="68" viewBox="0 0 100 100" fill="none" style={{ margin: '0 auto 0.5rem' }}>
    <circle cx="50" cy="50" r="18" stroke="var(--accent)" strokeWidth="1" />
    <circle cx="50" cy="50" r="12" stroke="var(--accent)" strokeWidth="0.5" strokeDasharray="2 2" />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, idx) => (
      <g key={idx} transform={`rotate(${angle} 50 50)`}>
        <line x1="50" y1="28" x2="50" y2="24" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" />
        <circle cx="50" cy="18" r="0.75" fill="var(--accent)" />
      </g>
    ))}
    <path d="M50 42 C 45 46, 45 54, 50 58 C 47 55, 47 45, 50 42 Z" fill="var(--accent)" />
  </svg>
);

export default function MidnightRoyalTemplate({ data, mode, slug }: TemplateProps) {
  const theme = midnightRoyalTheme;

  return (
    <div
      style={{
        ...themeToCssVars(theme),
        background: 'var(--bg)',
        backgroundImage: `radial-gradient(circle at 50% 30%, #152238 0%, var(--bg) 100%), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='10' cy='15' r='0.75' fill='%23d4af37' fill-opacity='0.15'/%3E%3Ccircle cx='50' cy='35' r='1.2' fill='%23d4af37' fill-opacity='0.25'/%3E%3Ccircle cx='25' cy='65' r='0.6' fill='%23d4af37' fill-opacity='0.15'/%3E%3Ccircle cx='70' cy='55' r='1' fill='%23d4af37' fill-opacity='0.2'/%3E%3Cpath d='M10 15 L25 15 M50 35 L50 45 L70 55' stroke='%23d4af37' stroke-opacity='0.08' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
        backgroundAttachment: 'fixed',
        color: 'var(--ink)',
        minHeight: '100vh',
      }}
    >
      {data.sections.musicPlayer && <MusicPlayer trackUrl={data.musicTrackUrl} />}

      <DoorReveal3D doorLabel="Tap to Enter Midnight Royal Celebration">
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '1.2rem',
            padding: '3rem 2.5rem',
            border: '2.5px solid var(--accent)',
            borderRadius: '16px',
            margin: '2rem 1.5rem',
            background: 'linear-gradient(135deg, var(--surface) 0%, #080f1e 100%)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.05), 0 0 35px rgba(212,175,55,0.1)',
            position: 'relative',
          }}
        >
          {/* Inner gold offset outline */}
          <div
            style={{
              position: 'absolute',
              inset: '10px',
              border: '1px solid var(--accent-soft)',
              borderRadius: '12px',
              pointerEvents: 'none',
            }}
          />

          <CelestialHeader />

          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent)', zIndex: 1, margin: 0 }}>
            Together with their families
          </p>

          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2.5rem, 8vw, 4.2rem)', margin: 0, color: 'var(--ink)', fontWeight: 'normal', zIndex: 1 }}>
            {data.coupleNames.partnerOne} <span style={{ color: 'var(--accent)' }}>&amp;</span> {data.coupleNames.partnerTwo}
          </h1>

          {data.tagline && (
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-muted)', maxWidth: '34ch', lineHeight: '1.6', fontSize: '0.92rem', zIndex: 1, margin: 0 }}>
              {data.tagline}
            </p>
          )}
        </div>
      </DoorReveal3D>

      {data.sections.scratchReveal && (
        <section style={{ padding: '5rem 1.5rem', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <SectionHead eyebrow="Starry Night" heading="Scratch to Reveal Date" />
          <ScratchReveal>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              Wedding Ceremony
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '2.4rem', margin: '0.4rem 0' }}>
              {new Date(data.weddingDateTimeISO).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </ScratchReveal>
        </section>
      )}

      {data.sections.countdown && (
        <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Countdown" heading="The Shubh Mahurath approaches" />
          <div style={{ background: 'var(--surface)', border: '1px solid var(--accent-soft)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
            <CountdownTimer targetDateISO={data.weddingDateTimeISO} />
          </div>
        </section>
      )}

      <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
        <SectionHead eyebrow="Timings" heading="Festivity Ceremonies" />
        <EventDetails events={data.events} dressCode={data.dressCode} />
      </section>

      {data.sections.gallery && data.gallery.length > 0 && (
        <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Moments" heading="Love Gallery" />
          <PhotoSlideshow images={data.gallery} />
        </section>
      )}

      {data.sections.rsvp && (
        <section style={{ padding: '2rem 1.5rem 6rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="RSVP" heading="Confirm Attendance" />
          <div 
            style={{ 
              background: 'linear-gradient(135deg, var(--surface) 0%, #080f1e 100%)', 
              border: '1.5px solid var(--accent-soft)', 
              borderRadius: '16px', 
              padding: '2.5rem 2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            <RSVPForm mode={mode} slug={slug} />
          </div>
        </section>
      )}

      {/* Gifts Blessings Section */}
      <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <SectionHead eyebrow="Blessings" heading="Gifts" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
            <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-muted)', fontSize: '0.92rem', lineHeight: '1.6', maxWidth: '44ch', margin: 0 }}>
            Your love, blessings, and presence are the greatest gifts we could ever ask for.
          </p>
        </div>
      </section>

      {/* Celebrate Footer Section */}
      <section
        style={{
          padding: '5rem 1.5rem',
          textAlign: 'center',
          borderTop: '1px solid var(--accent-soft)',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ width: 44, height: 1, background: 'var(--accent)', opacity: 0.3 }} />
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontStyle: 'italic', 
            fontSize: 'clamp(2rem, 5vw, 2.8rem)', 
            fontWeight: 'normal', 
            color: 'var(--ink)',
            margin: 0,
            lineHeight: 1.3
          }}>
            We can&apos;t wait to celebrate<br />with you!
          </h2>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '1.25rem',
            color: 'var(--accent)',
            margin: 0
          }}>
            {data.coupleNames.partnerOne} &amp; {data.coupleNames.partnerTwo}
          </p>
          <div style={{ width: 44, height: 1, background: 'var(--accent)', opacity: 0.3 }} />
        </div>
      </section>
    </div>
  );
}

function SectionHead({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent)', margin: 0 }}>
        {eyebrow}
      </p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', margin: '0.4rem 0 0', fontWeight: 'normal', color: 'var(--ink)' }}>
        {heading}
      </h2>
      <svg width="120" height="24" viewBox="0 0 120 24" fill="none" style={{ margin: '0.8rem auto 0' }}>
        <path d="M10 12h32M78 12h32" stroke="var(--accent)" strokeWidth="0.75" strokeOpacity="0.4" />
        <path d="M60 6 L62 10 L66 12 L62 14 L60 18 L58 14 L54 12 L58 10 Z" fill="var(--accent)" />
      </svg>
    </div>
  );
}
