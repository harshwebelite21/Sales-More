import { Types } from 'mongoose';
import { RoleEnum } from 'src/modules/user/user.model';

export interface SuccessMessageDTO {
  success: boolean;
  message: string;
}
export interface UserIdRole {
  userId: Types.ObjectId;
  role: RoleEnum;
}
