'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Template } from '@/types/template';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export default function BrowsePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorHeader, setErrorHeader] = useState('');

  // Filter States
  const [culture, setCulture] = useState<string>(''); // '' = ALL
  const [occasion, setOccasion] = useState<string>(''); // '' = ALL

  const cultures = [
    { label: 'All Cultures', value: '' },
    { label: 'Hindu', value: 'HINDU' },
    { label: 'Muslim', value: 'MUSLIM' },
    { label: 'Universal', value: 'UNIVERSAL' },
  ];

  const occasions = [
    { label: 'All Occasions', value: '' },
    { label: 'Wedding', value: 'WEDDING' },
    { label: 'Engagement', value: 'ENGAGEMENT' },
    { label: 'Birthday', value: 'BIRTHDAY' },
  ];

  useEffect(() => {
    async function loadTemplates() {
      setLoading(true);
      setErrorHeader('');
      try {
        const filters = {
          ...(culture ? { culture } : {}),
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
  }, [culture, occasion]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-serif text-4xl md:text-5xl font-bold text-maroon-deep mb-3">
            HERITAGE COLLECTION
          </h1>
          <p className="text-sm text-foreground/75 max-w-lg mx-auto font-sans leading-relaxed">
            Select a designer template to configure your custom animated Digital Invitation.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-maroon-deep text-ivory border border-gold-warm/25 p-4 rounded-xl shadow-lg mb-10 w-full">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase font-bold tracking-widest text-gold-warm flex items-center gap-1.5 shrink-0 pl-1">
              <Filter size={14} /> Culture:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {cultures.map(c => (
                <button
                  key={c.value}
                  onClick={() => setCulture(c.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    culture === c.value
                      ? 'bg-gold-warm text-maroon-deep shadow-md'
                      : 'hover:bg-gold-warm/15 text-ivory/90'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-[1px] h-[1px] md:h-8 bg-gold-warm/25" />

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <span className="text-xs uppercase font-bold tracking-widest text-gold-warm flex items-center gap-1.5 shrink-0 pl-1">
              Occasion:
            </span>
            <select
              value={occasion}
              onChange={e => setOccasion(e.target.value)}
              className="bg-maroon-deep border border-gold-warm/30 text-gold-warm rounded-lg text-xs font-semibold uppercase tracking-wider py-1.5 px-3 focus:outline-none focus:border-gold-warm w-full md:w-44"
            >
              {occasions.map(o => (
                <option key={o.value} value={o.value} className="bg-maroon-deep text-gold-warm">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 min-h-[300px]">
            <div className="w-10 h-10 border-4 border-gold-warm border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-semibold tracking-wider text-maroon-deep uppercase animate-pulse">
              Retrieving Catalog...
            </p>
          </div>
        ) : errorHeader ? (
          <div className="text-center py-20 bg-red-50 border border-red-200 rounded-xl max-w-md mx-auto">
            <span className="text-red-600 block font-bold mb-2">Error Loading Templates</span>
            <span className="text-sm text-gray-500">{errorHeader}</span>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-24 bg-maroon-deep/5 border border-gold-warm/15 rounded-xl max-w-lg mx-auto">
            <Sparkles size={36} className="text-gold-warm/40 mx-auto mb-3" />
            <h3 className="text-serif text-lg font-bold text-maroon-deep mb-1">No templates found</h3>
            <p className="text-xs text-gray-500">
              Try adjusting your culture selection or occasion filters to see templates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {templates.map(tmpl => (
              <div
                key={tmpl.id}
                className="group relative border border-gold-warm/30 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-maroon-deep text-ivory flex flex-col"
              >
                {/* Cultural Banner Motif */}
                <div className="absolute top-3 left-3 z-20 bg-gold-warm text-maroon-deep px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
                  {tmpl.cultureTag} • {tmpl.occasionType}
                </div>

                <div className="absolute top-3 right-3 z-20 bg-emerald-muted/80 backdrop-blur-sm text-ivory px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                  ₹{tmpl.price / 100}
                </div>

                {/* Card visuals - Simulated dynamic thumbnail placeholder since there are no images */}
                <div className="relative aspect-video bg-gradient-to-br from-maroon-deep to-teal-deep border-b border-gold-warm/20 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden shrink-0">
                  <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                    <div className="w-[180px] h-[180px] border border-gold-warm rounded-full animate-spin-slow flex items-center justify-center">
                      <div className="w-[140px] h-[140px] border border-dashed border-gold-warm rounded-full" />
                    </div>
                  </div>

                  <span className="text-serif text-xl md:text-2xl font-bold tracking-widest text-gold-warm drop-shadow-md z-15 mt-2">
                    {tmpl.name}
                  </span>
                  <span className="text-[10px] uppercase font-sans text-gold-warm/60 tracking-widest z-15 mt-1 border border-gold-warm/20 px-2 py-0.5 rounded">
                    {tmpl.rendererRef}
                  </span>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-ivory/70 leading-relaxed font-sans flex-1 mb-6">
                    {tmpl.description}
                  </p>

                  <div className="flex flex-col gap-3 font-semibold mt-auto">
                    <div className="flex flex-col gap-1 text-[11px] text-gold-warm/80">
                      <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-gold-warm" /> Custom parent greetings & welcome text</span>
                      <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-gold-warm" /> Unlimited digital event timeline milestones</span>
                      <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-gold-warm" /> Interactive google maps venue frame links</span>
                    </div>

                    <Link
                      href={`/create/${tmpl.id}`}
                      className="w-full bg-gold-warm text-maroon-deep hover:bg-gold-warm/95 font-sans font-bold py-2.5 rounded text-xs select-none transition-transform active:scale-98 mt-3 flex items-center justify-center gap-2 cursor-pointer shadow-lg text-center"
                    >
                      Start Creating Template
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
