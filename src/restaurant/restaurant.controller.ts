import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RegisterRestaurantDto } from './dto/register-restaurant-with-user.dto';

@Controller('restaurant')
export class RestaurantController {
    constructor(
        private readonly restaurantService: RestaurantService
    ) { }

    @Post('/register')
    async registerRestaurant(@Body() registerRestaurantDto: RegisterRestaurantDto) {
        const { user, restaurant } = registerRestaurantDto;
        return await this.restaurantService.registerRestaurant(user, restaurant);
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
