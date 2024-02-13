import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SuccessMessageDTO } from 'interfaces';
import { AdminAuthGuard } from 'guards/admin-role.guard';
import {
  AddProductDto,
  FilterProductDto,
  UpdateProductDto,
} from './dto/product.dto';
import { Product } from './products.model';
import { ProductService } from './products.service';

@Controller('product')
@ApiTags('Products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Add a new product
  @Post('/')
  @UseGuards(AdminAuthGuard)
  @ApiSecurity('JWT-auth')
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
  @UseGuards(AdminAuthGuard)
  @ApiSecurity('JWT-auth')
  async updateProduct(
    @Param('productId') productId: string,
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
  @UseGuards(AdminAuthGuard)
  @ApiSecurity('JWT-auth')
  async deleteProduct(
    @Param('productId') productId: string,
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
