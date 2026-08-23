'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Template } from '@/types/template';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { getTemplateById } from '@/templates/manifest';
import { ArrowLeft, Sparkles, Eye } from 'lucide-react';

const defaultDemoData: Record<string, any> = {
  'hindu-royal-wedding': {
    groomName: 'Arjun',
    brideName: 'Pooja',
    groomParents: 'Mr. & Mrs. Sharma',
    brideParents: 'Mr. & Mrs. Patel',
    welcomeQuote: 'Seeking the blessings of Lord Ganesha, we invite you to join us in celebrating our wedding.',
    events: [
      { name: 'Haldi & Mehendi', date: '2026-11-20', time: '11:00 AM', venue: 'Royal Palms Resort', address: 'ECR Main Road, Chennai' },
      { name: 'Wedding (Muhurtham)', date: '2026-11-21', time: '09:30 AM', venue: 'Shubh Laxmi Mandapam', address: 'Avinashi Road, Coimbatore' },
      { name: 'Reception', date: '2026-11-21', time: '07:00 PM', venue: 'Grand Palace Hall', address: 'Trichy Road, Coimbatore' }
    ],
    musicUrl: '/music/shehnai.mp3'
  },
  'muslim-nikah-elegant': {
    groomName: 'Zain',
    brideName: 'Farheen',
    groomParents: 'Mr. & Mrs. Altaf Ahmed',
    brideParents: 'Mr. & Mrs. Shakeel Khan',
    welcomeQuote: 'In the name of Allah, the Most Gracious, the Most Merciful. We request the pleasure of your company.',
    events: [
      { name: 'Nikah (Marriage Ceremony)', date: '2026-12-15', time: '04:00 PM', venue: 'Royal Crescent Banquet', address: 'Old City, Hyderabad' },
      { name: 'Walima (Reception)', date: '2026-12-16', time: '07:30 PM', venue: 'Taj Falaknuma Palace', address: 'Engine Bowli, Hyderabad' }
    ],
    musicUrl: '/music/sufi-flute.mp3'
  },
  'default': {
    groomName: 'Ranveer',
    brideName: 'Deepika',
    groomParents: 'Mr. & Mrs. Bhavnani',
    brideParents: 'Mr. & Mrs. Padukone',
    welcomeQuote: 'Together with our families, we request the pleasure of your company as we pledge our love.',
    events: [
      { name: 'Sangeet & Mehendi', date: '2026-11-13', time: '06:00 PM', venue: 'Villa del Balbianello', address: 'Lake Como, Italy' },
      { name: 'Wedding Ceremony', date: '2026-11-14', time: '05:00 PM', venue: 'Villa del Balbianello', address: 'Lake Como, Italy' },
      { name: 'Grand Reception', date: '2026-11-21', time: '07:30 PM', venue: 'Grand Hyatt Mumbai', address: 'Santacruz East, Mumbai' }
    ],
    musicUrl: '/music/shehnai.mp3'
  }
};

export default function DemoPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = use(params);

  const [templateName, setTemplateName] = useState<string>('Digital Invitation');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    async function loadTemplateDetails() {
      try {
        const res = await api.getTemplate(templateId);
        if (res.status === 'success' && res.template) {
          setTemplateName(res.template.name);
          
          // Seed defaults from schema or fallback
          const fields = res.template.schemaJson?.fields || [];
          const groom = fields.find((f: any) => f.name === 'groomName')?.defaultValue;
          const bride = fields.find((f: any) => f.name === 'brideName')?.defaultValue;
          const gParents = fields.find((f: any) => f.name === 'groomParents')?.defaultValue;
          const bParents = fields.find((f: any) => f.name === 'brideParents')?.defaultValue;
          const welcome = fields.find((f: any) => f.name === 'welcomeQuote')?.defaultValue;
          const defaultEvents = fields.find((f: any) => f.name === 'events')?.defaultValue;
          const music = fields.find((f: any) => f.name === 'musicUrl')?.defaultValue;

          const fallback = defaultDemoData[templateId] || defaultDemoData['default'];

          setFormData({
            groomName: groom || fallback.groomName,
            brideName: bride || fallback.brideName,
            groomParents: gParents || fallback.groomParents,
            brideParents: bParents || fallback.brideParents,
            welcomeQuote: welcome || fallback.welcomeQuote,
            events: defaultEvents || fallback.events,
            musicUrl: music || fallback.musicUrl,
          });
        } else {
          // Fallback to manifest lookup
          const manifestEntry = getTemplateById(templateId);
          if (manifestEntry) {
            setTemplateName(manifestEntry.name);
          }
          const fallback = defaultDemoData[templateId] || defaultDemoData['default'];
          setFormData(fallback);
        }
      } catch (err) {
        const fallback = defaultDemoData[templateId] || defaultDemoData['default'];
        setFormData(fallback);
      } finally {
        setLoading(false);
      }
    }

    loadTemplateDetails();
  }, [templateId]);

  if (loading || !formData) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-muted animate-pulse">Loading Live Demo...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Top Floating Demo Toolbar */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-hairline px-4 md:px-8 py-3 shadow-sm select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/browse"
            className="flex items-center gap-1.5 text-sm font-medium text-ink hover:text-primary transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Collection</span>
          </Link>

          <div className="flex items-center gap-2 text-center truncate">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping shrink-0" />
            <span className="text-xs md:text-sm font-semibold text-ink truncate">
              Live Demo: <span className="text-primary font-bold">{templateName}</span>
            </span>
          </div>

          <Link
            href={`/create/${templateId}`}
            className="bg-primary text-on-primary hover:bg-primary-active font-medium px-4 py-2 text-xs md:text-sm flex items-center gap-1.5 transition-colors shrink-0"
            style={{ borderRadius: 8 }}
          >
            <Sparkles size={14} />
            <span>Customize Card</span>
          </Link>
        </div>
      </header>

      {/* Live Interactive Template Renderer */}
      <main className="flex-1">
        <TemplateRenderer
          rendererRef={templateId}
          data={formData}
          mode="preview"
        />
      </main>
    </div>
  );
}
