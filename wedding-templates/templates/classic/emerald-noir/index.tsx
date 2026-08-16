'use client';

import type { InvitationData } from '../../types';
import { emeraldNoirTheme, themeToCssVars } from '../../theme';
import { CountdownTimer } from '../../shared/features/CountdownTimer';
import { ScratchReveal } from '../../shared/features/ScratchReveal';
import { DoorReveal3D } from '../../shared/features/DoorReveal3D';
import { EventDetails } from '../../shared/features/MapEmbed';
import { PhotoSlideshow } from '../../shared/features/PhotoSlideshow';
import { RSVPForm } from '../../shared/features/RSVPForm';
import { MusicPlayer } from '../../shared/features/MusicPlayer';

interface TemplateProps {
  data: InvitationData;
}

export default function EmeraldNoirTemplate({ data }: TemplateProps) {
  const theme = emeraldNoirTheme;

  return (
    <div
      style={{
        ...themeToCssVars(theme),
        background: 'var(--bg)',
        color: 'var(--ink)',
        minHeight: '100vh',
      }}
    >
      {data.sections.musicPlayer && <MusicPlayer trackUrl={data.musicTrackUrl} />}

      <DoorReveal3D doorLabel="Tap to open your invitation">
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '1rem',
            padding: '2rem',
          }}
        >
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            Together with their families
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(2.8rem, 9vw, 4.6rem)', margin: 0 }}>
            {data.coupleNames.partnerOne} <span style={{ color: 'var(--accent)' }}>&amp;</span> {data.coupleNames.partnerTwo}
          </h1>
          {data.tagline && (
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-muted)', maxWidth: '32ch' }}>{data.tagline}</p>
          )}
        </div>
      </DoorReveal3D>

      {data.sections.scratchReveal && (
        <section style={{ padding: '5rem 1.5rem', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <SectionHead eyebrow="A little secret" heading="Scratch to reveal our date" />
          <ScratchReveal>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              Save the date
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '2.3rem', margin: '0.3rem 0' }}>
              {new Date(data.weddingDateTimeISO).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </ScratchReveal>
        </section>
      )}

      {data.sections.countdown && (
        <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Counting down" heading={`Until we say "I do"`} />
          <CountdownTimer targetDateISO={data.weddingDateTimeISO} />
        </section>
      )}

      <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
        <SectionHead eyebrow="The celebration" heading="Event Details" />
        <EventDetails events={data.events} dressCode={data.dressCode} />
      </section>

      {data.sections.gallery && data.gallery.length > 0 && (
        <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Our story" heading="A Few Moments" />
          <PhotoSlideshow images={data.gallery} />
        </section>
      )}

      {data.sections.rsvp && (
        <section style={{ padding: '2rem 1.5rem 6rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Kindly respond" heading="RSVP" />
          <div style={{ background: 'var(--surface)', border: '1px solid var(--accent-soft)', borderRadius: 6, padding: '2.2rem' }}>
            <RSVPForm />
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHead({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent)', margin: 0 }}>
        {eyebrow}
      </p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', margin: '0.4rem 0 0' }}>
        {heading}
      </h2>
      <div style={{ width: 64, height: 1, background: 'var(--accent)', margin: '0.9rem auto 0' }} />
    </div>
  );
}
