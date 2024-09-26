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
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantStatus } from './schemas/restaurant.schema';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post('/register')
  async registerRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return await this.restaurantService.registerRestaurant(createRestaurantDto);
  }

  /**
   * Route to get all restaurants or filter based on the is_verified_by_admin field.
   * @param isVerified - Optional query parameter to filter restaurants by verification status.
   *                     If no query is provided, it returns all restaurants.
   * @returns List of restaurants based on the query or all restaurants.
   */
  @Get()
  async getRestaurants(
    @Query('is_verified_by_admin') isVerified?: RestaurantStatus, // Optional query parameter
  ) {
    if (isVerified !== undefined) {
      return this.restaurantService.getRestaurantsByVerification(isVerified);
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
