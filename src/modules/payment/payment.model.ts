import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, type: String })
  razorpay_order_id: string;

  @Prop({ required: true, type: String })
  razorpay_payment_id: string;

  @Prop({ required: true, type: String })
  razorpay_signature: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
