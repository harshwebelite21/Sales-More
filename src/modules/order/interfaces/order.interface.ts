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
