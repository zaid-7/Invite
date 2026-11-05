import { ImageResponse } from 'next/og';
import { fetchInvitationData } from '../../../../lib/invitation-server';
import { getInvitationShareDetails } from '../../../../lib/invitation-share';
import { InvitationShareCard } from '../../../../components/templates/InvitationShareCard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const invitation = await fetchInvitationData(slug);
  if (!invitation) {
    return new Response('Invitation not found or inactive', { status: 404, headers: { 'Cache-Control': 'no-store' } });
  }

  return new ImageResponse(
    <InvitationShareCard {...getInvitationShareDetails(invitation)} />,
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
