import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
    @Prop({ required: true, type: Types.ObjectId, ref: 'Restaurant' })
    restaurant_id: Types.ObjectId;

    @Prop({ required: true })
    customer_name: string;

    @Prop({ required: true })
    customer_contact: string;  // Can be email or phone number

    @Prop({ required: true })
    number_of_guests: number;

    @Prop({ required: true })
    is_verified: boolean;

    @Prop({ required: true })
    booking_time: Date;  // Time at which the booking starts

    @Prop({ required: true })
    booking_duration_in_minutes: number;  // How many hours the booking lasts

    @Prop({ required: true })
    special_requests?: string;  // Optional field for customer requests

    // Automatically calculated field (can be computed)
    @Prop()
    booking_end_time: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Middleware to automatically calculate booking_end_time based on booking_time and booking_duration_in_minutes
BookingSchema.pre('save', function (next) {
    const booking = this as BookingDocument;
    booking.booking_end_time = new Date(booking.booking_time.getTime() + booking.booking_duration_in_minutes * 60 * 1000);
    next();
});

