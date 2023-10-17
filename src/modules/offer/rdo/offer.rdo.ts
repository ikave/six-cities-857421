import { Expose, Type } from 'class-transformer';
import { HouseType } from '../types/house-type.enum.js';
import { Equipment } from '../types/equipment.enum.js';
import { User } from '../../user/types/user.type.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import UserRdo from '../../user/rdo/user.rdo.js';
import { City } from '../../city/types/city.type.js';
import CityRdo from '../../city/rdo/city.rdo.js';

export default class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public date!: Date;

  @Expose()
  @Type(() => CityRdo)
  public city!: City;

  @Expose()
  public preview!: string;

  @Expose()
  public pictures!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public raiting!: number;

  @Expose()
  public houseType!: HouseType;

  @Expose()
  public rooms!: number;

  @Expose()
  public guests!: number;

  @Expose()
  public price!: number;

  @Expose()
  public equipment!: Equipment[];

  @Expose()
  @Type(() => UserRdo)
  public owner!: User;

  @Expose()
  public commentsCount!: number;

  @Expose()
  public coordinates!: Coordinates;
}
