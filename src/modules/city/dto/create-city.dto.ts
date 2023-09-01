import { Coordinates } from 'src/types/coordinates.type';

export default class CreateCityDto {
  public name!: string;
  public coordinates!: Coordinates;
}
