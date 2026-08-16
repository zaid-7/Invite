export interface TemplateField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'time' | 'select' | 'array';
  required?: boolean;
  step?: string;
  defaultValue?: any;
  options?: { label: string; value: string }[];
  schema?: {
    fields: {
      name: string;
      label: string;
      type: string;
      required?: boolean;
      defaultValue?: any;
    }[];
  };
}

export interface TemplateSchema {
  fields: TemplateField[];
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  occasionType: 'WEDDING' | 'ENGAGEMENT' | 'BIRTHDAY' | 'HOUSEWARMING' | 'BABY_SHOWER' | 'RELIGIOUS';
  cultureTag: 'HINDU' | 'MUSLIM' | 'SIKH' | 'CHRISTIAN' | 'UNIVERSAL';
  regionTag: string | null;
  schemaJson: TemplateSchema;
  rendererRef: string;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  price: number; // in paise
  tier: 'BASIC' | 'PREMIUM' | 'DELUXE';
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  isFeatured: boolean;
  isTrending: boolean;
  isNew: boolean;
  createdAt: string;
}

export interface Preview {
  id: string;
  userId: string;
  templateId: string;
  formData: any;
  token: string;
  expiresAt: string;
  viewCount: number;
  maxViews: number;
  status: 'ACTIVE' | 'EXPIRED' | 'CONVERTED';
  createdAt: string;
  template: Template;
}

export interface Invitation {
  id: string;
  orderId: string;
  templateId: string;
  userId: string;
  finalData: any;
  slug: string;
  expiryDate: string | null;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  ogTitle: string | null;
  ogImage: string | null;
  createdAt: string;
  template: Template;
  rsvps: Rsvp[];
}

export interface Rsvp {
  id: string;
  invitationId: string;
  guestName: string;
  response: 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE';
  guestCount: number;
  message: string | null;
  createdAt: string;
}
