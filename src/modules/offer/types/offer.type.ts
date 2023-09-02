import { User } from '../../../modules/user/types/user.type.js';
import { City } from '../../city/types/city.type.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { Equipment } from './equipment.enum.js';
import { HouseType } from './house-type.enum.js';

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
