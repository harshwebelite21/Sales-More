import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './products.service';
import {
  AddProductDto,
  FilterProductDto,
  UpdateProductDto,
} from './dto/product.dto';
import { Product } from './products.model';
import { GetProductId } from './productId.decorator';
import { SuccessMessageDTO } from 'src/dtos';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Add a new product
  @Post('/')
  async addProducts(@Body() body: AddProductDto): Promise<SuccessMessageDTO> {
    try {
      await this.productService.addProducts(body);
      return { success: true, message: 'Product added successfully' };
    } catch (error) {
      console.error('Error during Adding Products:', error);
      throw error;
    }
  }

  // Update product details
  @Put('/:productId')
  async updateProduct(
    @GetProductId() productId: string,
    @Body() body: UpdateProductDto,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.productService.updateProduct(body, productId);
      return { success: true, message: 'Product updated successfully' };
    } catch (error) {
      console.error('Error during Updating Products:', error);
      throw Error('Error in Updating data');
    }
  }

  // Delete a product
  @Delete('/:productId')
  async deleteProduct(
    @GetProductId() productId: string,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.productService.deleteProduct(productId);
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      console.error('Error during deleting Products:', error);
      throw Error('Error in Deleting Product');
    }
  }

  // Filter Product
  @Get('/')
  async filterProduct(@Query() query: FilterProductDto): Promise<Product[]> {
    return this.productService.filterProduct(query);
  }
}
