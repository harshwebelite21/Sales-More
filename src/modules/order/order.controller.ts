import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { SuccessMessageDTO } from 'src/interfaces';

import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { OrderQueryInputDto } from './dto/order.dto';
import { OrderFilterType, UserIdRole } from './interfaces/order.interface';
import { OrderService } from './order.service';
import { GetUserId } from '../user/userId.decorator';

@Controller('/')
@ApiTags('Order')
@UseGuards(AuthGuard)
@ApiSecurity('JWT-auth')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  // Checkout
  @Post('order/')
  async checkOut(@GetUserId() userId: string): Promise<SuccessMessageDTO> {
    try {
      await this.orderService.checkOut(userId);
      return { success: true, message: 'Order Placed successfully' };
    } catch (error) {
      console.error('Error during CheckOut:', error);
      throw error;
    }
  }
  // View Order History using user Specific userId

  @UseGuards(AuthGuard)
  @ApiSecurity('JWT-auth')
  @Get('order/order-history')
  async filterOrders(
    @Query() query: OrderQueryInputDto,
    @GetUserId() userData: UserIdRole,
  ): Promise<OrderFilterType[]> {
    try {
      return this.orderService.filterOrder(query, userData);
    } catch (error) {
      console.error('Error during Getting Order Filter:', error);
      throw error;
    }
  }
}
