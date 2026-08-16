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

export const crimsonRoyaleTheme: ThemeConfig = {
  id: 'crimson-royale',
  name: 'Crimson Royale',
  tier: 'classic',
  palette: {
    background: '#121212',
    surface: '#1E1E1E',
    accent: '#D4AF37',
    accentSoft: 'rgba(212,175,55,0.25)',
    secondary: '#8B0000',
    ink: '#F5F5F5',
    inkMuted: '#A9A9A9',
  },
  fonts: {
    display: "'Cormorant Garamond', serif",
    body: "'Marcellus', serif",
    label: "'Jost', sans-serif",
  },
  motion: 'gentle',
};

export const royalEleganceClassicTheme: ThemeConfig = {
  id: 'royal-elegance-classic',
  name: 'Royal Elegance Classic',
  tier: 'classic',
  palette: {
    background: '#FAF6EE',
    surface: '#F0EAD6',
    accent: '#C5A059',
    accentSoft: 'rgba(197,160,89,0.25)',
    secondary: '#5C1B24',
    ink: '#2C221E',
    inkMuted: '#705E53',
  },
  fonts: {
    display: "'Cormorant Garamond', serif",
    body: "'Marcellus', serif",
    label: "'Jost', sans-serif",
  },
  motion: 'gentle',
};

export const gardenRomanceTheme: ThemeConfig = {
  id: 'garden-romance',
  name: 'Garden Romance',
  tier: 'classic',
  palette: {
    background: '#F4F7F4',
    surface: '#E4EAE4',
    accent: '#C29B38',
    accentSoft: 'rgba(194,155,56,0.2)',
    secondary: '#5B705B',
    ink: '#2A332A',
    inkMuted: '#697A69',
  },
  fonts: {
    display: "'Cormorant Infant', serif",
    body: "'Jost', sans-serif",
    label: "'Outfit', sans-serif",
  },
  motion: 'gentle',
};

export const modernMinimalTheme: ThemeConfig = {
  id: 'modern-minimal',
  name: 'Modern Minimal',
  tier: 'classic',
  palette: {
    background: '#FAF9F6',
    surface: '#FFFFFF',
    accent: '#1A1A1A',
    accentSoft: 'rgba(26,26,26,0.1)',
    secondary: '#7A7A7A',
    ink: '#121212',
    inkMuted: '#666666',
  },
  fonts: {
    display: "'Outfit', sans-serif",
    body: "'Jost', sans-serif",
    label: "'Jost', sans-serif",
  },
  motion: 'gentle',
};

export const mughalEmeraldTheme: ThemeConfig = {
  id: 'mughal-emerald',
  name: 'Mughal Emerald',
  tier: 'classic',
  palette: {
    background: '#0B241C',
    surface: '#123C2F',
    accent: '#E5C060',
    accentSoft: 'rgba(229,192,96,0.25)',
    secondary: '#6C1B2B',
    ink: '#F4F0E6',
    inkMuted: '#AAD1C5',
  },
  fonts: {
    display: "'Cormorant Garamond', serif",
    body: "'Marcellus', serif",
    label: "'Jost', sans-serif",
  },
  motion: 'gentle',
};

export const roseGoldBlushTheme: ThemeConfig = {
  id: 'rose-gold-blush',
  name: 'Rose Gold Blush',
  tier: 'classic',
  palette: {
    background: '#FFF5F5',
    surface: '#FFEBEB',
    accent: '#B76E79',
    accentSoft: 'rgba(183,110,121,0.25)',
    secondary: '#8F4D56',
    ink: '#3E2723',
    inkMuted: '#7C575C',
  },
  fonts: {
    display: "'Cormorant Infant', serif",
    body: "'Marcellus', serif",
    label: "'Jost', sans-serif",
  },
  motion: 'gentle',
};

export const midnightRoyalTheme: ThemeConfig = {
  id: 'midnight-royal',
  name: 'Midnight Royal',
  tier: 'classic',
  palette: {
    background: '#0B1325',
    surface: '#14213D',
    accent: '#D4AF37',
    accentSoft: 'rgba(212,175,55,0.25)',
    secondary: '#FCA311',
    ink: '#E2E8F0',
    inkMuted: '#94A3B8',
  },
  fonts: {
    display: "'Cormorant Garamond', serif",
    body: "'Marcellus', serif",
    label: "'Jost', sans-serif",
  },
  motion: 'gentle',
};

export const royalImperialTheme: ThemeConfig = {
  id: 'royal-imperial',
  name: 'Royal Imperial',
  tier: 'royal',
  palette: {
    background: '#1F0F12',
    surface: '#2D161B',
    accent: '#E0A899',
    accentSoft: 'rgba(224,168,153,0.25)',
    secondary: '#692429',
    ink: '#FCEEEB',
    inkMuted: '#D1A59C',
  },
  fonts: {
    display: "'Cormorant Garamond', serif",
    body: "'Marcellus', serif",
    label: "'Jost', sans-serif",
  },
  motion: 'cinematic',
};

export const royalPrestigeTheme: ThemeConfig = {
  id: 'royal-prestige',
  name: 'Royal Prestige',
  tier: 'royal',
  palette: {
    background: '#0B0C10',
    surface: '#1F2833',
    accent: '#C5A059',
    accentSoft: 'rgba(197,160,89,0.25)',
    secondary: '#45A29E',
    ink: '#F4F3EF',
    inkMuted: '#C5C6C7',
  },
  fonts: {
    display: "'Cormorant Garamond', serif",
    body: "'Marcellus', serif",
    label: "'Jost', sans-serif",
  },
  motion: 'cinematic',
};

export const royalHeritageTheme: ThemeConfig = {
  id: 'royal-heritage',
  name: 'Royal Heritage',
  tier: 'royal',
  palette: {
    background: '#1C0D02',
    surface: '#2B1707',
    accent: '#D4AF37',
    accentSoft: 'rgba(212,175,55,0.25)',
    secondary: '#800000',
    ink: '#F9F6F0',
    inkMuted: '#CD9B65',
  },
  fonts: {
    display: "'Cormorant Garamond', serif",
    body: "'Marcellus', serif",
    label: "'Jost', sans-serif",
  },
  motion: 'cinematic',
};

export const royalEleganceRoyalTheme: ThemeConfig = {
  id: 'royal-elegance-royal',
  name: 'Royal Elegance Royal',
  tier: 'royal',
  palette: {
    background: '#FCFBF4',
    surface: '#FAF6E8',
    accent: '#D4AF37',
    accentSoft: 'rgba(212,175,55,0.25)',
    secondary: '#8B0000',
    ink: '#2A1618',
    inkMuted: '#755255',
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
