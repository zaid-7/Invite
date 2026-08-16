import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const hinduSchema = {
  fields: [
    { name: 'groomName', label: "Groom's Name", type: 'text', required: true, step: 'names', defaultValue: 'Arjun' },
    { name: 'brideName', label: "Bride's Name", type: 'text', required: true, step: 'names', defaultValue: 'Pooja' },
    { name: 'groomParents', label: "Groom's Parents", type: 'text', required: false, step: 'names', defaultValue: 'Mr. & Mrs. Sharma' },
    { name: 'brideParents', label: "Bride's Parents", type: 'text', required: false, step: 'names', defaultValue: 'Mr. & Mrs. Patel' },
    { name: 'welcomeQuote', label: 'Welcome/Blessing Quote', type: 'textarea', required: false, step: 'names', defaultValue: 'Seeking the blessings of Lord Ganesha, we invite you to join us in celebrating our wedding.' },
    {
      name: 'events',
      label: 'Wedding Events',
      type: 'array',
      required: true,
      step: 'events',
      defaultValue: [
        { name: 'Haldi & Mehendi', date: '2026-11-20', time: '11:00 AM', venue: 'Royal Palms Resort', address: 'ECR Main Road, Chennai' },
        { name: 'Wedding (Muhurtham)', date: '2026-11-21', time: '09:30 AM', venue: 'Shubh Laxmi Mandapam', address: 'Avinashi Road, Coimbatore' },
        { name: 'Reception', date: '2026-11-21', time: '07:00 PM', venue: 'Grand Palace Palace Hall', address: 'Trichy Road, Coimbatore' }
      ]
    },
    { name: 'musicUrl', label: 'Background Music Track', type: 'select', required: false, step: 'music', options: [
      { label: 'Shehnai Classical', value: '/music/shehnai.mp3' },
      { label: 'Sitar Devotional', value: '/music/sitar.mp3' }
    ], defaultValue: '/music/shehnai.mp3' }
  ]
};

const muslimSchema = {
  fields: [
    { name: 'groomName', label: "Groom's Name", type: 'text', required: true, step: 'names', defaultValue: 'Zain' },
    { name: 'brideName', label: "Bride's Name", type: 'text', required: true, step: 'names', defaultValue: 'Farheen' },
    { name: 'groomParents', label: "Groom's Parents", type: 'text', required: false, step: 'names', defaultValue: 'Mr. & Mrs. Altaf Ahmed' },
    { name: 'brideParents', label: "Bride's Parents", type: 'text', required: false, step: 'names', defaultValue: 'Mr. & Mrs. Shakeel Khan' },
    { name: 'welcomeQuote', label: 'Welcome Quote (Bismillah / Verse)', type: 'textarea', required: false, step: 'names', defaultValue: 'In the name of Allah, the Most Gracious, the Most Merciful. We request the pleasure of your company.' },
    {
      name: 'events',
      label: 'Nikah & Walima Events',
      type: 'array',
      required: true,
      step: 'events',
      defaultValue: [
        { name: 'Nikah (Marriage Ceremony)', date: '2026-12-15', time: '04:00 PM', venue: 'Royal Crescent Banquet', address: 'Old City, Hyderabad' },
        { name: 'Walima (Reception)', date: '2026-12-16', time: '07:30 PM', venue: 'Taj Falaknuma Palace', address: 'Engine Bowli, Hyderabad' }
      ]
    },
    { name: 'musicUrl', label: 'Background Music Track', type: 'select', required: false, step: 'music', options: [
      { label: 'Sufi Flute instrumental', value: '/music/sufi-flute.mp3' },
      { label: 'Sitar Classical', value: '/music/instrumental-sitar.mp3' }
    ], defaultValue: '/music/sufi-flute.mp3' }
  ]
};

