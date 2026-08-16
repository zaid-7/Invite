'use client';

import type { InvitationData } from '../../types';
import { modernMinimalTheme, themeToCssVars } from '../../theme';
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

const MinimalOrnament = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: '0 auto 0.5rem' }}>
    <rect x="10" y="10" width="20" height="20" stroke="var(--accent)" strokeWidth="1" />
    <rect x="14" y="14" width="12" height="12" stroke="var(--accent-soft)" strokeWidth="0.5" />
    <circle cx="20" cy="20" r="1.5" fill="var(--accent)" />
  </svg>
);

export default function ModernMinimalTemplate({ data, mode, slug }: TemplateProps) {
  const theme = modernMinimalTheme;

  return (
    <div
      style={{
        ...themeToCssVars(theme),
        background: 'var(--bg)',
        backgroundImage: `radial-gradient(circle at 50% 30%, #ffffff 0%, var(--bg) 100%), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='0.65' fill='%231a1a1a' fill-opacity='0.035'/%3E%3C/svg%3E")`,
        backgroundAttachment: 'fixed',
        color: 'var(--ink)',
        minHeight: '100vh',
      }}
    >
      {data.sections.musicPlayer && <MusicPlayer trackUrl={data.musicTrackUrl} />}

      <DoorReveal3D doorLabel="Enter Invitation">
        <div
          style={{
            height: 'calc(100% - 4rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '1rem',
            padding: '3.5rem 3rem',
            background: 'var(--surface)',
            border: '1px solid var(--accent)',
            borderRadius: '0px',
            margin: '2rem 1.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.8)',
            position: 'relative',
          }}
        >
          {/* Inset border detail */}
          <div
            style={{
              position: 'absolute',
              inset: '8px',
              border: '1px solid var(--accent-soft)',
              pointerEvents: 'none',
            }}
          />

          <MinimalOrnament />

          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.68rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--secondary)', zIndex: 1, margin: 0 }}>
            Together with their families
          </p>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 7vw, 3.8rem)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink)', fontWeight: 'bold', zIndex: 1 }}>
            {data.coupleNames.partnerOne} &amp; {data.coupleNames.partnerTwo}
          </h1>

          {data.tagline && (
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-muted)', maxWidth: '36ch', fontSize: '0.85rem', lineHeight: '1.7', zIndex: 1, margin: 0 }}>
              {data.tagline}
            </p>
          )}
        </div>
      </DoorReveal3D>

      {data.sections.scratchReveal && (
        <section style={{ padding: '5rem 1.5rem', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <SectionHead eyebrow="Details" heading="Save the Date" />
          <ScratchReveal>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--secondary)' }}>
              Wedding Ceremony
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', margin: '0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {new Date(data.weddingDateTimeISO).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </ScratchReveal>
        </section>
      )}

      {data.sections.countdown && (
        <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Countdown" heading="Timing" />
          <div style={{ background: 'var(--surface)', border: '1px solid var(--accent-soft)', borderRadius: '0px', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
            <CountdownTimer targetDateISO={data.weddingDateTimeISO} />
          </div>
        </section>
      )}

      <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
        <SectionHead eyebrow="Events" heading="Occasions" />
        <EventDetails events={data.events} dressCode={data.dressCode} />
      </section>

      {data.sections.gallery && data.gallery.length > 0 && (
        <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Moments" heading="Gallery" />
          <PhotoSlideshow images={data.gallery} />
        </section>
      )}

      {data.sections.rsvp && (
        <section style={{ padding: '2rem 1.5rem 6rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Response" heading="RSVP" />
          <div 
            style={{ 
              background: 'var(--surface)', 
              border: '1px solid var(--accent)', 
              borderRadius: '0px', 
              padding: '2.5rem 2rem',
              boxShadow: '0 15px 30px rgba(0,0,0,0.04)'
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
      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.68rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--secondary)', margin: 0 }}>
        {eyebrow}
      </p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', margin: '0.4rem 0 0', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 'bold' }}>
        {heading}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0.8rem' }}>
        <div style={{ width: 16, height: 1, background: 'var(--accent)' }} />
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />
        <div style={{ width: 16, height: 1, background: 'var(--accent)' }} />
      </div>
    </div>
  );
}
