import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Products)
  products: Array<Products>;
}

export class Products {
  @IsNotEmpty()
  @IsString()
  productId: string;
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}

export class RemoveSpecificItemDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  productId: string;
}
