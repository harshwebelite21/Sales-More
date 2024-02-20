import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { SortEnum } from 'enums';
import { CategoryEnum } from '../products.model';

export class AddProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @ApiProperty()
  @IsInt()
  availableQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  @ApiProperty()
  @IsNotEmpty()
  attributes: Array<{
    name: string;
    value: string;
  }>;
}

export class UpdateProductDto extends PartialType(AddProductDto) {}

export class FilterProductDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(CategoryEnum)
  @Transform(({ value }) => {
    return parseInt(value, 10);
  })
  category?: CategoryEnum;

  @IsNumber()
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  minPrice?: number;

  @IsNumber()
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  maxPrice?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  attributeName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  attributeValue?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  pageNumber?: number;

  @IsInt()
  @ApiProperty({ required: false })
  @IsOptional()
  pageSize?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(SortEnum)
  sortOrder?: SortEnum;
}

export class AdminTicketQueryDataDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  productName: string;
}
