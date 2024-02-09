import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class AddToCartDto {
  @IsNotEmpty()
  @ApiProperty()
  @Transform(({ value }) => new Types.ObjectId(value))
  userId: Types.ObjectId;

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
  @Transform(({ value }) => new Types.ObjectId(value))
  userId: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productId: string;
}
