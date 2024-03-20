import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { diskStorage } from 'multer';
import { DatabaseModule } from 'modules/database/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { Request } from 'express';

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
      storage: diskStorage({
        destination: (req, file, callback) => {
          let customPath = '';
          if (file.mimetype == 'application/pdf') {
            customPath = 'src/uploads/documents';
          } else {
            customPath = 'src/uploads/images';
          }
          callback(null, customPath);
        },
        filename: (req: Request & { userId: string }, file, callback) => {
          const originalFileName = file.originalname
            .split('.')
            .slice(0, -1)
            .join('.');

          const fileExtension = file.originalname.split('.').pop();
          const newFilename = `${originalFileName}_${req.userId}.${fileExtension}`;
          callback(null, newFilename);
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
