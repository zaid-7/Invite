import type { Metadata } from 'next';

interface ShareInvitation {
  ogTitle?: string | null;
  finalData: unknown;
  template?: { occasionType?: string };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function formatDate(value: unknown): string {
  const input = text(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) return '';
  const date = new Date(`${input}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== input) return '';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function getInvitationShareDetails(invitation: ShareInvitation) {
  const data = isRecord(invitation.finalData) ? invitation.finalData : {};
  const events = Array.isArray(data.events) ? data.events : [];
  const firstEvent = isRecord(events[0]) ? events[0] : {};
  const names = [text(data.groomName), text(data.brideName)].filter(Boolean).join(' & ');
  const occasions: Record<string, string> = {
    WEDDING: 'Wedding Invitation',
    ENGAGEMENT: 'Engagement Invitation',
    BIRTHDAY: 'Birthday Invitation',
    HOUSEWARMING: 'Housewarming Invitation',
    BABY_SHOWER: 'Baby Shower Invitation',
    RELIGIOUS: 'Celebration Invitation',
  };
  const occasion = occasions[invitation.template?.occasionType || ''] || 'Celebration Invitation';
  const title = text(invitation.ogTitle) || (names ? `${names} — ${occasion}` : occasion);
  const date = formatDate(firstEvent.date);
  const time = text(firstEvent.time);
  const venue = text(firstEvent.venue) || text(firstEvent.address);
  const eventDetails = [date, time, venue].filter(Boolean).join(' · ');
  const description = [
    names ? `You are cordially invited to celebrate with ${names}.` : 'You are cordially invited to celebrate with us.',
    eventDetails ? `${eventDetails}.` : '',
    data.includeRsvp === false ? 'Open the invitation for event details.' : 'Open the invitation for event details and RSVP.',
  ].filter(Boolean).join(' ');

  return { names, occasion, title, description, date, time, venue };
}

export function getInvitationShareMetadata(invitation: ShareInvitation, pageUrl: URL): Metadata {
  const details = getInvitationShareDetails(invitation);
  const imageUrl = new URL(`${pageUrl.pathname}/share-image`, pageUrl.origin).href;
  const image = {
    url: imageUrl,
    width: 1200,
    height: 630,
    type: 'image/png',
    alt: details.names ? `${details.occasion} for ${details.names}` : details.occasion,
  };
  return {
    metadataBase: new URL(pageUrl.origin),
    title: `${details.title} — InviteCraft`,
    description: details.description,
    alternates: { canonical: pageUrl.href },
    openGraph: {
      title: details.title,
      description: details.description,
      url: pageUrl.href,
      siteName: 'InviteCraft',
      locale: 'en_IN',
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: details.title,
      description: details.description,
      images: [imageUrl],
    },
  };
}
