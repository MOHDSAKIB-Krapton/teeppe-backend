import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RegisterRestaurantDto } from './dto/register-restaurant-with-user.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post('/register')
  async registerRestaurant(
    @Body() registerRestaurantDto: RegisterRestaurantDto,
  ) {
    const { user, restaurant } = registerRestaurantDto;
    return await this.restaurantService.registerRestaurant(user, restaurant);
  }

  /**
   * Route to get all restaurants or filter based on the is_verified_by_admin field.
   * @param isVerified - Optional query parameter to filter restaurants by verification status.
   *                     If no query is provided, it returns all restaurants.
   * @returns List of restaurants based on the query or all restaurants.
   */
  @Get()
  async getRestaurants(
    @Query('is_verified_by_admin') isVerified?: string, // Optional query parameter
  ) {
    if (isVerified !== undefined) {
      // Convert the query string 'true'/'false' to a boolean
      const isVerifiedBool = isVerified === 'true';
      return this.restaurantService.getRestaurantsByVerification(
        isVerifiedBool,
      );
    } else {
      // No query parameter provided, return all restaurants
      return this.restaurantService.getAllRestaurants();
    }
  }

  @Get(':id')
  async getRestaurantById(@Param('id') id: string) {
    return await this.restaurantService.getRestaurantById(id);
  }

  @Patch(':id')
  async updateRestaurantById(
    @Param('id') id: string,
    @Body() updateRestaurant: UpdateRestaurantDto,
  ) {
    return await this.restaurantService.updateRestaurantById(
      id,
      updateRestaurant,
    );
  }

  @Delete(':id')
  async deleteRestaurantById(@Param('id') id: string) {
    return await this.restaurantService.deleteRestaurantById(id);
  }
}
