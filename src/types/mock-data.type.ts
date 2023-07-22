import { City } from './city.type';
import { Coordinates } from './coordinates.type';
import { Equipment } from './equipment.enum';
import { HouseType } from './house-type.enum';
import { User } from './user.type';

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
