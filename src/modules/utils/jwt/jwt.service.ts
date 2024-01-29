import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  // Generate JWT token with the provided payload and options
  async generateJwtToken(payload, options) {
    try {
      // Sign the JWT token using the configured secret key
      return jwt.sign(
        payload,
        this.configService.get<string>('SECRETKEY'),
        options,
      );
    } catch (err) {
      // Handle errors during token generation
      console.error('Error while generating token', err);
      throw err;
    }
  }

  // // Verify the provided JWT token
  // async verifyJwtToken() {
  //   try {
  //     return jwt.verify(cookieToken, this.configService.get<string>('jwtKey'));
  //   } catch (err) {
  //     console.error('Error while verifying token:', err);
  //     return false;
  //   }
  // }

  // // Decode the provided JWT token to retrieve the userId
  // async decodeJwtToken() {
  //   const { userId } = jwt.decode(
  //     cookieToken,
  //     this.configService.get<string>('jwtKey'),
  //   );
  //   return userId;
  // }
}
