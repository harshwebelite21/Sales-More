import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { SortEnum } from '../order.model';

export class OrderQueryInputDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  minAmount?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  maxAmount?: number;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  pageSize?: number;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  pageNumber?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortEnum)
  sortOrder?: SortEnum;
}
