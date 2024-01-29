import { MiddlewareConsumer, Module } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'; // Import cookie-parser
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from './modules/utils/jwt/jwt.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [JwtModule, UserModule, DatabaseModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
