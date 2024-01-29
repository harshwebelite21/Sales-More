import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DatabaseModule } from 'src/database/database.module'
import { UserSchema } from './user.model'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
