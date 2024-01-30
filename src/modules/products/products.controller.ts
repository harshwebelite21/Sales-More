import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './products.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Get all products
  @Get('/')
  async getAllProducts(): Promise<object> {
    try {
      const products = await this.productService.getAllProducts();
      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Add a new product
  @Post('/')
  async addProducts(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
  ): Promise<object> {
    try {
      await this.productService.addProducts(name, description, price);
      return { success: true, message: 'Product added successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update product details
  @Put('/:productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
  ): Promise<object> {
    try {
      await this.productService.updateProduct(
        name,
        description,
        price,
        productId,
      );
      return { success: true, message: 'Product updated successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete a product
  @Delete('/:productId')
  async deleteProduct(@Param('productId') productId: string): Promise<object> {
    try {
      await this.productService.deleteProduct(productId);
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
