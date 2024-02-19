import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SuccessMessageDTO, UserIdRole } from 'interfaces';
import { GetUserId } from 'modules/user/userId.decorator';
import { AuthGuard } from 'guards/auth.guard';
import { CustomerSupportService } from './customer-support.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/customer-support.dto';

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
  async createTicket(
    @GetUserId() { userId }: UserIdRole,
    @Body() body: CreateTicketDto,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.customerSupportService.createTicket(userId, body);
      return { success: true, message: 'Ticket Created Successfully' };
    } catch (error) {
      console.error('Error during Creating Ticket:', error);
      throw error;
    }
  }

  // Update Ticket
  @Put('/:ticketId')
  async updateTicket(
    @Param('ticketId') ticketId: string,
    @GetUserId() { userId }: UserIdRole,
    @Body() body: UpdateTicketDto,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.customerSupportService.updateTicket(ticketId, userId, body);
      return { success: true, message: 'Ticket Updated Successfully' };
    } catch (error) {
      console.error('Error during Updating Ticket:', error);
      throw error;
    }
  }
}
