import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CartService } from '../modules/cart/cart.service';

@Injectable()
export class CronService {
  constructor(private readonly cartService: CartService) {}
  @Cron('*/20 * * * *')
  async handleCron() {
    console.log('hello');

    await this.cartService.checkAndDeleteEmptyCart();
  }
}
