import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookingStatus, CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDocument } from './schema/booking.schema';
import {
  Restaurant,
  RestaurantDocument,
} from 'src/restaurant/schemas/restaurant.schema';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  // Create a new booking
  async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    try {
      const booking = new this.bookingModel(createBookingDto);
      return await booking.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create booking.');
    }
  }

  // Get all bookings
  async findAllBookings(): Promise<Booking[]> {
    try {
      return await this.bookingModel
        .find()
        .populate(
          'restaurant_id',
          'restaurant_name city state country special_dishes',
        )
        .exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch bookings.');
    }
  }

  // Get a booking by ID
  async findOneBooking(id: string): Promise<Booking> {
    try {
      const booking = await this.bookingModel
        .findById(id)
        .populate(
          'restaurant_id',
          'restaurant_name city state country special_dishes',
        )
        .exec();
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found.`);
      }
      return booking;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid booking ID: ${id}`);
      }
      throw new InternalServerErrorException('Failed to fetch booking.');
    }
  }

  // Update a booking
  async updateBooking(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    try {
      const updatedBooking = await this.bookingModel
        .findByIdAndUpdate(id, updateBookingDto, { new: true })
        .populate(
          'restaurant_id',
          'restaurant_name city state country special_dishes',
        )
        .exec();
      if (!updatedBooking) {
        throw new NotFoundException(`Booking with ID ${id} not found.`);
      }
      return updatedBooking;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid booking ID: ${id}`);
      }
      throw new InternalServerErrorException('Failed to update booking.');
    }
  }

  async confirmBooking(id: string): Promise<Booking> {
    try {
      // Find the booking and update the status to CONFIRMED
      const booking = await this.bookingModel
        .findByIdAndUpdate(
          id,
          { status: BookingStatus.CONFIRMED }, // Update the booking status
          { new: true },
        )
        .exec();

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found.`);
      }
      console.log('restaurant id => ', booking.restaurant_id);

      // Find the corresponding restaurant and add the booking ID to its bookings array
      const restaurant = await this.restaurantModel
        .findById(booking.restaurant_id)
        .exec();

      console.log('Find the relevant Restaurant', restaurant);

      if (!restaurant) {
        throw new NotFoundException(
          `Restaurant with ID ${booking.restaurant_id} not found.`,
        );
      }

      // Check if the booking ID already exists in the restaurant's bookings array
      if (!restaurant.bookings.includes(booking._id as Types.ObjectId)) {
        restaurant.bookings.push(booking._id as Types.ObjectId); // Add the booking ID

        console.log('Updated Restaurant => ', restaurant);
        await restaurant.save(); // Save the updated restaurant
      }

      return booking;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid booking ID: ${id}`);
      }
      throw new InternalServerErrorException('Failed to confirm booking.');
    }
  }

  // Delete a booking
  async deleteBookingById(id: string): Promise<void> {
    try {
      const result = await this.bookingModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Booking with ID ${id} not found.`);
      }
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid booking ID: ${id}`);
      }
      throw new InternalServerErrorException('Failed to delete booking.');
    }
  }

  // Migration Script:--------------

  // async addMissingBookingsFieldToRestaurants() {
  //   const restaurants = await this.restaurantModel
  //     .find({ bookings: { $exists: false } })
  //     .exec();

  //   for (const restaurant of restaurants) {
  //     restaurant.bookings = []; // Initialize the bookings array
  //     await restaurant.save(); // Save the updated restaurant
  //   }

  //   console.log(
  //     `Updated ${restaurants.length} restaurants to include the bookings field.`,
  //   );
  // }
}
