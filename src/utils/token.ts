import jwt from 'jsonwebtoken';
import { IAuthTokenPayload } from '../interfaces/auth.interface';
import  logger  from './logger';

// Ensure the secret is loaded from environment variables
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Parse expiresIn to ensure it's a valid string or number
const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

export const generateToken = (payload: IAuthTokenPayload): string => {
  return jwt.sign(
    payload,
    secret,
    { expiresIn } as jwt.SignOptions // Explicitly type the options
  );
};

export const verifyToken = (token: string): IAuthTokenPayload | null => {
  try {
    return jwt.verify(token, secret) as IAuthTokenPayload;
  } catch (error) {
    logger.error(`Error verifying token: ${error}`);
    return null;
  }
};

export const generateResetToken = (userId: string): string => {
    return jwt.sign({userId}, process.env.JWT_RESET_SECRET as string, {
        expiresIn: '1h'
    });
}

export const verifyResetToken = (token: string): string => {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET as string) as { userId: string };
    return decoded.userId;
}