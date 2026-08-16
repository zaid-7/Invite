import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface UserPayload {
  userId: string;
  phone?: string | null;
  email?: string | null;
}

export const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, env.JWT_SECRET) as UserPayload;
};
