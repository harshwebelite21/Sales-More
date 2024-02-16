import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SuccessMessageDTO, UserIdRole } from 'interfaces';
import { GetUserId } from 'modules/user/userId.decorator';
import { AuthGuard } from 'guards/auth.guard';
import { AdminAuthGuard } from 'guards/admin-role.guard';
import { CustomerSupportService } from './customer-support.service';
import {
  CreateTicketDto,
  QueryDataDto,
  UpdateStatusDto,
  UpdateTicketDto,
} from './dto/customer-support.dto';
import { GetTicketsInterface } from './interface/customer-support.interface';

@Controller('customer-support')
@ApiTags('Customer-Support')
@ApiSecurity('JWT-auth')
@UseGuards(AuthGuard)
export class CustomerSupportController {
  constructor(
    private readonly customerSupportService: CustomerSupportService,
  ) {}

  // Create New Ticket
  @Post('/')
  async CreateTicket(
    @GetUserId() { userId }: UserIdRole,
    @Body() body: CreateTicketDto,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.customerSupportService.CreateTicket(userId, body);
      return { success: true, message: 'Ticket Created Successfully' };
    } catch (error) {
      console.error('Error during Creating Ticket:', error);
      throw error;
    }
  }

  @Put('/update-status')
  @UseGuards(AdminAuthGuard)
  async updateStatus(
    @GetUserId() { userId }: UserIdRole,
    @Query() { status }: UpdateStatusDto,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.customerSupportService.updateStatus(userId, status);
      return { success: true, message: 'Ticket Status Updated SuccessFully' };
    } catch (error) {
      console.error('Error during Updating Ticket Status:', error);
      throw error;
    }
  }

  // Update Ticket
  @Put('/')
  async updateTicket(
    @GetUserId() { userId }: UserIdRole,
    @Body() body: UpdateTicketDto,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.customerSupportService.updateTicket(userId, body);
      return { success: true, message: 'Ticket Updated Successfully' };
    } catch (error) {
      console.error('Error during Updating Ticket:', error);
      throw error;
    }
  }

  @Get('/')
  async viewTickets(
    @GetUserId() userInfo: UserIdRole,
    @Query() queryData: QueryDataDto,
  ): Promise<GetTicketsInterface[]> {
    try {
      return this.customerSupportService.viewTickets(userInfo, queryData);
    } catch (error) {
      console.error('Error during Updating Ticket:', error);
      throw error;
    }
  }
}
