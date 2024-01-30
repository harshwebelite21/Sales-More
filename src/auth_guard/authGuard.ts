// auth.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { decodeJwtToken, verifyJwtToken } from 'src/utils/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const headerToken = request.headers.authorization?.replace('Bearer ', '');

      const cookieToken = request.cookies.jwtToken;
      // console.log(cookieToken);
      const token = cookieToken || headerToken;

      if (!token) {
        throw new Error('Access denied. Token not provided.');
      }
      const validToken = verifyJwtToken(cookieToken);

      if (!validToken) {
        throw new Error('Invalid Token ');
      }
      const decodedToken = decodeJwtToken(token);
      // console.log(decodedToken);

      if (!decodedToken) {
        throw new Error('Invalid decoded Token');
      }

      request.userId = decodedToken; // Attach userId to request

      return true;
    } catch (error) {
      console.error('Error in JwtAuthGuard:', error.message);
      return false;
    }
  }
}
