import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses.js';
import { Cities } from '../types/cities.enum.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { City } from '../types/city.type.js';

export interface CityEntity extends Base, TimeStamps {}

@modelOptions({
  schemaOptions: {
    collection: 'cities',
  },
})
export class CityEntity implements City {
  @prop({ required: true, enum: Cities })
  public name!: Cities;

  @prop({ required: true })
  public coordinates!: Coordinates;
}

export const CityModel = getModelForClass(CityEntity);
