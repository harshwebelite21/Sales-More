import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { convertToObjectId } from 'utils/converter';
import { ProductReview } from './products-review.model';
import {
  AddProductReviewDto,
  GetReviewDto,
  UpdateReviewDto,
} from './dto/products-review.dto';
import {
  MatchStage,
  ProductReviewInterface,
} from './interfaces/products-review.interface';

@Injectable()
export class ProductReviewService {
  constructor(
    @InjectModel('ProductReview')
    private readonly productReviewModel: Model<ProductReview>,
  ) {}

  async createReview(
    reviewerId: string,
    review: AddProductReviewDto,
  ): Promise<void> {
    const { productId, ...reviewData } = review;
    const reviewWithObjectId = {
      ...reviewData,
      reviewerId: convertToObjectId(reviewerId),
      productId: convertToObjectId(productId),
    };

    const exists = await this.productReviewModel.exists({
      productId: reviewWithObjectId.productId,
      reviewerId: reviewWithObjectId.reviewerId,
    });

    if (exists) {
      throw Error('Product reviewed  Already ');
    }
    await this.productReviewModel.create(reviewWithObjectId);
  }

  async getReviews(
    reviewData: GetReviewDto,
  ): Promise<ProductReviewInterface[]> {
    const { productName = 'A', rating } = reviewData;
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

  async deleteReview(reviewerId: string, productId: string): Promise<void> {
    await this.productReviewModel.deleteOne({
      productId: convertToObjectId(productId),
      reviewerId: convertToObjectId(reviewerId),
    });
  }

  async updateReview(
    reviewerId: string,
    productId: string,
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

  async getReviewsByProductId(
    productId: string,
  ): Promise<ProductReviewInterface[]> {
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
        $match: {
          productId: convertToObjectId(productId),
        },
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
}
