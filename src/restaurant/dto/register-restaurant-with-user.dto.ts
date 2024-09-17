import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class RegisterRestaurantDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateUserDto)
    user: CreateUserDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateRestaurantDto)
    restaurant: CreateRestaurantDto;
}
