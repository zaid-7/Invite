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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 1.2s cubic-bezier(.25,1,.5,1) 0.2s, transform 1.2s cubic-bezier(.25,1,.5,1) 0.2s',
        }}
      >
        {children}
      </div>

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
            background: 'var(--bg)',
            borderRight: '1px solid var(--accent-soft)',
            transformOrigin: 'left center',
            transform: open ? 'rotateY(-110deg)' : 'rotateY(0deg)',
            transition: 'transform 1.1s cubic-bezier(.65,0,.35,1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'relative',
            boxShadow: 'inset -20px 0 40px -10px rgba(0,0,0,0.5)',
          }}
        >
          {/* Ornate Inner Gold Leaf Border */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              bottom: '12px',
              left: '12px',
              right: '6px',
              border: '1px solid var(--accent-soft)',
              borderRight: 'none',
              pointerEvents: 'none',
            }}
          />
          
          {/* Half of lock knob */}
          <div
            style={{
              width: '28px',
              height: '56px',
              border: '2px solid var(--accent)',
              borderRight: 'none',
              borderTopLeftRadius: '28px',
              borderBottomLeftRadius: '28px',
              background: 'radial-gradient(circle at right, var(--surface) 0%, rgba(200,160,80,0.35) 100%)',
              boxShadow: '-3px 3px 6px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '6px',
              zIndex: 10,
            }}
          >
            <div style={{ width: '4px', height: '24px', borderRadius: '2px', background: 'var(--accent)' }} />
          </div>
        </div>

        {/* Right door */}
        <div
          style={{
            width: '50%',
            height: '100%',
            background: 'var(--bg)',
            borderLeft: '1px solid var(--accent-soft)',
            transformOrigin: 'right center',
            transform: open ? 'rotateY(110deg)' : 'rotateY(0deg)',
            transition: 'transform 1.1s cubic-bezier(.65,0,.35,1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            boxShadow: 'inset 20px 0 40px -10px rgba(0,0,0,0.5)',
          }}
        >
          {/* Ornate Inner Gold Leaf Border */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              bottom: '12px',
              right: '12px',
              left: '6px',
              border: '1px solid var(--accent-soft)',
              borderLeft: 'none',
              pointerEvents: 'none',
            }}
          />

          {/* Half of lock knob */}
          <div
            style={{
              width: '28px',
              height: '56px',
              border: '2px solid var(--accent)',
              borderLeft: 'none',
              borderTopRightRadius: '28px',
              borderBottomRightRadius: '28px',
              background: 'radial-gradient(circle at left, var(--surface) 0%, rgba(200,160,80,0.35) 100%)',
              boxShadow: '3px 3px 6px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingLeft: '6px',
              zIndex: 10,
            }}
          >
            <div style={{ width: '4px', height: '24px', borderRadius: '2px', background: 'var(--accent)' }} />
          </div>
        </div>

        <span
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-label)',
            fontSize: '0.72rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            zIndex: 10,
          }}
        >
          {doorLabel}
        </span>
      </button>
    </div>
  );
}