const prestigeSchema = {
  fields: [
    { name: 'groomName', label: "Groom's Name", type: 'text', required: true, step: 'names', defaultValue: 'Veer' },
    { name: 'brideName', label: "Bride's Name", type: 'text', required: true, step: 'names', defaultValue: 'Zara' },
    { name: 'groomParents', label: "Groom's Parents", type: 'text', required: false, step: 'names', defaultValue: 'Mr. & Mrs. Sharma' },
    { name: 'brideParents', label: "Bride's Parents", type: 'text', required: false, step: 'names', defaultValue: 'Mr. & Mrs. Patel' },
    { name: 'welcomeQuote', label: 'Welcome / Blessing Quote', type: 'textarea', required: false, step: 'names', defaultValue: 'Seeking the blessings of the Almighty, we invite you to join us in celebrating our wedding.' },
    {
      name: 'events',
      label: 'Wedding Events',
      type: 'array',
      required: true,
      step: 'events',
      defaultValue: [
        { name: 'Guest Arrival', date: '2026-09-30', time: '10:00 AM', venue: 'Royal Palms Resort', address: 'ECR Main Road, Chennai' },
        { name: 'Wedding Ceremony', date: '2026-09-30', time: '10:30 AM', venue: 'Grand Palace Palace Hall', address: 'Avinashi Road, Coimbatore' },
        { name: 'Reception Dinner', date: '2026-09-30', time: '07:00 PM', venue: 'Royal Palms Resort', address: 'ECR Main Road, Chennai' }
      ]
    },
    { name: 'musicUrl', label: 'Background Music Track', type: 'select', required: false, step: 'music', options: [
      { label: 'Shehnai Classical', value: '/music/shehnai.mp3' },
      { label: 'Sufi Flute Instrumental', value: '/music/sufi-flute.mp3' }
    ], defaultValue: '/music/shehnai.mp3' }
  ]
};

const emeraldSchema = {
  fields: [
    { name: 'groomName', label: "Groom's Name", type: 'text', required: true, step: 'names', defaultValue: 'Siddharth' },
    { name: 'brideName', label: "Bride's Name", type: 'text', required: true, step: 'names', defaultValue: 'Anjali' },
    { name: 'groomParents', label: "Groom's Parents", type: 'text', required: false, step: 'names', defaultValue: 'Mr. & Mrs. Kapoor' },
    { name: 'brideParents', label: "Bride's Parents", type: 'text', required: false, step: 'names', defaultValue: 'Mr. & Mrs. Malhotra' },
    { name: 'welcomeQuote', label: 'Invitational Quote', type: 'textarea', required: false, step: 'names', defaultValue: 'We cordially invite you to celebrate our new beginning.' },
    {
      name: 'events',
      label: 'Ceremonies',
      type: 'array',
      required: true,
      step: 'events',
      defaultValue: [
        { name: 'Sangeet Night', date: '2026-10-18', time: '06:30 PM', venue: 'The Leela Palace', address: 'Diplomatic Enclave, New Delhi' },
        { name: 'Wedding (Pheras)', date: '2026-10-19', time: '04:00 PM', venue: 'The Leela Palace', address: 'Chanakyapuri, New Delhi' }
      ]
    },
    { name: 'musicUrl', label: 'Background Music Track', type: 'select', required: false, step: 'music', options: [
      { label: 'Sitar Classical', value: '/music/sitar.mp3' },
      { label: 'Sufi Flute', value: '/music/sufi-flute.mp3' }
    ], defaultValue: '/music/sitar.mp3' }
  ]
};

