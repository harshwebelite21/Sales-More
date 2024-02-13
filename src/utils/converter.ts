import { Types } from 'mongoose';

export const convertToObjectId = (id: string): Types.ObjectId => {
  return Types.ObjectId.createFromHexString(id);
};
