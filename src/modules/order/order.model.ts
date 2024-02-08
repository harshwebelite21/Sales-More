import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ])
  products: { productId: Types.ObjectId; quantity: number }[];

  @Prop({ required: true, type: Number })
  amount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
