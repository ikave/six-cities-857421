import { Expose } from 'class-transformer';
import { HouseType } from '../types/house-type.enum.js';
import { City } from '../types/city.type.js';

export default class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public date!: Date;

  @Expose()
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
