'use client';

import React, { useState, useEffect } from 'react';
import type { GalleryImage } from '../../types';

interface PhotoSlideshowProps {
  images: GalleryImage[];
}

export function PhotoSlideshow({ images }: PhotoSlideshowProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Slider Window */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1.5',
          maxHeight: '420px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
          border: '1px solid var(--accent-soft)',
          background: 'var(--surface)',
        }}
      >
        {images.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.url}
            src={img.url}
            alt={img.alt ?? ''}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: activeIdx === i ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              zIndex: activeIdx === i ? 2 : 1,
            }}
          />
        ))}
      </div>

      {/* Navigation Indicators */}
      {images.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '1.2rem' }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: activeIdx === i ? 'var(--accent)' : 'var(--accent-soft)',
                opacity: activeIdx === i ? 1 : 0.4,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
