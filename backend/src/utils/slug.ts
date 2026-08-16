import crypto from 'crypto';

export const generateSlug = (text?: string): string => {
  if (!text) {
    return crypto.randomBytes(6).toString('hex'); // 12 chars hex
  }

  // Normalize text: lowercase, replace spaces and special chars, trim
  const clean = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word, non-space, non-hyphens
    .replace(/[\s_]+/g, '-')   // replace spaces/underscores with hyphens
    .replace(/-+/g, '-');      // remove consecutive hyphens

  const suffix = crypto.randomBytes(3).toString('hex'); // 6 chars hex suffix
  return `${clean}-${suffix}`;
};
