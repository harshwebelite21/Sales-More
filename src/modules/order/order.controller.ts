import { Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetUserId } from '../user/userId.decorator';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  // Checkout
  @Post('/')
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
  async getOrderHistory(@GetUserId() userId: string) {
    try {
      return this.orderService.getOrderHistory(userId);
    } catch (error) {
      console.error('Error during Getting Order History:', error);
      throw error;
    }
  }
}
