import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'modules/database/database.module';
import { CustomerSupportService } from './customer-support.service';
import { CustomerSupportController } from './customer-support.controller';
import { TicketSchema } from './customer-support.model';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
  ],
  providers: [CustomerSupportService],
  controllers: [CustomerSupportController],
})
export class CustomerSupportModule {}
