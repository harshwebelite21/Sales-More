import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetUserId } from '../user/userId.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  // Checkout
  @Post('/')
  @UseGuards(AuthGuard)
  async checkOut(@GetUserId() userId: string) {
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
  @UseGuards(AuthGuard)
  async getOrderHistory(@GetUserId() userId: string) {
    try {
      return this.orderService.getOrderHistory(userId);
    } catch (error) {
      console.error('Error during Getting Order History:', error);
      throw error;
    }
  }

  @Get('/filterApi')
  async filterOrders(@Body() body) {
    try {
      return this.orderService.filterOrder(body);
    } catch (error) {
      console.error('Error during Getting Order Filter:', error);
      throw error;
    }
  }
}
