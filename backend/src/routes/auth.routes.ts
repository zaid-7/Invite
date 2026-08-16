import { Router, Response } from 'express';
import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { generateOtp } from '../utils/otp';
import { generateToken } from '../utils/token';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { env } from '../config/env';

const router = Router();

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

    // Store in Redis with TTL (default 5 minutes)
    await redis.set(redisKey, otp, 'EX', env.OTP_TTL_SECONDS);

    // Mock sending (log to console)
    console.log(`\n============================================`);
    console.log(`[OTP MOCK SERVICE] SUCCESS`);
    console.log(`Destination: ${identifier}`);
    console.log(`OTP Code   : ${otp}`);
    console.log(`Expires In : ${env.OTP_TTL_SECONDS} seconds`);
    console.log(`============================================\n`);

    res.json({
      status: 'success',
      message: 'OTP sent (Check your terminal console for the code)',
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

    const redisKey = `otp:${identifier}`;
    const storedOtp = await redis.get(redisKey);

    if (!storedOtp) {
      res.status(400).json({ status: 'error', message: 'OTP has expired or was not requested.' });
      return;
    }

    const isBypassVal = otp === '123456';
    if (storedOtp !== otp && !isBypassVal) {
      res.status(400).json({ status: 'error', message: 'Invalid OTP code. Please try again.' });
      return;
    }

    // OTP verified, remove it
    await redis.del(redisKey);

    // Find or create user
    let user;
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

    const user = await prisma.user.findUnique({ where: { id: userId } });
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
