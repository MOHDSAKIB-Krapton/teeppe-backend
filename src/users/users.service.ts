import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,  // Injecting the Mongoose User model
    ) { }

    /**
     * @description Create a new user
     * @param createUserDto - DTO containing user data (phone number, email, first name, last name)
     * @returns The newly created user
     */
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const newUser = new this.userModel(createUserDto);
        return await newUser.save(); // Saving the new user to the database
    }

    /**
     * @description Get all users from the database
     * @returns A list of all users
     */
    async getAllUsers(): Promise<User[]> {
        return await this.userModel.find().exec(); // Fetching all users from the database
    }

    /**
     * @description Get a single user by their ID
     * @param id - The ID of the user to retrieve
     * @returns The user with the given ID
     */
    async getUserById(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);  // Throwing an error if user is not found
        }
        return user;
    }

    /**
     * @description Delete a user by their ID
     * @param id - The ID of the user to delete
     * @returns A success message or an error if the user doesn't exist
     */
    async deleteUserById(id: string): Promise<{ message: string }> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`User with ID ${id} not found`);  // Throwing an error if user is not found
        }
        return { message: 'User successfully deleted' };  // Returning a success message
    }
}
