'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Template } from '@/types/template';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sparkles, CheckCircle2, Eye, Crown } from 'lucide-react';

// Templates to exclude from browse listing
const EXCLUDED_TEMPLATES = [
  'hindu-royal-wedding',
  'muslim-nikah-elegant',
  'cinematic-royal',
];

// Royal template thumbnail poster images (generated from background videos)
const ROYAL_THUMBNAILS: Record<string, string> = {
  'royal-heritage': '/templates/thumbnails/royal-heritage.jpg',
  'royal-prestige': '/templates/thumbnails/royal-prestige.jpg',
  'royal-imperial': '/templates/thumbnails/royal-imperial.jpg',
  'royal-elegance-royal': '/templates/thumbnails/royal-elegance-royal.jpg',
};

// Classic template theme color palettes (from theme.ts)
const CLASSIC_THEME_COLORS: Record<string, { bg: string; surface: string; accent: string; secondary: string; ink: string }> = {
  'emerald-noir':          { bg: '#0F1B16', surface: '#16261F', accent: '#C9A467', secondary: '#1F3A2E', ink: '#F3EFE8' },
  'crimson-royale':        { bg: '#121212', surface: '#1E1E1E', accent: '#D4AF37', secondary: '#8B0000', ink: '#F5F5F5' },
  'royal-elegance-classic':{ bg: '#FAF6EE', surface: '#F0EAD6', accent: '#C5A059', secondary: '#5C1B24', ink: '#2C221E' },
  'garden-romance':        { bg: '#F4F7F4', surface: '#E4EAE4', accent: '#C29B38', secondary: '#5B705B', ink: '#2A332A' },
  'modern-minimal':        { bg: '#FAF9F6', surface: '#FFFFFF', accent: '#1A1A1A', secondary: '#7A7A7A', ink: '#121212' },
  'mughal-emerald':        { bg: '#0B241C', surface: '#123C2F', accent: '#E5C060', secondary: '#6C1B2B', ink: '#F4F0E6' },
  'rose-gold-blush':       { bg: '#FFF5F5', surface: '#FFEBEB', accent: '#B76E79', secondary: '#8F4D56', ink: '#3E2723' },
  'midnight-royal':        { bg: '#0B1325', surface: '#14213D', accent: '#D4AF37', secondary: '#FCA311', ink: '#E2E8F0' },
};

