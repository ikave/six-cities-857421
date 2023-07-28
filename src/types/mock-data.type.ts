import { City } from './city.type.js';
import { Coordinates } from './coordinates.type.js';
import { Equipment } from './equipment.enum.js';
import { HouseType } from './house-type.enum.js';
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
