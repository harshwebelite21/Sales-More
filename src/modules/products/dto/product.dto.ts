import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { SortEnum } from 'src/enums';

import { CategoryEnum } from '../products.model';

export class AddProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsInt()
  availableQuantity: number;

  @IsNotEmpty()
  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  @IsNotEmpty()
  attributes: Array<{
    name: string;
    value: string;
  }>;
}

export class UpdateProductDto {
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsInt()
  @IsOptional()
  availableQuantity?: number;

  @IsOptional()
  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  @IsOptional()
  attributes: Array<{
    name: string;
    value: string;
  }>;
}

export class FilterProductDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEnum(CategoryEnum)
  @Transform(({ value }) => {
    return parseInt(value, 10);
  })
  category?: CategoryEnum;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  maxPrice?: number;

  @IsOptional()
  @IsString()
  attributeName?: string;

  @IsOptional()
  @IsString()
  attributeValue?: string;

  @IsInt()
  @IsOptional()
  pageNumber?: number;

  @IsInt()
  @IsOptional()
  pageSize?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortEnum)
  sortOrder?: SortEnum;
}
