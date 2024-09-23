import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService, // Injecting the UsersService
  ) {}

  /**
   * @description Create a new user
   * @param createUserDto - Data Transfer Object containing user data (phone number, email, first name, last name)
   * @returns The newly created user
   */
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  /**
   * @description Get all users from the database
   * @returns A list of all users
   */
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  /**
   * @description Get a single user by their ID
   * @param id - The ID of the user to retrieve
   * @returns The user with the given ID
   */
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  /**
   * @description Update a user by ID
   * @param id - The user ID
   * @param updateUserDto - DTO containing updated user data
   * @returns The updated user
   */
  @Patch(':id')
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userService.updateUserById(id, updateUserDto);
  }

  /**
   * @description Delete a user by their ID
   * @param id - The ID of the user to delete
   * @returns A success message or an error if the user doesn't exist
   */
  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    return await this.userService.deleteUserById(id);
  }
}
