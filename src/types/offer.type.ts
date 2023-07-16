import { City } from './city.type';
import { Coordinates } from './coordinates.type';
import { Equipment } from './equipment.enum';
import { HouseType } from './house-type.enum';
import { User } from './user.type';

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
