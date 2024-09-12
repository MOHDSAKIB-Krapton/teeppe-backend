import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRestaurantDto {

    @IsString()
    @IsNotEmpty()
    restaurant_name: string;

    @IsString()
    @IsNotEmpty()
    owner_name: string;

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
    category:string;

    @IsNumber()
    zipcode: number;

    @IsString()
    full_address: string;
}