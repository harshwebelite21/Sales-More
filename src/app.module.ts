import { MiddlewareConsumer, Module } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'; // Import cookie-parser
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductReviewModule } from 'modules/products-review/products-review.module';
import { CustomerSupportModule } from 'modules/customer-support/customer-support.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { CartModule } from './modules/cart/cart.module';
import { DatabaseModule } from './modules/database/database.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/products/products.module';
import { UserModule } from './modules/user/user.module';
import { CronService } from './services/cron.service';
import { CartSchema } from './modules/cart/cart.model';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    ProductModule,
    CartModule,
    OrderModule,
    ProductReviewModule,
    CustomerSupportModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard, CronService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
