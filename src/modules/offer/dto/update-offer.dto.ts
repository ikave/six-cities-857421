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
import {
  OFFER_DESCRIPTION_LENGTH,
  OFFER_EQUIPMENT_COUNT,
  OFFER_GUESTS,
  OFFER_PRICE,
  OFFER_RATING,
  OFFER_ROOMS,
  OFFER_PICTURES_COUNT,
  OFFER_TITLE_LENGTH,
} from '../constants/offer.constants.js';

export default class CreateOfferDto {
  @IsOptional()
  @IsString()
  @MinLength(OFFER_TITLE_LENGTH.Min, {
    message: `Minimum length of the title must be a ${OFFER_TITLE_LENGTH.Min} chars`,
  })
  @MaxLength(OFFER_TITLE_LENGTH.Max, {
    message: `Maximum length of the title must be a ${OFFER_TITLE_LENGTH.Max} chars`,
  })
  public title?: string;

  @IsOptional()
  @IsString()
  @MinLength(OFFER_DESCRIPTION_LENGTH.Min, {
    message: `Minimum length of the description must be a ${OFFER_DESCRIPTION_LENGTH.Min} chars`,
  })
  @MaxLength(OFFER_DESCRIPTION_LENGTH.Max, {
    message: `Maximum length of the description must be a ${OFFER_DESCRIPTION_LENGTH.Max} chars`,
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
  @ArrayMinSize(OFFER_PICTURES_COUNT, {
    message: `The "pictures" field must contain ${OFFER_PICTURES_COUNT} files`,
  })
  @ArrayMaxSize(OFFER_PICTURES_COUNT, {
    message: `The "pictures" field must contain ${OFFER_PICTURES_COUNT} files`,
  })
  @IsUrl({}, { each: true, message: 'The image must be a valid URL string' })
  public pictures?: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsInt()
  @Min(OFFER_RATING.Min, {
    message: `The minimum rating value is ${OFFER_RATING.Min}`,
  })
  @Max(OFFER_RATING.Max, {
    message: `The maximum rating value is ${OFFER_RATING.Max}`,
  })
  public raiting?: number;

  @IsOptional()
  @IsEnum(HouseType, {
    message: `The type of house must be only of the following: ${Object.keys(
      HouseType
    ).join(', ')}`,
  })
  public houseType?: HouseType;

  @IsOptional()
  @IsInt()
  @Min(OFFER_ROOMS.Min, {
    message: `The minimum number of room must be ${OFFER_ROOMS.Min}`,
  })
  @Max(OFFER_ROOMS.Max, {
    message: `The muximum number of room must be ${OFFER_ROOMS.Max}`,
  })
  public rooms?: number;

  @IsOptional()
  @IsInt()
  @Min(OFFER_GUESTS.Min, {
    message: `The minimum number of room must be ${OFFER_GUESTS.Min}`,
  })
  @Max(OFFER_GUESTS.Max, {
    message: `The muximum number of room must be ${OFFER_GUESTS.Max}`,
  })
  public guests?: number;

  @IsOptional()
  @IsInt()
  @Min(OFFER_PRICE.Min, {
    message: `The minimum number of room must be ${OFFER_PRICE.Min}`,
  })
  @Max(OFFER_PRICE.Max, {
    message: `The muximum number of room must be ${OFFER_PRICE.Max}`,
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
  @ArrayMinSize(OFFER_EQUIPMENT_COUNT.Min, {
    message: `The field "equipment" must contain minimum ${OFFER_EQUIPMENT_COUNT.Min} items`,
  })
  public equipment?: Equipment[];

  @ValidateNested()
  public coordinates?: Coordinates;
}
