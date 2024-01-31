import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../database/database.module';
import { OrderSchema } from './order.model';
import { CartSchema } from '../cart/cart.model';
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
