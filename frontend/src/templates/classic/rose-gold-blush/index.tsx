'use client';

import type { InvitationData } from '../../types';
import { roseGoldBlushTheme, themeToCssVars } from '../../theme';
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

const RoseGoldHeader = () => (
  <svg width="68" height="68" viewBox="0 0 100 100" fill="none" style={{ margin: '0 auto 0.5rem' }}>
    <path
      d="M50 80 C50 55, 35 45, 35 30 C35 16, 50 16, 50 16 C50 16, 65 16, 65 30 C65 45, 50 55, 50 80 Z"
      stroke="var(--accent)"
      strokeWidth="1.2"
    />
    <path
      d="M50 35 C42 28, 42 22, 50 16 C58 22, 58 28, 50 35 Z"
      stroke="var(--accent)"
      strokeWidth="0.75"
      fill="var(--accent-soft)"
    />
    <circle cx="50" cy="50" r="3" fill="var(--accent)" />
    <path d="M38 52 C30 50, 26 56, 32 62 C38 56, 38 58, 38 52 Z" stroke="var(--accent)" strokeWidth="0.8" />
    <path d="M62 52 C70 50, 74 56, 68 62 C62 56, 62 58, 62 52 Z" stroke="var(--accent)" strokeWidth="0.8" />
  </svg>
);

export default function RoseGoldBlushTemplate({ data, mode, slug }: TemplateProps) {
  const theme = roseGoldBlushTheme;

  return (
    <div
      style={{
        ...themeToCssVars(theme),
        background: 'var(--bg)',
        backgroundImage: `radial-gradient(circle at 50% 30%, #fffbfb 0%, var(--bg) 100%), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Cpath d='M25 0 C 29 12, 37 12, 41 25 C 37 38, 29 38, 25 50 C 21 38, 13 38, 9 25 C 13 12, 21 12, 25 0 Z' stroke='%23b76e79' stroke-width='0.4' stroke-opacity='0.075' fill='none'/%3E%3C/svg%3E")`,
        backgroundAttachment: 'fixed',
        color: 'var(--ink)',
        minHeight: '100vh',
      }}
    >
      {data.sections.musicPlayer && <MusicPlayer trackUrl={data.musicTrackUrl} />}

      <DoorReveal3D doorLabel="Reveal Invitation">
        <div
          style={{
            height: 'calc(100% - 4rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '1.2rem',
            padding: '3rem 2.5rem',
            border: '2px solid var(--accent)',
            borderRadius: '24px',
            margin: '2rem 1.5rem',
            background: 'var(--surface)',
            boxShadow: '0 20px 45px rgba(183,110,121,0.12), inset 0 0 0 1px rgba(255,255,255,0.7)',
            position: 'relative',
          }}
        >
          {/* Inner offset frame */}
          <div
            style={{
              position: 'absolute',
              inset: '12px',
              border: '1.5px solid var(--accent-soft)',
              borderRadius: '18px',
              pointerEvents: 'none',
            }}
          />

          <RoseGoldHeader />

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
          <SectionHead eyebrow="Love Story" heading="Scratch to Reveal Date" />
          <ScratchReveal>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              Wedding Day
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '2.4rem', margin: '0.4rem 0' }}>
              {new Date(data.weddingDateTimeISO).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </ScratchReveal>
        </section>
      )}

      {data.sections.countdown && (
        <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Countdown" heading="Almost There" />
          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--accent-soft)', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(183,110,121,0.06)' }}>
            <CountdownTimer targetDateISO={data.weddingDateTimeISO} />
          </div>
        </section>
      )}

      <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
        <SectionHead eyebrow="Events" heading="The Ceremonies" />
        <EventDetails events={data.events} dressCode={data.dressCode} />
      </section>

      {data.sections.gallery && data.gallery.length > 0 && (
        <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Gallery" heading="Moments of Love" />
          <PhotoSlideshow images={data.gallery} />
        </section>
      )}

      {data.sections.rsvp && (
        <section style={{ padding: '2rem 1.5rem 6rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="RSVP" heading="Kind Responses" />
          <div 
            style={{ 
              background: 'var(--surface)', 
              border: '1.5px solid var(--accent-soft)', 
              borderRadius: '24px', 
              padding: '2.5rem 2rem',
              boxShadow: '0 20px 40px rgba(183,110,121,0.08)'
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
        <path d="M60 12 C 57 9, 54 9, 52 12 C 54 15, 57 15, 60 12 C 63 9, 66 9, 68 12 C 66 15, 63 15, 60 12 Z" stroke="var(--accent)" strokeWidth="0.8" fill="var(--accent-soft)" />
      </svg>
    </div>
  );
}
