import { Body, Controller, Get, Post } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('restaurant')
export class RestaurantController {
    constructor(
        private readonly restaurantService: RestaurantService
    ){}

    @Post('/register')
    async registerRestaurant(@Body() createRestaurant: CreateRestaurantDto){
        return await this.restaurantService.registerRestaurant(createRestaurant)
    }
}
