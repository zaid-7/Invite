import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { rateLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';

// Import route files
import authRoutes from './routes/auth.routes';
import templateRoutes from './routes/template.routes';
import previewRoutes from './routes/preview.routes';
import paymentRoutes from './routes/payment.routes';
import invitationRoutes from './routes/invitation.routes';

const app = express();

// Secure headers
app.use(helmet());

// Enable CORS
// FRONTEND_URL may be a comma-separated list (e.g. apex + www domain in production)
const allowedOrigins = [
  ...env.FRONTEND_URL.split(',').map(origin => origin.trim()).filter(Boolean),
  'http://localhost:3000',
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', environment: env.NODE_ENV });
});

// Setup api routing paths
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/previews', previewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/invitations', invitationRoutes);

// Global Error Handler (must be registered last)
app.use(errorHandler);

export default app;
