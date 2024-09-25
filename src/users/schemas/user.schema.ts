import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '../dto/create-user.dto';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Adding timestamps for createdAt and updatedAt
export class User {
  @Prop({ required: true })
  uid: string;

  @Prop({ required: true }) // Phone number is required
  phone_number: number;

  @Prop({ required: true, unique: true }) // Email is required and should be unique
  email: string;

  @Prop({ required: true }) // First name is required
  first_name: string;

  @Prop({ required: true }) // Last name is required
  last_name: string;

  @Prop()
  restaurants: string[];

  @Prop({ required: true, default: UserRole.Partner })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
