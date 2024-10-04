import {
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class CreateEventDto {
  @IsMongoId()
  restaurant: string; // Restaurant ID where the event happens

  @IsString()
  name_of_event: string;

  @IsString()
  description_of_event: string;

  @IsDateString()
  event_date: string;

  @IsString()
  event_start_time: string;

  @IsString()
  event_end_time: string;

  @IsNumber()
  ticket_fee: number;

  @IsString()
  @IsOptional()
  image_showcase: string; // Showcase image of the event

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsNumber()
  total_no_of_tickets: number;
}
