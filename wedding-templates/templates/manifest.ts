// templates/manifest.ts
import dynamic from 'next/dynamic';

export type Tier = 'classic' | 'royal';

export interface TemplateManifestEntry {
  id: string;
  name: string;
  tier: Tier;
  thumbnail: string;
  features: string[];
  Component: ReturnType<typeof dynamic>;
}

// next/dynamic + ssr:false means a Royal template's video/curtain bundle never
// gets shipped to a viewer looking at a Classic invitation, and vice versa.
export const templateManifest: TemplateManifestEntry[] = [
  {
    id: 'emerald-noir',
    name: 'Emerald Noir',
    tier: 'classic',
    thumbnail: '/thumbnails/emerald-noir.jpg',
    features: ['scratchReveal', 'countdown', 'doorReveal3d', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./classic/emerald-noir'), { ssr: false }),
  },
  {
    id: 'cinematic-royal',
    name: 'Cinematic Royal',
    tier: 'royal',
    thumbnail: '/thumbnails/cinematic-royal.jpg',
    features: ['cinematicHero', 'curtainReveal', 'countdown', 'rsvp', 'musicPlayer'],
    Component: dynamic(() => import('./royal/cinematic-royal'), { ssr: false }),
  },

  // Add the rest of your Classic (6) and Royal (10) templates here.
  // Each new entry only needs: a new theme in theme.ts, and a new index.tsx
  // that composes the same shared primitives in a different arrangement.
];

export function getTemplateById(id: string) {
  return templateManifest.find((t) => t.id === id);
}

export function getTemplatesByTier(tier: Tier) {
  return templateManifest.filter((t) => t.tier === tier);
}
