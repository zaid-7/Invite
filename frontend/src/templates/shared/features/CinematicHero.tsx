'use client';

interface CinematicHeroProps {
  videoUrl?: string;
  posterUrl?: string;
  partnerOne: string;
  partnerTwo: string;
  tagline?: string;
}

// Video-based hero background for Royal tier. Falls back to poster/gradient if no video —
// never block the render on a missing asset. Source stock footage from a licensed library
// and grade it to your palette rather than reusing any specific product's clips.
export function CinematicHero({ videoUrl, posterUrl, partnerOne, partnerTwo, tagline }: CinematicHeroProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 30%, var(--secondary), var(--bg))',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.55))',
        }}
      />

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
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
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
          }}
        >
          {partnerOne} <span style={{ color: 'var(--accent)' }}>&amp;</span> {partnerTwo}
        </h1>
        {tagline && (
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-muted)', maxWidth: '32ch' }}>{tagline}</p>
        )}
      </div>
    </div>
  );
}
