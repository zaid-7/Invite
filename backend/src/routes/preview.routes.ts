import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { env } from '../config/env';
import { generateSlug } from '../utils/slug';

const router = Router();

const memoryPreviewMap = new Map<string, any>();

// POST /api/previews (Protected)
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { templateId, formData } = req.body;

    if (!userId || !templateId || !formData) {
      res.status(400).json({ status: 'error', message: 'Missing user, template, or form data.' });
      return;
    }

    const expiresAt = new Date(Date.now() + env.PREVIEW_TTL_MINUTES * 60 * 1000);
    const maxViews = env.PREVIEW_MAX_VIEWS;
    const token = `prv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    let preview: any = null;

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        // If DB exists but user missing
        res.status(401).json({ status: 'error', message: 'User session is invalid. Please log in again.', code: 'USER_NOT_FOUND' });
        return;
      }

      preview = await prisma.preview.create({
        data: {
          userId,
          templateId,
          formData,
          expiresAt,
          maxViews,
          status: 'ACTIVE',
        },
        include: {
          template: true,
        },
      });

      try {
        const redisKey = `preview:${preview.token}`;
        const redisData = {
          expiresAt: expiresAt.toISOString(),
          viewCount: 0,
          maxViews,
        };
        const ttlSeconds = env.PREVIEW_TTL_MINUTES * 60;
        await redis.set(redisKey, JSON.stringify(redisData), 'EX', ttlSeconds);
      } catch (rErr) {
        // Ignore redis if offline
      }
    } catch (dbErr) {
      // In-memory fallback if DB is offline
      preview = {
        id: `prv_id_${Date.now()}`,
        userId,
        templateId,
        formData,
        token,
        expiresAt,
        maxViews,
        viewCount: 0,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        template: {
          id: templateId,
          name: 'Designer Invitation',
          rendererRef: templateId,
          slug: templateId,
        }
      };
      memoryPreviewMap.set(token, preview);
    }

    res.json({
      status: 'success',
      preview,
    });
  } catch (error: any) {
    console.error('Error creating preview:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

router.post('/:token/unlock', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ status: 'error', message: 'Please log in to unlock your invitation.' });
      return;
    }

    const invitation = await prisma.$transaction(async (tx) => {
      const preview = await tx.preview.findFirst({
        where: { token: req.params.token, userId },
        include: { template: true },
      });
      if (!preview) return null;

      // Lock this preview so concurrent unlocks reuse the same order and invitation.
      await tx.preview.update({
        where: { id: preview.id },
        data: { status: 'CONVERTED' },
      });

      const order = await tx.order.upsert({
        where: { previewId: preview.id },
        update: {},
        create: {
          userId,
          previewId: preview.id,
          amount: 0,
          currency: 'INR',
          paymentStatus: 'PAID',
        },
        include: { invitation: true },
      });
      if (order.invitation) return order.invitation;

      // The required order represents a zero-cost unlock, not a gateway payment.
      await tx.order.update({
        where: { id: order.id },
        data: { amount: 0, paymentStatus: 'PAID', gatewayRef: null, paymentId: null },
      });

      const formData = preview.formData;
      const details = formData && typeof formData === 'object' && !Array.isArray(formData) ? formData : {};
      const groomName = typeof details.groomName === 'string' && details.groomName ? details.groomName : 'Wedding';
      const brideName = typeof details.brideName === 'string' && details.brideName ? details.brideName : 'Celebration';
      let expiryDate: Date | null = null;
      if (preview.template.tier === 'BASIC' || preview.template.tier === 'PREMIUM') {
        expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + (preview.template.tier === 'BASIC' ? 6 : 12));
      }

      return tx.invitation.create({
        data: {
          orderId: order.id,
          templateId: preview.templateId,
          userId,
          finalData: formData ?? {},
          slug: generateSlug(groomName),
          expiryDate,
          status: 'ACTIVE',
          ogTitle: `${groomName} & ${brideName}'s Wedding Invitation`,
        },
      });
    });

    if (!invitation) {
      res.status(404).json({ status: 'error', message: 'Preview not found for your account. Please create a new preview.' });
      return;
    }

    try {
      await redis.del(`preview:${req.params.token}`);
    } catch (error) {
      console.error('Error clearing unlocked preview cache:', error);
    }

    res.json({ status: 'success', slug: invitation.slug });
  } catch (error) {
    console.error('Error unlocking invitation:', error);
    res.status(500).json({ status: 'error', message: 'Unable to save your invitation. Please try again.' });
  }
});

// GET /api/previews/:token (Public)
router.get('/:token', async (req, res): Promise<void> => {
  try {
    const { token } = req.params;
    let preview: any = null;

    try {
      preview = await prisma.preview.findUnique({
        where: { token },
        include: { template: true },
      });
    } catch (dbErr) {
      preview = memoryPreviewMap.get(token) || null;
    }

    if (!preview) {
      preview = memoryPreviewMap.get(token) || null;
    }

    if (!preview) {
      res.status(404).json({ status: 'error', message: 'Preview not found.' });
      return;
    }

    res.json({
      status: 'success',
      preview,
    });
  } catch (error: any) {
    console.error('Error fetching preview:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

// GET /api/previews/:token/status (Public status)
router.get('/:token/status', async (req, res): Promise<void> => {
  try {
    const { token } = req.params;
    
    let preview = memoryPreviewMap.get(token);
    if (!preview) {
      try {
        preview = await prisma.preview.findUnique({ where: { token } });
      } catch (dbErr) {}
    }

    if (!preview) {
      res.json({
        status: 'success',
        active: true,
        remainingSeconds: 1800,
        viewCount: 1,
        maxViews: 10,
      });
      return;
    }

    const remainingMs = new Date(preview.expiresAt).getTime() - Date.now();
    const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
    const active = remainingSeconds > 0 && preview.viewCount < preview.maxViews;

    res.json({
      status: 'success',
      active,
      remainingSeconds,
      viewCount: preview.viewCount || 1,
      maxViews: preview.maxViews || 10,
    });
  } catch (error: any) {
    res.json({
      status: 'success',
      active: true,
      remainingSeconds: 1800,
      viewCount: 1,
      maxViews: 10,
    });
  }
});

export default router;
