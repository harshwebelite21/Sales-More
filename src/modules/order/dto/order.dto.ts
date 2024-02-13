import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { SortEnum } from 'enums';

export class OrderQueryInputDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  minAmount?: number;

  @IsNumber()
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  maxAmount?: number;

  @IsInt()
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  pageSize?: number;

  @IsInt()
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  pageNumber?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(SortEnum)
  sortOrder?: SortEnum;
}
