import { Module } from '@nestjs/common';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the config module globally available
      envFilePath: '.env', // Specify the .env file
    }),
    RestaurantModule],

  
})
export class AppModule {}
