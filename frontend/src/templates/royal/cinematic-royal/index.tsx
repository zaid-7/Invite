'use client';

import type { InvitationData } from '../../types';
import { cinematicRoyalTheme, themeToCssVars } from '../../theme';
import { CountdownTimer } from '../../shared/features/CountdownTimer';
import { VideoBackground } from '../../shared/features/VideoBackground';
import { EventDetails } from '../../shared/features/MapEmbed';
import { PhotoSlideshow } from '../../shared/features/PhotoSlideshow';
import { RSVPForm } from '../../shared/features/RSVPForm';
import { MusicPlayer } from '../../shared/features/MusicPlayer';
import { ScratchReveal } from '../../shared/features/ScratchReveal';

interface TemplateProps {
  data: InvitationData;
  mode?: 'preview' | 'live';
  slug?: string;
}

export default function CinematicRoyalTemplate({ data, mode, slug }: TemplateProps) {
  const theme = cinematicRoyalTheme;

  return (
    <div style={{ ...themeToCssVars(theme), background: 'var(--bg)', color: 'var(--ink)', minHeight: '100vh' }}>
      {data.sections.musicPlayer && <MusicPlayer trackUrl={data.musicTrackUrl} />}

      <VideoBackground
        videoSrc="/royal-videos/royal-heritage.mp4"
        partnerOne={data.coupleNames.partnerOne}
        partnerTwo={data.coupleNames.partnerTwo}
        tagline={data.tagline}
      />

      {data.sections.scratchReveal && (
        <section style={{ padding: '5rem 1.5rem 2rem', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <SectionHead eyebrow="Save The Date" heading="Scratch to Reveal" />
          <ScratchReveal>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>Wedding Ceremony</p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '2.4rem', margin: '0.4rem 0' }}>
              {new Date(data.weddingDateTimeISO).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </ScratchReveal>
        </section>
      )}

      {data.sections.countdown && (
        <section style={{ padding: '3rem 1.5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Counting down" heading={`Until we say "I do"`} />
          <GlassCard><CountdownTimer targetDateISO={data.weddingDateTimeISO} /></GlassCard>
        </section>
      )}

      <section style={{ padding: '3rem 1.5rem', maxWidth: 720, margin: '0 auto' }}>
        <SectionHead eyebrow="The celebration" heading="Event Details" />
        <GlassCard><EventDetails events={data.events} dressCode={data.dressCode} /></GlassCard>
      </section>

      {data.sections.gallery && data.gallery.length > 0 && (
        <section style={{ padding: '3rem 1.5rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Our story" heading="A Few Moments" />
          <PhotoSlideshow images={data.gallery} />
        </section>
      )}

      {data.sections.rsvp && (
        <section style={{ padding: '3rem 1.5rem 6rem', maxWidth: 720, margin: '0 auto' }}>
          <SectionHead eyebrow="Kindly respond" heading="RSVP" />
          <GlassCard><RSVPForm mode={mode} slug={slug} /></GlassCard>
        </section>
      )}
    </div>
  );
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1.5px solid var(--accent-soft)', borderRadius: '16px', padding: '2rem 1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative' }}>
      {children}
    </div>
  );
}

function SectionDivider() {
  return (
    <svg width="120" height="24" viewBox="0 0 120 24" fill="none" style={{ margin: '0.8rem auto 0' }}>
      <path d="M10 12h32M78 12h32" stroke="var(--accent)" strokeWidth="0.75" strokeOpacity="0.4" />
      <path d="M60 4 L64 12 L60 20 L56 12 Z" fill="var(--bg)" stroke="var(--accent)" strokeWidth="0.75" />
    </svg>
  );
}

function SectionHead({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
      <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.72rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent)', margin: 0 }}>{eyebrow}</p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', margin: '0.4rem 0 0', fontWeight: 'normal', color: 'var(--ink)' }}>{heading}</h2>
      <SectionDivider />
    </div>
  );
}
