import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis';

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `rate:${ip}`;
    const requests = await redis.incr(key);
    
    if (requests === 1) {
      await redis.expire(key, 60);
    }
    
    if (requests > 500) { // Large limit for development testing
      res.status(429).json({
        status: 'error',
        message: 'Too many requests. Please try again later.',
      });
      return;
    }
    
    next();
  } catch (error) {
    // If Redis fails, degrade gracefully in dev
    console.error('[Rate Limit Error] Redis error:', error);
    next();
  }
};
