import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RoleEnum } from 'modules/user/user.model';
import { verifyJwtToken } from 'utils/jwt';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    try {
      const headerToken = request.headers.authorization?.replace('Bearer ', '');
      const cookieToken = request.cookies.jwtToken;
      const token = cookieToken || headerToken;

      if (!token) {
        throw new Error('Access denied. Token not provided.');
      }

      const { userId, role } = verifyJwtToken(token);

      if (!userId || role !== RoleEnum.admin) {
        throw new Error('Unauthorized. Admin role required.');
      }
      request.userId = userId;
      request.role = role;

      return true;
    } catch (error) {
      console.error('Error in AuthGuard:', error.message);
      throw error;
    }
  }
}
