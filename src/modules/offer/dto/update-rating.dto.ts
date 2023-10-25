import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Offer } from '../constants/offer.constants';

export default class UpdateRatingDto {
  @IsOptional()
  @IsInt()
  @Min(Offer.RATING_MIN, {
    message: `The minimum rating value is ${Offer.RATING_MIN}`,
  })
  @Max(Offer.RATING_MAX, {
    message: `The maximum rating value is ${Offer.RATING_MAX}`,
  })
  public raiting?: number;
}
