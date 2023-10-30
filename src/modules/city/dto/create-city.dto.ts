import { IsString, ValidateNested } from 'class-validator';
import { Coordinates } from '../../../types/coordinates.type.js';

export default class CreateCityDto {
  @IsString()
  public name!: string;

  @ValidateNested()
  public coordinates!: Coordinates;
}
