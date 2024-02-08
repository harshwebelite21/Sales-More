import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderController } from './order.controller';
import { OrderSchema } from './order.model';
import { OrderService } from './order.service';
import { CartSchema } from '../cart/cart.model';
import { DatabaseModule } from '../database/database.module';
import { ProductSchema } from '../products/products.model';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'Cart', schema: CartSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
