import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';
import { redis } from './config/redis';

const port = env.PORT || 4000;

async function bootstrap() {
  try {
    // Audit database connectivity
    await prisma.$connect();
    console.log('[Database] PostgreSQL connected successfully');
  } catch (error) {
    console.warn('[Database] Warning: Could not connect to PostgreSQL. Install PostgreSQL/Docker to enable database features.');
  }

  try {
    // Audit Redis connectivity
    await redis.ping();
    console.log('[Redis] Connection handshake successful');
  } catch (error) {
    console.warn('[Redis] Warning: Could not connect to Redis.');
  }

  // Start Express server
  app.listen(port, () => {
    console.log(`\n===========================================`);
    console.log(`[InviteCraft Backend] server running on port ${port}`);
    console.log(`Environment: ${env.NODE_ENV}`);
    console.log(`API URL    : ${env.BACKEND_URL}`);
    console.log(`Ready for requests!`);
    console.log(`===========================================\n`);
  });
}

bootstrap();