export default function BrowsePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorHeader, setErrorHeader] = useState('');

  // Category Switcher: 'classic' | 'royal'
  const [category, setCategory] = useState<'classic' | 'royal'>('classic');

  // Filter States - Default selected: Wedding Invitation
  const [occasion, setOccasion] = useState<string>('WEDDING');

  const occasions = [
    { label: 'Wedding Invitation', value: 'WEDDING' },
    { label: 'Engagement Invitation', value: 'ENGAGEMENT' },
    { label: 'Birthday Invitation', value: 'BIRTHDAY' },
    { label: 'Anniversary Invitation', value: 'ANNIVERSARY' },
    { label: 'Baby Shower Invitation', value: 'BABY_SHOWER' },
    { label: 'Housewarming Invitation', value: 'HOUSEWARMING' },
    { label: 'Party Invitation', value: 'PARTY' },
  ];

  useEffect(() => {
    async function loadTemplates() {
      setLoading(true);
      setErrorHeader('');
      try {
        const filters = {
          ...(occasion ? { occasion } : {}),
        };
        const res = await api.getTemplates(filters);
        if (res.status === 'success') {
          setTemplates(res.templates);
        } else {
          setErrorHeader('Failed to load templates.');
        }
      } catch (err) {
        setErrorHeader('Could not connect to service.');
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, [occasion]);

  // Royal templates: video background templates (tier === 'PREMIUM')
  const isRoyalTemplate = (tmpl: Template) => {
    const id = tmpl.id || tmpl.slug || '';
    return tmpl.tier === 'PREMIUM' || id === 'cinematic-royal';
  };

  const filteredTemplates = templates
    .filter(tmpl => !EXCLUDED_TEMPLATES.includes(tmpl.id) && !EXCLUDED_TEMPLATES.includes(tmpl.slug))
    .filter(tmpl => {
      const matchesCategory = category === 'royal' ? isRoyalTemplate(tmpl) : !isRoyalTemplate(tmpl);
      const matchesOccasion = !occasion || tmpl.occasionType === occasion || tmpl.occasionType === 'WEDDING';
      return matchesCategory && matchesOccasion;
    });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-10" style={{ paddingTop: 48, paddingBottom: 64 }}>
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3" style={{ lineHeight: 1.2 }}>
            Heritage Collection
          </h1>
          <p className="text-base text-muted max-w-lg mx-auto leading-relaxed" style={{ fontWeight: 400 }}>
            Select a designer template to configure your custom animated Digital Invitation or test with Live Demo.
          </p>
        </div>

        {/* Category Switcher Pill Toggle Bar (Classic vs Royal) */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-[#F7F4EE] border border-[#E8E2D9] p-1.5 rounded-full shadow-inner select-none">
            <button
              type="button"
              onClick={() => setCategory('classic')}
              className={`px-6 py-2.5 text-sm md:text-base font-serif transition-all cursor-pointer rounded-full ${
                category === 'classic'
                  ? 'bg-white text-ink shadow-sm font-semibold'
                  : 'text-muted hover:text-ink font-normal'
              }`}
            >
              Mandap Classics
            </button>
            <button
              type="button"
              onClick={() => setCategory('royal')}
              className={`px-6 py-2.5 text-sm md:text-base font-serif transition-all cursor-pointer rounded-full flex items-center gap-2 ${
                category === 'royal'
                  ? 'bg-white text-ink shadow-sm font-semibold'
                  : 'text-muted hover:text-ink font-normal'
              }`}
            >
              <Crown size={16} className={category === 'royal' ? 'text-primary' : 'text-muted'} />
              Mandap Royal
            </button>
          </div>
        </div>

        {/* Filter Toolbar (Invitation Type) */}
        <div className="flex justify-between md:justify-end items-center bg-white border border-hairline p-4 mb-8 w-full" style={{ borderRadius: 14 }}>
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <span className="text-sm font-semibold text-ink shrink-0">
              Invitation Type:
            </span>
            <select
              value={occasion}
              onChange={e => setOccasion(e.target.value)}
              className="bg-white border border-hairline text-ink text-sm font-medium py-2 px-4 focus:outline-none focus:border-ink w-full md:w-56 shadow-sm"
              style={{ borderRadius: 8, height: 40 }}
            >
              {occasions.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 min-h-[300px]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-muted animate-pulse">
              Retrieving Catalog...
            </p>
          </div>
        ) : errorHeader ? (
          <div className="text-center py-20 bg-red-50 border border-red-200 max-w-md mx-auto" style={{ borderRadius: 14 }}>
            <span className="text-error block font-semibold mb-2">Error Loading Templates</span>
            <span className="text-sm text-muted">{errorHeader}</span>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-24 bg-surface-soft border border-hairline max-w-lg mx-auto" style={{ borderRadius: 14 }}>
            <Sparkles size={36} className="text-muted-soft mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-ink mb-1">No templates found</h3>
            <p className="text-sm text-muted" style={{ fontWeight: 400 }}>
              Try adjusting your Invitation Type selection or switch between Mandap Classics and Mandap Royal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredTemplates.map(tmpl => {
              const templateId = tmpl.id || tmpl.slug || '';
              const isRoyal = isRoyalTemplate(tmpl);
              const classicColors = CLASSIC_THEME_COLORS[templateId];
              const royalThumb = ROYAL_THUMBNAILS[templateId];

              return (
                <div
                  key={tmpl.id}
                  className="group relative border border-hairline overflow-hidden bg-white shadow-card-hover transition-all duration-200 flex flex-col"
                  style={{ borderRadius: 14 }}
                >
                  {/* Category & Price Badges */}
                  <div className="absolute top-3 left-3 z-20 flex gap-2">
                    <span
                      className="bg-white/90 backdrop-blur-sm text-ink px-3 py-1 text-xs font-semibold shadow-card flex items-center gap-1"
                      style={{ borderRadius: 9999 }}
                    >
                      {isRoyal ? (
                        <>
                          <Crown size={12} className="text-primary" /> Royal
                        </>
                      ) : (
                        'Classic'
                      )}
                    </span>
                    <span
                      className="bg-white/90 backdrop-blur-sm text-ink px-3 py-1 text-xs font-semibold shadow-card"
                      style={{ borderRadius: 9999 }}
                    >
                      {tmpl.occasionType}
                    </span>
                  </div>

                  <div
                    className="absolute top-3 right-3 z-20 bg-ink text-on-primary px-3 py-1 text-xs font-semibold"
                    style={{ borderRadius: 9999 }}
                  >
                    ₹{tmpl.price / 100}
                  </div>

                  {/* Card Visual Area */}
                  {isRoyal && royalThumb ? (
                    /* Royal template: cinematic thumbnail image */
                    <div className="relative aspect-video overflow-hidden shrink-0">
                      <Image
                        src={royalThumb}
                        alt={tmpl.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                        <span className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg block" style={{ letterSpacing: '-0.01em' }}>
                          {tmpl.name}
                        </span>
                        <span className="text-xs text-white/70 font-medium tracking-wider mt-1 block">
                          {tmpl.rendererRef}
                        </span>
                      </div>
                    </div>
                  ) : classicColors ? (
                    /* Classic template: theme color preview */
                    <div
                      className="relative aspect-video overflow-hidden shrink-0 flex flex-col items-center justify-center p-6 select-none"
                      style={{ background: classicColors.bg }}
                    >
                      {/* Decorative accent ring */}
                      <div
                        className="absolute w-32 h-32 rounded-full border-2 opacity-30"
                        style={{ borderColor: classicColors.accent, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                      />
                      <div
                        className="absolute w-48 h-48 rounded-full border opacity-15"
                        style={{ borderColor: classicColors.accent, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                      />

                      {/* Theme color palette strip */}
                      <div className="flex gap-2 mb-4 z-10">
                        <div className="w-5 h-5 rounded-full border border-white/20 shadow-sm" style={{ background: classicColors.bg }} title="Background" />
                        <div className="w-5 h-5 rounded-full border border-white/20 shadow-sm" style={{ background: classicColors.surface }} title="Surface" />
                        <div className="w-5 h-5 rounded-full border border-white/20 shadow-sm" style={{ background: classicColors.accent }} title="Accent" />
                        <div className="w-5 h-5 rounded-full border border-white/20 shadow-sm" style={{ background: classicColors.secondary }} title="Secondary" />
                      </div>

                      <span
                        className="text-2xl md:text-3xl font-bold z-10 mt-1"
                        style={{ color: classicColors.ink, letterSpacing: '-0.01em' }}
                      >
                        {tmpl.name}
                      </span>
                      <span
                        className="text-xs font-medium tracking-wider z-10 mt-2 px-3 py-1 border"
                        style={{ color: classicColors.accent, borderColor: classicColors.accent + '44', borderRadius: 9999 }}
                      >
                        {tmpl.rendererRef}
                      </span>
                    </div>
                  ) : (
                    /* Fallback: plain surface */
                    <div className="relative aspect-video bg-surface-soft border-b border-hairline flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden shrink-0">
                      <span className="text-2xl md:text-3xl font-bold text-ink z-10 mt-2" style={{ letterSpacing: '-0.01em' }}>
                        {tmpl.name}
                      </span>
                      <span
                        className="text-xs text-muted font-medium tracking-wider z-10 mt-2 border border-hairline px-3 py-1"
                        style={{ borderRadius: 9999 }}
                      >
                        {tmpl.rendererRef}
                      </span>
                    </div>
                  )}

                  {/* Details */}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-sm text-muted leading-relaxed flex-1 mb-6" style={{ fontWeight: 400 }}>
                      {tmpl.description}
                    </p>

                    <div className="flex flex-col gap-3 mt-auto">
                      <div className="flex flex-col gap-1.5 text-sm text-body-text" style={{ fontWeight: 400 }}>
                        <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary shrink-0" /> Custom parent greetings &amp; welcome text</span>
                        <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary shrink-0" /> Unlimited digital event timeline milestones</span>
                        <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary shrink-0" /> Interactive google maps venue frame links</span>
                      </div>

                      <div className="flex gap-2.5 mt-3">
                        <Link
                          href={`/demo/${tmpl.id}`}
                          className="flex-1 bg-white text-ink border border-ink hover:bg-surface-soft font-medium py-2.5 text-sm select-none transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
                          style={{ borderRadius: 8 }}
                        >
                          <Eye size={15} /> Live Demo
                        </Link>
                        <Link
                          href={`/create/${tmpl.id}`}
                          className="flex-1 bg-primary text-on-primary hover:bg-primary-active font-medium py-2.5 text-sm select-none transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
                          style={{ borderRadius: 8 }}
                        >
                          <Sparkles size={15} /> Customize
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
