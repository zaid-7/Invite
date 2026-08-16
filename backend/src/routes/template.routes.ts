import { Router } from 'express';
import { prisma } from '../config/database';
import { OccasionType, CultureTag } from '@prisma/client';

const router = Router();

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

    const templates = await prisma.template.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

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

    const template = await prisma.template.findUnique({
      where: { id },
    });

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
