import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DatabaseModule } from 'src/database/database.module'
import { OrderController, OrderServices } from './order.controller'
import { OrderSchema } from './order.model'

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }])
  ],
  providers: [OrderServices],
  controllers: [OrderController]
})
export class OrderModule {}
