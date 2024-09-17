import { IsBoolean, IsNotEmpty, IsMongoId, IsNumber, IsString, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateBookingDto {
    @IsMongoId()
    @IsNotEmpty()
    restaurant_id: string;

    @IsString()
    @IsNotEmpty()
    customer_name: string;

    @IsString()
    @IsNotEmpty()
    customer_contact: string;  // Email or phone

    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    number_of_guests: number;

    @IsBoolean()
    @IsNotEmpty()
    is_verified: boolean;

    @IsDateString()
    @IsNotEmpty()
    booking_time: string;  // Start time of the booking

    @IsNumber()
    @Min(15)
    @IsNotEmpty()
    booking_duration_in_minutes: number;  // Duration of the booking in minutes

    @IsString()
    @IsOptional()
    special_requests?: string;  // Optional field
}
