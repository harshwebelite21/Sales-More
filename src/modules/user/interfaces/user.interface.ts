import { Types } from 'mongoose';
import { Role } from '../user.model';

export interface TokenPayload {
  userId: Types.ObjectId;
  role: Role;
}

export interface VerifiedToken {
  userId: Types.ObjectId;
  role: Role;
}
export interface UserDocuments {
  name: string;
  path: string;
}
