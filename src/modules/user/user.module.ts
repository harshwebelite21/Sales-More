import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/modules/database/database.module';

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
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
