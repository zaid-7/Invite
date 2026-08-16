import crypto from 'crypto';
import { env } from '../config/env';

export const generateOtp = (): string => {
  const length = env.OTP_LENGTH;
  const digits = '0123456789';
  let otp = '';
  
  // Use cryptographically secure random values
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    const index = randomBytes[i] % digits.length;
    otp += digits[index];
  }
  
  return otp;
};
