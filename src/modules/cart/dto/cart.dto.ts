export class AddToCartDto {
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
}

export class RemoveSpecificItemDto {
  userId: string;
  productId: string;
}
