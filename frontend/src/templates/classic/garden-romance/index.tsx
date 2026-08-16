'use client';

import type { InvitationData } from '../../types';
import { gardenRomanceTheme, themeToCssVars } from '../../theme';
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

const FloralBranchHeader = () => (
  <svg width="72" height="72" viewBox="0 0 100 100" fill="none" style={{ margin: '0 auto 0.5rem' }}>
    <path 
      d="M50 85 C 50 60, 48 35, 68 15 M50 60 C 40 50, 28 40, 32 25" 
      stroke="var(--secondary)" 
      strokeWidth="1.2" 
      strokeLinecap="round" 
    />
    <path d="M50 70 C 45 66, 40 66, 38 72 C 43 76, 47 74, 50 70" fill="none" stroke="var(--secondary)" strokeWidth="1" />
    <path d="M50 50 C 58 46, 62 48, 64 42 C 58 40, 54 44, 50 50" fill="none" stroke="var(--secondary)" strokeWidth="1" />
    <path d="M58 30 C 64 26, 70 28, 72 22 C 65 20, 60 24, 58 30" fill="none" stroke="var(--secondary)" strokeWidth="1" />
    <path d="M41 43 C 35 41, 33 46, 27 46 C 30 52, 36 50, 41 43" fill="none" stroke="var(--secondary)" strokeWidth="1" />
    <circle cx="68" cy="15" r="3.5" fill="var(--accent)" />
    <circle cx="32" cy="25" r="3" fill="var(--accent)" />
  </svg>
);

export default function GardenRomanceTemplate({ data, mode, slug }: TemplateProps) {
  const theme = gardenRomanceTheme;

  return (
    <div
      style={{
        ...themeToCssVars(theme),
        background: 'var(--bg)',
        backgroundImage: `radial-gradient(circle at 50% 30%, #f4f8f4 0%, var(--bg) 100%), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M12 24 C 18 18, 20 18, 26 21 C 20 24, 18 24, 12 24 Z' fill='%235b705b' fill-opacity='0.04'/%3E%3Cpath d='M36 12 C 42 6, 44 6, 50 9 C 44 12, 42 12, 36 12 Z' fill='%235b705b' fill-opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundAttachment: 'fixed',
        color: 'var(--ink)',
        minHeight: '100vh',
      }}
    >
      {data.sections.musicPlayer && <MusicPlayer trackUrl={data.musicTrackUrl} />}

      <DoorReveal3D doorLabel="Step into our Garden Romance">
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
            border: '1.5px solid var(--secondary)',
            borderRadius: '32px 8px 32px 8px', // Leaf contour corners
            margin: '2rem 1.5rem',
            background: 'var(--surface)',
            boxShadow: '0 15px 35px rgba(91,112,91,0.15), inset 0 0 0 1px rgba(255,255,255,0.7)',
            position: 'relative',
          }}
        >
          {/* Subtle inside frame overlay */}
          <div
            style={{
              position: 'absolute',
              inset: '12px',
              border: '1px dashed var(--accent-soft)',
              borderRadius: '28px 4px 28px 4px',
              pointerEvents: 'none',
            }}
          />

          <FloralBranchHeader />

          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--secondary)', zIndex: 1, margin: 0 }}>
            Together with their families
          </p>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 8vw, 4.2rem)', margin: 0, color: 'var(--ink)', fontWeight: 'normal', zIndex: 1 }}>
            {data.coupleNames.partnerOne} <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>&amp;</span> {data.coupleNames.partnerTwo}
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
          <SectionHead eyebrow="Love Blooming" heading="Scratch to Reveal Date" />
          <ScratchReveal>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--secondary)' }}>
              Wedding Day
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', margin: '0.4rem 0' }}>
              {new Date(data.weddingDateTimeISO).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </ScratchReveal>
        </section>
      )}

      {data.sections.countdown && (
        <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Counting down" heading="Our Day of Love" />
          <div style={{ background: 'var(--surface)', border: '1px solid var(--accent-soft)', borderRadius: '24px 8px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(91,112,91,0.08)' }}>
            <CountdownTimer targetDateISO={data.weddingDateTimeISO} />
          </div>
        </section>
      )}

      <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
        <SectionHead eyebrow="Celebrations" heading="Garden Festivities" />
        <EventDetails events={data.events} dressCode={data.dressCode} />
      </section>

      {data.sections.gallery && data.gallery.length > 0 && (
        <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Gallery" heading="Cherished Moments" />
          <PhotoSlideshow images={data.gallery} />
        </section>
      )}

      {data.sections.rsvp && (
        <section style={{ padding: '2rem 1.5rem 6rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="RSVP" heading="Join Our Celebration" />
          <div 
            style={{ 
              background: 'var(--surface)', 
              border: '1.5px solid var(--accent-soft)', 
              borderRadius: '24px 8px', 
              padding: '2.5rem 2rem',
              boxShadow: '0 20px 40px rgba(91,112,91,0.1)'
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
      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--secondary)', margin: 0 }}>
        {eyebrow}
      </p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', margin: '0.4rem 0 0', fontWeight: 'normal', color: 'var(--ink)' }}>
        {heading}
      </h2>
      <svg width="120" height="24" viewBox="0 0 120 24" fill="none" style={{ margin: '0.8rem auto 0' }}>
        <path d="M10 12h32M78 12h32" stroke="var(--secondary)" strokeWidth="0.75" strokeOpacity="0.4" />
        <path d="M60 12 C 55 8, 48 10, 52 14 C 55 12, 58 12, 60 12 C 62 12, 65 12, 68 14 C 72 10, 65 8, 60 12 Z" stroke="var(--secondary)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}
