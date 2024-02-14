import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { convertToObjectId } from 'utils/converter';
import { ProductReview } from './products-review.model';
import {
  AddProductReviewDto,
  DeleteReviewDto,
  GetReviewDto,
  UpdateReviewDto,
} from './dto/products-review.dto';
import { MatchStage } from './interfaces/products-review.interface';

@Injectable()
export class ProductReviewService {
  constructor(
    @InjectModel('ProductReview')
    private readonly productReviewModel: Model<ProductReview>,
  ) {}

  async createReview(review: AddProductReviewDto): Promise<void> {
    const { productId, reviewerId, ...reviewData } = review;
    const reviewWithObjectId = {
      ...reviewData,
      reviewerId: convertToObjectId(reviewerId),
      productId: convertToObjectId(productId),
    };

    const find = await this.productReviewModel.findOne({
      productId: reviewWithObjectId.productId,
      reviewerId: reviewWithObjectId.reviewerId,
    });

    if (find) {
      throw Error('Product reviewed  Already ');
    }
    await this.productReviewModel.create(reviewWithObjectId);
  }

  async getReviewsByProductId(
    reviewData: GetReviewDto,
  ): Promise<ProductReview[]> {
    const { rating, productName } = reviewData;
    const productRegex = new RegExp(productName, 'i');

    const matchStage: MatchStage = {};
    if (productName) {
      matchStage['productsData.name'] = productRegex;
    }
    if (rating) {
      matchStage.rating = rating;
    }

    return this.productReviewModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'reviewerId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'productsData',
        },
      },
      {
        $unwind: '$productsData',
      },
      {
        $match: matchStage,
      },
      {
        $project: {
          userName: '$user.name',
          productName: '$productsData.name',
          rating: 1,
          reviewText: 1,
        },
      },
    ]);
  }

  async deleteReview({
    productId,
    reviewerId,
  }: DeleteReviewDto): Promise<void> {
    await this.productReviewModel.deleteOne({
      productId: convertToObjectId(productId),
      reviewerId: convertToObjectId(reviewerId),
    });
  }

  async updateReview(
    { productId, reviewerId }: DeleteReviewDto,
    reviewData: UpdateReviewDto,
  ): Promise<void> {
    await this.productReviewModel.updateOne(
      {
        productId: convertToObjectId(productId),
        reviewerId: convertToObjectId(reviewerId),
      },
      reviewData,
    );
  }
}
