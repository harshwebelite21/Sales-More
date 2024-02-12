import { Types } from 'mongoose';
import { RoleEnum } from '../user.model';

export interface TokenPayload {
  userId: Types.ObjectId;
  role: RoleEnum;
}

export interface VerifiedToken {
  userId: Types.ObjectId;
  role: RoleEnum;
}
