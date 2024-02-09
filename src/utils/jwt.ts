import { sign, verify } from 'jsonwebtoken';
import { appConfig } from 'src/config/appConfig';
import { convertToObjectId } from './converter';

// Generate JWT token with the provided payload and options
export const generateJwtToken = (payload, options) => {
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
export const verifyJwtToken = (cookieToken) => {
  try {
    const { userId, role } = verify(cookieToken, appConfig.jwtKey) || {};
    const id = convertToObjectId(userId);
    return { id, role };
  } catch (err) {
    console.error('Error while verifying token:', err);
    throw new Error('Invalid token or unauthorized.');
  }
};
