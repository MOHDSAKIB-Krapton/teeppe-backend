import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true })  // Adding timestamps for createdAt and updatedAt
export class Restaurant {

  @Prop({ required: true })  // Making restaurant_name required
  restaurant_name: string;

  @Prop({ required: true })  // Making owner_name required
  owner_name: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop({ required: true })  // Latitude and longitude required for location
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop([String])  // Array of special dishes
  special_dishes: string[];

  @Prop([String])  // Array of image URLs for multiple images
  restaurant_images: string[];

  @Prop({ required: true })  // Category of the restaurant
  category: string;

  @Prop({ required: true })  // Making zipcode required
  zipcode: number;

  @Prop({ required: true })  // Full address is required
  full_address: string;

  @Prop({
    type: [
      {
        day: { type: String, required: true },  // e.g., 'Monday'
        openedtime: { type: String, required: true },  // e.g., '08:00 AM'
        closedtime: { type: String, required: true },  // e.g., '10:00 PM'
      }
    ],
    required: true,  // Ensure that this field is required
  })
  opening_hours: { day: string, openedtime: string, closedtime: string }[];

}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

