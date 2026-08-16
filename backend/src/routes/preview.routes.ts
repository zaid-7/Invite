import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { env } from '../config/env';

const router = Router();

// POST /api/previews (Protected)
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { templateId, formData } = req.body;

    if (!userId || !templateId || !formData) {
      res.status(400).json({ status: 'error', message: 'Missing user, template, or form data.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(401).json({ status: 'error', message: 'User session is invalid. Please log in again.', code: 'USER_NOT_FOUND' });
      return;
    }

    const template = await prisma.template.findUnique({ where: { id: templateId } });
    if (!template) {
      res.status(404).json({ status: 'error', message: 'Template not found.' });
      return;
    }

    const expiresAt = new Date(Date.now() + env.PREVIEW_TTL_MINUTES * 60 * 1000);
    const maxViews = env.PREVIEW_MAX_VIEWS;

    // Save in DB
    const preview = await prisma.preview.create({
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

    // Save TTL session details in Redis
    const redisKey = `preview:${preview.token}`;
    const redisData = {
      expiresAt: expiresAt.toISOString(),
      viewCount: 0,
      maxViews,
    };

    // TTL in seconds
    const ttlSeconds = env.PREVIEW_TTL_MINUTES * 60;
    await redis.set(redisKey, JSON.stringify(redisData), 'EX', ttlSeconds);

    res.json({
      status: 'success',
      preview,
    });
  } catch (error: any) {
    console.error('Error creating preview:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

// GET /api/previews/:token (Public - view limit / TTL enforced)
router.get('/:token', async (req, res): Promise<void> => {
  try {
    const { token } = req.params;
    const redisKey = `preview:${token}`;
    
    // Check Redis
    let redisDataRaw = await redis.get(redisKey);
    let redisData = redisDataRaw ? JSON.parse(redisDataRaw) : null;

    // Load from DB
    const preview = await prisma.preview.findUnique({
      where: { token },
      include: { template: true },
    });

    if (!preview) {
      res.status(404).json({ status: 'error', message: 'Preview not found.' });
      return;
    }

    // Check expiry
    const isExpired = new Date() > new Date(preview.expiresAt);
    if (isExpired || preview.status === 'EXPIRED') {
      if (preview.status !== 'EXPIRED') {
        await prisma.preview.update({
          where: { id: preview.id },
          data: { status: 'EXPIRED' },
        });
      }
      res.status(410).json({ status: 'error', message: 'Preview session has expired.', code: 'PREVIEW_EXPIRED' });
      return;
    }

    // Check view count limit
    if (redisData && redisData.viewCount >= redisData.maxViews) {
      res.status(410).json({ status: 'error', message: 'Preview view limit reached.', code: 'VIEW_LIMIT_REACHED' });
      return;
    }

    if (preview.viewCount >= preview.maxViews) {
      res.status(410).json({ status: 'error', message: 'Preview view limit reached.', code: 'VIEW_LIMIT_REACHED' });
      return;
    }

    // Increment view count
    let updatedViewCount = preview.viewCount + 1;

    if (redisData) {
      redisData.viewCount += 1;
      // Preserve original TTL
      const remainingTime = await redis.ttl(redisKey);
      if (remainingTime > 0) {
        await redis.set(redisKey, JSON.stringify(redisData), 'EX', remainingTime);
      }
      updatedViewCount = redisData.viewCount;
    }

    // Update DB
    const updatedPreview = await prisma.preview.update({
      where: { id: preview.id },
      data: {
        viewCount: updatedViewCount,
        status: updatedViewCount >= preview.maxViews ? 'EXPIRED' : 'ACTIVE',
      },
      include: { template: true },
    });

    res.json({
      status: 'success',
      preview: updatedPreview,
    });
  } catch (error: any) {
    console.error('Error fetching preview:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

// GET /api/previews/:token/status (Public countdown info)
router.get('/:token/status', async (req, res): Promise<void> => {
  try {
    const { token } = req.params;
    const redisKey = `preview:${token}`;
    
    // Check Redis
    const ttlSeconds = await redis.ttl(redisKey);
    let redisDataRaw = await redis.get(redisKey);
    let redisData = redisDataRaw ? JSON.parse(redisDataRaw) : null;

    if (ttlSeconds > 0 && redisData) {
      res.json({
        status: 'success',
        active: redisData.viewCount < redisData.maxViews,
        remainingSeconds: ttlSeconds,
        viewCount: redisData.viewCount,
        maxViews: redisData.maxViews,
      });
      return;
    }

    // Fallback to database
    const preview = await prisma.preview.findUnique({ where: { token } });
    if (!preview) {
      res.status(404).json({ status: 'error', message: 'Preview not found.' });
      return;
    }

    const remainingMs = new Date(preview.expiresAt).getTime() - Date.now();
    const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
    const active = remainingSeconds > 0 && preview.viewCount < preview.maxViews && preview.status === 'ACTIVE';

    res.json({
      status: 'success',
      active,
      remainingSeconds,
      viewCount: preview.viewCount,
      maxViews: preview.maxViews,
    });
  } catch (error: any) {
    console.error('Error checking preview status:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

export default router;
