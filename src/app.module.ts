import { MiddlewareConsumer, Module } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'; // Import cookie-parser

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { CartModule } from './modules/cart/cart.module';
import { DatabaseModule } from './modules/database/database.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/products/products.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule, DatabaseModule, ProductModule, CartModule, OrderModule],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
