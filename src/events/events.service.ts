import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './schemas/events.schema';
import {
  Restaurant,
  RestaurantStatus,
} from 'src/restaurant/schemas/restaurant.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
  ) {}

  /**
   * @description Retrieve all events from the database, including restaurant and owner details.
   * @returns A promise resolving to an array of all events with populated restaurant and owner information.
   */
  async getAllEvents(): Promise<Event[]> {
    return this.eventModel
      .find()
      .populate({
        path: 'restaurant', // Populate restaurant
        select: 'restaurant_name full_address state city country owner', // Select restaurant fields
        populate: {
          path: 'owner', // Populate owner fields inside restaurant
          select: 'first_name last_name phone_number email',
        },
      })
      .exec();
  }

  /**
   * @description Retrieve a single event by its ID, including restaurant and owner details.
   * @param id - The ID of the event to retrieve.
   * @returns A promise resolving to the event object with populated restaurant and owner information.
   * @throws NotFoundException if the event with the specified ID is not found.
   */
  async getEventById(id: string): Promise<Event> {
    const event = await this.eventModel
      .findById(id)
      .populate({
        path: 'restaurant', // Populate restaurant
        select: 'restaurant_name full_address state city country owner', // Select restaurant fields
        populate: {
          path: 'owner', // Populate owner fields inside restaurant
          select: 'first_name last_name phone_number email',
        },
      })
      .exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  /**
   * @description Create a new event and link it to the associated restaurant. The restaurant must be approved by the admin.
   * @param createEventDto - DTO containing the details for creating the event.
   * @returns A promise resolving to the newly created event object.
   * @throws NotFoundException if the restaurant is not found.
   * @throws BadRequestException if the restaurant is not approved by the admin.
   */
  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    // Find the restaurant by its ID
    const restaurant = await this.restaurantModel
      .findById(createEventDto.restaurant)
      .exec();

    // Check if the restaurant exists
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID ${createEventDto.restaurant} not found`,
      );
    }

    // Check if the restaurant is verified by admin
    if (restaurant.is_verified_by_admin !== RestaurantStatus.APPROVED) {
      throw new BadRequestException(`Restaurant is not approved by the admin`);
    }

    // Create and save the new event if the restaurant is approved
    const newEvent = new this.eventModel(createEventDto);
    const savedEvent = await newEvent.save();

    // Add the event ID to the restaurant's events array
    restaurant.events.push(savedEvent._id as Types.ObjectId);
    await restaurant.save();

    return savedEvent;
  }

  /**
   * @description Update an existing event by its ID.
   * @param id - The ID of the event to update.
   * @param updateEventDto - Partial data to update the event.
   * @returns A promise resolving to the updated event object.
   * @throws NotFoundException if the event with the specified ID is not found.
   */
  async updateEvent(
    id: string,
    updateEventDto: Partial<CreateEventDto>,
  ): Promise<Event> {
    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, {
        new: true, // Return the updated document
      })
      .exec();
    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return updatedEvent;
  }

  /**
   * @description Delete an event by its ID and remove its reference from the associated restaurant's events array.
   * @param id - The ID of the event to delete.
   * @returns A promise resolving to an object containing a success message.
   * @throws NotFoundException if the event with the specified ID is not found.
   */
  async deleteEventById(id: string): Promise<{ message: string }> {
    // Find the event by its ID to retrieve the associated restaurant ID
    const event = await this.eventModel.findById(id).exec();

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    // Get the restaurant ID from the event
    const restaurantId = event.restaurant;

    // Find the restaurant that contains the event and remove the event ID from the array
    const restaurant = await this.restaurantModel.findById(restaurantId).exec();

    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID ${restaurantId} not found for event ID ${id}`,
      );
    }

    // Remove the event ID from the restaurant's events array
    restaurant.events = restaurant.events.filter(
      (eventId: Types.ObjectId) => !eventId.equals(id),
    );
    await restaurant.save(); // Save the updated restaurant document

    // Now delete the event after updating the restaurant
    await this.eventModel.findByIdAndDelete(id).exec();

    return { message: 'Event deleted successfully' };
  }
}
