import { User } from '../../user/types/user.type.js';

export default class CreateCommentDto {
  public text!: string;
  public rating!: number;
  public owner!: User;
  public offerId!: string;
}
