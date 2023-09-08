import { Expose, Type } from 'class-transformer';
import { City } from '../../city/types/city.type.js';
import { HouseType } from '../types/house-type.enum.js';
import CityRdo from '../../city/rdo/city.rdo.js';

export default class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public date!: Date;

  @Expose()
  @Type(() => CityRdo)
  public city!: City;

  @Expose()
  public preview!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public raiting!: number;

  @Expose()
  public houseType!: HouseType;

  @Expose()
  public price!: number;

  @Expose()
  public commentsCount!: number;
}
