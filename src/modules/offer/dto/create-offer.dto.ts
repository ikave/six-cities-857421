import { User } from '../../user/types/user.type.js';
import { City } from '../types/city.type.js';
import { Coordinates } from '../types/coordinates.type.js';
import { Equipment } from '../types/equipment.enum.js';
import { HouseType } from '../types/house-type.enum.js';

export default class CreateOfferDto {
  public title!: string;
  public description!: string;
  public date!: Date;
  public city!: City;
  public preview!: string;
  public pictures!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public raiting!: number;
  public houseType!: HouseType;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public equipment!: Equipment[];
  public owner!: User;
  public commentsCount!: number;
  public coordinates!: Coordinates;
}
