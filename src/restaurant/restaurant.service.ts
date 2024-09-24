import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { Model } from 'mongoose';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    private usersService: UsersService,
  ) {}

  /**
   * Register a new restaurant
   * @param createUser Data Transfer Object for user creation
   * @param createRestaurant Data Transfer Object for restaurant creation
   * @returns Newly created restaurant document or error message
   */
  async registerRestaurant(
    createRestaurant: CreateRestaurantDto,
  ): Promise<Restaurant> {
    let restaurant: RestaurantDocument | undefined;

    try {
      // Step 1: Fetch the owner by their ID
      const owner = await this.usersService.getUserById(createRestaurant.owner);
      if (!owner) {
        throw new NotFoundException('Owner not found.');
      }

      // Step 2: Check for duplicate restaurant by name and owner
      const existingRestaurant = await this.restaurantModel.findOne({
        restaurant_name: createRestaurant.restaurant_name,
        owner: createRestaurant.owner, // Check against the owner's ID
      });

      if (existingRestaurant) {
        throw new ConflictException(
          'Restaurant with the same name and owner already exists.',
        );
      }

      // Step 3: Create and save the new restaurant document
      restaurant = new this.restaurantModel(createRestaurant);
      await restaurant.save();

      // Step 4: Update the user's restaurants array
      owner.restaurants.push(String(restaurant._id)); // Add the newly created restaurant's ID to the user's restaurants array
      await owner.save(); // Save the updated user document

      return restaurant;
    } catch (error) {
      // Step 5: Error handling
      if (error instanceof ConflictException) {
        throw error; // Re-throw the specific ConflictException
      } else if (error.name === 'ValidationError') {
        throw new BadRequestException('Invalid data provided.');
      } else {
        throw new InternalServerErrorException(
          'An error occurred while creating the restaurant.',
        );
      }
    }
  }

  /**
   * Get the list of all restaurants
   * @returns An array of restaurants or error
   */
  async getAllRestaurants(): Promise<Restaurant[]> {
    try {
      return await this.restaurantModel.find().populate('owner').exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while fetching the list of restaurants.',
      );
    }
  }

  /**
   * Method to get restaurants by their verification status.
   * @param isVerified - A boolean indicating whether to fetch verified (true) or unverified (false) restaurants.
   * @returns A list of restaurants matching the verification status.
   */
  async getRestaurantsByVerification(
    isVerified: boolean,
  ): Promise<Restaurant[]> {
    console.log('Verified => ', isVerified);
    try {
      // Cast the query to ensure boolean comparison
      const restaurants = await this.restaurantModel
        .find({ is_verified_by_admin: Boolean(isVerified) })
        .populate('owner') // Explicitly cast to boolean
        .lean() // Ensure lean is used for plain JavaScript objects
        .exec();

      return restaurants;
    } catch (error) {
      // Log the error for debugging purposes
      console.error(
        'Error fetching restaurants by verification status:',
        error,
      );

      // Throw a 500 Internal Server Error with a descriptive message
      throw new InternalServerErrorException(
        'Failed to fetch restaurants based on verification status. Please try again later.',
      );
    }
  }

  /**
   * Get a restaurant by ID
   * @param id Restaurant's unique MongoDB ID
   * @returns Restaurant document or error message
   */
  async getRestaurantById(id: string): Promise<Restaurant> {
    try {
      const restaurant = await (
        await this.restaurantModel.findById(id)
      ).populate('owner');
      if (!restaurant) {
        throw new NotFoundException(`Restaurant with ID "${id}" not found.`);
      }
      return restaurant;
    } catch (error) {
      // Handle invalid MongoDB ObjectId format
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid restaurant ID: "${id}".`);
      }
      throw new InternalServerErrorException(
        'An error occurred while fetching the restaurant by ID.',
      );
    }
  }

  /**
   * Update a restaurant by ID
   * @param id Restaurant's unique MongoDB ID
   * @param updateRestaurantDto Data Transfer Object for updating restaurant details
   * @returns Updated restaurant document or error message
   */
  async updateRestaurantById(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    try {
      const updatedRestaurant = await this.restaurantModel
        .findByIdAndUpdate(id, updateRestaurantDto, {
          new: true,
          runValidators: true,
        }) // Return the updated document
        .exec();

      if (!updatedRestaurant) {
        throw new NotFoundException(`Restaurant with ID "${id}" not found.`);
      }

      return updatedRestaurant;
    } catch (error) {
      // Handle invalid MongoDB ObjectId format
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid restaurant ID: "${id}".`);
      }
      // Handle validation errors or others
      throw new InternalServerErrorException(
        'An error occurred while updating the restaurant.',
      );
    }
  }

  /**
   * Delete a restaurant by ID
   * @param id Restaurant's unique MongoDB ID
   * @returns Success message or error message
   */
  async deleteRestaurantById(id: string): Promise<RestaurantDocument> {
    try {
      const deletedRestaurant = await this.restaurantModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedRestaurant) {
        throw new NotFoundException(`Restaurant with ID "${id}" not found.`);
      }

      return deletedRestaurant;
    } catch (error) {
      // Handle invalid MongoDB ObjectId format
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid restaurant ID: "${id}".`);
      }
      throw new InternalServerErrorException(
        'An error occurred while deleting the restaurant.',
      );
    }
  }
}
