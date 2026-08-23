import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { generateOtp } from '../utils/otp';
import { generateToken } from '../utils/token';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { env } from '../config/env';

const router = Router();

// In-memory fallbacks when Redis/Postgres are offline in development
const memoryOtpMap = new Map<string, { otp: string; expiresAt: number }>();
const memoryUserMap = new Map<string, { id: string; phone?: string; email?: string; name?: string }>();

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res): Promise<void> => {
  try {
    const { phone, email } = req.body;
    const identifier = phone || email;

    if (!identifier) {
      res.status(400).json({ status: 'error', message: 'Please provide either phone number or email address.' });
      return;
    }

    const otp = generateOtp();
    const redisKey = `otp:${identifier}`;

    // Try Redis, fallback to in-memory store if Redis is offline
    try {
      await redis.set(redisKey, otp, 'EX', env.OTP_TTL_SECONDS);
    } catch (redisErr) {
      memoryOtpMap.set(identifier, {
        otp,
        expiresAt: Date.now() + env.OTP_TTL_SECONDS * 1000,
      });
    }

    // Always log OTP for easy testing
    console.log(`\n============================================`);
    console.log(`[OTP MOCK SERVICE] SUCCESS`);
    console.log(`Destination: ${identifier}`);
    console.log(`OTP Code   : ${otp}`);
    console.log(`Bypass Code: 123456`);
    console.log(`Expires In : ${env.OTP_TTL_SECONDS} seconds`);
    console.log(`============================================\n`);

    res.json({
      status: 'success',
      message: `OTP sent successfully. (Dev code: ${otp} or bypass: 123456)`,
    });
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res): Promise<void> => {
  try {
    const { phone, email, otp } = req.body;
    const identifier = phone || email;

    if (!identifier || !otp) {
      res.status(400).json({ status: 'error', message: 'Identifier and OTP code are required.' });
      return;
    }

    const isBypassVal = otp === '123456';
    let storedOtp: string | null = null;

    try {
      const redisKey = `otp:${identifier}`;
      storedOtp = await redis.get(redisKey);
      if (storedOtp) {
        await redis.del(redisKey);
      }
    } catch (redisErr) {
      const entry = memoryOtpMap.get(identifier);
      if (entry && entry.expiresAt > Date.now()) {
        storedOtp = entry.otp;
        memoryOtpMap.delete(identifier);
      }
    }

    if (!storedOtp && !isBypassVal) {
      res.status(400).json({ status: 'error', message: 'OTP has expired or was not requested. (Or use bypass code: 123456)' });
      return;
    }

    if (storedOtp && storedOtp !== otp && !isBypassVal) {
      res.status(400).json({ status: 'error', message: 'Invalid OTP code. Please try again.' });
      return;
    }

    // Find or create user (with fallback)
    let user: any = null;
    try {
      if (phone) {
        user = await prisma.user.findUnique({ where: { phone } });
        if (!user) {
          user = await prisma.user.create({ data: { phone } });
        }
      } else {
        user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({ data: { email } });
        }
      }
    } catch (dbErr) {
      // In-memory fallback if DB is offline
      const userKey = identifier;
      if (memoryUserMap.has(userKey)) {
        user = memoryUserMap.get(userKey);
      } else {
        user = {
          id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          ...(phone ? { phone } : { email }),
          name: 'Demo User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        memoryUserMap.set(userKey, user);
      }
    }

    const token = generateToken({
      userId: user.id,
      phone: user.phone,
      email: user.email,
    });

    res.json({
      status: 'success',
      token,
      user,
    });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ status: 'error', message: 'User payload missing.' });
      return;
    }

    let user: any = null;
    try {
      user = await prisma.user.findUnique({ where: { id: userId } });
    } catch (dbErr) {
      user = Array.from(memoryUserMap.values()).find(u => u.id === userId) || {
        id: userId,
        phone: req.user?.phone || '9876543210',
        email: req.user?.email || 'demo@example.com',
        name: 'Demo User',
      };
    }

    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found.' });
      return;
    }

    res.json({
      status: 'success',
      user,
    });
  } catch (error: any) {
    console.error('Error fetching user context:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

export default router;
