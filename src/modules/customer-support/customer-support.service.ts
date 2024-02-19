import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { convertToObjectId } from 'utils/converter';
import { UserIdRole } from 'interfaces';
import { Role } from 'modules/user/user.model';
import { CreateTicketDto, UpdateTicketDto } from './dto/customer-support.dto';
import { Ticket, TicketStatus } from './customer-support.model';
import { UpdateTicketsQueryInterface } from './interface/cutomer-support.interface';

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
    userInfo: UserIdRole,
    body: UpdateTicketDto,
  ): Promise<void> {
    const { userId, role } = userInfo;
    const { subject, description, status } = body;
    let query: UpdateTicketsQueryInterface = {
      _id: convertToObjectId(ticketId),
    };
    let newFields = {};

    if (role === Role.Admin) {
      newFields = { status };
    } else if (role === Role.User) {
      query = { userId: convertToObjectId(userId), ...query };
      newFields = { subject, description };
    }

    const result = await this.ticketModel.updateOne(query, newFields);

    if (!result.matchedCount) {
      throw new NotFoundException('Ticket not found.');
    }
  }
}
