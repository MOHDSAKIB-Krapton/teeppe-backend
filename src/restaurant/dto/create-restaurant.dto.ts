import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { RestaurantStatus } from '../schemas/restaurant.schema';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  restaurant_name: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone_number: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsMongoId()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsArray()
  special_dishes: string[];

  @IsArray()
  restaurant_images: string[];

  @IsString()
  category: string;

  @IsNumber()
  zipcode: number;

  @IsString()
  full_address: string;

  @IsNumber()
  booking_price: number;

  @IsOptional()
  is_verified_by_admin: RestaurantStatus;

  @IsArray()
  @ValidateNested({ each: true }) // Validate each object in the array
  @Type(() => OpeningHoursDto) // Transform each item into OpeningHoursDto
  @IsDefined() // Ensure the array is defined
  opening_hours: OpeningHoursDto[];
}

class OpeningHoursDto {
  @IsString()
  @IsNotEmpty()
  day: string; // e.g., 'Monday'

  @ValidateIf((o) => !o.is_closed) // Validate only if is_closed is false
  @IsString()
  @IsNotEmpty()
  openedtime: string; // e.g., '08:00 AM'

  @ValidateIf((o) => !o.is_closed) // Validate only if is_closed is false
  @IsString()
  @IsNotEmpty()
  closedtime: string; // e.g., '10:00 PM'

  @IsBoolean()
  @IsNotEmpty()
  is_closed: boolean; // Indicates if the restaurant is closed on this day
}
