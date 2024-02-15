import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Put,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SuccessMessageDTO, UserIdRole } from 'interfaces';
import { AuthGuard } from 'guards/auth.guard';
import { GetUserId } from 'modules/user/userId.decorator';
import { ProductReviewService } from './products-review.service';
import {
  AddProductReviewDto,
  GetReviewDto,
  UpdateReviewDto,
} from './dto/products-review.dto';
import { ProductReviewInterface } from './interfaces/products-review.interface';

@Controller('review')
@ApiTags('Product-review')
@UseGuards(AuthGuard)
@ApiSecurity('JWT-auth')
export class ProductReviewController {
  constructor(private readonly reviewService: ProductReviewService) {}

  @Post('/')
  async createReview(
    @GetUserId() { userId }: UserIdRole,
    @Body() review: AddProductReviewDto,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.reviewService.createReview(userId, review);
      return { success: true, message: 'Review added successfully' };
    } catch (error) {
      console.error('Error during Review Products:', error);
      throw error;
    }
  }

  @Get('/')
  async getReviews(
    @Query() reviewData: GetReviewDto,
  ): Promise<ProductReviewInterface[]> {
    try {
      return this.reviewService.getReviews(reviewData);
    } catch (error) {
      console.error('Error during Getting Reviews:', error);
      throw Error('Error in Filtering Review');
    }
  }

  @Delete('/:productId')
  async deleteProductReview(
    @GetUserId() { userId }: UserIdRole,
    @Param('productId') productId: string,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.reviewService.deleteReview(userId, productId);
      return { success: true, message: 'Review deleted successfully' };
    } catch (error) {
      console.error('Error during Delete Reviews:', error);
      throw Error('Error in Deleting Reviews');
    }
  }

  @Put('/:productId')
  async updateReview(
    @GetUserId() { userId }: UserIdRole,
    @Param('productId') productId: string,
    @Body() reviewData: UpdateReviewDto,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.reviewService.updateReview(userId, productId, reviewData);
      return { success: true, message: 'Review Updated successfully' };
    } catch (error) {
      console.error('Error during Updating Review:', error);
      throw Error('Error in Updating Review');
    }
  }
}
