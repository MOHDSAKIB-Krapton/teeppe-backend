import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('restaurant')
export class RestaurantController {
    constructor(
        private readonly restaurantService: RestaurantService
    ) { }

    @Post('/register')
    async registerRestaurant(@Body() createRestaurant: CreateRestaurantDto) {
        return await this.restaurantService.registerRestaurant(createRestaurant)
    }

    @Get()
    async getAllRestaurants() {
        return await this.restaurantService.getAllRestaurants();
    }

    @Get(":id")
    async getRestaurantById(@Param("id") id: string) {
        return await this.restaurantService.getRestaurantById(id);
    }
}
