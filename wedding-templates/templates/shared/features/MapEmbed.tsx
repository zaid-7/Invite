import type { VenueDetail } from '../../types';

interface EventDetailsProps {
  events: VenueDetail[];
  dressCode?: string;
}

export function EventDetails({ events, dressCode }: EventDetailsProps) {
  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      {events.map((event) => (
        <div
          key={event.label}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--accent-soft)',
            borderRadius: 4,
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <div>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', margin: 0 }}>
              {event.label}
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--ink)', margin: '0.25rem 0 0' }}>
              {event.venueName}
            </p>
            <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.82rem', color: 'var(--ink-muted)', margin: '0.2rem 0 0' }}>
              {event.time} · {event.address}
            </p>
          </div>
          {event.mapUrl && (
            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-label)', fontSize: '0.78rem', color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--accent)', whiteSpace: 'nowrap' }}
            >
              View map
            </a>
          )}
        </div>
      ))}

      {dressCode && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--accent-soft)', borderRadius: 4, padding: '1.5rem' }}>
          <p style={{ fontFamily: 'var(--font-label)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', margin: 0 }}>
            Dress code
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--ink)', margin: '0.25rem 0 0' }}>{dressCode}</p>
        </div>
      )}
    </div>
  );
}
