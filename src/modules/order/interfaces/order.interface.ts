import { Date, Types } from 'mongoose';

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

interface BillingProducts {
  productName: string;
  quantity: number;
  price: number;
}
export interface BillingData {
  username: string;
  email: string;
  address: string;
  createdAt: Date;
  mobile: number;
  amount: number;
  _id: Types.ObjectId;
  products: BillingProducts[];
}
