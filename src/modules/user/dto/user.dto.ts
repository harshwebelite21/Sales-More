import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  Max,
  IsDate,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';

export class UserLoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
export class UserSignupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  age: number;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  birthdate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;
  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: 'Invalid mobile number' })
  mobile: string;
}
export class UserUpdateDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: 'Invalid mobile number' })
  mobile?: string;

  @IsInt()
  @ApiProperty({ required: false })
  @Min(0)
  @Max(100)
  @IsOptional()
  age?: number;

  @IsDate()
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  birthdate?: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;
}
