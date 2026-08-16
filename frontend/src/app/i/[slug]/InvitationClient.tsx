'use client';

import React from 'react';
import { Invitation } from '@/types/template';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

interface InvitationClientProps {
  invitation: Invitation;
}

export default function InvitationClient({ invitation }: InvitationClientProps) {
  return (
    <div className="relative min-h-screen">
      <TemplateRenderer
        rendererRef={invitation.template.rendererRef}
        data={invitation.finalData}
        mode="live"
        slug={invitation.slug}
      />
    </div>
  );
}
