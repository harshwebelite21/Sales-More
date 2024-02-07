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
import { AddToCartDto, RemoveSpecificItemDto } from './dto/cart.dto';
import { SuccessMessageDTO } from '../products/dto/product.dto';
import { FindCartInterface } from './interfaces/cart.interface';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Add New Item To cart
  @Post('/')
  async addToCart(@Body() body: AddToCartDto): Promise<SuccessMessageDTO> {
    try {
      await this.cartService.addToCart(body);
      return { success: true, message: 'Product added successfully In Cart' };
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  // Remove the  user Cart
  @Delete('/:userId')
  async removeFromCart(
    @Param('userId') userId: string,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.cartService.removeFromCart(userId);
      return { success: true, message: 'cart Removed successfully' };
    } catch (error) {
      console.error('Error during removeFromCart:', error);
      throw error;
    }
  }
  // View the user specific Cart
  @Get('/:userId')
  async findCart(
    @Param('userId') userId: string,
  ): Promise<FindCartInterface[]> {
    try {
      return this.cartService.findCart(userId);
    } catch (error) {
      console.error('Error during find Cart:', error);
      throw error;
    }
  }

  // Remove the Specific Item From cart
  @Patch('/items')
  async removeSpecificItem(
    @Body() body: RemoveSpecificItemDto,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.cartService.removeSpecificItem(body);
      return { success: true, message: 'Item Removed successfully' };
    } catch (error) {
      console.error('Error during removing Item:', error);
      throw error;
    }
  }

  // Decrement the quantity from cart
  @Patch('/reduce-quantity')
  async reduceQuantity(
    @Body() body: RemoveSpecificItemDto,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.cartService.reduceQuantity(body);
      return { success: true, message: 'Product Decremented successfully' };
    } catch (error) {
      console.error('Error during reduce quantity of Item:', error);
      throw error;
    }
  }
}
