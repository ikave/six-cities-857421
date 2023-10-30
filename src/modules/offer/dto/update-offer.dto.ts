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
  @MinLength(Offer.TitleLengthMin, {
    message: `Minimum length of the title must be a ${Offer.TitleLengthMin} chars`,
  })
  @MaxLength(Offer.TitleLengthMax, {
    message: `Maximum length of the title must be a ${Offer.TitleLengthMax} chars`,
  })
  public title?: string;

  @IsOptional()
  @IsString()
  @MinLength(Offer.DescriptionLengthMin, {
    message: `Minimum length of the description must be a ${Offer.DescriptionLengthMin} chars`,
  })
  @MaxLength(Offer.DescriptionLengthMax, {
    message: `Maximum length of the description must be a ${Offer.DescriptionLengthMax} chars`,
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
  @ArrayMinSize(Offer.PicturesCount, {
    message: `The "pictures" field must contain ${Offer.PicturesCount} files`,
  })
  @ArrayMaxSize(Offer.PicturesCount, {
    message: `The "pictures" field must contain ${Offer.PicturesCount} files`,
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
  @Min(Offer.RoomsMin, {
    message: `The minimum number of room must be ${Offer.RoomsMin}`,
  })
  @Max(Offer.RoomsMax, {
    message: `The maximum number of room must be ${Offer.RoomsMax}`,
  })
  public rooms?: number;

  @IsOptional()
  @IsInt()
  @Min(Offer.GuestsMin, {
    message: `The minimum number of guests must be ${Offer.GuestsMin}`,
  })
  @Max(Offer.GuestsMax, {
    message: `The maximum number of guests must be ${Offer.GuestsMax}`,
  })
  public guests?: number;

  @IsOptional()
  @IsInt()
  @Min(Offer.PriceMin, {
    message: `Minimum cost must be ${Offer.PriceMin}`,
  })
  @Max(Offer.PriceMax, {
    message: `Maximum cost must be ${Offer.PriceMax}`,
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
  @ArrayMinSize(Offer.EquipmentCountMin, {
    message: `The field "equipment" must contain minimum ${Offer.EquipmentCountMin} items`,
  })
  public equipment?: Equipment[];

  @ValidateNested()
  public coordinates?: Coordinates;
}
