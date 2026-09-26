'use client';

import { useState } from 'react';

interface RSVPFormProps {
  onSubmit?: (data: { name: string; attending: 'yes' | 'no'; guests: number; message: string }) => void | Promise<void>;
  slug?: string;
  mode?: 'preview' | 'live';
}

// Frontend-oriented component - wired to optionally perform POST /api/invitations/[slug]/rsvp submissions
export function RSVPForm({ onSubmit, slug, mode }: RSVPFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit({ name, attending, guests, message });
    } else if (slug && mode === 'live') {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api'}/invitations/${slug}/rsvp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestName: name,
            response: attending === 'yes' ? 'ATTENDING' : 'NOT_ATTENDING',
            guestCount: attending === 'yes' ? guests : 0,
            message: message,
          }),
        });
        const resData = await res.json();
        if (resData.status !== 'success') {
          alert(resData.message || 'Submission failed.');
          return;
        }
      } catch (err) {
        console.error(err);
        alert('Failed to connect to API server.');
        return;
      }
    } else {
      console.log('Sandbox/Preview RSVP Submitted:', { name, attending, guests, message });
    }
    setSubmitted(true);
  }

  const inputStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    padding: '0.6rem 0.2rem',
    border: 'none',
    borderBottom: '1px solid var(--accent-soft)',
    background: 'transparent',
    color: 'var(--ink)',
    outline: 'none',
    width: '100%',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-label)',
    fontSize: '0.68rem',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--ink-muted)',
  };

  if (submitted) {
    return (
      <p style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.3rem', color: 'var(--ink)' }}>
        {attending === 'yes'
          ? `Thank you, ${name || 'friend'} — we can't wait to celebrate with you.`
          : `Thank you, ${name || 'friend'} — you'll be with us in spirit.`}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label style={labelStyle} htmlFor="rsvp-name">Your name</label>
        <input id="rsvp-name" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={labelStyle} htmlFor="rsvp-attending">Will you attend</label>
          <select
            id="rsvp-attending"
            style={inputStyle}
            value={attending}
            onChange={(e) => setAttending(e.target.value as 'yes' | 'no')}
          >
            <option value="yes">Joyfully accept</option>
            <option value="no">Regretfully decline</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={labelStyle} htmlFor="rsvp-guests">Number of guests</label>
          <input
            id="rsvp-guests"
            type="number"
            min={1}
            max={10}
            style={inputStyle}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label style={labelStyle} htmlFor="rsvp-message">A message for the couple</label>
        <textarea id="rsvp-message" rows={3} style={inputStyle} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      <button
        type="submit"
        style={{
          fontFamily: 'var(--font-label)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          fontSize: '0.78rem',
          padding: '0.9rem',
          background: 'var(--accent)',
          color: 'var(--bg)',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Send RSVP
      </button>
    </form>
  );
}
