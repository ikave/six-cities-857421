import {
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
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
  @Min(COMMENT_RATING.Min, {
    message: `Rating min value is ${COMMENT_RATING.Min}`,
  })
  @Max(COMMENT_RATING.Max, {
    message: `Rating max value is ${COMMENT_RATING.Max}`,
  })
  public rating!: number;
}
