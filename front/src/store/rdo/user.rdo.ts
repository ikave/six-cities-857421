import { UserType } from '../../const';

export default class UserRdo {
  public id!: string;
  public name!: string;
  public email!: string;
  public avatar!: string;
  public type!: UserType;
}
