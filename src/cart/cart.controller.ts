import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/addToCart')
  // Create a cart
  async addToCart(
    @Body('userId') userId: string,
    @Body('products') products: Array<{ productId: string; quantity: number }>,
  ): Promise<string> {
    return this.cartService.addToCart(userId, products);
  }

  @Delete('/deleteCart/:userId')
  //Delete Cart
  async removeFromCart(@Param('userId') userId: string): Promise<string> {
    return this.cartService.removeFromCart(userId);
  }

  @Get('/:userId')
  //Find user Cart
  async findCart(@Param('userId') userId: string): Promise<string> {
    return this.cartService.findCart(userId);
  }

  @Patch('/items/:productId')
  // To remove the specific item from cart
  async removeSpecificItem(
    @Param('productId') productId: string,
    @Body('userId') userId: string,
  ): Promise<string> {
    return this.cartService.removeSpecificItem(productId, userId);
  }

  @Patch('/reduce-quantity/:productId')
  // Reduce Quantity
  async reduceQuantity(
    @Body('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise<string> {
    return this.cartService.reduceQuantity(productId, userId);
  }
}
