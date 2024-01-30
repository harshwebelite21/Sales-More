import { sign, decode, verify } from 'jsonwebtoken';
import { appConfig } from 'src/config/appConfig';

// Generate JWT token with the provided payload and options
export function generateJwtToken(payload, options) {
  try {
    // Sign the JWT token using the configured secret key
    return sign(payload, appConfig.jwtKey, options);
  } catch (err) {
    // Handle errors during token generation
    console.error('Error while generating token', err);
    throw err;
  }
}

// Verify the provided JWT token
export function verifyJwtToken(cookieToken) {
  try {
    return verify(cookieToken, appConfig.jwtKey);
  } catch (err) {
    console.error('Error while verifying token:', err);
    return false;
  }
}

// Decode the provided JWT token to retrieve the userId
export function decodeJwtToken(cookieToken) {
  const decodedToken = decode(cookieToken, appConfig.jwtKey);
  const userId = decodedToken ? decodedToken.userId : null;
  return userId;
}
