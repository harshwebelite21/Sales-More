import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './products/products.module';

@Module({
  imports: [ConfigModule, DatabaseModule, CartModule,UserModule,OrderModule,ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
 
}
