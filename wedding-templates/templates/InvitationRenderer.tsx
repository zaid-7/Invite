'use client';

import type { InvitationData } from './types';
import { getTemplateById } from './manifest';

interface InvitationRendererProps {
  data: InvitationData;
}

// Drop this into your public invitation page, e.g. app/invite/[slug]/page.tsx,
// after fetching the InvitationData for that slug from your DB.
export function InvitationRenderer({ data }: InvitationRendererProps) {
  const entry = getTemplateById(data.templateId);

  if (!entry) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Template not found.</div>;
  }

  const { Component } = entry;
  return <Component data={data} />;
}
