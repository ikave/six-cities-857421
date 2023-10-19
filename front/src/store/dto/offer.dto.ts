import { City, Location, Type } from '../../types/types';

export class OfferDto {
  public title!: string;
  public description!: string;
  public date!: Date;
  public city!: City;
  public preview!: string;
  public pictures!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public raiting!: number;
  public houseType!: Type;
  public price!: number;
  public rooms!: number;
  public guests!: number;
  public equipment!: string[];
  public coordinates!: Location;
  public commentsCount!: number;
}

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public date?: Date;
  public city?: City;
  public preview?: string;
  public pictures?: string[];
  public isPremium?: boolean;
  public houseType?: Type;
  public price?: number;
  public rooms?: number;
  public guests?: number;
  public equipment?: string[];
  public coordinates?: Location;
}
