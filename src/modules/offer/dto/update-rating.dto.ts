import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Offer } from '../constants/offer.constants';

export default class UpdateRatingDto {
  @IsOptional()
  @IsInt()
  @Min(Offer.RatingMin, {
    message: `The minimum rating value is ${Offer.RatingMin}`,
  })
  @Max(Offer.RatingMax, {
    message: `The maximum rating value is ${Offer.RatingMax}`,
  })
  public raiting?: number;
}
