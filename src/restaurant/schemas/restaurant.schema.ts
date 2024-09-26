import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type RestaurantDocument = Restaurant & Document;

export enum RestaurantStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
  DISAPPROVED = 'disapproved',
  // BLOCKED = 'blocked',
  // PAUSED = 'paused',
  // VERIFIED = 'verified',
  // ACTIVE = 'active', // Add other statuses as needed
  // INACTIVE = 'inactive',
}

@Schema({ timestamps: true }) // Adding timestamps for createdAt and updatedAt
export class Restaurant {
  @Prop({ required: true }) // Making restaurant_name required
  restaurant_name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Linking to User schema by ObjectId
  owner: User | Types.ObjectId; // Either store the entire user object or just the ObjectId

  @Prop()
  phone_number: number;

  @Prop()
  email: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop({ required: true }) // Latitude and longitude required for location
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop([String]) // Array of special dishes
  special_dishes: string[];

  @Prop([String]) // Array of image URLs for multiple images
  restaurant_images: string[];

  @Prop({ required: true }) // Category of the restaurant
  category: string;

  @Prop({ required: true }) // Making zipcode required
  zipcode: number;

  @Prop({ required: true }) // Full address is required
  full_address: string;

  @Prop({
    type: String,
    enum: RestaurantStatus,
    default: RestaurantStatus.PENDING,
  }) // Default value is pending
  is_verified_by_admin: RestaurantStatus;

  @Prop({ required: true })
  booking_price: number;

  @Prop({ default: [], type: [{ type: Types.ObjectId, ref: 'Booking' }] })
  bookings: Types.ObjectId[];

  @Prop({
    type: [
      {
        day: { type: String, required: true }, // e.g., 'Monday'
        openedtime: {
          type: String,
          required: function () {
            return !this.is_closed;
          },
        }, // Required only if is_closed is false
        closedtime: {
          type: String,
          required: function () {
            return !this.is_closed;
          },
        }, // Required only if is_closed is false
        is_closed: { type: Boolean, required: true }, // Indicate if the restaurant is closed on this day
      },
    ],
    required: true, // Ensure that this field is required
  })
  opening_hours: { day: string; openedtime: string; closedtime: string }[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
