import { Types } from 'mongoose';

export const convertToObjectId = (id) => {
  return Types.ObjectId.createFromHexString(id);
};
