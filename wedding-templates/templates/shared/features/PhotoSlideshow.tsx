import type { GalleryImage } from '../../types';

interface PhotoSlideshowProps {
  images: GalleryImage[];
}

// Simple responsive grid to start with — swap the wrapper for an embla-carousel-react
// or framer-motion drag carousel once you want a true slideshow interaction.
export function PhotoSlideshow({ images }: PhotoSlideshowProps) {
  if (!images.length) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
      {images.slice(0, 6).map((img, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={img.url}
          src={img.url}
          alt={img.alt ?? ''}
          style={{
            width: '100%',
            aspectRatio: '3 / 4',
            objectFit: 'cover',
            borderRadius: 3,
            transform: i === 1 ? 'translateY(10%)' : undefined,
          }}
        />
      ))}
    </div>
  );
}
