import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { verifyJwtToken } from 'src/utils/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const headerToken = request.headers.authorization?.replace('Bearer ', '');
      const cookieToken = request.cookies.jwtToken;
      const token = cookieToken || headerToken;

      if (!token) {
        throw new Error('Access denied. Token not provided.');
      }

      const validToken = verifyJwtToken(token);

      if (!validToken || !validToken.userId || !validToken.role) {
        throw new Error('Invalid token or unauthorized.');
      }

      // Attach userId and role to request
      request.userId = validToken.userId;
      request.role = validToken.role;

      return true;
    } catch (error) {
      console.error('Error in AuthGuard:', error.message);
      return false;
    }
  }
}
