import { RoleEnum } from 'src/modules/user/user.model';

interface OrderProduct {
  productId: string;
  quantity: number;
}

interface OrderData {
  userId: string;
  products: OrderProduct[];
  amount: number;
}

export interface OrderFilterType {
  Orders: OrderData[];
  totalAmount: number;
}

export interface UserIdRole {
  userId: string;
  role: RoleEnum;
}
