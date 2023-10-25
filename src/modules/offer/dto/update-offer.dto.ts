import { Coordinates } from '../../../types/coordinates.type.js';
import { Equipment } from '../types/equipment.enum.js';
import { HouseType } from '../types/house-type.enum.js';
import { City } from '../../../modules/city/types/city.type.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Offer } from '../constants/offer.constants.js';

export default class CreateOfferDto {
  @IsOptional()
  @IsString()
  @MinLength(Offer.TITLE_LENGTH_MIN, {
    message: `Minimum length of the title must be a ${Offer.TITLE_LENGTH_MIN} chars`,
  })
  @MaxLength(Offer.TITLE_LENGTH_MAX, {
    message: `Maximum length of the title must be a ${Offer.TITLE_LENGTH_MAX} chars`,
  })
  public title?: string;

  @IsOptional()
  @IsString()
  @MinLength(Offer.DESCRIPTION_LENGTH_MIN, {
    message: `Minimum length of the description must be a ${Offer.DESCRIPTION_LENGTH_MIN} chars`,
  })
  @MaxLength(Offer.DESCRIPTION_LENGTH_MAX, {
    message: `Maximum length of the description must be a ${Offer.DESCRIPTION_LENGTH_MAX} chars`,
  })
  public description?: string;

  @IsOptional()
  @ValidateNested()
  public city?: City;

  @IsOptional()
  @IsUrl({}, { message: 'Preview image must be a valid URL string' })
  public preview?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(Offer.PICTURES_COUNT, {
    message: `The "pictures" field must contain ${Offer.PICTURES_COUNT} files`,
  })
  @ArrayMaxSize(Offer.PICTURES_COUNT, {
    message: `The "pictures" field must contain ${Offer.PICTURES_COUNT} files`,
  })
  @IsUrl({}, { each: true, message: 'The image must be a valid URL string' })
  public pictures?: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(HouseType, {
    message: `The type of house must be only of the following: ${Object.keys(
      HouseType
    ).join(', ')}`,
  })
  public houseType?: HouseType;

  @IsOptional()
  @IsInt()
  @Min(Offer.ROOMS_MIN, {
    message: `The minimum number of room must be ${Offer.ROOMS_MIN}`,
  })
  @Max(Offer.ROOMS_MAX, {
    message: `The maximum number of room must be ${Offer.ROOMS_MAX}`,
  })
  public rooms?: number;

  @IsOptional()
  @IsInt()
  @Min(Offer.GUESTS_MIN, {
    message: `The minimum number of guests must be ${Offer.GUESTS_MIN}`,
  })
  @Max(Offer.GUESTS_MAX, {
    message: `The maximum number of guests must be ${Offer.GUESTS_MAX}`,
  })
  public guests?: number;

  @IsOptional()
  @IsInt()
  @Min(Offer.PRICE_MIN, {
    message: `Minimum cost must be ${Offer.PRICE_MIN}`,
  })
  @Max(Offer.PRICE_MAX, {
    message: `Maximum cost must be ${Offer.PRICE_MAX}`,
  })
  public price?: number;

  @IsOptional()
  @IsArray({ message: 'The "equipment" field must be Array' })
  @IsEnum(Equipment, {
    each: true,
    message: `The each item in "equipment" array must be one of the following: ${Object.keys(
      Equipment
    ).join(', ')}`,
  })
  @ArrayUnique({ message: 'All items in field "equipment" must be unique' })
  @ArrayMinSize(Offer.EQUIPMENT_COUNT_MIN, {
    message: `The field "equipment" must contain minimum ${Offer.EQUIPMENT_COUNT_MIN} items`,
  })
  public equipment?: Equipment[];

  @ValidateNested()
  public coordinates?: Coordinates;
}
