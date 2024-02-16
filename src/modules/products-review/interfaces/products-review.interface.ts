import { Types } from 'mongoose';
import { Rating } from '../products-review.model';

export interface ProductReviewInterface {
  userName: string;
  productName: string;
  rating: Rating;
  reviewText: string;
}

export interface MatchStage {
  'productsData.name'?: RegExp;
  rating?: Rating;
  productId?: Types.ObjectId;
}
