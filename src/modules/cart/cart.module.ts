import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CronService } from 'src/cron/cron.service';
import { CartController } from './cart.controller';
import { CartSchema } from './cart.model';
import { CartService } from './cart.service';
import { ProductSchema } from '../products/products.model';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: 'Cart', schema: CartSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [CartService, CronService],
  controllers: [CartController],
})
export class CartModule {}
