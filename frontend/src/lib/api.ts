const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api';

// Helper to get authorization header
const getHeaders = (headers: HeadersInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('invitecraft_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
};

export const api = {
  // Authentication
  async sendOtp(phone?: string, email?: string) {
    const res = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ phone, email }),
    });
    return res.json();
  },

  async verifyOtp(phone: string | null, email: string | null, otp: string) {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ phone, email, otp }),
    });
    const data = await res.json();
    if (data.status === 'success' && data.token) {
      localStorage.setItem('invitecraft_token', data.token);
      localStorage.setItem('invitecraft_user', JSON.stringify(data.user));
    }
    return data;
  },

  async me() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return res.json();
  },

  logout() {
    localStorage.removeItem('invitecraft_token');
    localStorage.removeItem('invitecraft_user');
  },

  // Templates
  async getTemplates(filters?: { occasion?: string; culture?: string; featured?: boolean; trending?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.occasion) params.set('occasion', filters.occasion);
    if (filters?.culture) params.set('culture', filters.culture);
    if (filters?.featured) params.set('featured', 'true');
    if (filters?.trending) params.set('trending', 'true');

    const res = await fetch(`${BASE_URL}/templates?${params.toString()}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return res.json();
  },

  async getTemplate(id: string) {
    const res = await fetch(`${BASE_URL}/templates/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Previews
  async createPreview(templateId: string, formData: any) {
    const res = await fetch(`${BASE_URL}/previews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ templateId, formData }),
    });
    return res.json();
  },

  async getPreview(token: string) {
    const res = await fetch(`${BASE_URL}/previews/${token}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return res.json();
  },

  async getPreviewStatus(token: string) {
    const res = await fetch(`${BASE_URL}/previews/${token}/status`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Payments
  async createOrder(previewId: string) {
    const res = await fetch(`${BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ previewId }),
    });
    return res.json();
  },

  async verifyPayment(orderId: string, paymentId: string, signature?: string) {
    const res = await fetch(`${BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ orderId, paymentId, signature }),
    });
    return res.json();
  },

  // Invitations
  async getInvitation(slug: string) {
    const res = await fetch(`${BASE_URL}/invitations/${slug}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return res.json();
  },

  async submitRsvp(slug: string, guestName: string, response: string, guestCount: number, message?: string) {
    const res = await fetch(`${BASE_URL}/invitations/${slug}/rsvp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ guestName, response, guestCount, message }),
    });
    return res.json();
  },
};
