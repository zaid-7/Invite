'use client';

import { useState, type ReactNode } from 'react';

interface CurtainRevealProps {
  children: ReactNode;
  label?: string;
}

// Two velvet-style curtain panels that draw apart — the Royal-tier signature open.
// Pairs well with CinematicHero behind it (video plays underneath from the start).
export function CurtainReveal({ children, label = 'Begin' }: CurtainRevealProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>

      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '50.5%',
          background: 'linear-gradient(135deg, var(--secondary) 0%, rgba(92,26,43,0.9) 50%, var(--bg) 100%)',
          boxShadow: 'inset -30px 0 65px -15px rgba(0,0,0,0.85), 5px 0 15px rgba(0,0,0,0.3)',
          borderRight: '3px double var(--accent)',
          transform: open ? 'translateX(-105%)' : 'translateX(0)',
          transition: 'transform 1.6s cubic-bezier(.76,0,.24,1)',
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '50.5%',
          background: 'linear-gradient(225deg, var(--secondary) 0%, rgba(92,26,43,0.9) 50%, var(--bg) 100%)',
          boxShadow: 'inset 30px 0 65px -15px rgba(0,0,0,0.85), -5px 0 15px rgba(0,0,0,0.3)',
          borderLeft: '3px double var(--accent)',
          transform: open ? 'translateX(105%)' : 'translateX(0)',
          transition: 'transform 1.6s cubic-bezier(.76,0,.24,1)',
          zIndex: 2,
        }}
      />

      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            padding: '0.9rem 2.2rem',
            borderRadius: 999,
            border: '1px solid var(--accent)',
            color: 'var(--accent)',
            background: 'rgba(0,0,0,0.25)',
            fontFamily: 'var(--font-label)',
            fontSize: '0.78rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
          }}
        >
          {label}
        </button>
      )}
    </div>
  );
}
