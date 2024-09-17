import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { Document, Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class RestaurantService {

    constructor(
        @InjectModel(Restaurant.name) private restaurantModel: Model<RestaurantDocument>,
        private readonly usersService: UsersService
    ) { }

    /**
     * Register a new restaurant
     * @param createUser Data Transfer Object for user creation
     * @param createRestaurant Data Transfer Object for restaurant creation
     * @returns Newly created restaurant document or error message
     */
    async registerRestaurant(
        createUser: CreateUserDto,
        createRestaurant: CreateRestaurantDto
    ): Promise<Restaurant> {
        let user: UserDocument | undefined;
        let restaurant: RestaurantDocument | undefined;

        try {
            // Step 1: Create the user first
            user = await this.usersService.createUser(createUser);

            // Step 2: Check for duplicate restaurant by name and owner
            const existingRestaurant = await this.restaurantModel.findOne({
                restaurant_name: createRestaurant.restaurant_name,
                owner: user._id,  // Check against the newly created user ID
            });

            if (existingRestaurant) {
                throw new ConflictException('Restaurant with the same name and owner already exists.');
            }

            // Step 3: Prepare restaurant data with the new owner (user ID)
            const restaurantData = {
                ...createRestaurant,
                owner: user._id,  // Link the restaurant to the user ID
            };

            // Step 4: Create and save the new restaurant document
            restaurant = new this.restaurantModel(restaurantData);
            return await restaurant.save();

        } catch (error) {
            // Step 5: Error handling
            if (error instanceof ConflictException) {
                throw error; // Re-throw the specific ConflictException
            } else if (error.name === 'ValidationError') {
                throw new BadRequestException('Invalid data provided.');
            } else {
                throw new InternalServerErrorException('An error occurred while creating the restaurant.');
            }
        } finally {
            // Step 6: Rollback if restaurant creation fails
            if (user && !restaurant) {
                try {
                    await this.usersService.deleteUserById(user._id.toString());
                    console.log(`User with ID ${user._id} deleted after failed restaurant registration.`);
                } catch (deletionError) {
                    console.error(`Failed to delete user with ID ${user._id}:`, deletionError);
                }
            }
        }
    }



    /**
     * Get the list of all restaurants
     * @returns An array of restaurants or error
     */
    async getAllRestaurants(): Promise<Restaurant[]> {
        try {
            return await this.restaurantModel.find().exec();
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while fetching the list of restaurants.');
        }
    }

    /**
     * Get a restaurant by ID
     * @param id Restaurant's unique MongoDB ID
     * @returns Restaurant document or error message
     */
    async getRestaurantById(id: string): Promise<Restaurant> {
        try {
            const restaurant = await this.restaurantModel.findById(id).exec();
            if (!restaurant) {
                throw new NotFoundException(`Restaurant with ID "${id}" not found.`);
            }
            return restaurant;
        } catch (error) {
            // Handle invalid MongoDB ObjectId format
            if (error.name === 'CastError') {
                throw new BadRequestException(`Invalid restaurant ID: "${id}".`);
            }
            throw new InternalServerErrorException('An error occurred while fetching the restaurant by ID.');
        }
    }
}
