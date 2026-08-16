'use client';

import type { InvitationData } from '../../types';
import { mughalEmeraldTheme, themeToCssVars } from '../../theme';
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

const MughalArchHeader = () => (
  <svg width="84" height="84" viewBox="0 0 100 100" fill="none" style={{ margin: '0 auto 0.5rem' }}>
    <path
      d="M50 10 
         C45 26, 28 36, 28 56 
         C28 76, 38 86, 50 86 
         C62 86, 72 76, 72 56 
         C72 36, 55 26, 50 10 Z"
      stroke="var(--accent)"
      strokeWidth="1.5"
    />
    <path
      d="M50 16 
         C46 29, 32 38, 32 56 
         C32 72, 40 80, 50 80 
         C60 80, 68 72, 68 56 
         C68 38, 54 29, 50 16 Z"
      stroke="var(--accent)"
      strokeWidth="0.75"
      strokeDasharray="2 2"
    />
    <circle cx="50" cy="56" r="4" fill="var(--accent)" />
    <path d="M50 4v6" stroke="var(--accent)" strokeWidth="1.2" />
    <circle cx="50" cy="3" r="1.2" fill="var(--accent)" />
  </svg>
);

export default function MughalEmeraldTemplate({ data, mode, slug }: TemplateProps) {
  const theme = mughalEmeraldTheme;

  return (
    <div
      style={{
        ...themeToCssVars(theme),
        background: 'var(--bg)',
        backgroundImage: `radial-gradient(circle at 50% 30%, #0e3025 0%, var(--bg) 100%), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M16 0 L32 16 L16 32 L0 16 Z' fill='none' stroke='%23e5c060' stroke-width='0.45' stroke-opacity='0.08'/%3E%3Ccircle cx='16' cy='16' r='1.2' fill='%23e5c060' fill-opacity='0.12'/%3E%3C/svg%3E")`,
        backgroundAttachment: 'fixed',
        color: 'var(--ink)',
        minHeight: '100vh',
      }}
    >
      {data.sections.musicPlayer && <MusicPlayer trackUrl={data.musicTrackUrl} />}

      <DoorReveal3D doorLabel="Open Shahi Invitation">
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '1.2rem',
            padding: '3.5rem 2rem',
            border: '2px solid var(--accent)',
            borderRadius: '80px 80px 16px 16px', // Mughal arch silhouette
            margin: '2rem 1.5rem',
            background: 'linear-gradient(135deg, var(--surface) 0%, #0c271e 100%)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)',
            position: 'relative',
          }}
        >
          {/* Decorative gold hairline offset border */}
          <div
            style={{
              position: 'absolute',
              inset: '12px',
              border: '1.5px solid var(--accent-soft)',
              borderRadius: '70px 70px 10px 10px',
              pointerEvents: 'none',
            }}
          />

          <MughalArchHeader />

          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent)', margin: 0, zIndex: 1 }}>
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
          <SectionHead eyebrow="Shahi Daawat" heading="Scratch to Reveal Date" />
          <ScratchReveal>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              Auspicious Day
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '2.4rem', margin: '0.4rem 0' }}>
              {new Date(data.weddingDateTimeISO).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </ScratchReveal>
        </section>
      )}

      {data.sections.countdown && (
        <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Countdown" heading="The Shahi Nikah Approaches" />
          <div style={{ background: 'var(--surface)', border: '1px solid var(--accent-soft)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
            <CountdownTimer targetDateISO={data.weddingDateTimeISO} />
          </div>
        </section>
      )}

      <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
        <SectionHead eyebrow="Festivities" heading="Nikah & Ceremonies" />
        <EventDetails events={data.events} dressCode={data.dressCode} />
      </section>

      {data.sections.gallery && data.gallery.length > 0 && (
        <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Glimpses" heading="Moments of Grace" />
          <PhotoSlideshow images={data.gallery} />
        </section>
      )}

      {data.sections.rsvp && (
        <section style={{ padding: '2rem 1.5rem 6rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Response" heading="Register RSVP" />
          <div 
            style={{ 
              background: 'linear-gradient(135deg, var(--surface) 0%, #0c271e 100%)', 
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
      <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', margin: '0.4rem 0 0', fontWeight: 'normal' }}>
        {heading}
      </h2>
      <svg width="140" height="24" viewBox="0 0 140 24" fill="none" style={{ margin: '0.8rem auto 0' }}>
        <path d="M10 12 C 30 12, 45 16, 55 12 M130 12 C 110 12, 95 16, 85 12" stroke="var(--accent)" strokeWidth="0.75" />
        <path d="M70 4 C67 8, 64 12, 70 20 C76 12, 73 8, 70 4" stroke="var(--accent)" strokeWidth="1" fill="none" />
        <path d="M70 7 C68 10, 68 12, 70 16 C72 12, 72 10, 70 7" stroke="var(--accent)" strokeWidth="0.5" fill="var(--accent)" />
      </svg>
    </div>
  );
}
