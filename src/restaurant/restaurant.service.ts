import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { Model } from 'mongoose';

@Injectable()
export class RestaurantService {

    constructor(
        @InjectModel(Restaurant.name) private restaurantModel: Model<RestaurantDocument>,
    ) { }

    /**
   * Register a new restaurant
   * @param createRestaurantDto Data Transfer Object for restaurant creation
   * @returns Newly created restaurant document or error message
   */
    async registerRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
        try {
            // Check for duplicate restaurant by name and owner (optional, depending on your use case)
            const existingRestaurant = await this.restaurantModel.findOne({
                restaurant_name: createRestaurantDto.restaurant_name,
                owner_name: createRestaurantDto.owner_name,
            });

            if (existingRestaurant) {
                throw new ConflictException('Restaurant with the same name and owner already exists.');
            }

            // Create a new restaurant document from DTO
            const newRestaurant = new this.restaurantModel(createRestaurantDto);

            // Save the document to the database
            return await newRestaurant.save();
        } catch (error) {
            // Handle Mongoose validation errors or other server errors
            if (error.name === 'ValidationError') {
                throw new BadRequestException('Invalid data provided.');
            } else if (error.code === 11000) { // Handling unique index violation (duplicate error)
                throw new ConflictException('Duplicate entry detected.');
            } else {
                throw new InternalServerErrorException('An error occurred while creating the restaurant.');
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
