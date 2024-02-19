import { Types } from 'mongoose';

export interface UpdateTicketsQueryInterface {
  _id?: Types.ObjectId;
  userId?: Types.ObjectId;
}
