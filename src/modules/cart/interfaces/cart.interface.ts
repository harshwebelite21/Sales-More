interface CartProduct {
  productId: string;
  quantity: number;
  _id: string;
}

export interface FindCartInterface {
  userId: string;
  products: CartProduct[];
}
