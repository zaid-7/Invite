// templates/theme.ts
// Every template is (ThemeConfig + a set of feature primitives + a layout).
// New palette variations should not require new component logic — just a new theme entry.

import type React from 'react';

export interface ThemeConfig {
  id: string;
  name: string;
  tier: 'classic' | 'royal';
  palette: {
    background: string;
    surface: string;
    accent: string;       // primary metallic / brand accent (gold, etc.)
    accentSoft: string;   // low-opacity version for hairlines/dividers
    secondary: string;    // secondary color (dusty rose, crimson, emerald...)
    ink: string;          // main text color
    inkMuted: string;     // secondary text
  };
  fonts: {
    display: string;      // headline/name serif
    body: string;         // body copy
    label: string;        // eyebrows, buttons, countdown labels
  };
  motion: 'gentle' | 'cinematic';
}

export const emeraldNoirTheme: ThemeConfig = {
  id: 'emerald-noir',
  name: 'Emerald Noir',
  tier: 'classic',
  palette: {
    background: '#0F1B16',
    surface: '#16261F',
    accent: '#C9A467',
    accentSoft: 'rgba(201,164,103,0.3)',
    secondary: '#1F3A2E',
    ink: '#F3EFE8',
    inkMuted: '#B9C4BC',
  },
  fonts: {
    display: "'Cormorant Garamond', serif",
    body: "'Marcellus', serif",
    label: "'Jost', sans-serif",
  },
  motion: 'gentle',
};

export const cinematicRoyalTheme: ThemeConfig = {
  id: 'cinematic-royal',
  name: 'Cinematic Royal',
  tier: 'royal',
  palette: {
    background: '#0A0A12',
    surface: '#15141F',
    accent: '#D4AF6A',
    accentSoft: 'rgba(212,175,106,0.3)',
    secondary: '#5C1A2B',
    ink: '#F6F1E9',
    inkMuted: '#B9AFA6',
  },
  fonts: {
    display: "'Cormorant Garamond', serif",
    body: "'Marcellus', serif",
    label: "'Jost', sans-serif",
  },
  motion: 'cinematic',
};

// Helper: turns a ThemeConfig into CSS custom properties you spread onto a wrapper div.
export function themeToCssVars(theme: ThemeConfig): React.CSSProperties {
  return {
    ['--bg' as any]: theme.palette.background,
    ['--surface' as any]: theme.palette.surface,
    ['--accent' as any]: theme.palette.accent,
    ['--accent-soft' as any]: theme.palette.accentSoft,
    ['--secondary' as any]: theme.palette.secondary,
    ['--ink' as any]: theme.palette.ink,
    ['--ink-muted' as any]: theme.palette.inkMuted,
    ['--font-display' as any]: theme.fonts.display,
    ['--font-body' as any]: theme.fonts.body,
    ['--font-label' as any]: theme.fonts.label,
  } as React.CSSProperties;
}
