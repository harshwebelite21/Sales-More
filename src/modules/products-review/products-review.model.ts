import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class ProductReview {
  @Prop({ required: true, ref: 'Product', type: Types.ObjectId })
  productId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  reviewerId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  rating: Rating;

  @Prop({ required: true, type: String })
  reviewText: string;
}

export const ReviewSchema = SchemaFactory.createForClass(ProductReview);
ReviewSchema.index({ productId: 1, reviewerId: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ productId: 1 });

export enum Rating {
  Poor = 1,
  Fair,
  Good,
  VeryGood,
  Excellent,
}
