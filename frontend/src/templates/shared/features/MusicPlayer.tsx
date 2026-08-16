'use client';

import { useRef, useState } from 'react';

interface MusicPlayerProps {
  trackUrl?: string;
}

export function MusicPlayer({ trackUrl }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!trackUrl) return null;

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        /* autoplay policies can block this until a user gesture — this click IS the gesture, so it should succeed */
      });
    }
    setPlaying(!playing);
  }

  return (
    <>
      <audio ref={audioRef} src={trackUrl} loop />
      <button
        onClick={toggle}
        aria-label="Toggle background music"
        aria-pressed={playing}
        style={{
          position: 'fixed',
          bottom: '1.4rem',
          right: '1.4rem',
          zIndex: 20,
          width: 46,
          height: 46,
          borderRadius: '50%',
          background: playing ? 'var(--accent)' : 'var(--surface)',
          border: '1px solid var(--accent-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 22px -10px rgba(0,0,0,0.5)',
        }}
      >
        <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="var(--ink)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </button>
    </>
  );
}
