import React from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { fetchInvitationData } from '../../../lib/invitation-server';
import { getInvitationShareMetadata } from '../../../lib/invitation-share';
import InvitationClient from './InvitationClient';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await fetchInvitationData(slug);

  if (!invitation) {
    return {
      title: 'Invitation Not Found — InviteCraft',
    };
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host');
  if (!process.env.NEXT_PUBLIC_SITE_URL && !host) {
    throw new Error('A site URL or request host is required for invitation sharing metadata');
  }
  const protocol = requestHeaders.get('x-forwarded-proto') || (host?.startsWith('localhost') || host?.startsWith('127.0.0.1') ? 'http' : 'https');
  const origin = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
  return getInvitationShareMetadata(invitation, new URL(`/i/${encodeURIComponent(slug)}`, origin));
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
