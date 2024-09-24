import { IsNumber, IsString } from 'class-validator';

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
}
