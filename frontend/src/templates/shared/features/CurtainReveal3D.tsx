'use client';

import { useState, type ReactNode } from 'react';

interface CurtainReveal3DProps {
  children: ReactNode;
  curtainLabel?: string;
  curtainColor?: string; // e.g. '#7A1C25' or default velvet red
}

export function CurtainReveal3D({ children, curtainLabel = 'Enter Celebration', curtainColor = '#7A1C25' }: CurtainReveal3DProps) {
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
      }}
    >
      {/* Revealed content panel */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(25px)',
          transition: 'opacity 1.2s cubic-bezier(.25,1,.5,1) 0.3s, transform 1.2s cubic-bezier(.25,1,.5,1) 0.3s',
        }}
      >
        {children}
      </div>

      {/* Velvet curtain split pages */}
      <button
        onClick={() => setOpen(true)}
        aria-label={curtainLabel}
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
          transition: 'opacity 0.5s ease 0.8s',
          zIndex: 20,
        }}
      >
        {/* Left Curtain Panel with folding pleats */}
        <div
          style={{
            width: '50%',
            height: '100%',
            background: `linear-gradient(90deg, ${curtainColor} 0%, #4A0E13 25%, ${curtainColor} 50%, #4A0E13 75%, ${curtainColor} 100%)`,
            transform: open ? 'translateX(-100%)' : 'translateX(0)',
            transition: 'transform 1.2s cubic-bezier(.65,0,.35,1)',
            position: 'relative',
            boxShadow: 'inset -15px 0 25px rgba(0,0,0,0.6), 10px 0 20px rgba(0,0,0,0.4)',
          }}
        >
          {/* Gold fringe trim left */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '6px',
              backgroundImage: 'repeating-linear-gradient(0deg, #D4AF37, #D4AF37 4px, #AA7C11 4px, #AA7C11 8px)',
              boxShadow: '0 0 5px rgba(212,175,55,0.5)',
            }}
          />
          {/* Left curtain drape tassels */}
          <div
            style={{
              position: 'absolute',
              bottom: '25%',
              right: '15px',
              opacity: 0.85,
            }}
          >
            {/* Tassel SVG */}
            <svg width="24" height="48" viewBox="0 0 24 48">
              <path d="M12 0 L12 24 M12 24 C 6 24, 6 28, 12 32 C 18 28, 18 24, 12 24 Z" stroke="#D4AF37" strokeWidth="1.5" fill="#AA7C11" />
              <path d="M8 32 L4 48 M10 32 L8 48 M12 32 L12 48 M14 32 L16 48 M16 32 L20 48" stroke="#D4AF37" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Right Curtain Panel with folding pleats */}
        <div
          style={{
            width: '50%',
            height: '100%',
            background: `linear-gradient(90deg, ${curtainColor} 0%, #4A0E13 25%, ${curtainColor} 50%, #4A0E13 75%, ${curtainColor} 100%)`,
            transform: open ? 'translateX(100%)' : 'translateX(0)',
            transition: 'transform 1.2s cubic-bezier(.65,0,.35,1)',
            position: 'relative',
            boxShadow: 'inset 15px 0 25px rgba(0,0,0,0.6), -10px 0 20px rgba(0,0,0,0.4)',
          }}
        >
          {/* Gold fringe trim right */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '6px',
              backgroundImage: 'repeating-linear-gradient(0deg, #D4AF37, #D4AF37 4px, #AA7C11 4px, #AA7C11 8px)',
              boxShadow: '0 0 5px rgba(212,175,55,0.5)',
            }}
          />
          {/* Right curtain drape tassels */}
          <div
            style={{
              position: 'absolute',
              bottom: '25%',
              left: '15px',
              opacity: 0.85,
            }}
          >
            {/* Tassel SVG */}
            <svg width="24" height="48" viewBox="0 0 24 48">
              <path d="M12 0 L12 24 M12 24 C 6 24, 6 28, 12 32 C 18 28, 18 24, 12 24 Z" stroke="#D4AF37" strokeWidth="1.5" fill="#AA7C11" />
              <path d="M8 32 L4 48 M10 32 L8 48 M12 32 L12 48 M14 32 L16 48 M16 32 L20 48" stroke="#D4AF37" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Central golden pulling label */}
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(12,12,12,0.92)',
            border: '2px solid #D4AF37',
            padding: '0.85rem 1.8rem',
            borderRadius: '50px',
            fontFamily: 'var(--font-label)',
            fontSize: '0.72rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#D4AF37',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.35)',
            zIndex: 30,
            whiteSpace: 'nowrap',
          }}
        >
          {curtainLabel}
        </span>
      </button>
    </div>
  );
}
