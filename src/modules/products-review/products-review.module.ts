import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReviewSchema } from './products-review.model';
import { ProductReviewController } from './products-review.controller';
import { ProductReviewService } from './products-review.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: 'ProductReview', schema: ReviewSchema },
    ]),
  ],
  controllers: [ProductReviewController],
  providers: [ProductReviewService],
})
export class ProductReviewModule {}
