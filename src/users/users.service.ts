import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { RestaurantService } from 'src/restaurant/restaurant.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // Injecting the Mongoose User model

    // Using this forwerdref to avoid circular dependency of restaurant and user module
    @Inject(forwardRef(() => RestaurantService)) // Use forwardRef to inject UsersService
    private readonly restaurantService: RestaurantService,
  ) {}

  /**
   * @description Create a new user
   * @param createUserDto - DTO containing user data (phone number, email, first name, last name)
   * @returns The newly created user
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const newUser = new this.userModel(createUserDto);

      // Save the new user to the database and return the saved user
      return await newUser.save();
    } catch (error) {
      // Handling specific error types
      if (error.code === 11000) {
        // 11000 is the MongoDB duplicate key error code
        throw new ConflictException('User with this email already exists.');
      } else if (error.name === 'ValidationError') {
        throw new BadRequestException('Validation failed. Invalid user data.');
      } else {
        // Generic server error
        throw new InternalServerErrorException(
          'An error occurred while creating the user.',
        );
      }
    }
  }

  /**
   * @description Get all users from the database
   * @returns A list of all users
   */
  async getAllUsers(): Promise<UserDocument[]> {
    return await this.userModel.find().exec(); // Fetching all users from the database
  }

  /**
   * @description Get a single user by their ID
   * @param id - The ID of the user to retrieve
   * @returns The user with the given ID
   */
  async getUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`); // Throwing an error if user is not found
    }
    return user;
  }

  /**
   * @description Get a single user by their UID
   * @param uid - The UID of the user to retrieve
   * @returns The user with the given UID
   */
  async getUserByUid(uid: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ uid }).exec(); // Finding user by `uid` field
    if (!user) {
      throw new NotFoundException(`User with UID ${uid} not found`); // Throwing an error if user is not found
    }
    return user;
  }

  /**
   * @description Update a user by their ID
   * @param id - The ID of the user to update
   * @param updateUserDto - DTO containing updated user data
   * @returns The updated user
   */
  async updateUserById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, {
          new: true,
          runValidators: true,
        }) // Returns the updated user
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return updatedUser;
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error code
        throw new ConflictException('User with this email already exists.');
      } else if (error.name === 'ValidationError') {
        throw new BadRequestException('Validation failed. Invalid user data.');
      } else {
        throw new InternalServerErrorException(
          'An error occurred while updating the user.',
        );
      }
    }
  }

  /**
   * @description Delete a user by their ID
   * @param id - The ID of the user to delete
   * @returns A success message or an error if the user doesn't exist
   */
  async deleteUserById(id: string): Promise<{ message: string }> {
    // Find the user by ID
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`); // Throw an error if the user is not found
    }

    // If the user has associated restaurants, delete them
    if (user.restaurants && user.restaurants.length > 0) {
      await Promise.all(
        user.restaurants.map(async (restaurantId: string) => {
          await this.restaurantService.deleteRestaurantById(restaurantId); // Call delete method from RestaurantService
        }),
      );
    }

    // Delete the user
    await this.userModel.findByIdAndDelete(id).exec();

    return { message: 'User and associated restaurants successfully deleted' };
  }
}
