import { Body, Controller, Get, Post } from '@nestjs/common'
import { OrderServices } from './order.service'

@Controller('order')
export class OrderController {
  constructor (private readonly orderService: OrderServices) {}
  // Checkout
  @Post('/')
  async checkOut (@Body('userId') userId: string) {
    this.orderService.checkOut(userId)
  }
  // View Order History using user Specific userId

  @Get('/')
  async getOrderHistory (@Body('userId') userId: string) {
    this.orderService.getOrderHistory(userId)
  }
}
