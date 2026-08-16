'use client';

import { useState } from 'react';

interface RSVPFormProps {
  onSubmit?: (data: { name: string; attending: 'yes' | 'no'; guests: number; message: string }) => void | Promise<void>;
}

// Frontend-only by default — wire onSubmit to your API route (e.g. POST /api/invitations/[id]/rsvp)
// to actually persist responses into your dashboard's guest inbox.
export function RSVPForm({ onSubmit }: RSVPFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit?.({ name, attending, guests, message });
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
