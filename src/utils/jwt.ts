import { sign, verify } from 'jsonwebtoken';
import { appConfig } from 'config/appConfig';
import {
  TokenPayload,
  VerifiedToken,
} from 'modules/user/interfaces/user.interface';

// Generate JWT token with the provided payload and options
export const generateJwtToken = (
  payload: TokenPayload,
  options: { expiresIn: string },
): string => {
  try {
    // Sign the JWT token using the configured secret key
    return sign(payload, appConfig.jwtKey, options);
  } catch (err) {
    // Handle errors during token generation
    console.error('Error while generating token', err);
    throw err;
  }
};

// Verify the provided JWT token
export const verifyJwtToken = (cookieToken: string): VerifiedToken => {
  try {
    const { userId, role } = verify(cookieToken, appConfig.jwtKey) || {};
    return { userId, role };
  } catch (err) {
    console.error('Error while verifying token:', err);
    throw new Error('Invalid token or unauthorized.');
  }
};
