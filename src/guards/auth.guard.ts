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

      if (!validToken) {
        throw new Error('Invalid token.');
      }

      // Assuming your JWT payload
      const { userId } = validToken;

      if (!userId) {
        throw new Error('Unauthorized');
      }

      request.userId = userId;
      // Attach userId to request

      return true;
    } catch (error) {
      console.error('Error in AuthGuard:', error.message);
      return false;
    }
  }
}
