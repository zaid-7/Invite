'use client';

import type { InvitationData } from '../../types';
import { crimsonRoyaleTheme, themeToCssVars } from '../../theme';
import { CountdownTimer } from '../../shared/features/CountdownTimer';
import { ScratchReveal } from '../../shared/features/ScratchReveal';
import { CardReveal3D } from '../../shared/features/CardReveal3D';
import { EventDetails } from '../../shared/features/MapEmbed';
import { PhotoSlideshow } from '../../shared/features/PhotoSlideshow';
import { RSVPForm } from '../../shared/features/RSVPForm';
import { MusicPlayer } from '../../shared/features/MusicPlayer';

interface TemplateProps {
  data: InvitationData;
  mode?: 'preview' | 'live';
  slug?: string;
}

const MandalaOrnament = () => (
  <svg width="56" height="56" viewBox="0 0 100 100" fill="none" style={{ margin: '0 auto 0.5rem' }}>
    <circle cx="50" cy="50" r="45" stroke="var(--accent)" strokeWidth="0.5" strokeDasharray="3 3" />
    <circle cx="50" cy="50" r="16" stroke="var(--accent)" strokeWidth="1" />
    <circle cx="50" cy="50" r="6" fill="var(--accent)" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
      <g key={idx} transform={`rotate(${angle} 50 50)`}>
        <path d="M50 15 C45 30, 42 40, 50 50 C58 40, 55 30, 50 15" stroke="var(--accent)" strokeWidth="1" fill="none" />
        <path d="M50 25 C47 35, 45 42, 50 48 C55 42, 53 35, 50 25" stroke="var(--accent)" strokeWidth="0.5" fill="none" strokeOpacity="0.7" />
        <circle cx="50" cy="22" r="2" fill="var(--accent)" />
      </g>
    ))}
  </svg>
);

export default function CrimsonRoyaleTemplate({ data, mode, slug }: TemplateProps) {
  const theme = crimsonRoyaleTheme;

  return (
    <div
      style={{
        ...themeToCssVars(theme),
        background: 'radial-gradient(circle at 50% 30%, #201a1b 0%, var(--bg) 100%)',
        color: 'var(--ink)',
        minHeight: '100vh',
      }}
    >
      {data.sections.musicPlayer && <MusicPlayer trackUrl={data.musicTrackUrl} />}

      <CardReveal3D
        cardLabel="Open Crimson Royale Invitation"
        envelopeColor="var(--surface)"
        accentColor="var(--accent)"
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
            padding: '3rem 2rem',
            border: '2px solid var(--accent)',
            borderRadius: '16px',
            margin: '2rem 1.5rem',
            background: 'linear-gradient(135deg, var(--surface) 0%, #151515 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.05)',
            position: 'relative',
          }}
        >
          {/* Inner offset frame */}
          <div
            style={{
              position: 'absolute',
              inset: '12px',
              border: '1px solid var(--accent-soft)',
              borderRadius: '10px',
              pointerEvents: 'none',
            }}
          />

          <MandalaOrnament />
          
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent)', margin: 0, zIndex: 1 }}>
            Together with their families
          </p>
          
          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2.5rem, 8vw, 4rem)', margin: 0, color: 'var(--ink)', fontWeight: 'normal', zIndex: 1 }}>
            {data.coupleNames.partnerOne} <span style={{ color: 'var(--accent)' }}>&amp;</span> {data.coupleNames.partnerTwo}
          </h1>
          
          {data.tagline && (
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-muted)', maxWidth: '34ch', lineHeight: '1.6', fontSize: '0.92rem', zIndex: 1, margin: 0 }}>
              {data.tagline}
            </p>
          )}
        </div>
      </CardReveal3D>

      {data.sections.scratchReveal && (
        <section style={{ padding: '5rem 1.5rem', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <SectionHead eyebrow="Save The Date" heading="Scratch to Reveal" />
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
          <SectionHead eyebrow="The Occasion" heading="Countdown to Union" />
          <div style={{ background: 'var(--surface)', border: '1px solid var(--accent-soft)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
            <CountdownTimer targetDateISO={data.weddingDateTimeISO} />
          </div>
        </section>
      )}

      <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
        <SectionHead eyebrow="The celebrations" heading="Ceremony Schedule" />
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
          <SectionHead eyebrow="Response" heading="RSVP Registration" />
          <div 
            style={{ 
              background: 'linear-gradient(135deg, var(--surface) 0%, #151515 100%)', 
              border: '1px solid var(--accent-soft)', 
              borderRadius: '12px', 
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
      <svg width="120" height="24" viewBox="0 0 120 24" fill="none" style={{ margin: '0.8rem auto 0' }}>
        <path d="M10 12h35M75 12h35" stroke="var(--accent)" strokeWidth="0.75" strokeLinecap="round" strokeOpacity="0.5" />
        <circle cx="60" cy="12" r="3" fill="var(--accent)" />
        <path d="M60 4 C57 8, 54 12, 60 20 C66 12, 63 8, 60 4" stroke="var(--accent)" strokeWidth="0.75" fill="none" />
      </svg>
    </div>
  );
}
