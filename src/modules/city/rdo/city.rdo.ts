import { Expose } from 'class-transformer';
import { Coordinates } from '../../../types/coordinates.type.js';

export default class CityRdo {
  @Expose()
  public name!: string;

  @Expose()
  public coordinates!: Coordinates;
}
