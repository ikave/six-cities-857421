import {
  IsDateString,
  IsInt,
  IsMongoId,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  COMMENT_LENGTH,
  COMMENT_RATING,
} from '../constants/comment.constants.js';

export default class CreateCommentDto {
  @IsString()
  @MinLength(COMMENT_LENGTH.Min, {
    message: `Min comment length must be ${COMMENT_LENGTH.Min} symbols`,
  })
  @MaxLength(COMMENT_LENGTH.Max, {
    message: `Max comment length must be ${COMMENT_LENGTH.Max} symbols`,
  })
  public comment!: string;

  @IsInt({ message: 'Rating is required' })
  @MinLength(COMMENT_LENGTH.Min, {
    message: `Rating min value is ${COMMENT_RATING.Min}`,
  })
  @MaxLength(COMMENT_LENGTH.Max, {
    message: `Rating max value is ${COMMENT_RATING.Max}`,
  })
  public rating!: number;

  @IsDateString({}, { message: 'The date must be a valid ISO date' })
  public date!: Date;

  @IsMongoId({ message: 'Owner must be a valid id' })
  public owner!: string;

  @IsMongoId({ message: 'Offer must be a valid id' })
  public offer!: string;
}