const cinematicRoyalSchema = {
  fields: [
    { name: 'groomName', label: "Groom's Name", type: 'text', required: true, step: 'names', defaultValue: 'Ranveer' },
    { name: 'brideName', label: "Bride's Name", type: 'text', required: true, step: 'names', defaultValue: 'Deepika' },
    { name: 'groomParents', label: "Groom's Parents", type: 'text', required: false, step: 'names', defaultValue: 'Mr. & Mrs. Bhavnani' },
    { name: 'brideParents', label: "Bride's Parents", type: 'text', required: false, step: 'names', defaultValue: 'Mr. & Mrs. Padukone' },
    { name: 'welcomeQuote', label: 'Royal Invitational Quote', type: 'textarea', required: false, step: 'names', defaultValue: 'Together with our families, we request your presence as we pledge our love.' },
    {
      name: 'events',
      label: 'Royal Ceremonies',
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

async function main() {
  console.log('Seeding templates...');

  await prisma.rsvp.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.order.deleteMany();
  await prisma.preview.deleteMany();
  await prisma.template.deleteMany();
  await prisma.user.deleteMany();

  await prisma.template.create({
    data: {
      name: 'Hindu Royal Wedding (Mandalla)',
      slug: 'hindu-royal-wedding',
      description: 'A rich, ceremonial Hindu wedding invitation with a gold mandala opener and deep crimson styling.',
      occasionType: 'WEDDING',
      cultureTag: 'HINDU',
      regionTag: 'Universal',
      schemaJson: hinduSchema,
      rendererRef: 'hindu-royal-wedding',
      thumbnailUrl: '/templates/thumbnails/hindu-royal.jpg',
      previewUrl: '/templates/previews/hindu-royal.gif',
      price: 49900, // Rs 499.00 in paise
      tier: 'PREMIUM',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: true,
      isNew: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Muslim Nikah Elegant',
      slug: 'muslim-nikah-elegant',
      description: 'A refined, Islamic-art-inspired Nikah invitation with emerald green themes, lantern glow, and Bismillah opener.',
      occasionType: 'WEDDING',
      cultureTag: 'MUSLIM',
      regionTag: 'Universal',
      schemaJson: muslimSchema,
      rendererRef: 'muslim-nikah-elegant',
      thumbnailUrl: '/templates/thumbnails/muslim-nikah.jpg',
      previewUrl: '/templates/previews/muslim-nikah.gif',
      price: 49900, // Rs 499.00 in paise
      tier: 'PREMIUM',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: false,
      isNew: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Royal Prestige Custom',
      slug: 'royal-prestige',
      description: 'An ultra-premium, interactive invitation featuring a custom wax seal envelope entry, dynamic scratch reveal date card, English/Urdu direct translation toggle, and elegant timing logs.',
      occasionType: 'WEDDING',
      cultureTag: 'UNIVERSAL',
      regionTag: 'Universal',
      schemaJson: prestigeSchema,
      rendererRef: 'royal-prestige',
      thumbnailUrl: '/templates/thumbnails/royal-prestige.jpg',
      previewUrl: '/templates/previews/royal-prestige.gif',
      price: 59900, // Rs 599.00 in paise
      tier: 'PREMIUM',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: true,
      isNew: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Emerald Noir (Gold Foil)',
      slug: 'emerald-noir',
      description: 'A classic rich corporate gold foil textured invitation featuring a 3D door entry reveal card, scratch card save-the-date, and image slider galleries.',
      occasionType: 'WEDDING',
      cultureTag: 'UNIVERSAL',
      regionTag: 'Universal',
      schemaJson: emeraldSchema,
      rendererRef: 'emerald-noir',
      thumbnailUrl: '/templates/thumbnails/emerald-noir.jpg',
      previewUrl: '/templates/previews/emerald-noir.gif',
      price: 39900, // Rs 399.00 in paise
      tier: 'BASIC',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: true,
      isNew: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Cinematic Royal (Curtain Video)',
      slug: 'cinematic-royal',
      description: 'A royal video-hero card configured with dynamic sliding curtains entry, elegant event slots, and responsive audio layers.',
      occasionType: 'WEDDING',
      cultureTag: 'UNIVERSAL',
      regionTag: 'Universal',
      schemaJson: cinematicRoyalSchema,
      rendererRef: 'cinematic-royal',
      thumbnailUrl: '/templates/thumbnails/cinematic-royal.jpg',
      previewUrl: '/templates/previews/cinematic-royal.gif',
      price: 59900,
      tier: 'PREMIUM',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: true,
      isNew: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Crimson Royale',
      slug: 'crimson-royale',
      description: 'Dark charcoal base with gold and deep red accents, luxury card reveal.',
      occasionType: 'WEDDING',
      cultureTag: 'UNIVERSAL',
      regionTag: 'Universal',
      schemaJson: emeraldSchema,
      rendererRef: 'crimson-royale',
      thumbnailUrl: '/templates/thumbnails/crimson-royale.jpg',
      previewUrl: '/templates/previews/crimson-royale.gif',
      price: 39900,
      tier: 'BASIC',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: true,
      isNew: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Magestic Love',
      slug: 'royal-elegance-classic',
      description: 'Classic ivory and gold with palace motifs and velvet curtain reveal.',
      occasionType: 'WEDDING',
      cultureTag: 'UNIVERSAL',
      regionTag: 'Universal',
      schemaJson: emeraldSchema,
      rendererRef: 'royal-elegance-classic',
      thumbnailUrl: '/templates/thumbnails/royal-elegance.jpg',
      previewUrl: '/templates/previews/royal-elegance-classic.gif',
      price: 39900,
      tier: 'BASIC',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: true,
      isNew: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Garden Romance',
      slug: 'garden-romance',
      description: 'Soft florals and natural tones for outdoor celebrations.',
      occasionType: 'WEDDING',
      cultureTag: 'UNIVERSAL',
      regionTag: 'Universal',
      schemaJson: emeraldSchema,
      rendererRef: 'garden-romance',
      thumbnailUrl: '/templates/thumbnails/garden-romance.jpg',
      previewUrl: '/templates/previews/garden-romance.gif',
      price: 39900,
      tier: 'BASIC',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: true,
      isNew: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Modern Minimal',
      slug: 'modern-minimal',
      description: 'Clean lines and contemporary sophistication.',
      occasionType: 'WEDDING',
      cultureTag: 'UNIVERSAL',
      regionTag: 'Universal',
      schemaJson: emeraldSchema,
      rendererRef: 'modern-minimal',
      thumbnailUrl: '/templates/thumbnails/modern-minimal.jpg',
      previewUrl: '/templates/previews/modern-minimal.gif',
      price: 39900,
      tier: 'BASIC',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: true,
      isNew: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Mughal Emerald',
      slug: 'mughal-emerald',
      description: 'Rich emerald and gold inspired by Mughal architecture.',
      occasionType: 'WEDDING',
      cultureTag: 'UNIVERSAL',
      regionTag: 'Universal',
      schemaJson: emeraldSchema,
      rendererRef: 'mughal-emerald',
      thumbnailUrl: '/templates/thumbnails/mughal-emerald.jpg',
      previewUrl: '/templates/previews/mughal-emerald.gif',
      price: 39900,
      tier: 'BASIC',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: true,
      isNew: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Rose Gold Blush',
      slug: 'rose-gold-blush',
      description: 'Warm rose gold tones with delicate blush accents.',
      occasionType: 'WEDDING',
      cultureTag: 'UNIVERSAL',
      regionTag: 'Universal',
      schemaJson: emeraldSchema,
      rendererRef: 'rose-gold-blush',
      thumbnailUrl: '/templates/thumbnails/rose-gold-blush.jpg',
      previewUrl: '/templates/previews/rose-gold-blush.gif',
      price: 39900,
      tier: 'BASIC',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: true,
      isNew: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Midnight Royal',
      slug: 'midnight-royal',
      description: 'Deep navy and gold for an evening celebration.',
      occasionType: 'WEDDING',
      cultureTag: 'UNIVERSAL',
      regionTag: 'Universal',
      schemaJson: emeraldSchema,
      rendererRef: 'midnight-royal',
      thumbnailUrl: '/templates/thumbnails/midnight-royal.jpg',
      previewUrl: '/templates/previews/midnight-royal.gif',
      price: 39900,
      tier: 'BASIC',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: true,
      isNew: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Royal Imperial',
      slug: 'royal-imperial',
      description: 'Cinematic rose-gold opening with luxurious motion storytelling.',
      occasionType: 'WEDDING',
      cultureTag: 'UNIVERSAL',
      regionTag: 'Universal',
      schemaJson: cinematicRoyalSchema,
      rendererRef: 'royal-imperial',
      thumbnailUrl: '/templates/thumbnails/royal-imperial.jpg',
      previewUrl: '/templates/previews/royal-imperial.gif',
      price: 59900,
      tier: 'PREMIUM',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: true,
      isNew: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Royal Heritage',
      slug: 'royal-heritage',
      description: 'Timeless cinematic opening with regal heritage storytelling.',
      occasionType: 'WEDDING',
      cultureTag: 'UNIVERSAL',
      regionTag: 'Universal',
      schemaJson: cinematicRoyalSchema,
      rendererRef: 'royal-heritage',
      thumbnailUrl: '/templates/thumbnails/royal-heritage.jpg',
      previewUrl: '/templates/previews/royal-heritage.gif',
      price: 59900,
      tier: 'PREMIUM',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: true,
      isNew: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Royal Elegance Royal',
      slug: 'royal-elegance-royal',
      description: 'Velvet cream and crimson cinematic experience with palace motifs.',
      occasionType: 'WEDDING',
      cultureTag: 'UNIVERSAL',
      regionTag: 'Universal',
      schemaJson: cinematicRoyalSchema,
      rendererRef: 'royal-elegance-royal',
      thumbnailUrl: '/templates/thumbnails/royal-elegance-royal.jpg',
      previewUrl: '/templates/previews/royal-elegance-royal.gif',
      price: 59900,
      tier: 'PREMIUM',
      status: 'ACTIVE',
      isFeatured: true,
      isTrending: true,
      isNew: true,
    },
  });

  // Query the seeded templates
  const royalHeritageT = await prisma.template.findUniqueOrThrow({ where: { slug: 'royal-heritage' } });
  const royalPrestigeT = await prisma.template.findUniqueOrThrow({ where: { slug: 'royal-prestige' } });
  const royalImperialT = await prisma.template.findUniqueOrThrow({ where: { slug: 'royal-imperial' } });
  const royalEleganceRoyalT = await prisma.template.findUniqueOrThrow({ where: { slug: 'royal-elegance-royal' } });

  // Create a Demo User
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      phone: '9876543210',
      name: 'Demo User',
    },
  });

  const templatesList = [royalHeritageT, royalPrestigeT, royalImperialT, royalEleganceRoyalT];

  for (const t of templatesList) {
    const demoPreview = await prisma.preview.create({
      data: {
        userId: demoUser.id,
        templateId: t.id,
        formData: {
          groomName: 'Ranveer',
          brideName: 'Deepika',
          groomParents: 'Mr. & Mrs. Bhavnani',
          brideParents: 'Mr. & Mrs. Padukone',
          welcomeQuote: 'Together with our families, we request your presence as we pledge our love.',
          musicUrl: t.slug === 'royal-prestige' || t.slug === 'royal-heritage' || t.slug === 'royal-elegance-royal' ? '/music/sufi-flute.mp3' : '/music/shehnai.mp3',
          events: [
            { name: 'Wedding Ceremony', date: '2026-11-14', time: '05:00 PM', venue: 'Villa del Balbianello', address: 'Lake Como, Italy' },
            { name: 'Grand Reception', date: '2026-11-21', time: '07:30 PM', venue: 'Grand Hyatt Mumbai', address: 'Santacruz East, Mumbai' }
          ]
        },
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });

    const demoOrder = await prisma.order.create({
      data: {
        userId: demoUser.id,
        previewId: demoPreview.id,
        amount: 59900,
        paymentStatus: 'PAID',
        gatewayRef: `pay_${t.slug}_order`,
        paymentId: `pay_${t.slug}_payment_id`,
      },
    });

    await prisma.invitation.create({
      data: {
        orderId: demoOrder.id,
        templateId: t.id,
        userId: demoUser.id,
        slug: t.slug,
        status: 'ACTIVE',
        ogTitle: `${t.name} - Ranveer & Deepika`,
        finalData: {
          templateId: t.slug,
          groomName: 'Ranveer',
          brideName: 'Deepika',
          groomParents: 'Mr. & Mrs. Bhavnani',
          brideParents: 'Mr. & Mrs. Padukone',
          welcomeQuote: 'Together with our families, we request your presence as we pledge our love.',
          musicUrl: t.slug === 'royal-prestige' || t.slug === 'royal-heritage' || t.slug === 'royal-elegance-royal' ? '/music/sufi-flute.mp3' : '/music/shehnai.mp3',
          events: [
            { name: 'Wedding Ceremony', date: '2026-11-14', time: '05:00 PM', venue: 'Villa del Balbianello', address: 'Lake Como, Italy' },
            { name: 'Grand Reception', date: '2026-11-21', time: '07:30 PM', venue: 'Grand Hyatt Mumbai', address: 'Santacruz East, Mumbai' }
          ]
        },
      },
    });
  }

  console.log('Seeded templates count:', await prisma.template.count());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
