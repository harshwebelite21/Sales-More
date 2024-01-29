import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/modules/database/database.module';
import { UserSchema } from './user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '../utils/jwt/jwt.module';
import { JwtService } from '../utils/jwt/jwt.service';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
