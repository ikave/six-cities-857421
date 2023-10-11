import { Expose } from 'class-transformer';
import { Cities } from '../types/cities.enum.js';
import { Coordinates } from '../../../types/coordinates.type.js';

export default class CityRdo {
  @Expose()
  public name!: Cities;

  @Expose()
  public coordinates!: Coordinates;
}
