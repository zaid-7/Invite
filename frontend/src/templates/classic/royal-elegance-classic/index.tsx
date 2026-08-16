'use client';

import type { InvitationData } from '../../types';
import { royalEleganceClassicTheme, themeToCssVars } from '../../theme';
import { CountdownTimer } from '../../shared/features/CountdownTimer';
import { ScratchReveal } from '../../shared/features/ScratchReveal';
import { CurtainReveal3D } from '../../shared/features/CurtainReveal3D';
import { EventDetails } from '../../shared/features/MapEmbed';
import { PhotoSlideshow } from '../../shared/features/PhotoSlideshow';
import { RSVPForm } from '../../shared/features/RSVPForm';
import { MusicPlayer } from '../../shared/features/MusicPlayer';

interface TemplateProps {
  data: InvitationData;
  mode?: 'preview' | 'live';
  slug?: string;
}

const PalaceCrestHeader = () => (
  <svg width="84" height="84" viewBox="0 0 120 120" fill="none" style={{ margin: '0 auto 0.5rem' }}>
    {/* Outer boundary palace dome */}
    <path d="M20 90 L20 60 C20 30, 40 20, 60 10 C80 20, 100 30, 100 60 L100 90 Z" stroke="var(--accent)" strokeWidth="1.2" />
    <path d="M26 86 L26 60 C26 35, 42 26, 60 17 C78 26, 94 35, 94 60 L94 86 Z" stroke="var(--accent-soft)" strokeWidth="0.8" strokeDasharray="3 3" />
    
    {/* Inner grand arch */}
    <path d="M45 60 C45 50, 52 45, 60 45 C68 45, 75 50, 75 60 L75 90 L45 90 Z" stroke="var(--accent)" strokeWidth="1" fill="none" />
    <path d="M50 63 C50 55, 54 52, 60 52 C66 52, 70 55, 70 63 L70 90 L50 90 Z" stroke="var(--accent-soft)" strokeWidth="0.5" fill="none" />
    
    {/* Minaret towers left and right */}
    <line x1="15" y1="95" x2="15" y2="40" stroke="var(--accent)" strokeWidth="1.5" />
    <line x1="105" y1="95" x2="105" y2="40" stroke="var(--accent)" strokeWidth="1.5" />
    <path d="M11 40 L19 40 L15 32 Z" fill="var(--accent)" />
    <path d="M101 40 L109 40 L105 32 Z" fill="var(--accent)" />
    
    {/* Center Pinnacle */}
    <line x1="60" y1="10" x2="60" y2="2" stroke="var(--accent)" strokeWidth="1.2" />
    <circle cx="60" cy="2" r="1.5" fill="var(--accent)" />
  </svg>
);

export default function RoyalEleganceClassicTemplate({ data, mode, slug }: TemplateProps) {
  const theme = royalEleganceClassicTheme;

  return (
    <div
      style={{
        ...themeToCssVars(theme),
        background: 'var(--bg)',
        backgroundImage: `radial-gradient(circle at 50% 30%, #fffefe 0%, var(--bg) 100%), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z' stroke='%23c5a059' stroke-width='0.4' stroke-opacity='0.085' fill='none'/%3E%3C/svg%3E")`,
        backgroundAttachment: 'fixed',
        color: 'var(--ink)',
        minHeight: '100vh',
      }}
    >
      {data.sections.musicPlayer && <MusicPlayer trackUrl={data.musicTrackUrl} />}

      <CurtainReveal3D
        curtainLabel="Open Magestic Love Invitation"
        curtainColor="var(--secondary)"
      >
        <div
          style={{
            height: 'calc(100% - 4rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '1.2rem',
            padding: '3.5rem 2.5rem',
            border: '2px solid var(--accent)',
            borderRadius: '16px',
            margin: '2rem 1.5rem',
            background: 'var(--surface)',
            boxShadow: '0 20px 40px rgba(92,26,43,0.08), inset 0 0 0 1px rgba(255,255,255,0.8)',
            position: 'relative',
          }}
        >
          {/* Inner gold frame detail */}
          <div
            style={{
              position: 'absolute',
              inset: '12px',
              border: '1.5px solid var(--accent-soft)',
              borderRadius: '10px',
              pointerEvents: 'none',
            }}
          />

          <PalaceCrestHeader />

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
      </CurtainReveal3D>

      {data.sections.scratchReveal && (
        <section style={{ padding: '5rem 1.5rem', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <SectionHead eyebrow="Grand Celebration" heading="Scratch to Reveal Date" />
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
          <SectionHead eyebrow="Countdown" heading="The Big Day is Approaching" />
          <div style={{ background: 'var(--surface)', border: '1px solid var(--accent-soft)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(92,26,43,0.03)' }}>
            <CountdownTimer targetDateISO={data.weddingDateTimeISO} />
          </div>
        </section>
      )}

      <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
        <SectionHead eyebrow="Schedule" heading="Ceremony Details" />
        <EventDetails events={data.events} dressCode={data.dressCode} />
      </section>

      {data.sections.gallery && data.gallery.length > 0 && (
        <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Gallery" heading="Our Journey" />
          <PhotoSlideshow images={data.gallery} />
        </section>
      )}

      {data.sections.rsvp && (
        <section style={{ padding: '2rem 1.5rem 6rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="RSVP" heading="Confirm Your Presence" />
          <div 
            style={{ 
              background: 'var(--surface)', 
              border: '1.5px solid var(--accent-soft)', 
              borderRadius: '16px', 
              padding: '2.5rem 2rem',
              boxShadow: '0 20px 40px rgba(92,26,43,0.05)'
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
        <path d="M60 4 L64 12 L60 20 L56 12 Z" fill="var(--secondary)" stroke="var(--accent)" strokeWidth="0.75" />
      </svg>
    </div>
  );
}
