import React from 'react';
import type { Metadata } from 'next';
import InvitationClient from './InvitationClient';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

async function fetchInvitationData(slug: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/invitations/${slug}`, {
      cache: 'no-store', // force fetch fresh
    });
    if (!res.ok) return null;
    const body = await res.json();
    return body.status === 'success' ? body.invitation : null;
  } catch (err) {
    console.error('Error fetching invitation on server:', err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await fetchInvitationData(slug);

  if (!invitation) {
    return {
      title: 'Invitation Not Found — Mandap',
    };
  }

  const titleString = invitation.ogTitle || 'Wedding Celebration Invitation';

  return {
    title: `${titleString} — Mandap`,
    description: `You have been cordially invited to celebrate with us. View timings, venues, and RSVP online.`,
    openGraph: {
      title: titleString,
      description: `You have been cordially invited to celebrate with us. View timings, venues, and RSVP online.`,
      locale: 'en_IN',
      type: 'article',
    },
  };
}

export default async function PermanentInvitationPage({ params }: Props) {
  const { slug } = await params;
  const invitation = await fetchInvitationData(slug);

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 text-center select-none font-sans">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm border-l-4 border-red-500">
          <span className="text-3xl mb-3 block">⚠️</span>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Invitation Inactive</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            The requested digital invitation is expired, has been revoked, or does not exist.
          </p>
          <Link
            href="/"
            className="inline-block bg-maroon-deep text-ivory hover:opacity-90 font-bold py-2 px-6 rounded text-xs uppercase"
          >
            Create Your Invitation
          </Link>
        </div>
      </div>
    );
  }

  return <InvitationClient invitation={invitation} />;
}
