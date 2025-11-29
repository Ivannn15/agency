import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterAgencyDto {
  @IsNotEmpty()
  agencyName: string;

  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdatePasswordDto {
  @IsOptional()
  @MinLength(6)
  password?: string;
}
