import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SuccessMessageDTO } from 'interfaces';
import { AuthGuard } from 'guards/auth.guard';
import { ProductReviewService } from './products-review.service';
import {
  AddProductReviewDto,
  DeleteReviewDto,
  GetReviewDto,
  UpdateReviewDto,
} from './dto/products-review.dto';
import { ProductReview } from './products-review.model';

@Controller('review')
@ApiTags('Order')
@UseGuards(AuthGuard)
@ApiSecurity('JWT-auth')
export class ProductReviewController {
  constructor(private readonly reviewService: ProductReviewService) {}

  @Post('/')
  async createReview(
    @Body() review: AddProductReviewDto,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.reviewService.createReview(review);
      return { success: true, message: 'Review added successfully' };
    } catch (error) {
      console.error('Error during Review Products:', error);
      throw error;
    }
  }

  @Get('/:productId')
  async getReviewsByProductId(
    @Query() reviewData: GetReviewDto,
  ): Promise<ProductReview[]> {
    try {
      return this.reviewService.getReviewsByProductId(reviewData);
    } catch (error) {
      console.error('Error during Getting Reviews:', error);
      throw Error('Error in Filtering Review');
    }
  }

  @Delete('/')
  async deleteProduct(
    @Query() reviewIds: DeleteReviewDto,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.reviewService.deleteReview(reviewIds);
      return { success: true, message: 'Review deleted successfully' };
    } catch (error) {
      console.error('Error during Delete Reviews:', error);
      throw Error('Error in Deleting Reviews');
    }
  }

  @Put('/')
  async updateReview(
    @Query() reviewIds: DeleteReviewDto,
    @Body() reviewData: UpdateReviewDto,
  ): Promise<SuccessMessageDTO> {
    try {
      await this.reviewService.updateReview(reviewIds, reviewData);
      return { success: true, message: 'Review Updated successfully' };
    } catch (error) {
      console.error('Error during Updating Review:', error);
      throw Error('Error in Updating Review');
    }
  }
}
