'use client';

import React from 'react';
import { InvitationRenderer } from '@/templates/InvitationRenderer';

interface TemplateRendererProps {
  rendererRef: string;
  data: any;
  mode: 'preview' | 'live';
  slug?: string;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  rendererRef,
  data,
  mode,
  slug,
}) => {
  // Normalize the payload data by injecting templateId mapped from rendererRef
  const normalizedData = {
    ...data,
    templateId: rendererRef,
  };

  return <InvitationRenderer data={normalizedData} mode={mode} slug={slug} />;
};
