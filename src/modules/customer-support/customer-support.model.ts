// ticket.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
export enum TicketStatus {
  Open = 1,
  InProgress,
  Resolved,
}

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: true, type: String })
  subject: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ default: TicketStatus.Open, type: Number })
  status: TicketStatus;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
TicketSchema.index({ userId: 1, productId: 1, status: 1 });
TicketSchema.index({ userId: 1 });
TicketSchema.index({ productId: 1 });
