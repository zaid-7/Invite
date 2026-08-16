import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret-change-in-production-1234567890',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockedkeyid',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'your-razorpay-test-secret',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'your-razorpay-webhook-secret',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:4000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PREVIEW_TTL_MINUTES: parseInt(process.env.PREVIEW_TTL_MINUTES || '30', 10),
  PREVIEW_MAX_VIEWS: parseInt(process.env.PREVIEW_MAX_VIEWS || '10', 10),
  OTP_TTL_SECONDS: parseInt(process.env.OTP_TTL_SECONDS || '300', 10),
  OTP_LENGTH: parseInt(process.env.OTP_LENGTH || '6', 10),
  PORT: parseInt(process.env.PORT || '4000', 10),
};

// Validate critical variables
const required = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[warning]: Environment variable ${key} is not set in process.env. Using fallback value.`);
  }
}
