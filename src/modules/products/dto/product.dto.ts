export class AddProductDto {
  name: string;
  description: string;
  price: number;
}

export class UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
}
