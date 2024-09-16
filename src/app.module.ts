import { Module } from '@nestjs/common';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the config module globally available
      envFilePath: '.env', // Specify the .env file
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    RestaurantModule,
    UsersModule,
  ],

  
})
export class AppModule {}
