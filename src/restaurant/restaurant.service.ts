import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantService {

    constructor(){}

    async registerRestaurant(createRestaurant: CreateRestaurantDto){
       return createRestaurant;
    }
}
