import { Cities } from './cities.enum';
import { Coordinates } from './coordinates.type';

export type City = {
  name: Cities;
  coordinates: Coordinates;
};
