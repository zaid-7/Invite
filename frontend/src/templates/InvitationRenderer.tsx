'use client';

import type { InvitationData } from './types';
import { getTemplateById } from './manifest';

interface InvitationRendererProps {
  data: any;
  mode?: 'preview' | 'live';
  slug?: string;
}

// Drop this into your public invitation page, e.g. app/invite/[slug]/page.tsx,
// after fetching the InvitationData for that slug from your DB.
export function InvitationRenderer({ data, mode, slug }: InvitationRendererProps) {
  // Check if target template is one of the new modular layouts
  const isModular = data && data.templateId !== 'hindu-royal-wedding' && data.templateId !== 'muslim-nikah-elegant';

  let normalizedData = data;
  if (isModular && data) {
    const firstEvent = data.events && data.events[0];
    const eventDate = firstEvent ? firstEvent.date : new Date().toISOString().split('T')[0];

    normalizedData = {
      id: data.id || 'temp-id',
      templateId: data.templateId,
      coupleNames: {
        partnerOne: data.groomName || 'Partner One',
        partnerTwo: data.brideName || 'Partner Two',
      },
      weddingDateTimeISO: eventDate ? `${eventDate}T17:00:00` : new Date().toISOString(),
      tagline: data.welcomeQuote || 'Together with their families...',
      events: (data.events || []).map((ev: any) => ({
        label: ev.name,
        venueName: ev.venue,
        address: ev.address,
        time: ev.time || '05:00 PM onwards',
        mapUrl: 'https://maps.google.com',
      })),
      dressCode: 'Formal Traditional / Smart Elegant',
      gallery: [
        { url: '/slide-images/slide-1.jpg', alt: 'Wedding Couple' },
        { url: '/slide-images/slide-2.jpg', alt: 'Decorations' },
        { url: '/slide-images/slide-3.jpg', alt: 'Celebration' },
        { url: '/slide-images/slide-4.jpg', alt: 'Moments' },
      ],
      heroImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
      heroVideoUrl: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054e18987d10005cae1dbbbcfbb63c6&profile_id=139&oauth2_token_id=57447761',
      heroPosterUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
      musicTrackUrl: data.musicUrl || '',
      sections: {
        scratchReveal: true,
        countdown: true,
        gallery: true,
        rsvp: true,
        map: true,
        musicPlayer: !!data.musicUrl,
      },
    };
  }

  const entry = getTemplateById(normalizedData ? normalizedData.templateId : '');

  if (!entry) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Template not found.</div>;
  }

  const { Component } = entry;
  return <Component data={normalizedData} mode={mode} slug={slug} />;
}
