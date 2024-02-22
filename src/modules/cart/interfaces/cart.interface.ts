export interface CartProduct {
  productId: string;
  quantity: number;
}

export interface FindCartInterface {
  userId: string;
  products: CartProduct[];
}
