import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDocument } from './schema/booking.schema';

@Injectable()
export class BookingService {
    constructor(@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) { }

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
            return await this.bookingModel.find().exec();
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch bookings.');
        }
    }

    // Get a booking by ID
    async findOneBooking(id: string): Promise<Booking> {
        try {
            const booking = await this.bookingModel.findById(id).exec();
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
    async updateBooking(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
        try {
            const updatedBooking = await this.bookingModel.findByIdAndUpdate(id, updateBookingDto, { new: true }).exec();
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
}
