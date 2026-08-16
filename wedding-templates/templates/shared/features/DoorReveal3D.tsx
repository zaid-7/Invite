'use client';

import { useState, type ReactNode } from 'react';

interface DoorReveal3DProps {
  children: ReactNode;   // content revealed once doors open
  doorLabel?: string;
}

// Two door panels using CSS perspective + rotateY — no Three.js needed.
// Good enough for Classic-tier "premium door open" effect at a fraction of the bundle cost.
export function DoorReveal3D({ children, doorLabel = 'Tap to open' }: DoorReveal3DProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        perspective: '1400px',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>

      {/* Doors stay mounted through their own transition, then stop intercepting clicks. */}
      <button
        onClick={() => setOpen(true)}
        aria-label={doorLabel}
        disabled={open}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          border: 'none',
          cursor: open ? 'default' : 'pointer',
          background: 'transparent',
          padding: 0,
          pointerEvents: open ? 'none' : 'auto',
          opacity: open ? 0 : 1,
          transition: 'opacity 0.4s ease 0.7s',
        }}
      >
        {/* Left door */}
          <div
            style={{
              width: '50%',
              height: '100%',
              background: 'var(--surface)',
              borderRight: '1px solid var(--accent-soft)',
              transformOrigin: 'left center',
              transform: open ? 'rotateY(-110deg)' : 'rotateY(0deg)',
              transition: 'transform 1.1s cubic-bezier(.65,0,.35,1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '0.5rem',
            }}
          >
            <div style={{ width: 2, height: '60%', background: 'var(--accent)' }} />
          </div>
          {/* Right door */}
          <div
            style={{
              width: '50%',
              height: '100%',
              background: 'var(--surface)',
              borderLeft: '1px solid var(--accent-soft)',
              transformOrigin: 'right center',
              transform: open ? 'rotateY(110deg)' : 'rotateY(0deg)',
              transition: 'transform 1.1s cubic-bezier(.65,0,.35,1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingLeft: '0.5rem',
            }}
          >
            <div style={{ width: 2, height: '60%', background: 'var(--accent)' }} />
          </div>

          <span
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-label)',
              fontSize: '0.75rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
            }}
          >
            {doorLabel}
          </span>
      </button>
    </div>
  );
}
