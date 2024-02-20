import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TicketStatus } from '../customer-support.model';

export class CreateTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(TicketStatus)
  status: TicketStatus;
}
