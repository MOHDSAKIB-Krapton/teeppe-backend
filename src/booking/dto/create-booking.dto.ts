import {
  IsBoolean,
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  Min,
  IsEnum,
} from 'class-validator';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
}

export class CreateBookingDto {
  @IsMongoId()
  @IsNotEmpty()
  restaurant_id: string;

  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @IsString()
  @IsNotEmpty()
  customer_contact: string; // Email or phone

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  number_of_guests?: number;

  @IsDateString()
  @IsNotEmpty()
  booking_time: string; // Start time of the booking

  // @IsNumber()
  // @Min(15)
  // @IsNotEmpty()
  // booking_duration_in_minutes: number;  // Duration of the booking in minutes

  @IsString()
  @IsOptional()
  special_requests?: string; // Optional field

  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus; // The current status of the booking
}
