import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TicketStatus } from '../customer-support.model';

export class CreateTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsDate()
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  createdAt: Date;

  @IsDate()
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  updatedAt: Date;
}

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}

export class QueryDataDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userId?: string | Types.ObjectId;
}
export class UpdateStatusDto {
  @Transform(({ value }) => parseInt(value))
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TicketStatus)
  status: TicketStatus;
}
