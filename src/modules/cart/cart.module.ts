import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { DatabaseModule } from '../database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './cart.model';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
