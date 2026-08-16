'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDateISO: string;
}

function getTimeLeft(target: Date) {
  const diff = Math.max(target.getTime() - Date.now(), 0);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

export function CountdownTimer({ targetDateISO }: CountdownTimerProps) {
  const target = new Date(targetDateISO);
  const [time, setTime] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDateISO]);

  const units: [string, number][] = [
    ['Days', time.days],
    ['Hours', time.hours],
    ['Minutes', time.minutes],
    ['Seconds', time.seconds],
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
      {units.map(([label, value]) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.4rem',
              color: 'var(--ink)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {String(value).padStart(2, '0')}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-label)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginTop: '0.25rem',
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
