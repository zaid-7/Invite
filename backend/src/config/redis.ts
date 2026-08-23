import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  retryStrategy() {
    return null; // Stop retrying if Redis is offline
  }
});

redis.on('connect', () => {
  console.log('[Redis] Connected successfully');
});

redis.on('error', () => {
  // Suppress unhandled redis error noise in dev mode when Redis is not running
});
