import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.createBooking(createBookingDto);
  }

  @Get()
  async findAllBookings() {
    return this.bookingService.findAllBookings();
  }

  @Get(':id')
  async findOneBooking(@Param('id') id: string) {
    return this.bookingService.findOneBooking(id);
  }

  @Patch(':id')
  async updateBooking(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.updateBooking(id, updateBookingDto);
  }

  @Get('confirm-booking/:id')
  async confirmBooking(@Param('id') id: string) {
    return this.bookingService.confirmBooking(id);
  }

  @Delete(':id')
  async deleteBookingById(@Param('id') id: string) {
    return this.bookingService.deleteBookingById(id);
  }
}
