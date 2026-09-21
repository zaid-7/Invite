// templates/manifest.ts
import React from 'react';
import dynamic from 'next/dynamic';

export type Tier = 'classic' | 'royal';

export interface TemplateManifestEntry {
  id: string;
  name: string;
  tier: Tier;
  thumbnail: string;
  features: string[];
  Component: React.ComponentType<any>;
}

// next/dynamic + ssr:false means a Royal template's video/curtain bundle never
// gets shipped to a viewer looking at a Classic invitation, and vice versa.
export const templateManifest: TemplateManifestEntry[] = [
  {
    id: 'emerald-noir',
    name: 'Emerald Noir',
    tier: 'classic',
    thumbnail: '/templates/thumbnails/emerald-noir.jpg',
    features: ['scratchReveal', 'countdown', 'doorReveal3d', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./classic/emerald-noir'), { ssr: false }),
  },
  {
    id: 'crimson-royale',
    name: 'Crimson Royale',
    tier: 'classic',
    thumbnail: '/templates/thumbnails/crimson-royale.jpg',
    features: ['scratchReveal', 'countdown', 'doorReveal3d', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./classic/crimson-royale'), { ssr: false }),
  },
  {
    id: 'royal-elegance-classic',
    name: 'Magestic Love',
    tier: 'classic',
    thumbnail: '/templates/thumbnails/royal-elegance-classic.jpg',
    features: ['scratchReveal', 'countdown', 'doorReveal3d', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./classic/royal-elegance-classic'), { ssr: false }),
  },
  {
    id: 'garden-romance',
    name: 'Garden Romance',
    tier: 'classic',
    thumbnail: '/templates/thumbnails/garden-romance.jpg',
    features: ['scratchReveal', 'countdown', 'doorReveal3d', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./classic/garden-romance'), { ssr: false }),
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    tier: 'classic',
    thumbnail: '/templates/thumbnails/modern-minimal.jpg',
    features: ['scratchReveal', 'countdown', 'doorReveal3d', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./classic/modern-minimal'), { ssr: false }),
  },
  {
    id: 'mughal-emerald',
    name: 'Mughal Emerald',
    tier: 'classic',
    thumbnail: '/templates/thumbnails/mughal-emerald.jpg',
    features: ['scratchReveal', 'countdown', 'doorReveal3d', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./classic/mughal-emerald'), { ssr: false }),
  },
  {
    id: 'rose-gold-blush',
    name: 'Rose Gold Blush',
    tier: 'classic',
    thumbnail: '/templates/thumbnails/rose-gold-blush.jpg',
    features: ['scratchReveal', 'countdown', 'doorReveal3d', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./classic/rose-gold-blush'), { ssr: false }),
  },
  {
    id: 'midnight-royal',
    name: 'Midnight Royal',
    tier: 'classic',
    thumbnail: '/templates/thumbnails/midnight-royal.jpg',
    features: ['scratchReveal', 'countdown', 'doorReveal3d', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./classic/midnight-royal'), { ssr: false }),
  },
  {
    id: 'cinematic-royal',
    name: 'Cinematic Royal',
    tier: 'royal',
    thumbnail: '/templates/thumbnails/cinematic-royal.jpg',
    features: ['videoBackground', 'scratchReveal', 'countdown', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./royal/cinematic-royal'), { ssr: false }),
  },
  {
    id: 'royal-imperial',
    name: 'Royal Imperial',
    tier: 'royal',
    thumbnail: '/templates/thumbnails/royal-imperial.jpg',
    features: ['videoBackground', 'scratchReveal', 'countdown', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./royal/royal-imperial'), { ssr: false }),
  },
  {
    id: 'royal-prestige',
    name: 'Royal Prestige',
    tier: 'royal',
    thumbnail: '/templates/thumbnails/royal-prestige.jpg',
    features: ['videoBackground', 'scratchReveal', 'countdown', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./royal/royal-prestige'), { ssr: false }),
  },
  {
    id: 'royal-heritage',
    name: 'Royal Heritage',
    tier: 'royal',
    thumbnail: '/templates/thumbnails/royal-heritage.jpg',
    features: ['videoBackground', 'scratchReveal', 'countdown', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./royal/royal-heritage'), { ssr: false }),
  },
  {
    id: 'royal-elegance-royal',
    name: 'Royal Elegance Royal',
    tier: 'royal',
    thumbnail: '/templates/thumbnails/royal-elegance-royal.jpg',
    features: ['videoBackground', 'scratchReveal', 'countdown', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./royal/royal-elegance-royal'), { ssr: false }),
  },
  {
    id: 'hindu-royal-wedding',
    name: 'Hindu Royal Wedding (Mandalla)',
    tier: 'classic',
    thumbnail: '/templates/thumbnails/hindu-royal.jpg',
    features: ['countdown', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('../components/templates/hindu-royal-wedding/HinduRoyalWedding'), { ssr: false }),
  },
  {
    id: 'muslim-nikah-elegant',
    name: 'Muslim Nikah Elegant',
    tier: 'classic',
    thumbnail: '/templates/thumbnails/muslim-nikah.jpg',
    features: ['countdown', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('../components/templates/muslim-nikah-elegant/MuslimNikahElegant'), { ssr: false }),
  },
];

export function getTemplateById(id: string) {
  return templateManifest.find((t) => t.id === id);
}

export function getTemplatesByTier(tier: Tier) {
  return templateManifest.filter((t) => t.tier === tier);
}
