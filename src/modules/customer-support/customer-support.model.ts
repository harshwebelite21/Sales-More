// ticket.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
export enum TicketStatus {
  Open = 1,
  InProgress,
  Resolved,
}

@Schema()
export class Ticket {
  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true, type: String })
  subject: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ default: TicketStatus.Open, type: Number })
  status: TicketStatus;

  @Prop({ default: Date.now, type: Date })
  createdAt: Date;

  @Prop({ default: Date.now, type: Date })
  updatedAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
