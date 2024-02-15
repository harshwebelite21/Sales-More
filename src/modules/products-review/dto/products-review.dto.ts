import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Rating } from '../products-review.model';

export class AddProductReviewDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsEnum(Rating)
  rating: Rating;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reviewText: string;
}

export class UpdateReviewDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsEnum(Rating)
  rating?: Rating;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reviewText?: string;
}

export class GetReviewDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsEnum(Rating)
  @Transform(({ value }) => parseInt(value))
  rating?: Rating;
}
