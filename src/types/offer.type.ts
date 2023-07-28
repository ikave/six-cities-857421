import { City } from './city.type.js';
import { Coordinates } from './coordinates.type.js';
import { Equipment } from './equipment.enum.js';
import { HouseType } from './house-type.enum.js';
import { User } from '../modules/user/types/user.type.js';

export type Offer = {
  title: string;
  description: string;
  date: Date;
  city: City;
  preview: string;
  pictures: string[];
  isPremium: boolean;
  isFavorite: boolean;
  raiting: number;
  houseType: HouseType;
  rooms: number;
  guests: number;
  price: number;
  equipment: Equipment[];
  owner: User;
  commentsCount: number;
  coordinates: Coordinates;
};
