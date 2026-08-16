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

    // Audit Redis connectivity
    await redis.ping();
    console.log('[Redis] Connection handshake successful');

    // Start Express server listens
    app.listen(port, () => {
      console.log(`\n===========================================`);
      console.log(`[Mandap Backend] server running on port ${port}`);
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`API URL    : ${env.BACKEND_URL}`);
      console.log(`Ready for requests!`);
      console.log(`===========================================\n`);
    });
  } catch (error) {
    console.error('Error starting backend application:', error);
    process.exit(1);
  }
}

bootstrap();
