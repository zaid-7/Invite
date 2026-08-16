'use client';

import { useState, type ReactNode } from 'react';

interface CardReveal3DProps {
  children: ReactNode;
  cardLabel?: string;
  envelopeColor?: string;
  accentColor?: string;
}

export function CardReveal3D({ children, cardLabel = 'Open Invitation', envelopeColor = '#1E1E1E', accentColor = '#D4AF37' }: CardReveal3DProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1200px',
      }}
    >
      {/* Revealed Inner Card Content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
          transition: 'opacity 1.2s cubic-bezier(.25,1,.5,1) 0.5s, transform 1.2s cubic-bezier(.25,1,.5,1) 0.5s',
          zIndex: 10,
        }}
      >
        {children}
      </div>

      {/* Envelope Cover Wrapper */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: open ? 'none' : 'auto',
          opacity: open ? 0 : 1,
          transform: open ? 'translateY(150px) scale(0.9)' : 'translateY(0) scale(1)',
          transition: 'opacity 0.8s cubic-bezier(.25,1,.5,1) 0.6s, transform 1.0s cubic-bezier(.25,1,.5,1) 0.4s',
          zIndex: 20,
        }}
      >
        <button
          onClick={() => setOpen(true)}
          aria-label={cardLabel}
          style={{
            width: '90%',
            maxWidth: '460px',
            height: '340px',
            background: envelopeColor,
            border: `1.5px solid ${accentColor}40`,
            borderRadius: '16px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.45), inset 0 0 40px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
            padding: 0,
            overflow: 'hidden',
          }}
        >
          {/* Decorative Corner Filigrees on the Envelope */}
          <div style={{ position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderTop: `2px solid ${accentColor}`, borderLeft: `2px solid ${accentColor}`, opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderTop: `2px solid ${accentColor}`, borderRight: `2px solid ${accentColor}`, opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, width: 24, height: 24, borderBottom: `2px solid ${accentColor}`, borderLeft: `2px solid ${accentColor}`, opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderBottom: `2px solid ${accentColor}`, borderRight: `2px solid ${accentColor}`, opacity: 0.5 }} />

          {/* Envelope Slit lines diagonal styling */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <line x1="0" y1="0" x2="230" y2="170" stroke={`${accentColor}25`} strokeWidth="1" />
            <line x1="460" y1="0" x2="230" y2="170" stroke={`${accentColor}25`} strokeWidth="1" />
            <line x1="0" y1="340" x2="230" y2="170" stroke={`${accentColor}25`} strokeWidth="1" />
            <line x1="460" y1="340" x2="230" y2="170" stroke={`${accentColor}25`} strokeWidth="1" />
          </svg>

          {/* Wax Seal Opener Button */}
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#8B0000',
              border: `2px solid ${accentColor}`,
              boxShadow: '0 8px 20px rgba(139,0,0,0.5), inset 0 0 10px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
              animation: 'pulse-seal 2s infinite ease-in-out',
            }}
          >
            {/* Heart monogram */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill={accentColor}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>

          <span
            style={{
              marginTop: '1.2rem',
              fontFamily: 'var(--font-label)',
              fontSize: '0.68rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: accentColor,
              fontWeight: 'bold',
              zIndex: 30,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            {cardLabel}
          </span>
        </button>
      </div>

      <style>{`
        @keyframes pulse-seal {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); box-shadow: 0 8px 25px rgba(212,175,55,0.4), inset 0 0 10px rgba(0,0,0,0.5); }
        }
      `}</style>
    </div>
  );
}
