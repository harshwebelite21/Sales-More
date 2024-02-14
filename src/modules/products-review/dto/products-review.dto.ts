import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class AddProductReviewDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reviewerId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reviewText: string;
}

export class DeleteReviewDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reviewerId: string;
}

export class UpdateReviewDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  rating: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reviewText: string;
}

export class GetReviewDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  productName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  rating: number;
}
