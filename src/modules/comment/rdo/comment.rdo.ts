import { Expose, Type } from 'class-transformer';
import UserRdo from '../../../modules/user/rdo/user.rdo.js';

export default class CommentRdo {
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose()
  public date!: string;

  @Expose()
  public rating!: number;

  @Expose()
  @Type(() => UserRdo)
  public owner!: UserRdo;
}
