import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { convertToObjectId } from 'utils/converter';
import { CreateTicketDto, UpdateTicketDto } from './dto/customer-support.dto';
import { Ticket, TicketStatus } from './customer-support.model';

@Injectable()
export class CustomerSupportService {
  constructor(
    @InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
  ) {}
  async createTicket(userId: string, body: CreateTicketDto): Promise<void> {
    const ticketData = {
      ...body,
      userId: convertToObjectId(userId),
      productId: convertToObjectId(body.productId),
    };
    const exists = await this.ticketModel.exists({
      userId: ticketData.userId,
      productId: ticketData.productId,
      status: { $in: [TicketStatus.Open, TicketStatus.InProgress] },
    });

    if (exists) {
      throw Error('You have created a ticket already!');
    }
    await this.ticketModel.create(ticketData);
  }

  //   To update ticket
  async updateTicket(
    ticketId: string,
    userId: string,
    body: UpdateTicketDto,
  ): Promise<void> {
    const result = await this.ticketModel.updateOne(
      {
        userId: convertToObjectId(userId),
        _id: convertToObjectId(ticketId),
      },
      body,
    );
    if (!result.matchedCount) {
      throw new NotFoundException('Ticket not found.');
    }
  }
}
