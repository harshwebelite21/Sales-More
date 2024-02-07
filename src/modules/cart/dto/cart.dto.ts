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
  @Type(() => ModelArray)
  products: Array<ModelArray>;
}

export class ModelArray {
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

export class ReturnCartDataDto {
  userId: string;
  products: Array<ModelArray>;
}
interface CartProduct {
  productId: string;
  quantity: number;
  _id: string;
}

export interface FindCartInterface {
  userId: string;
  products: CartProduct[];
}
