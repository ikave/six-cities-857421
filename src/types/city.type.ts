import { Cities } from './cities.enum.js';
import { Coordinates } from './coordinates.type.js';

export type City = {
  name: Cities;
  coordinates: Coordinates;
};
