import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { convertToObjectId } from 'utils/converter';
import { UserIdRole } from 'interfaces';
import { Role } from 'modules/user/user.model';
import {
  CreateTicketDto,
  QueryDataDto,
  UpdateTicketDto,
} from './dto/customer-support.dto';
import { Ticket, TicketStatus } from './customer-support.model';
import { GetTicketsInterface } from './interface/customer-support.interface';

@Injectable()
export class CustomerSupportService {
  constructor(
    @InjectModel('Ticket') private readonly ticketModel: Model<Ticket>,
  ) {}
  async createTicket(userId: string, body: CreateTicketDto): Promise<void> {
    const ticketData = { ...body, userId: convertToObjectId(userId) };
    const exists = await this.ticketModel.exists({
      userId: ticketData.userId,
      status: { $in: [TicketStatus.Open, TicketStatus.InProgress] },
    });

    if (exists) {
      throw Error('You Have Already ticket');
    }
    await this.ticketModel.create(ticketData);
  }

  //   To Update Status of ticket
  async updateStatus(userId: string, status: TicketStatus): Promise<void> {
    const result = await this.ticketModel.updateOne(
      { userId: convertToObjectId(userId) },
      { $set: { status } },
    );
    if (result.matchedCount === 0) {
      throw new NotFoundException('Ticket not found.');
    }
  }

  //   To update ticket
  async updateTicket(userId: string, body: UpdateTicketDto): Promise<void> {
    const result = await this.ticketModel.updateOne(
      {
        userId: convertToObjectId(userId),
      },
      body,
    );
    if (result.matchedCount === 0) {
      throw new NotFoundException('Ticket not found.');
    }
  }

  //   To View Tickets By Admin
  async viewTickets(
    userInfo: UserIdRole,
    queryData: QueryDataDto,
  ): Promise<GetTicketsInterface[]> {
    const { userId, status } = queryData;

    const query: QueryDataDto = {
      ...(status && { status }),
      ...(userId && { userId: convertToObjectId(`${userId}`) }),
    };

    if (userInfo.role === Role.User) {
      query.userId = convertToObjectId(userInfo.userId);
    }

    return this.ticketModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      { $match: query },
      {
        $project: {
          userName: '$user.name',
          mobileNo: '$user.mobile',
          Email: '$user.email',
          subject: 1,
          description: 1,
          status: 1,
        },
      },
    ]);
  }
}
