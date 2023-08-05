import { City } from '../modules/offer/types/city.type.js';
import { Coordinates } from '../modules/offer/types/coordinates.type.js';
import { Equipment } from '../modules/offer/types/equipment.enum.js';
import { HouseType } from '../modules/offer/types/house-type.enum.js';
import { User } from '../modules/user/types/user.type.js';

export type MockData = {
  title: string[];
  description: string[];
  cities: City[];
  preview: string[];
  pictures: string[];
  houseType: HouseType[];
  equipment: Equipment[];
  owner: User[];
  commentsCount: number[];
  coordinates: Coordinates[];
};
