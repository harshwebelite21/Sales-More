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
import { SuccessMessageDTO, UserIdRole } from 'interfaces';
import { AdminAuthGuard } from 'guards/admin-role.guard';
import { Ticket } from 'modules/customer-support/customer-support.model';
import { AuthGuard } from 'guards/auth.guard';
import { GetUserId } from 'modules/user/userId.decorator';
import {
  AddProductDto,
  AdminTicketQueryDataDto,
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

  @Get('/:productId')
  async getSingleProduct(
    @Param('productId') productId: string,
  ): Promise<{ data: Product | null }> {
    try {
      const data: Product | null =
        await this.productService.getSingleProduct(productId);
      return { data };
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
    try {
      return this.productService.filterProduct(query);
    } catch (error) {
      console.error('Error during Filtering Products:', error);
      throw Error('Error in Filtering Product');
    }
  }

  // Tickets endpoint
  @UseGuards(AuthGuard)
  @ApiSecurity('JWT-auth')
  @Get('/tickets/:productId')
  async ticketsByProductId(
    @Param('productId') productId: string,
    @GetUserId() { userId }: UserIdRole,
  ): Promise<Ticket[]> {
    try {
      return this.productService.ticketsByProductId(productId, userId);
    } catch (error) {
      console.error('Error during Filtering Tickets:', error);
      throw Error('Error in Filtering Tickets');
    }
  }

  // Get All Tickets Admin end Point
  @UseGuards(AdminAuthGuard)
  @ApiSecurity('JWT-auth')
  @Get('admin/tickets')
  async ticketsAdminFilter(
    @Query() queryData: AdminTicketQueryDataDto,
  ): Promise<Ticket[]> {
    try {
      return this.productService.ticketsByAdmin(queryData);
    } catch (error) {
      console.error('Error during Filtering Tickets:', error);
      throw Error('Error in Filtering Tickets');
    }
  }

  // Get All Products
  @ApiSecurity('JWT-auth')
  @Get('/get-all-products')
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }
}
