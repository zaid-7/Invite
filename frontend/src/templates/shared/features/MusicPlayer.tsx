'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  trackUrl?: string;
}

export function MusicPlayer({ trackUrl }: MusicPlayerProps) {
  return trackUrl ? <TrackPlayer key={trackUrl} trackUrl={trackUrl} /> : null;
}

function TrackPlayer({ trackUrl }: { trackUrl: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const mountedRef = useRef(false);
  const generationRef = useRef(0);
  const wantsPlaybackRef = useRef(true);
  const failedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [errorText, setErrorText] = useState('');

  const reportError = useCallback((error: unknown) => {
    if (!mountedRef.current || failedRef.current) return;
    failedRef.current = true;
    console.error('Unable to play invitation background music', trackUrl, error);
    setPlaying(false);
    setErrorText('Music could not be played. Tap the music button to retry.');
  }, [trackUrl]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const generation = generationRef.current;
    void audio.play().catch((error: unknown) => {
      if (!mountedRef.current || generation !== generationRef.current) return;
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        // Audible autoplay requires a guest interaction in some browsers.
        return;
      }
      reportError(error);
    });
  }, [reportError]);

  useEffect(() => {
    const audio = audioRef.current;
    mountedRef.current = true;
    generationRef.current += 1;

    const startOnInteraction = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('[data-music-control]')) return;
      if (event instanceof KeyboardEvent && event.key !== 'Enter' && event.key !== ' ') return;
      if (wantsPlaybackRef.current && !failedRef.current && audio?.paused) play();
    };

    document.addEventListener('click', startOnInteraction, true);
    document.addEventListener('keydown', startOnInteraction, true);
    play();

    return () => {
      mountedRef.current = false;
      document.removeEventListener('click', startOnInteraction, true);
      document.removeEventListener('keydown', startOnInteraction, true);
      audio?.pause();
    };
  }, [play]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused || audio.error) {
      wantsPlaybackRef.current = true;
      failedRef.current = false;
      setErrorText('');
      audio.muted = false;
      if (audio.error) audio.load();
      play();
      return;
    }
    audio.muted = !audio.muted;
    wantsPlaybackRef.current = !audio.muted;
  }

  const audible = playing && !muted;
  const label = audible ? 'Mute background music' : playing ? 'Unmute background music' : 'Play background music';

  return (
    <>
      <audio
        ref={audioRef}
        src={trackUrl}
        loop
        preload="none"
        onPlaying={() => {
          setPlaying(true);
          failedRef.current = false;
          setErrorText('');
        }}
        onPause={() => setPlaying(false)}
        onVolumeChange={event => setMuted(event.currentTarget.muted)}
        onError={event => reportError(event.currentTarget.error)}
      />
      <div style={{ position: 'fixed', bottom: '1.4rem', right: '1.4rem', zIndex: 10000 }}>
        {errorText && (
          <p role="alert" style={{ maxWidth: 240, padding: 12, borderRadius: 8, background: 'var(--surface, #fff)', color: 'var(--ink, #1c1917)' }}>
            {errorText}
          </p>
        )}
        <button
          type="button"
          data-music-control
          onClick={toggle}
          aria-label={label}
          aria-pressed={audible}
          title={label}
          className="focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{
            marginLeft: 'auto',
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: audible ? 'var(--accent, #c8a050)' : 'var(--surface, #fff)',
            color: 'var(--ink, #1c1917)',
            border: '1px solid var(--accent-soft, #c8a050)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 22px -10px rgba(0,0,0,0.5)',
          }}
        >
          {audible ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
        </button>
      </div>
    </>
  );
}
