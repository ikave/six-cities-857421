import UserRdo from './user.rdo';

export default class CommentRdo {
  public id!: string;
  public comment!: string;
  public date!: string;
  public rating!: number;
  public owner!: UserRdo;
}
