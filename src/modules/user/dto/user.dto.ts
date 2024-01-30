import { IsString, IsEmail, IsInt, Min, Max, IsDate } from 'class-validator';
export class UserLoginDto {
  @IsEmail()
  email: string;
  password: string;
}
export class UserSignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsInt()
  @Min(6)
  @Max(20)
  password: string;

  @IsInt()
  @Min(0)
  @Max(100)
  age: number;

  @IsDate()
  birthdate: Date;
}
export class UserUpdateDto {
  @IsString()
  name?: string;
  @IsEmail()
  email?: string;
  @IsString()
  @IsInt()
  @Min(6)
  @Max(20)
  password?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  age?: number;

  @IsDate()
  birthdate?: Date;
}
