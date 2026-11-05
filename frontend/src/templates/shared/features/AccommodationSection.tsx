interface AccommodationSectionProps {
  enabled?: boolean;
  details?: string;
  background?: string;
  color?: string;
}

export function AccommodationSection({
  enabled,
  details,
  background = 'var(--bg, #ffffff)',
  color = 'var(--ink, #2e3a5f)',
}: AccommodationSectionProps) {
  if (!enabled || !details?.trim()) return null;

  return (
    <section id="accommodation-section" style={{ background, color, padding: '4.5rem 1.5rem 1.5rem', textAlign: 'center' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 0.4rem', opacity: 0.9 }}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
        </svg>
        <h2 style={{
          fontFamily: 'var(--font-script, var(--font-display, serif))',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontStyle: 'italic',
          fontWeight: 'normal',
          margin: '0.2rem 0',
        }}>
          Accommodation
        </h2>
        <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', margin: '1rem auto', width: 160 }}>
          <div style={{ height: '1.2px', width: 60, background: color, opacity: 0.5 }} />
          <svg width="12" height="12" viewBox="0 0 24 24" fill={color}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5c0-3.09 2.41-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.09 0 5.5 2.41 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <div style={{ height: '1.2px', width: 60, background: color, opacity: 0.5 }} />
        </div>
        <p style={{
          fontFamily: 'var(--font-sans, var(--font-body, sans-serif))',
          fontSize: '0.92rem',
          lineHeight: 1.6,
          whiteSpace: 'pre-line',
          overflowWrap: 'anywhere',
          maxWidth: 460,
          margin: '1.2rem auto 0',
        }}>
          {details}
        </p>
      </div>
    </section>
  );
}
