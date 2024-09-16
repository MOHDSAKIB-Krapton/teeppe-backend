import { Type } from "class-transformer";
import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class CreateRestaurantDto {

    @IsString()
    @IsNotEmpty()
    restaurant_name: string;

    @IsString()
    @IsNotEmpty()
    owner_name: string;

    @IsNumber()
    phone_number: number;

    @IsString()
    email:string;

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

    @IsArray()
    @ValidateNested({ each: true })  // Validate each object in the array
    @Type(() => OpeningHoursDto)  // Transform each item into OpeningHoursDto
    @IsDefined()  // Ensure the array is defined
    opening_hours: OpeningHoursDto[];
}

class OpeningHoursDto {
    @IsString()
    @IsNotEmpty()
    day: string;  // e.g., 'Monday'

    @IsString()
    @IsNotEmpty()
    openedtime: string;  // e.g., '08:00 AM'

    @IsString()
    @IsNotEmpty()
    closedtime: string;  // e.g., '10:00 PM'
}