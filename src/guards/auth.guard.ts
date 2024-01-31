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
        throw new Error('UserId not found from token!');
      }

      // Decode function
      // const decodedToken = decodeJwtToken(token);

      // if (!decodedToken) {
      //   throw new Error('Invalid decoded Token');
      // }
      request.userId = validToken;
      // Attach userId to request

      return true;
    } catch (error) {
      console.error('Error in JwtAuthGuard:', error.message);
      return false;
    }
  }
}
