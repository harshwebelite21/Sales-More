import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { SuccessMessageDTO } from 'src/interfaces';

import { AdminAuthGuard } from 'src/guards/admin.auth.guard';
import { OrderQueryInputDto } from './dto/order.dto';
import { OrderFilterType } from './interfaces/order.interface';
import { OrderService } from './order.service';
import { GetUserId } from '../user/userId.decorator';

@Controller('/')
@UseGuards(AuthGuard)
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
  @Get('order/filter-order')
  async filterOrders(
    @Query() query: OrderQueryInputDto,
    @GetUserId() userId: string,
  ): Promise<OrderFilterType[]> {
    try {
      return this.orderService.filterOrderByUserId(query, userId);
    } catch (error) {
      console.error('Error during Getting Order Filter:', error);
      throw error;
    }
  }

  @UseGuards(AdminAuthGuard)
  @Get('admin/order-history')
  async administerOrders(
    @Query() query: OrderQueryInputDto,
  ): Promise<OrderFilterType[]> {
    try {
      // Admin can see all orders
      return this.orderService.filterOrder(query);
    } catch (error) {
      console.error('Error during Getting Order Filter:', error);
      throw error;
    }
  }
}
