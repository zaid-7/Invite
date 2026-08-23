import { Router } from 'express';
import { prisma } from '../config/database';
import { OccasionType, CultureTag } from '@prisma/client';

const router = Router();

const defaultSchema = {
  fields: [
    { name: 'groomName', label: "Groom's Name", type: 'text', required: true, step: 'names', defaultValue: 'Ranveer' },
    { name: 'brideName', label: "Bride's Name", type: 'text', required: true, step: 'names', defaultValue: 'Deepika' },
    { name: 'groomParents', label: "Groom's Parents", type: 'text', required: false, step: 'names', defaultValue: 'Mr. & Mrs. Bhavnani' },
    { name: 'brideParents', label: "Bride's Parents", type: 'text', required: false, step: 'names', defaultValue: 'Mr. & Mrs. Padukone' },
    { name: 'welcomeQuote', label: 'Welcome Quote', type: 'textarea', required: false, step: 'names', defaultValue: 'Together with our families, we request your presence as we pledge our love.' },
    {
      name: 'events',
      label: 'Wedding Events',
      type: 'array',
      required: true,
      step: 'events',
      defaultValue: [
        { name: 'Wedding Ceremony', date: '2026-11-14', time: '05:00 PM', venue: 'Villa del Balbianello', address: 'Lake Como, Italy' },
        { name: 'Grand Reception', date: '2026-11-21', time: '07:30 PM', venue: 'Grand Hyatt Mumbai', address: 'Santacruz East, Mumbai' }
      ]
    },
    { name: 'musicUrl', label: 'Background Music Track', type: 'select', required: false, step: 'music', options: [
      { label: 'Shehnai Classical', value: '/music/shehnai.mp3' },
      { label: 'Sufi Flute', value: '/music/sufi-flute.mp3' }
    ], defaultValue: '/music/sufi-flute.mp3' }
  ]
};

