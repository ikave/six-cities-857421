// import { UserDto } from '../dto/user.dto';
import { Location, Type } from '../../types/types';
import { CityRdo } from './city.rdo';
import UserRdo from './user.rdo';

export class OfferRdo {
  public id!: string;
  public title!: string;
  public description!: string;
  public date!: Date;
  public city!: CityRdo;
  public preview!: string;
  public pictures!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public raiting!: number;
  public houseType!: Type;
  public price!: number;
  public commentsCount!: number;
  public rooms!: number;
  public guests!: number;
  public equipment!: string[];
  public owner!: UserRdo;
  public coordinates!: Location;
}
