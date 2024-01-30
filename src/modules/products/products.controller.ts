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
import { AddProductDto, UpdateProductDto } from './dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Get all products
  @Get('/')
  async getAllProducts(): Promise<string> {
    try {
      const products = await this.productService.getAllProducts();
      return products;
    } catch (error) {
      throw Error('Error in Fetching Products');
    }
  }

  // Add a new product
  @Post('/')
  async addProducts(@Body() body: AddProductDto): Promise<object> {
    try {
      await this.productService.addProducts(body);
      return { success: true, message: 'Product added successfully' };
    } catch (error) {
      throw Error('Error in Adding Product');
    }
  }

  // Update product details
  @Put('/')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() body: UpdateProductDto,
  ): Promise<object> {
    try {
      await this.productService.updateProduct(body, productId);
      return { success: true, message: 'Product updated successfully' };
    } catch (error) {
      throw Error('Error in Updating data');
    }
  }

  // Delete a product
  @Delete('/:productId')
  async deleteProduct(@Param('productId') productId: string): Promise<object> {
    try {
      await this.productService.deleteProduct(productId);
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      throw Error('Error in Deleting Product');
    }
  }
}
