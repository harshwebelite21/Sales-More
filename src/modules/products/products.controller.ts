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
import { Product } from './products.model';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Get all products
  @Get('/')
  async getAllProducts(): Promise<Product[]> {
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
      if (!body) {
        throw Error('No Data Found in Body');
      }
      await this.productService.addProducts(body);
      return { success: true, message: 'Product added successfully' };
    } catch (error) {
      console.error('Error during Adding Products:', error);
      throw error;
    }
  }

  // Update product details
  @Put('/')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() body: UpdateProductDto,
  ): Promise<object> {
    try {
      if (!productId && !body) {
        throw new Error('Product Id And Data To Update is Required');
      }
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
      if (!productId) {
        throw Error('ProductId Is require to Delete Product');
      }
      await this.productService.deleteProduct(productId);
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      throw Error('Error in Deleting Product');
    }
  }
}
