import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Restaurant } from 'src/restaurant/schemas/restaurant.schema';

@Schema()
export class Event extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurant: Restaurant | Types.ObjectId; // Restaurant where the event will happen

  @Prop({ required: true })
  name_of_event: string;

  @Prop({ required: true })
  description_of_event: string;

  @Prop({ required: true })
  event_date: Date;

  @Prop({ required: true })
  event_start_time: string;

  @Prop({ required: true })
  event_end_time: string;

  @Prop({ required: true })
  ticket_fee: number;

  @Prop()
  image_showcase: string; // Showcase image of the event

  @Prop([String])
  tags: string[];

  @Prop({ required: true })
  total_no_of_tickets: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
