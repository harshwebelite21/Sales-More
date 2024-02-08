import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  userId: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Products)
  products: Array<Products>;
}

export class Products {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  productId: string;
  @IsNotEmpty()
  @ApiProperty()
  @IsInt()
  quantity: number;
}

export class RemoveSpecificItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productId: string;
}
