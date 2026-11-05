import { cache } from 'react';
import type { Invitation } from '../types/template';

export const fetchInvitationData = cache(async (slug: string): Promise<Invitation | null> => {
  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api';
    const response = await fetch(`${backendUrl}/invitations/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (response.status === 404 || response.status === 410) return null;
    if (!response.ok) {
      throw new Error(`Invitation API returned HTTP ${response.status}`);
    }
    const body = await response.json();
    if (body.status !== 'success' || !body.invitation) {
      throw new Error('Invitation API returned an invalid response');
    }
    return body.invitation;
  } catch (error) {
    console.error('Error fetching invitation on server:', error);
    return null;
  }
});
