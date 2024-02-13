import { Role } from 'modules/user/user.model';

export interface SuccessMessageDTO {
  success: boolean;
  message: string;
}
export interface UserIdRole {
  userId: string;
  role: Role;
}
