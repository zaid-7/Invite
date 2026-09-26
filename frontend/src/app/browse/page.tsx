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

// Static thumbnail images for every template, keyed by slug.
// Classic thumbnails are captured from the live invitation design; Royal
// thumbnails double as the <video> poster frame while the clip loads.
const TEMPLATE_THUMBNAILS: Record<string, string> = {
  'emerald-noir': '/templates/thumbnails/emerald-noir.jpg',
  'crimson-royale': '/templates/thumbnails/crimson-royale.jpg',
  'royal-elegance-classic': '/templates/thumbnails/royal-elegance-classic.jpg',
  'garden-romance': '/templates/thumbnails/garden-romance.jpg',
  'modern-minimal': '/templates/thumbnails/modern-minimal.jpg',
  'mughal-emerald': '/templates/thumbnails/mughal-emerald.jpg',
  'rose-gold-blush': '/templates/thumbnails/rose-gold-blush.jpg',
  'midnight-royal': '/templates/thumbnails/midnight-royal.jpg',
  'royal-heritage': '/templates/thumbnails/royal-heritage.jpg',
  'royal-prestige': '/templates/thumbnails/royal-prestige.jpg',
  'royal-imperial': '/templates/thumbnails/royal-imperial.jpg',
  'royal-elegance-royal': '/templates/thumbnails/royal-elegance-royal.jpg',
};

// Royal templates loop a short clip of their own hero background video on the card,
// matching the video each template plays on its live invitation page.
const ROYAL_VIDEOS: Record<string, string> = {
  'royal-heritage': '/royal-videos/royal-heritage.mp4',
  'royal-prestige': '/royal-videos/royal-prestige.mp4',
  'royal-imperial': '/royal-videos/rose-gold-blush.mp4',
  'royal-elegance-royal': '/royal-videos/royal-elegance-royal.mp4',
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
    return tmpl.tier === 'PREMIUM' || tmpl.slug === 'cinematic-royal';
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
              InviteCraft Classics
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
              InviteCraft Royal
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
              Try adjusting your Invitation Type selection or switch between InviteCraft Classics and InviteCraft Royal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredTemplates.map(tmpl => {
              const isRoyal = isRoyalTemplate(tmpl);
              const thumbnail = TEMPLATE_THUMBNAILS[tmpl.slug];
              const royalVideo = ROYAL_VIDEOS[tmpl.slug];

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
                  {isRoyal && royalVideo ? (
                    /* Royal template: looping clip of the template's own hero video */
                    <div className="relative aspect-video overflow-hidden shrink-0">
                      <video
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={royalVideo}
                        poster={thumbnail}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
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
                  ) : thumbnail ? (
                    /* Thumbnail image captured from the live template design */
                    <div className="relative aspect-video overflow-hidden shrink-0">
                      <Image
                        src={thumbnail}
                        alt={tmpl.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                        <span className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg block" style={{ letterSpacing: '-0.01em' }}>
                          {tmpl.name}
                        </span>
                        <span className="text-xs text-white/70 font-medium tracking-wider mt-1 block">
                          {tmpl.rendererRef}
                        </span>
                      </div>
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
