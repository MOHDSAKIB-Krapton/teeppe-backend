import { IsNumber, IsOptional, IsString } from 'class-validator';

export enum UserRole {
  Partner = 'partner',
  Admin = 'admin',
}
export class CreateUserDto {
  @IsString()
  uid: string;

  @IsNumber()
  phone_number: number;

  @IsString()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  role?: UserRole;
}
