import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { SuccessMessageDTO } from 'src/interfaces';

import { GetUserId } from '../user/userId.decorator';

import { OrderQueryInputDto } from './dto/order.dto';
import { OrderFilterType } from './interfaces/order.interface';
import { Order } from './order.model';
import { OrderService } from './order.service';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  // Checkout
  @Post('/')
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

  @Get('/')
  async getOrderHistory(@GetUserId() userId: string): Promise<Order[]> {
    try {
      return this.orderService.getOrderHistory(userId);
    } catch (error) {
      console.error('Error during Getting Order History:', error);
      throw error;
    }
  }

  @Get('/filter-order')
  async filterOrders(
    @Query() query: OrderQueryInputDto,
  ): Promise<OrderFilterType[]> {
    try {
      return this.orderService.filterOrder(query);
    } catch (error) {
      console.error('Error during Getting Order Filter:', error);
      throw error;
    }
  }
}