const FALLBACK_TEMPLATES = [
  {
    id: 'hindu-royal-wedding',
    name: 'Hindu Royal Wedding (Mandalla)',
    slug: 'hindu-royal-wedding',
    description: 'A rich, ceremonial Hindu wedding invitation with a gold mandala opener and deep crimson styling.',
    occasionType: 'WEDDING',
    cultureTag: 'HINDU',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'hindu-royal-wedding',
    thumbnailUrl: '/templates/thumbnails/hindu-royal.jpg',
    price: 119900,
    tier: 'PREMIUM',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: 'muslim-nikah-elegant',
    name: 'Muslim Nikah Elegant',
    slug: 'muslim-nikah-elegant',
    description: 'A refined, Islamic-art-inspired Nikah invitation with emerald green themes, lantern glow, and Bismillah opener.',
    occasionType: 'WEDDING',
    cultureTag: 'MUSLIM',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'muslim-nikah-elegant',
    thumbnailUrl: '/templates/thumbnails/muslim-nikah.jpg',
    price: 119900,
    tier: 'PREMIUM',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: false,
    isNew: true,
  },
  {
    id: 'royal-prestige',
    name: 'Royal Prestige Custom',
    slug: 'royal-prestige',
    description: 'An ultra-premium, interactive invitation featuring a custom wax seal envelope entry, dynamic scratch reveal date card, English/Urdu direct translation toggle, and elegant timing logs.',
    occasionType: 'WEDDING',
    cultureTag: 'UNIVERSAL',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'royal-prestige',
    thumbnailUrl: '/templates/thumbnails/royal-prestige.jpg',
    price: 119900,
    tier: 'PREMIUM',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: 'emerald-noir',
    name: 'Emerald Noir (Gold Foil)',
    slug: 'emerald-noir',
    description: 'A classic rich corporate gold foil textured invitation featuring a 3D door entry reveal card, scratch card save-the-date, and image slider galleries.',
    occasionType: 'WEDDING',
    cultureTag: 'UNIVERSAL',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'emerald-noir',
    thumbnailUrl: '/templates/thumbnails/emerald-noir.jpg',
    price: 79900,
    tier: 'BASIC',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: 'cinematic-royal',
    name: 'Cinematic Royal (Curtain Video)',
    slug: 'cinematic-royal',
    description: 'A royal video-hero card configured with dynamic sliding curtains entry, elegant event slots, and responsive audio layers.',
    occasionType: 'WEDDING',
    cultureTag: 'UNIVERSAL',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'cinematic-royal',
    thumbnailUrl: '/templates/thumbnails/cinematic-royal.jpg',
    price: 119900,
    tier: 'PREMIUM',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: 'crimson-royale',
    name: 'Crimson Royale',
    slug: 'crimson-royale',
    description: 'Dark charcoal base with gold and deep red accents, luxury card reveal.',
    occasionType: 'WEDDING',
    cultureTag: 'UNIVERSAL',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'crimson-royale',
    thumbnailUrl: '/templates/thumbnails/crimson-royale.jpg',
    price: 79900,
    tier: 'BASIC',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: 'royal-elegance-classic',
    name: 'Magestic Love',
    slug: 'royal-elegance-classic',
    description: 'Classic ivory and gold with palace motifs and velvet curtain reveal.',
    occasionType: 'WEDDING',
    cultureTag: 'UNIVERSAL',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'royal-elegance-classic',
    thumbnailUrl: '/templates/thumbnails/royal-elegance.jpg',
    price: 79900,
    tier: 'BASIC',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: 'garden-romance',
    name: 'Garden Romance',
    slug: 'garden-romance',
    description: 'Soft florals and natural tones for outdoor celebrations.',
    occasionType: 'WEDDING',
    cultureTag: 'UNIVERSAL',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'garden-romance',
    thumbnailUrl: '/templates/thumbnails/garden-romance.jpg',
    price: 79900,
    tier: 'BASIC',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    slug: 'modern-minimal',
    description: 'Clean lines and contemporary sophistication.',
    occasionType: 'WEDDING',
    cultureTag: 'UNIVERSAL',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'modern-minimal',
    thumbnailUrl: '/templates/thumbnails/modern-minimal.jpg',
    price: 79900,
    tier: 'BASIC',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: 'mughal-emerald',
    name: 'Mughal Emerald',
    slug: 'mughal-emerald',
    description: 'Rich emerald and gold inspired by Mughal architecture.',
    occasionType: 'WEDDING',
    cultureTag: 'UNIVERSAL',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'mughal-emerald',
    thumbnailUrl: '/templates/thumbnails/mughal-emerald.jpg',
    price: 79900,
    tier: 'BASIC',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: 'rose-gold-blush',
    name: 'Rose Gold Blush',
    slug: 'rose-gold-blush',
    description: 'Warm rose gold tones with delicate blush accents.',
    occasionType: 'WEDDING',
    cultureTag: 'UNIVERSAL',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'rose-gold-blush',
    thumbnailUrl: '/templates/thumbnails/rose-gold-blush.jpg',
    price: 79900,
    tier: 'BASIC',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: 'midnight-royal',
    name: 'Midnight Royal',
    slug: 'midnight-royal',
    description: 'Deep navy and gold for an evening celebration.',
    occasionType: 'WEDDING',
    cultureTag: 'UNIVERSAL',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'midnight-royal',
    thumbnailUrl: '/templates/thumbnails/midnight-royal.jpg',
    price: 79900,
    tier: 'BASIC',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: 'royal-imperial',
    name: 'Royal Imperial',
    slug: 'royal-imperial',
    description: 'Cinematic rose-gold opening with luxurious motion storytelling.',
    occasionType: 'WEDDING',
    cultureTag: 'UNIVERSAL',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'royal-imperial',
    thumbnailUrl: '/templates/thumbnails/royal-imperial.jpg',
    price: 119900,
    tier: 'PREMIUM',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: 'royal-heritage',
    name: 'Royal Heritage',
    slug: 'royal-heritage',
    description: 'Timeless cinematic opening with regal heritage storytelling.',
    occasionType: 'WEDDING',
    cultureTag: 'UNIVERSAL',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'royal-heritage',
    thumbnailUrl: '/templates/thumbnails/royal-heritage.jpg',
    price: 119900,
    tier: 'PREMIUM',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: true,
    isNew: true,
  },
  {
    id: 'royal-elegance-royal',
    name: 'Royal Elegance Royal',
    slug: 'royal-elegance-royal',
    description: 'Velvet cream and crimson cinematic experience with palace motifs.',
    occasionType: 'WEDDING',
    cultureTag: 'UNIVERSAL',
    regionTag: 'Universal',
    schemaJson: defaultSchema,
    rendererRef: 'royal-elegance-royal',
    thumbnailUrl: '/templates/thumbnails/royal-elegance-royal.jpg',
    price: 119900,
    tier: 'PREMIUM',
    status: 'ACTIVE',
    isFeatured: true,
    isTrending: true,
    isNew: true,
  }
];

// GET /api/templates
router.get('/', async (req, res): Promise<void> => {
  try {
    const { occasion, culture, featured, trending } = req.query;

    const where: any = { status: 'ACTIVE' };

    if (occasion) {
      where.occasionType = occasion as OccasionType;
    }
    if (culture) {
      where.cultureTag = culture as CultureTag;
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (trending === 'true') {
      where.isTrending = true;
    }

    let templates = [];
    try {
      templates = await prisma.template.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      // Fallback to static catalog if DB is offline
      let filtered = FALLBACK_TEMPLATES.filter(t => t.status === 'ACTIVE');
      if (occasion) filtered = filtered.filter(t => t.occasionType === (occasion as string));
      if (culture) filtered = filtered.filter(t => t.cultureTag === (culture as string));
      if (featured === 'true') filtered = filtered.filter(t => t.isFeatured);
      if (trending === 'true') filtered = filtered.filter(t => t.isTrending);
      templates = filtered as any;
    }

    res.json({
      status: 'success',
      results: templates.length,
      templates,
    });
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

// GET /api/templates/:id
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    let template = null;
    try {
      template = await prisma.template.findUnique({
        where: { id },
      });
    } catch (dbErr) {
      // Fallback to static lookup
      template = FALLBACK_TEMPLATES.find(t => t.id === id || t.slug === id) || null;
    }

    if (!template) {
      // Secondary check in fallback templates if id lookup yielded nothing
      template = FALLBACK_TEMPLATES.find(t => t.id === id || t.slug === id) || null;
    }

    if (!template) {
      res.status(404).json({ status: 'error', message: 'Template not found' });
      return;
    }

    res.json({
      status: 'success',
      template,
    });
  } catch (error: any) {
    console.error('Error fetching template details:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

export default router;
