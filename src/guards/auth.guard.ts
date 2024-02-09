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

      const { id, role } = verifyJwtToken(token);

      if (!id || !role) {
        throw new Error('Invalid token or unauthorized.');
      }

      // Attach userId and role to request
      request.userId = id;
      request.role = role;

      return true;
    } catch (error) {
      console.error('Error in AuthGuard:', error.message);
      throw error;
    }
  }
}
