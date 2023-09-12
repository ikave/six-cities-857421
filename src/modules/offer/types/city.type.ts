import { Cities } from './cities.enum.js';
import { Coordinates } from '../../../types/coordinates.type.js';

export interface City {
  name: Cities;
  coordinates: Coordinates;
}
