import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'modules/database/database.module';
import { MulterModule } from '@nestjs/platform-express';

import { TicketSchema } from 'modules/customer-support/customer-support.model';
import { UserController } from './user.controller';
import { UserSchema } from './user.model';
import { UserService } from './user.service';
import { CartSchema } from '../cart/cart.model';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Cart', schema: CartSchema },
      { name: 'Ticket', schema: TicketSchema },
    ]),
    MulterModule.register({
      dest: './uploads', // Specify your upload directory
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
