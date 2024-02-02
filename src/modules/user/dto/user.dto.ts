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
} from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
export class UserSignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  age: number;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  birthdate: Date;
}
export class UserUpdateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  age?: number;

  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  birthdate?: Date;
}